package com.gemhaven.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Request body for POST /api/auctions.
 * Keeps gemstoneId, pricing, and scheduling together in one clean JSON body.
 */
public class CreateAuctionRequest {

    @NotNull
    private Long gemstoneId;

    @NotNull
    @Positive
    private BigDecimal startingPrice;

    @NotNull
    @Positive
    private BigDecimal minIncrement;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    public CreateAuctionRequest() {}

    public Long getGemstoneId() { return gemstoneId; }
    public void setGemstoneId(Long gemstoneId) { this.gemstoneId = gemstoneId; }

    public BigDecimal getStartingPrice() { return startingPrice; }
    public void setStartingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; }

    public BigDecimal getMinIncrement() { return minIncrement; }
    public void setMinIncrement(BigDecimal minIncrement) { this.minIncrement = minIncrement; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}
