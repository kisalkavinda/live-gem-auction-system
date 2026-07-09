package com.gemhaven.controller;

import com.gemhaven.model.Auction;
import com.gemhaven.model.Bid;
import com.gemhaven.service.AuctionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionService auctionService;

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }

    /** GET /api/auctions?status= */
    @GetMapping
    public ResponseEntity<List<Auction>> getAll(
            @RequestParam(required = false) Auction.AuctionStatus status) {
        return ResponseEntity.ok(auctionService.getAll(status));
    }

    /** GET /api/auctions/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Auction> getById(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getById(id));
    }

    /**
     * POST /api/auctions — ADMIN only
     * Body includes gemstoneId + auction fields (startingPrice, minIncrement, endTime)
     */
    @PostMapping
    public ResponseEntity<Auction> create(
            @RequestParam Long gemstoneId,
            @RequestBody Auction auction) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(auctionService.create(gemstoneId, auction));
    }

    /** PUT /api/auctions/{id} — ADMIN only, only while SCHEDULED */
    @PutMapping("/{id}")
    public ResponseEntity<Auction> update(@PathVariable Long id, @RequestBody Auction auction) {
        return ResponseEntity.ok(auctionService.update(id, auction));
    }

    /** DELETE /api/auctions/{id} — ADMIN only */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        auctionService.delete(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    /** POST /api/auctions/{id}/end-early — ADMIN only */
    @PostMapping("/{id}/end-early")
    public ResponseEntity<Auction> endEarly(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.endEarly(id));
    }

    /** GET /api/auctions/{id}/bids — public bid history */
    @GetMapping("/{id}/bids")
    public ResponseEntity<List<Bid>> getBidHistory(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getBidHistory(id));
    }

    // NOTE: Bid placement is WebSocket-only via @MessageMapping in AuctionWebSocketController.
    // There is intentionally no POST /api/auctions/{id}/bids REST endpoint.
}
