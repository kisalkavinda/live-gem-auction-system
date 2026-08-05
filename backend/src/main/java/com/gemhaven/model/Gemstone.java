package com.gemhaven.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gemstones")
public class Gemstone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String type;

    @NotNull
    @Column(name = "carat_weight", nullable = false, precision = 10, scale = 3)
    private BigDecimal caratWeight;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String cut;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String color;

    @Column(name = "color_name", length = 100)
    private String colorName;

    @Column(length = 20)
    private String clarity;

    @Column(length = 100)
    private String origin;

    @Column(name = "cert_number", length = 100)
    private String certNumber;

    @Column(name = "cert_authority", length = 50)
    private String certAuthority;

    @Column(name = "certification_pdf_url")
    private String certificationPdfUrl;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    /**
     * Unified gem lifecycle status.
     * DB column name kept as "reservation_status" to avoid schema migration.
     * DRAFT     — not yet available for auction
     * PUBLISHED — available to be listed in an auction
     * RESERVED  — currently in an active/scheduled auction
     * SOLD      — auction closed with a winner; awaiting offline payment & collection
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "reservation_status", length = 50)
    private GemStatus status = GemStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum GemStatus {
        DRAFT, PUBLISHED, RESERVED, SOLD
    }

    public Gemstone() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getCaratWeight() { return caratWeight; }
    public void setCaratWeight(BigDecimal caratWeight) { this.caratWeight = caratWeight; }

    public String getCut() { return cut; }
    public void setCut(String cut) { this.cut = cut; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getColorName() { return colorName; }
    public void setColorName(String colorName) { this.colorName = colorName; }

    public String getClarity() { return clarity; }
    public void setClarity(String clarity) { this.clarity = clarity; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getCertNumber() { return certNumber; }
    public void setCertNumber(String certNumber) { this.certNumber = certNumber; }

    public String getCertAuthority() { return certAuthority; }
    public void setCertAuthority(String certAuthority) { this.certAuthority = certAuthority; }

    public String getCertificationPdfUrl() { return certificationPdfUrl; }
    public void setCertificationPdfUrl(String certificationPdfUrl) { this.certificationPdfUrl = certificationPdfUrl; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public GemStatus getStatus() { return status; }
    public void setStatus(GemStatus status) { this.status = status; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
