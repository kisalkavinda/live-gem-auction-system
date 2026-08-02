package com.gemhaven.websocket;

import com.gemhaven.dto.PlaceBidRequest;
import com.gemhaven.model.User;
import com.gemhaven.service.BiddingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

/**
 * Handles incoming STOMP messages from clients.
 *
 * Client sends to: /app/auctions/{auctionId}/bid
 * Body: { "amount": 45000 }
 *
 * On success: BiddingService broadcasts BID_PLACED to /topic/auctions/{auctionId}
 *             and sends targeted /user/queue/outbid to the previous highest bidder.
 * On failure: error is sent back to the bidding user on /user/queue/errors —
 *             the session is NOT crashed, and other subscribers are NOT notified.
 *
 * NOTE: The Principal here is the authenticated user derived from the STOMP connect headers.
 * The frontend must pass the JWT in the STOMP connect Authorization header for this to work.
 */
@Controller
@SuppressWarnings("null")
public class AuctionWebSocketController {

    private static final Logger log = LoggerFactory.getLogger(AuctionWebSocketController.class);

    private final BiddingService biddingService;
    private final SimpMessagingTemplate messagingTemplate;

    public AuctionWebSocketController(BiddingService biddingService,
                                       SimpMessagingTemplate messagingTemplate) {
        this.biddingService = biddingService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/auctions/{auctionId}/bid")
    public void placeBid(
            @DestinationVariable Long auctionId,
            @Payload PlaceBidRequest request,
            Principal principal
    ) {
        if (principal == null) {
            // Can't send an error back without a principal — just log and drop
            log.warn("[WebSocket] Unauthenticated bid attempt on auction #{}", auctionId);
            return;
        }

        try {
            // Cast Principal to User — Spring Security populates this from the JWT filter
            User user = (User) ((org.springframework.security.authentication.UsernamePasswordAuthenticationToken)
                    principal).getPrincipal();
            biddingService.placeNewBid(user, auctionId, request.getAmount());
            // BiddingService handles all broadcasting — no return value needed here

        } catch (IllegalStateException e) {
            // e.g. "Auction is not live"
            log.info("[WebSocket] Bid rejected (state): auctionId={} user={} reason={}",
                    auctionId, principal.getName(), e.getMessage());
            sendError(principal.getName(), auctionId, "AUCTION_STATE_ERROR", e.getMessage());

        } catch (IllegalArgumentException e) {
            // e.g. "Bid does not meet minimum increment"
            log.info("[WebSocket] Bid rejected (validation): auctionId={} user={} reason={}",
                    auctionId, principal.getName(), e.getMessage());
            sendError(principal.getName(), auctionId, "BID_VALIDATION_ERROR", e.getMessage());

        } catch (Exception e) {
            // Unexpected error — don't crash the session
            log.error("[WebSocket] Unexpected error placing bid on auction #{}: {}", auctionId, e.getMessage(), e);
            sendError(principal.getName(), auctionId, "INTERNAL_ERROR", "An unexpected error occurred. Please try again.");
        }
    }

    private void sendError(String username, Long auctionId, String errorCode, String message) {
        messagingTemplate.convertAndSendToUser(
                username,
                "/queue/errors",
                Map.of(
                        "auctionId", auctionId,
                        "errorCode", errorCode,
                        "message", message
                )
        );
    }
}
