package com.gemhaven.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "land_plot_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private MiningPlot landPlot;

    /** Buyer who submitted the booking — non-nullable; BUYER auth is required. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @NotBlank
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Email
    @NotBlank
    @Column(nullable = false)
    private String email;

    @Column(length = 30)
    private String phone;

    @NotNull
    @Column(name = "preferred_visit_date", nullable = false)
    private LocalDate preferredVisitDate;

    @Column(name = "num_visitors")
    private Integer numVisitors;

    /** Optional notes or special requests */
    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum BookingStatus {
        PENDING, CONFIRMED, COMPLETED
    }

    public Booking() {}

    // ─── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MiningPlot getLandPlot() { return landPlot; }
    public void setLandPlot(MiningPlot landPlot) { this.landPlot = landPlot; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getPreferredVisitDate() { return preferredVisitDate; }
    public void setPreferredVisitDate(LocalDate preferredVisitDate) { this.preferredVisitDate = preferredVisitDate; }

    public Integer getNumVisitors() { return numVisitors; }
    public void setNumVisitors(Integer numVisitors) { this.numVisitors = numVisitors; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
