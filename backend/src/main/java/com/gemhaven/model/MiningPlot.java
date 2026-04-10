package com.gemhaven.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "mining_plots")
public class MiningPlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "geological_data", nullable = false, columnDefinition = "jsonb")
    private String geologicalData;

    @Column(name = "yield_estimate", precision = 10, scale = 2)
    private BigDecimal yieldEstimate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public MiningPlot() {}

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGeologicalData() { return geologicalData; }
    public void setGeologicalData(String geologicalData) { this.geologicalData = geologicalData; }

    public BigDecimal getYieldEstimate() { return yieldEstimate; }
    public void setYieldEstimate(BigDecimal yieldEstimate) { this.yieldEstimate = yieldEstimate; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
