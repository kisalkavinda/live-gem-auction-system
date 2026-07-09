package com.gemhaven.service;

import com.gemhaven.model.Auction;
import com.gemhaven.model.Bid;
import com.gemhaven.model.Gemstone;
import com.gemhaven.repository.AuctionRepository;
import com.gemhaven.repository.BidRepository;
import com.gemhaven.repository.GemstoneRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@SuppressWarnings("null")
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final GemstoneRepository gemstoneRepository;
    private final BidRepository bidRepository;

    public AuctionService(AuctionRepository auctionRepository,
                          GemstoneRepository gemstoneRepository,
                          BidRepository bidRepository) {
        this.auctionRepository = auctionRepository;
        this.gemstoneRepository = gemstoneRepository;
        this.bidRepository = bidRepository;
    }

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

    @Transactional
    public Auction create(Long gemstoneId, Auction auction) {
        Gemstone gem = gemstoneRepository.findById(gemstoneId)
                .orElseThrow(() -> new IllegalArgumentException("Gemstone not found: " + gemstoneId));
        auction.setGemstone(gem);
        auction.setStatus(Auction.AuctionStatus.SCHEDULED);
        return auctionRepository.save(auction);
    }

    @Transactional
    public Auction update(Long id, Auction updated) {
        Auction existing = getById(id);
        if (existing.getStatus() != Auction.AuctionStatus.SCHEDULED) {
            throw new IllegalStateException("Only SCHEDULED auctions can be edited.");
        }
        existing.setStartingPrice(updated.getStartingPrice());
        existing.setMinIncrement(updated.getMinIncrement());
        existing.setEndTime(updated.getEndTime());
        return auctionRepository.save(existing);
    }

    public void delete(Long id) {
        auctionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + id));
        auctionRepository.deleteById(id);
    }

    @Transactional
    public Auction endEarly(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + id));
        if (auction.getStatus() == Auction.AuctionStatus.ENDED) {
            throw new IllegalStateException("Auction is already ended.");
        }
        auction.setStatus(Auction.AuctionStatus.ENDED);
        return auctionRepository.save(auction);
    }

    public List<Bid> getBidHistory(Long auctionId) {
        return bidRepository.findByAuction_IdOrderByTimestampDesc(auctionId);
    }
}
