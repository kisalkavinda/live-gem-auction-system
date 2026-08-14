package com.gemhaven.controller;

import com.gemhaven.model.Reservation;
import com.gemhaven.model.User;
import com.gemhaven.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReservationController {

    private static final Logger log = LoggerFactory.getLogger(ReservationController.class);
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    /** POST /api/reservations — Create customer reservation on checkout */
    @PostMapping("/reservations")
    public ResponseEntity<?> createReservation(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {

        try {
            log.info("Received reservation payload: {}", body);

            Object gemIdObj = body.get("gemId") != null ? body.get("gemId") : body.get("gemstoneId");
            if (gemIdObj == null && body.get("id") != null) {
                gemIdObj = body.get("id");
            }
            if (gemIdObj == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "gemId is required for reservation"));
            }

            String gemIdStr = gemIdObj.toString();
            if (gemIdStr.contains("-")) {
                gemIdStr = gemIdStr.split("-")[0];
            }
            Long gemId;
            try {
                gemId = Long.valueOf(gemIdStr);
            } catch (NumberFormatException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid gemId format: " + gemIdObj));
            }

            Reservation reservation = new Reservation();
            reservation.setCustomerName(getStringOrDefault(body, "customerName", "Valued Customer"));
            reservation.setCustomerPhone(getStringOrDefault(body, "customerPhone", "N/A"));
            reservation.setCustomerAddress(getStringOrDefault(body, "customerAddress", "N/A"));
            reservation.setCity(getStringOrDefault(body, "city", "N/A"));
            reservation.setProvince(getStringOrDefault(body, "province", "N/A"));
            reservation.setDistrict(getStringOrDefault(body, "district", "N/A"));
            reservation.setPostalCode(getStringOrDefault(body, "postalCode", "00000"));

            if (body.get("totalAmount") != null) {
                try {
                    reservation.setTotalAmount(new BigDecimal(body.get("totalAmount").toString()));
                } catch (Exception e) {
                    reservation.setTotalAmount(BigDecimal.ZERO);
                }
            } else {
                reservation.setTotalAmount(BigDecimal.ZERO);
            }

            if (body.get("paymentMethod") != null) {
                reservation.setPaymentMethod(body.get("paymentMethod").toString());
            }

            Reservation created = reservationService.createReservation(reservation, gemId, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (IllegalArgumentException e) {
            log.warn("Reservation validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating reservation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    /** GET /api/admin/reservations — ADMIN only */
    @GetMapping("/admin/reservations")
    public ResponseEntity<List<Reservation>> getAllReservations(
            @RequestParam(required = false) Reservation.ReservationStatus status) {
        return ResponseEntity.ok(reservationService.getAllReservations(status));
    }

    /** PUT /api/admin/reservations/{id}/status — ADMIN only */
    @PutMapping("/admin/reservations/{id}/status")
    public ResponseEntity<Reservation> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null || statusStr.isBlank()) {
            throw new IllegalArgumentException("Status field is required");
        }
        Reservation.ReservationStatus status = Reservation.ReservationStatus.valueOf(statusStr.toUpperCase());
        return ResponseEntity.ok(reservationService.updateStatus(id, status));
    }

    private String getStringOrDefault(Map<String, Object> map, String key, String defaultValue) {
        Object val = map.get(key);
        if (val == null || val.toString().isBlank()) {
            return defaultValue;
        }
        return val.toString().trim();
    }
}
