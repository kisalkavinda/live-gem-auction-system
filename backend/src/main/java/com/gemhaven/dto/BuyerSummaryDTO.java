package com.gemhaven.dto;

import java.time.LocalDateTime;

public class BuyerSummaryDTO {

    private Long id;
    private String fullName;
    private String email;
    private LocalDateTime joinDate;
    private long bidsPlaced;
    private long purchases;
    private String status; // "Active" | "Suspended"

    public BuyerSummaryDTO(Long id, String fullName, String email,
                           LocalDateTime joinDate, long bidsPlaced, long purchases,
                           String status) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.joinDate = joinDate;
        this.bidsPlaced = bidsPlaced;
        this.purchases = purchases;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public LocalDateTime getJoinDate() { return joinDate; }
    public long getBidsPlaced() { return bidsPlaced; }
    public long getPurchases() { return purchases; }
    public String getStatus() { return status; }
}
