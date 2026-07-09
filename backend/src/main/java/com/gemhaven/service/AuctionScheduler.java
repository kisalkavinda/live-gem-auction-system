package com.gemhaven.service;

import com.gemhaven.model.Auction;
import com.gemhaven.repository.AuctionRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Periodically sweeps for auctions whose endTime has passed but whose status
 * is not yet ENDED. Transitions them to ENDED and broadcasts AUCTION_ENDED
 * to the corresponding WebSocket topic.
 *
 * This is the proactive counterpart to BiddingService's lazy expiry check.
 * Together they ensure no auction stays "stuck" in LIVE/SCHEDULED after its end time.
 */
@Component
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final BiddingService biddingService;

    public AuctionScheduler(AuctionRepository auctionRepository, BiddingService biddingService) {
        this.auctionRepository = auctionRepository;
        this.biddingService = biddingService;
    }

    /**
     * Runs every 30 seconds. Finds all auctions where endTime < now and status != ENDED,
     * transitions them, and broadcasts AUCTION_ENDED to each affected topic.
     */
    @Scheduled(fixedDelay = 30_000)
    @Transactional
    public void closeExpiredAuctions() {
        List<Auction> expired = auctionRepository
                .findByEndTimeBeforeAndStatusNot(LocalDateTime.now(), Auction.AuctionStatus.ENDED);

        for (Auction auction : expired) {
            auction.setStatus(Auction.AuctionStatus.ENDED);
            auctionRepository.save(auction);
            biddingService.broadcastAuctionEnded(auction);
        }

        if (!expired.isEmpty()) {
            System.out.println("[AuctionScheduler] Closed " + expired.size() + " expired auction(s).");
        }
    }
}
