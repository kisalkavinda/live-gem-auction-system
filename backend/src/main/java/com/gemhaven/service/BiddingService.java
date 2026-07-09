package com.gemhaven.service;

import com.gemhaven.dto.BidEventDTO;
import com.gemhaven.model.Auction;
import com.gemhaven.model.Bid;
import com.gemhaven.model.User;
import com.gemhaven.repository.AuctionRepository;
import com.gemhaven.repository.BidRepository;
import jakarta.transaction.Transactional;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class BiddingService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public BiddingService(BidRepository bidRepository,
                          AuctionRepository auctionRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Places a bid. Uses pessimistic write lock to ensure atomicity.
     *
     * Additionally:
     * - Lazily transitions the auction to ENDED if endTime has passed (and broadcasts AUCTION_ENDED).
     * - Sends a targeted /user/queue/outbid message to the previous highest bidder.
     *
     * @throws IllegalStateException   if the auction has ended
     * @throws IllegalArgumentException if the bid is too low (below current max + min increment)
     */
    @Transactional
    public Bid placeNewBid(User user, @NonNull Long auctionId, BigDecimal bidAmount) {
        Auction auction = auctionRepository.findByIdWithPessimisticLock(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + auctionId));

        // Lazy expiry: if endTime has passed but status is not yet ENDED, transition now
        if (LocalDateTime.now().isAfter(auction.getEndTime())) {
            if (auction.getStatus() != Auction.AuctionStatus.ENDED) {
                auction.setStatus(Auction.AuctionStatus.ENDED);
                auctionRepository.save(auction);
                broadcastAuctionEnded(auction);
            }
            throw new IllegalStateException("Auction has ended.");
        }

        if (auction.getStatus() == Auction.AuctionStatus.ENDED) {
            throw new IllegalStateException("Auction has ended.");
        }

        // If auction was SCHEDULED and someone bids, move to LIVE
        if (auction.getStatus() == Auction.AuctionStatus.SCHEDULED) {
            auction.setStatus(Auction.AuctionStatus.LIVE);
        }

        BigDecimal currentMax = auction.getCurrentBid() != null
                ? auction.getCurrentBid()
                : auction.getStartingPrice();

        BigDecimal minRequired = auction.getMinIncrement() != null
                ? currentMax.add(auction.getMinIncrement())
                : currentMax.add(BigDecimal.ONE); // fallback: at least +1

        if (bidAmount.compareTo(minRequired) < 0) {
            throw new IllegalArgumentException(
                    "Bid must be at least " + minRequired + " (current: " + currentMax +
                    " + min increment: " + (auction.getMinIncrement() != null ? auction.getMinIncrement() : 1) + ").");
        }

        // Find the previous highest bidder BEFORE saving the new bid (for outbid notification)
        List<Bid> topBids = bidRepository.findByAuctionIdOrderByAmountDesc(auctionId);
        Optional<User> previousTopBidder = topBids.isEmpty()
                ? Optional.empty()
                : Optional.of(topBids.get(0).getUser());

        // 1. Create and save the new bid
        Bid bid = new Bid();
        bid.setAuction(auction);
        bid.setUser(user);
        bid.setAmount(bidAmount);
        bidRepository.save(bid);

        // 2. Update the auction's current max bid
        auction.setCurrentBid(bidAmount);
        auctionRepository.save(auction);

        // 3. Broadcast BID_PLACED to all subscribers of this auction topic
        String maskedBidder = maskBidderName(user.getEmail());
        BidEventDTO event = BidEventDTO.bidPlaced(auctionId, bidAmount, maskedBidder, Instant.now());
        messagingTemplate.convertAndSend("/topic/auctions/" + auctionId, event);

        // 4. Send targeted outbid notification to previous highest bidder (if different from current bidder)
        previousTopBidder.ifPresent(prevBidder -> {
            if (!prevBidder.getId().equals(user.getId())) {
                messagingTemplate.convertAndSendToUser(
                        prevBidder.getEmail(),
                        "/queue/outbid",
                        BidEventDTO.bidPlaced(auctionId, bidAmount, maskedBidder, Instant.now())
                );
            }
        });

        return bid;
    }

    /** Called by AuctionScheduler and lazy expiry — broadcasts AUCTION_ENDED to topic */
    public void broadcastAuctionEnded(Auction auction) {
        String winner = "N/A";
        BigDecimal winningBid = BigDecimal.ZERO;
        if (auction.getCurrentBid() != null) {
            winningBid = auction.getCurrentBid();
            List<Bid> topBids = bidRepository.findByAuctionIdOrderByAmountDesc(auction.getId());
            if (!topBids.isEmpty()) {
                winner = maskBidderName(topBids.get(0).getUser().getEmail());
            }
        }
        BidEventDTO endEvent = BidEventDTO.auctionEnded(auction.getId(), winningBid, winner);
        messagingTemplate.convertAndSend("/topic/auctions/" + auction.getId(), endEvent);
    }

    /** Masks bidder identity: shows last 2 chars of the email local part e.g. "Bidder ****er" */
    private String maskBidderName(String email) {
        String localPart = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
        if (localPart.length() <= 2) return "Bidder ****";
        return "Bidder ****" + localPart.substring(localPart.length() - 2);
    }
}
