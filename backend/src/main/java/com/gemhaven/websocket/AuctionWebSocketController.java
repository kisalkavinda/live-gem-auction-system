package com.gemhaven.websocket;

import com.gemhaven.dto.PlaceBidRequest;
import com.gemhaven.model.User;
import com.gemhaven.service.BiddingService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * Handles incoming STOMP messages from clients.
 *
 * Client sends to: /app/auctions/{auctionId}/bid
 * Body: { "amount": 45000 }
 *
 * On success: BiddingService broadcasts BID_PLACED to /topic/auctions/{auctionId}
 *             and sends targeted /user/queue/outbid to the previous highest bidder.
 * On failure: the exception propagates and Spring STOMP sends an ERROR frame to the client.
 *
 * NOTE: The Principal here is the authenticated user derived from the STOMP connect headers.
 * The frontend must pass the JWT in the STOMP connect Authorization header for this to work.
 * (Integration detail for the frontend STOMP client wiring phase.)
 */
@Controller
@SuppressWarnings("null")
public class AuctionWebSocketController {

    private final BiddingService biddingService;

    public AuctionWebSocketController(BiddingService biddingService) {
        this.biddingService = biddingService;
    }

    @MessageMapping("/auctions/{auctionId}/bid")
    public void placeBid(
            @DestinationVariable Long auctionId,
            @Payload PlaceBidRequest request,
            Principal principal
    ) {
        if (principal == null) {
            throw new IllegalStateException("Authentication required to place a bid.");
        }

        // Cast Principal to User — Spring Security populates this from the JWT filter
        User user = (User) ((org.springframework.security.authentication.UsernamePasswordAuthenticationToken) principal).getPrincipal();

        biddingService.placeNewBid(user, auctionId, request.getAmount());
        // BiddingService handles all broadcasting — no return value needed here
    }
}
