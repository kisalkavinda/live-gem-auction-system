package com.gemhaven.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

public class BidEventDTO {

    private String type;          // "BID_PLACED" | "AUCTION_STARTED" | "AUCTION_ENDED"
    private Long auctionId;
    private BigDecimal currentBid;
    private String bidder;         // masked e.g. "Bidder ****42"
    private LocalDateTime endTime; // included in BID_PLACED so clients know if endTime was extended
    private BigDecimal winningBid; // only set for AUCTION_ENDED
    private Long winnerId;         // only set for AUCTION_ENDED (highestBidderId)
    private String message;        // e.g. "Won — Awaiting Payment & Collection"
    private Instant timestamp;

    private BidEventDTO() {}

    public static BidEventDTO bidPlaced(Long auctionId, BigDecimal currentBid,
                                        String bidder, LocalDateTime endTime, Instant timestamp) {
        BidEventDTO dto = new BidEventDTO();
        dto.type = "BID_PLACED";
        dto.auctionId = auctionId;
        dto.currentBid = currentBid;
        dto.bidder = bidder;
        dto.endTime = endTime;
        dto.timestamp = timestamp;
        return dto;
    }

    public static BidEventDTO auctionStarted(Long auctionId) {
        BidEventDTO dto = new BidEventDTO();
        dto.type = "AUCTION_STARTED";
        dto.auctionId = auctionId;
        dto.timestamp = Instant.now();
        return dto;
    }

    public static BidEventDTO auctionEnded(Long auctionId, BigDecimal winningBid,
                                           Long winnerId, String message) {
        BidEventDTO dto = new BidEventDTO();
        dto.type = "AUCTION_ENDED";
        dto.auctionId = auctionId;
        dto.winningBid = winningBid;
        dto.winnerId = winnerId;
        dto.message = message;
        dto.timestamp = Instant.now();
        return dto;
    }

    // ─── Getters ─────────────────────────────────────────────────────────────

    public String getType() { return type; }
    public Long getAuctionId() { return auctionId; }
    public BigDecimal getCurrentBid() { return currentBid; }
    public String getBidder() { return bidder; }
    public LocalDateTime getEndTime() { return endTime; }
    public BigDecimal getWinningBid() { return winningBid; }
    public Long getWinnerId() { return winnerId; }
    public String getMessage() { return message; }
    public Instant getTimestamp() { return timestamp; }
}
