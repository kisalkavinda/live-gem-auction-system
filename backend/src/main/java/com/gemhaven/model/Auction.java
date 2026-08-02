package com.gemhaven.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auctions")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * ManyToOne (not OneToOne) — a gem that doesn't sell can be relisted in a future auction.
     * No unique constraint on gemstone_id.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gemstone_id", nullable = false)
    private Gemstone gemstone;

    @NotNull
    @Positive
    @Column(name = "starting_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal startingPrice;

    @Column(name = "current_bid", precision = 15, scale = 2)
    private BigDecimal currentBid;

    @NotNull
    @Positive
    @Column(name = "min_increment", nullable = false, precision = 15, scale = 2)
    private BigDecimal minIncrement;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuctionStatus status = AuctionStatus.SCHEDULED;

    /**
     * Plain Long FK referencing users.id — not a full @ManyToOne to avoid join complexity.
     * Null if no bids have been placed yet.
     */
    @Column(name = "highest_bidder_id")
    private Long highestBidderId;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum AuctionStatus {
        SCHEDULED, LIVE, ENDED
    }

    public Auction() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Gemstone getGemstone() { return gemstone; }
    public void setGemstone(Gemstone gemstone) { this.gemstone = gemstone; }

    public BigDecimal getStartingPrice() { return startingPrice; }
    public void setStartingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; }

    public BigDecimal getCurrentBid() { return currentBid; }
    public void setCurrentBid(BigDecimal currentBid) { this.currentBid = currentBid; }

    public BigDecimal getMinIncrement() { return minIncrement; }
    public void setMinIncrement(BigDecimal minIncrement) { this.minIncrement = minIncrement; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public AuctionStatus getStatus() { return status; }
    public void setStatus(AuctionStatus status) { this.status = status; }

    public Long getHighestBidderId() { return highestBidderId; }
    public void setHighestBidderId(Long highestBidderId) { this.highestBidderId = highestBidderId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
