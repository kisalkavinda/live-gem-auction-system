package com.gemhaven.service;

import com.gemhaven.model.Auction;
import com.gemhaven.repository.AuctionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Periodically sweeps for auction lifecycle transitions:
 *
 * Method 1 — activateScheduledAuctions():
 *   Finds SCHEDULED auctions where startTime <= NOW(), transitions them to LIVE,
 *   and broadcasts AUCTION_STARTED.
 *
 * Method 2 — closeExpiredAuctions():
 *   Finds LIVE auctions where endTime <= NOW(). For each:
 *   - Acquires a pessimistic write lock before closing, to prevent a race with
 *     a concurrent last-second bid that may have just extended endTime via anti-sniping.
 *   - Re-checks endTime AFTER acquiring the lock.
 *   - Closes only if still expired.
 *
 * Both methods run every 5 seconds.
 */
@Component
public class AuctionSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(AuctionSchedulerService.class);

    private final AuctionRepository auctionRepository;
    private final AuctionService auctionService;
    private final BiddingService biddingService;

    public AuctionSchedulerService(AuctionRepository auctionRepository,
                                   AuctionService auctionService,
                                   BiddingService biddingService) {
        this.auctionRepository = auctionRepository;
        this.auctionService = auctionService;
        this.biddingService = biddingService;
    }

    // ─── Method 1: Start scheduled auctions ──────────────────────────────────

    @Scheduled(fixedRate = 5_000)
    @Transactional
    public void activateScheduledAuctions() {
        LocalDateTime now = LocalDateTime.now();
        List<Auction> toStart = auctionRepository
                .findByStatusAndStartTimeLessThanEqual(Auction.AuctionStatus.SCHEDULED, now);

        for (Auction auction : toStart) {
            auction.setStatus(Auction.AuctionStatus.LIVE);
            auctionRepository.save(auction);
            // Publish event — broadcasts AUCTION_STARTED after this transaction commits
            biddingService.publishAuctionStartedEvent(auction.getId());
            log.info("[AuctionScheduler] Started auction #{}", auction.getId());
        }

        if (!toStart.isEmpty()) {
            log.info("[AuctionScheduler] Activated {} auction(s) to LIVE.", toStart.size());
        }
    }

    // ─── Method 2: Close expired auctions ────────────────────────────────────

    @Scheduled(fixedRate = 5_000)
    public void closeExpiredAuctions() {
        LocalDateTime now = LocalDateTime.now();
        List<Auction> candidates = auctionRepository
                .findByStatusAndEndTimeLessThanEqual(Auction.AuctionStatus.LIVE, now);

        for (Auction candidate : candidates) {
            // Process each auction in its own transaction so a lock failure on one
            // doesn't roll back the others.
            closeSingleExpiredAuction(candidate.getId());
        }

        if (!candidates.isEmpty()) {
            log.info("[AuctionScheduler] Processed {} expired auction candidate(s).", candidates.size());
        }
    }

    /**
     * Acquires a pessimistic lock on the auction, re-checks endTime (anti-sniping race guard),
     * and closes it only if still expired.
     */
    @Transactional
    public void closeSingleExpiredAuction(Long auctionId) {
        Auction auction = auctionRepository.findByIdWithPessimisticLock(auctionId).orElse(null);
        if (auction == null) return;

        // Already closed by a concurrent scheduler run or admin endEarly
        if (auction.getStatus() == Auction.AuctionStatus.ENDED) return;

        // Re-check: a last-moment bid may have extended endTime via anti-sniping
        if (!LocalDateTime.now().isAfter(auction.getEndTime())) {
            log.info("[AuctionScheduler] Auction #{} endTime was extended by anti-sniping — skipping close.", auctionId);
            return;
        }

        // Still expired — close it
        auctionService.closeAuction(auction);
        log.info("[AuctionScheduler] Closed auction #{} (winningBid={}, winnerId={}).",
                auctionId, auction.getCurrentBid(), auction.getHighestBidderId());
    }
}
