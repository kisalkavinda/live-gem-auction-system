package com.gemhaven.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gemstones")
public class Gemstone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal carat;

    @Column(nullable = false, length = 50)
    private String cut;

    @Column(nullable = false, length = 50)
    private String color;

    @Column(name = "certification_pdf_url")
    private String certificationPdfUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "reservation_status", length = 50)
    private ReservationStatus reservationStatus = ReservationStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ReservationStatus {
        AVAILABLE, RESERVED, SOLD
    }

    public Gemstone() {}

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getCarat() { return carat; }
    public void setCarat(BigDecimal carat) { this.carat = carat; }

    public String getCut() { return cut; }
    public void setCut(String cut) { this.cut = cut; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getCertificationPdfUrl() { return certificationPdfUrl; }
    public void setCertificationPdfUrl(String certificationPdfUrl) { this.certificationPdfUrl = certificationPdfUrl; }

    public ReservationStatus getReservationStatus() { return reservationStatus; }
    public void setReservationStatus(ReservationStatus reservationStatus) { this.reservationStatus = reservationStatus; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
