package com.gemhaven.repository;

import com.gemhaven.model.Bid;
import com.gemhaven.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    /** Bids for a given auction, newest first — for bid history feed (list version) */
    List<Bid> findByAuction_IdOrderByTimestampDesc(Long auctionId);

    /** Bids for a given auction, newest first — paginated version for REST endpoint */
    Page<Bid> findByAuction_IdOrderByTimestampDesc(Long auctionId, Pageable pageable);

    /** Count of bids placed by a specific user — for BuyerSummaryDTO */
    long countByUser(User user);

    /** Count of bids for a specific auction — for concurrency test assertions */
    long countByAuction_Id(Long auctionId);

    /**
     * Find bids for an auction ordered by amount descending.
     * Used to look up the previous highest bidder for outbid notifications.
     */
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.amount DESC")
    List<Bid> findByAuctionIdOrderByAmountDesc(@Param("auctionId") Long auctionId);

    /** The previous highest bidder (best bid excluding a specific user) */
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId AND b.user != :excludeUser ORDER BY b.amount DESC")
    Optional<Bid> findTopBidByAuctionExcludingUser(
            @Param("auctionId") Long auctionId,
            @Param("excludeUser") User excludeUser
    );

    /** Count of won auctions for a user (where their bid equals the auction's currentBid on ENDED auctions) */
    @Query("""
        SELECT COUNT(DISTINCT b.auction.id)
        FROM Bid b
        WHERE b.user = :user
        AND b.auction.status = :status
        AND b.amount = b.auction.currentBid
    """)
    long countWonAuctionsByUserAndStatus(@Param("user") User user, @Param("status") com.gemhaven.model.Auction.AuctionStatus status);

    default long countWonAuctionsByUser(User user) {
        return countWonAuctionsByUserAndStatus(user, com.gemhaven.model.Auction.AuctionStatus.ENDED);
    }
}
