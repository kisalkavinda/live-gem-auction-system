package com.gemhaven.service;

import com.gemhaven.dto.CreateAuctionRequest;
import com.gemhaven.model.Auction;
import com.gemhaven.model.Bid;
import com.gemhaven.model.Gemstone;
import com.gemhaven.repository.AuctionRepository;
import com.gemhaven.repository.BidRepository;
import com.gemhaven.repository.GemstoneRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@SuppressWarnings("null")
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final GemstoneRepository gemstoneRepository;
    private final BidRepository bidRepository;
    private final BiddingService biddingService;

    public AuctionService(AuctionRepository auctionRepository,
                          GemstoneRepository gemstoneRepository,
                          BidRepository bidRepository,
                          BiddingService biddingService) {
        this.auctionRepository = auctionRepository;
        this.gemstoneRepository = gemstoneRepository;
        this.bidRepository = bidRepository;
        this.biddingService = biddingService;
    }

    // ─── Queries ──────────────────────────────────────────────────────────────

    public List<Auction> getAll(Auction.AuctionStatus status) {
        if (status != null) {
            return auctionRepository.findByStatus(status);
        }
        return auctionRepository.findAll();
    }

    public Auction getById(Long id) {
        return auctionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + id));
    }

    public Page<Bid> getBidHistory(Long auctionId, Pageable pageable) {
        // Verify auction exists before returning bid history
        if (!auctionRepository.existsById(auctionId)) {
            throw new IllegalArgumentException("Auction not found: " + auctionId);
        }
        return bidRepository.findByAuction_IdOrderByTimestampDesc(auctionId, pageable);
    }

    // ─── Admin CRUD ───────────────────────────────────────────────────────────

    /**
     * Creates an auction. Part 2 validations:
     * - startTime must be now or in the future
     * - endTime must be strictly after startTime
     * - startingPrice > 0 (enforced by @Positive on entity)
     * - minIncrement > 0 (enforced by @Positive on entity)
     * - gem must have status = PUBLISHED
     * On success: sets gem.status = RESERVED
     */
    @Transactional
    public Auction create(CreateAuctionRequest req) {
        LocalDateTime now = LocalDateTime.now();

        // Validate startTime
        if (req.getStartTime().isBefore(now.minusMinutes(30))) {
            throw new IllegalArgumentException("startTime must be in the future (or now, up to 30 mins ago)");
        }

        // Validate endTime > startTime
        if (!req.getEndTime().isAfter(req.getStartTime())) {
            throw new IllegalArgumentException("endTime must be strictly after startTime");
        }

        // Validate startingPrice > 0
        if (req.getStartingPrice() == null || req.getStartingPrice().signum() <= 0) {
            throw new IllegalArgumentException("startingPrice must be greater than 0");
        }

        // Validate minIncrement > 0
        if (req.getMinIncrement() == null || req.getMinIncrement().signum() <= 0) {
            throw new IllegalArgumentException("minIncrement must be greater than 0");
        }

        // Validate gem exists and has status PUBLISHED
        Gemstone gem = gemstoneRepository.findByIdWithPessimisticLock(req.getGemstoneId())
                .orElseThrow(() -> new IllegalArgumentException("Gemstone not found: " + req.getGemstoneId()));

        if (gem.getStatus() != Gemstone.GemStatus.PUBLISHED) {
            throw new IllegalStateException(
                    "Gemstone must be PUBLISHED to create an auction (current status: " + gem.getStatus() + ")");
        }

        // Transition gem to RESERVED so it can't be listed in another concurrent auction
        gem.setStatus(Gemstone.GemStatus.RESERVED);
        gemstoneRepository.save(gem);

        // Build and persist auction
        Auction auction = new Auction();
        auction.setGemstone(gem);
        auction.setStartingPrice(req.getStartingPrice());
        auction.setMinIncrement(req.getMinIncrement());
        auction.setStartTime(req.getStartTime());
        auction.setEndTime(req.getEndTime());
        auction.setStatus(Auction.AuctionStatus.SCHEDULED);
        return auctionRepository.save(auction);
    }

    /**
     * Updates an auction. Only allowed while status = SCHEDULED.
     */
    @Transactional
    public Auction update(Long id, CreateAuctionRequest req) {
        Auction existing = auctionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + id));

        if (existing.getStatus() != Auction.AuctionStatus.SCHEDULED) {
            throw new IllegalStateException("Only SCHEDULED auctions can be edited.");
        }

        // Validate times if provided
        if (req.getStartTime() != null && req.getEndTime() != null
                && !req.getEndTime().isAfter(req.getStartTime())) {
            throw new IllegalArgumentException("endTime must be strictly after startTime");
        }

        if (req.getStartingPrice() != null) existing.setStartingPrice(req.getStartingPrice());
        if (req.getMinIncrement() != null) existing.setMinIncrement(req.getMinIncrement());
        if (req.getStartTime() != null) existing.setStartTime(req.getStartTime());
        if (req.getEndTime() != null) existing.setEndTime(req.getEndTime());

        return auctionRepository.save(existing);
    }

    /**
     * Deletes an auction. Allowed for SCHEDULED or ENDED auctions.
     * Reverts gemstone.status back to PUBLISHED so it can be relisted.
     */
    @Transactional
    public void delete(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + id));

        if (auction.getStatus() == Auction.AuctionStatus.LIVE) {
            throw new IllegalStateException("LIVE auctions cannot be deleted. End them early instead.");
        }

        // Delete all bids for this auction first to prevent foreign key constraint violations
        bidRepository.deleteByAuctionId(id);

        // Revert gem back to PUBLISHED so it can be relisted
        Gemstone gem = auction.getGemstone();
        gem.setStatus(Gemstone.GemStatus.PUBLISHED);
        gemstoneRepository.save(gem);

        auctionRepository.deleteById(id);
    }

    /**
     * Admin force-closes a LIVE auction.
     * Uses the same shared closeAuction() logic as the scheduler — no code duplication.
     */
    @Transactional
    public Auction endEarly(Long id) {
        Auction auction = auctionRepository.findByIdWithPessimisticLock(id)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + id));

        if (auction.getStatus() == Auction.AuctionStatus.ENDED) {
            throw new IllegalStateException("Auction is already ended");
        }
        if (auction.getStatus() == Auction.AuctionStatus.SCHEDULED) {
            throw new IllegalStateException("Cannot force-close a SCHEDULED auction. Delete it instead.");
        }

        closeAuction(auction);
        return auctionRepository.findById(id).orElseThrow();
    }

    // ─── Shared close logic (used by scheduler + endEarly) ───────────────────

    /**
     * Closes an auction: sets status=ENDED, updates gem status, publishes AUCTION_ENDED event.
     * Note: This is an internal helper, usually called via scheduler or endAuctionEarly. context with a pessimistic lock already held.
     *
     * If bids exist: gem → SOLD, broadcast with winner info + "Won — Awaiting Payment & Collection"
     * If no bids:    gem → PUBLISHED (available for relisting), broadcast "No bids — auction closed"
     */
    public void closeAuction(Auction auction) {
        auction.setStatus(Auction.AuctionStatus.ENDED);

        Gemstone gem = auction.getGemstone();
        String message;

        if (auction.getCurrentBid() != null) {
            // At least one bid was placed
            gem.setStatus(Gemstone.GemStatus.SOLD);
            message = "Won — Awaiting Payment & Collection";
        } else {
            // No bids — gem goes back to PUBLISHED so it can be relisted
            gem.setStatus(Gemstone.GemStatus.PUBLISHED);
            message = "No bids — auction closed";
        }

        gemstoneRepository.save(gem);
        auctionRepository.save(auction);

        // Publish event — will broadcast AFTER the enclosing transaction commits
        biddingService.publishAuctionEndedEvent(
                auction.getId(),
                auction.getCurrentBid(),
                auction.getHighestBidderId(),
                message
        );
    }
}
