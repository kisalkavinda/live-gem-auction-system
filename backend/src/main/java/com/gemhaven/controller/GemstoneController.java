package com.gemhaven.controller;

import com.gemhaven.model.Gemstone;
import com.gemhaven.model.User;
import com.gemhaven.service.GemstoneService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gems")
public class GemstoneController {

    private final GemstoneService gemstoneService;

    public GemstoneController(GemstoneService gemstoneService) {
        this.gemstoneService = gemstoneService;
    }

    /** GET /api/gems?type=&clarity=&sort=&status= */
    @GetMapping
    public ResponseEntity<List<Gemstone>> getAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String clarity,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "PUBLISHED") String status
    ) {
        return ResponseEntity.ok(gemstoneService.getAll(type, clarity, sort, status));
    }

    /** GET /api/gems/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Gemstone> getById(@PathVariable Long id) {
        return ResponseEntity.ok(gemstoneService.getById(id));
    }

    /** POST /api/gems — ADMIN only (enforced by SecurityConfig) */
    @PostMapping
    public ResponseEntity<Gemstone> create(@RequestBody Gemstone gemstone) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gemstoneService.create(gemstone));
    }

    /** PUT /api/gems/{id} — ADMIN only */
    @PutMapping("/{id}")
    public ResponseEntity<Gemstone> update(@PathVariable Long id, @RequestBody Gemstone gemstone) {
        return ResponseEntity.ok(gemstoneService.update(id, gemstone));
    }

    /** DELETE /api/gems/{id} — ADMIN only */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        gemstoneService.delete(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    /** POST /api/gems/{id}/publish — ADMIN only (DRAFT → PUBLISHED) */
    @PostMapping("/{id}/publish")
    public ResponseEntity<Gemstone> publish(@PathVariable Long id) {
        return ResponseEntity.ok(gemstoneService.publish(id));
    }

    /** POST /api/gems/{id}/purchase — BUYER only */
    @PostMapping("/{id}/purchase")
    public ResponseEntity<Gemstone> purchase(@PathVariable Long id,
                                              @AuthenticationPrincipal User buyer) {
        return ResponseEntity.ok(gemstoneService.purchase(id, buyer));
    }
}
