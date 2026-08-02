package com.gemhaven.repository;

import com.gemhaven.model.Auction;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {

    List<Auction> findByStatus(Auction.AuctionStatus status);

    /** Used by scheduler to find SCHEDULED auctions whose startTime has arrived */
    List<Auction> findByStatusAndStartTimeLessThanEqual(Auction.AuctionStatus status, LocalDateTime now);

    /** Used by scheduler to find LIVE auctions whose endTime has passed */
    List<Auction> findByStatusAndEndTimeLessThanEqual(Auction.AuctionStatus status, LocalDateTime now);

    /** Count of active (LIVE or SCHEDULED) auctions — for admin overview stats */
    long countByStatusIn(List<Auction.AuctionStatus> statuses);

    /**
     * Pessimistic write lock — ensures bid placement and current_bid updates are atomic.
     * Prevents two concurrent bids from both passing the "is this bid higher?" check.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Auction a WHERE a.id = :id")
    Optional<Auction> findByIdWithPessimisticLock(@Param("id") Long id);
}
