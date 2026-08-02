package com.gemhaven.service;

import com.gemhaven.dto.BidEventDTO;
import com.gemhaven.model.Auction;
import com.gemhaven.model.Bid;
import com.gemhaven.model.User;
import com.gemhaven.repository.AuctionRepository;
import com.gemhaven.repository.BidRepository;
import com.gemhaven.repository.UserRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;

@Service
@SuppressWarnings("null")
public class BiddingService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private final SimpMessageSendingOperations messagingTemplate;
    private final ApplicationEventPublisher eventPublisher;

    public BiddingService(BidRepository bidRepository,
                          AuctionRepository auctionRepository,
                          UserRepository userRepository,
                          SimpMessageSendingOperations messagingTemplate,
                          ApplicationEventPublisher eventPublisher) {
        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
        this.eventPublisher = eventPublisher;
    }

    // ─── Internal event payload for after-commit broadcasting ────────────────

    /**
     * Carries the data needed to broadcast after the DB transaction commits.
     * Using an internal event prevents clients from receiving a notification
     * if the transaction rolls back.
     */
    public record BidPlacedEvent(
        Long auctionId,
        BigDecimal currentBid,
        String maskedBidder,
        LocalDateTime endTime,
        Long previousHighestBidderId,
        Long newBidderId
    ) {}

    public record AuctionEndedEvent(
        Long auctionId,
        BigDecimal winningBid,
        Long winnerId,
        String message
    ) {}

    public record AuctionStartedEvent(Long auctionId) {}

    // ─── Transactional bid placement ─────────────────────────────────────────

    /**
     * Places a bid. Uses pessimistic write lock to ensure atomicity.
     *
     * Flow:
     * 1. Acquire lock
     * 2. Validate status == LIVE
     * 3. Validate bid >= currentBid (or startingPrice if no bids) + minIncrement
     * 4. Store previousHighestBidderId
     * 5. Update auction.currentBid + highestBidderId
     * 6. Save Bid row
     * 7. Anti-sniping: extend endTime by 30s if < 30s remaining
     * 8. Save auction
     * 9. Publish after-commit event (broadcast happens outside transaction)
     *
     * @throws IllegalStateException   if the auction is not LIVE
     * @throws IllegalArgumentException if the bid does not meet the minimum increment
     */
    @Transactional
    public Bid placeNewBid(User user, Long auctionId, BigDecimal bidAmount) {
        Auction auction = auctionRepository.findByIdWithPessimisticLock(auctionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + auctionId));

        // Step 2 — auction must be LIVE (no auto-transitions allowed)
        if (auction.getStatus() != Auction.AuctionStatus.LIVE) {
            throw new IllegalStateException("Auction is not live");
        }

        // Step 3 — validate minimum increment
        BigDecimal baseline = auction.getCurrentBid() != null
                ? auction.getCurrentBid()
                : auction.getStartingPrice();
        BigDecimal minRequired = baseline.add(auction.getMinIncrement());

        if (bidAmount.compareTo(minRequired) < 0) {
            throw new IllegalArgumentException("Bid does not meet minimum increment");
        }

        // Step 4 — remember previous highest bidder before overwriting
        Long previousHighestBidderId = auction.getHighestBidderId();

        // Step 5 — update auction state
        auction.setCurrentBid(bidAmount);
        auction.setHighestBidderId(user.getId());

        // Step 6 — persist the bid row
        Bid bid = new Bid();
        bid.setAuction(auction);
        bid.setUser(user);
        bid.setAmount(bidAmount);
        bidRepository.save(bid);

        // Step 7 — anti-sniping: extend endTime if < 30 seconds remain
        LocalDateTime now = LocalDateTime.now();
        long secondsRemaining = Duration.between(now, auction.getEndTime()).getSeconds();
        if (secondsRemaining < 30) {
            auction.setEndTime(auction.getEndTime().plusSeconds(30));
        }

        // Step 8 — save auction (with potentially extended endTime)
        auctionRepository.save(auction);

        // Step 9 — publish event to be broadcast AFTER this transaction commits
        eventPublisher.publishEvent(new BidPlacedEvent(
                auctionId,
                bidAmount,
                maskBidderName(user.getEmail()),
                auction.getEndTime(),
                previousHighestBidderId,
                user.getId()
        ));

        return bid;
    }

    // ─── After-commit broadcast listeners ────────────────────────────────────

    /**
     * Broadcasts BID_PLACED to the auction topic and sends targeted outbid
     * notification to the previous highest bidder.
     * Runs AFTER the transaction commits — prevents phantom notifications on rollback.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onBidPlaced(BidPlacedEvent event) {
        // Broadcast to all subscribers of this auction
        messagingTemplate.convertAndSend(
                "/topic/auctions/" + event.auctionId(),
                BidEventDTO.bidPlaced(
                        event.auctionId(),
                        event.currentBid(),
                        event.maskedBidder(),
                        event.endTime(),
                        Instant.now()
                )
        );

        // Targeted outbid notification to the previous highest bidder (if different user)
        Long prevId = event.previousHighestBidderId();
        if (prevId != null && !prevId.equals(event.newBidderId())) {
            userRepository.findById(prevId).ifPresent(prevUser -> {
                messagingTemplate.convertAndSendToUser(
                        prevUser.getEmail(),
                        "/queue/outbid",
                        java.util.Map.of(
                                "auctionId", event.auctionId(),
                                "newHighestBid", event.currentBid()
                        )
                );
            });
        }
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onAuctionEnded(AuctionEndedEvent event) {
        messagingTemplate.convertAndSend(
                "/topic/auctions/" + event.auctionId(),
                BidEventDTO.auctionEnded(
                        event.auctionId(),
                        event.winningBid(),
                        event.winnerId(),
                        event.message()
                )
        );
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onAuctionStarted(AuctionStartedEvent event) {
        messagingTemplate.convertAndSend(
                "/topic/auctions/" + event.auctionId(),
                BidEventDTO.auctionStarted(event.auctionId())
        );
    }

    // ─── Public event publishing helpers (called by AuctionService/Scheduler) ──

    /** Publishes an AUCTION_ENDED event to be broadcast after the enclosing transaction commits. */
    public void publishAuctionEndedEvent(Long auctionId, BigDecimal winningBid,
                                          Long winnerId, String message) {
        eventPublisher.publishEvent(new AuctionEndedEvent(auctionId, winningBid, winnerId, message));
    }

    /** Publishes an AUCTION_STARTED event to be broadcast after the enclosing transaction commits. */
    public void publishAuctionStartedEvent(Long auctionId) {
        eventPublisher.publishEvent(new AuctionStartedEvent(auctionId));
    }

    // ─── Utility ──────────────────────────────────────────────────────────────

    /** Masks bidder identity: shows last 2 chars of the email local part e.g. "Bidder ****er" */
    private String maskBidderName(String email) {
        String localPart = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
        if (localPart.length() <= 2) return "Bidder ****";
        return "Bidder ****" + localPart.substring(localPart.length() - 2);
    }
}
