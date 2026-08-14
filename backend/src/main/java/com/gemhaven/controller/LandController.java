package com.gemhaven.controller;

import com.gemhaven.model.Booking;
import com.gemhaven.model.MiningPlot;
import com.gemhaven.model.User;
import com.gemhaven.service.LandService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/land")
public class LandController {

    private final LandService landService;

    public LandController(LandService landService) {
        this.landService = landService;
    }

    /** GET /api/land?region=&status=&minAcres=&maxAcres=&sort= */
    @GetMapping
    public ResponseEntity<List<MiningPlot>> getAll(
            @RequestParam(required = false) String region,
            @RequestParam(required = false) MiningPlot.PlotStatus status,
            @RequestParam(required = false) BigDecimal minAcres,
            @RequestParam(required = false) BigDecimal maxAcres,
            @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(landService.getAll(region, status, minAcres, maxAcres, sort));
    }

    /** GET /api/land/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<MiningPlot> getById(@PathVariable Long id) {
        return ResponseEntity.ok(landService.getById(id));
    }

    /** POST /api/land — ADMIN only */
    @PostMapping
    public ResponseEntity<MiningPlot> create(@RequestBody MiningPlot plot) {
        return ResponseEntity.status(HttpStatus.CREATED).body(landService.create(plot));
    }

    /** PUT /api/land/{id} — ADMIN only */
    @PutMapping("/{id}")
    public ResponseEntity<MiningPlot> update(@PathVariable Long id, @RequestBody MiningPlot plot) {
        return ResponseEntity.ok(landService.update(id, plot));
    }

    /** DELETE /api/land/{id} — ADMIN only */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        landService.delete(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    /** POST /api/land/{id}/bookings — BUYER required */
    @PostMapping("/{id}/bookings")
    public ResponseEntity<Booking> submitBooking(
            @PathVariable Long id,
            @RequestBody Booking booking,
            @AuthenticationPrincipal User authenticatedUser
    ) {
        if (authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(landService.submitBooking(id, booking, authenticatedUser));
    }

    /** GET /api/land/bookings — ADMIN only */
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) Booking.BookingStatus status) {
        return ResponseEntity.ok(landService.getAllBookings(status));
    }

    /** GET /api/land/my-bookings — Authenticated User */
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal User authenticatedUser) {
        if (authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(landService.getUserBookings(authenticatedUser));
    }

    /** PUT /api/land/bookings/{id}/status — ADMIN only */
    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(landService.updateBookingStatus(id, newStatus));
    }
}
