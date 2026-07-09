package com.gemhaven.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "mining_plots")
public class MiningPlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String region;

    @Column(name = "size_perch", precision = 10, scale = 2)
    private BigDecimal sizePerch;

    @Column(name = "size_acres", precision = 10, scale = 4)
    private BigDecimal sizeAcres;

    /** Human-readable label e.g. "High (Sapphire Focus)" */
    @Column(name = "yield_potential", length = 100)
    private String yieldPotential;

    /** Precise numeric estimate kept for future analytics */
    @Column(name = "yield_estimate", precision = 10, scale = 2)
    private BigDecimal yieldEstimate;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private PlotStatus status = PlotStatus.AVAILABLE;

    /** List of image URL strings stored as a JSON array */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> images;

    @Column(name = "survey_date")
    private LocalDate surveyDate;

    @Column(name = "soil_composition", columnDefinition = "TEXT")
    private String soilComposition;

    @Column(name = "historical_yield_data", columnDefinition = "TEXT")
    private String historicalYieldData;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String coordinates;

    /** Catch-all JSONB for additional survey data not covered by discrete columns */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "geological_data", columnDefinition = "jsonb")
    private String geologicalData;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum PlotStatus {
        AVAILABLE, RESERVED, UNDER_SURVEY
    }

    public MiningPlot() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public BigDecimal getSizePerch() { return sizePerch; }
    public void setSizePerch(BigDecimal sizePerch) { this.sizePerch = sizePerch; }

    public BigDecimal getSizeAcres() { return sizeAcres; }
    public void setSizeAcres(BigDecimal sizeAcres) { this.sizeAcres = sizeAcres; }

    public String getYieldPotential() { return yieldPotential; }
    public void setYieldPotential(String yieldPotential) { this.yieldPotential = yieldPotential; }

    public BigDecimal getYieldEstimate() { return yieldEstimate; }
    public void setYieldEstimate(BigDecimal yieldEstimate) { this.yieldEstimate = yieldEstimate; }

    public PlotStatus getStatus() { return status; }
    public void setStatus(PlotStatus status) { this.status = status; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public LocalDate getSurveyDate() { return surveyDate; }
    public void setSurveyDate(LocalDate surveyDate) { this.surveyDate = surveyDate; }

    public String getSoilComposition() { return soilComposition; }
    public void setSoilComposition(String soilComposition) { this.soilComposition = soilComposition; }

    public String getHistoricalYieldData() { return historicalYieldData; }
    public void setHistoricalYieldData(String historicalYieldData) { this.historicalYieldData = historicalYieldData; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoordinates() { return coordinates; }
    public void setCoordinates(String coordinates) { this.coordinates = coordinates; }

    public String getGeologicalData() { return geologicalData; }
    public void setGeologicalData(String geologicalData) { this.geologicalData = geologicalData; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
