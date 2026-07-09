package com.gemhaven.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class BidEventDTO {

    private String type; // "BID_PLACED" | "AUCTION_ENDED"
    private Long auctionId;
    private BigDecimal currentBid;
    private String bidder;       // masked e.g. "Bidder ****42"
    private BigDecimal winningBid; // only set for AUCTION_ENDED
    private String winner;         // only set for AUCTION_ENDED
    private Instant timestamp;

    private BidEventDTO() {}

    public static BidEventDTO bidPlaced(Long auctionId, BigDecimal currentBid,
                                        String bidder, Instant timestamp) {
        BidEventDTO dto = new BidEventDTO();
        dto.type = "BID_PLACED";
        dto.auctionId = auctionId;
        dto.currentBid = currentBid;
        dto.bidder = bidder;
        dto.timestamp = timestamp;
        return dto;
    }

    public static BidEventDTO auctionEnded(Long auctionId, BigDecimal winningBid, String winner) {
        BidEventDTO dto = new BidEventDTO();
        dto.type = "AUCTION_ENDED";
        dto.auctionId = auctionId;
        dto.winningBid = winningBid;
        dto.winner = winner;
        dto.timestamp = Instant.now();
        return dto;
    }

    public String getType() { return type; }
    public Long getAuctionId() { return auctionId; }
    public BigDecimal getCurrentBid() { return currentBid; }
    public String getBidder() { return bidder; }
    public BigDecimal getWinningBid() { return winningBid; }
    public String getWinner() { return winner; }
    public Instant getTimestamp() { return timestamp; }
}
