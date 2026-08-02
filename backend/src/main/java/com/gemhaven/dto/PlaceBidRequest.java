package com.gemhaven.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class PlaceBidRequest {

    @NotNull
    @Positive
    private BigDecimal amount;

    public PlaceBidRequest() {}

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
