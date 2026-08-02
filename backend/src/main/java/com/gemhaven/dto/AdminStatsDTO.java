package com.gemhaven.dto;

import java.math.BigDecimal;

public class AdminStatsDTO {

    private long totalGems;
    private long activeAuctions;
    private long totalBuyers;
    private BigDecimal revenueThisMonth;

    public AdminStatsDTO(long totalGems, long activeAuctions,
                         long totalBuyers, BigDecimal revenueThisMonth) {
        this.totalGems = totalGems;
        this.activeAuctions = activeAuctions;
        this.totalBuyers = totalBuyers;
        this.revenueThisMonth = revenueThisMonth;
    }

    public long getTotalGems() { return totalGems; }
    public long getActiveAuctions() { return activeAuctions; }
    public long getTotalBuyers() { return totalBuyers; }
    public BigDecimal getRevenueThisMonth() { return revenueThisMonth; }
}
