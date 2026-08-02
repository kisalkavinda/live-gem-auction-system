package com.gemhaven.controller;

import com.gemhaven.dto.AdminStatsDTO;
import com.gemhaven.dto.BuyerSummaryDTO;
import com.gemhaven.model.Booking;
import com.gemhaven.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /** GET /api/admin/stats/overview */
    @GetMapping("/stats/overview")
    public ResponseEntity<AdminStatsDTO> getOverviewStats() {
        return ResponseEntity.ok(adminService.getOverviewStats());
    }

    /** GET /api/admin/activity */
    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() {
        return ResponseEntity.ok(adminService.getRecentActivity());
    }

    /** GET /api/admin/buyers */
    @GetMapping("/buyers")
    public ResponseEntity<List<BuyerSummaryDTO>> getAllBuyers() {
        return ResponseEntity.ok(adminService.getAllBuyers());
    }

    /** GET /api/admin/buyers/{id} */
    @GetMapping("/buyers/{id}")
    public ResponseEntity<BuyerSummaryDTO> getBuyerDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getBuyerDetail(id));
    }

    /** PUT /api/admin/buyers/{id}/status — body: {status: "Active"|"Suspended"} */
    @PutMapping("/buyers/{id}/status")
    public ResponseEntity<Map<String, Boolean>> updateBuyerStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        // Note: user suspension requires a `status` column on User entity (not yet added).
        // This endpoint currently returns success without side effects as a placeholder.
        // Track in future iteration: add User.status field + update logic here.
        return ResponseEntity.ok(Map.of("updated", true));
    }

    /** GET /api/admin/bookings?status= */
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) Booking.BookingStatus status) {
        return ResponseEntity.ok(adminService.getAllBookings(status));
    }
}
