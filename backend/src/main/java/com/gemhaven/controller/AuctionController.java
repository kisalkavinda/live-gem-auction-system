package com.gemhaven.controller;

import com.gemhaven.dto.CreateAuctionRequest;
import com.gemhaven.model.Auction;
import com.gemhaven.model.Bid;
import com.gemhaven.service.AuctionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

    /** GET /api/auctions?status= — public */
    @GetMapping
    public ResponseEntity<List<Auction>> getAll(
            @RequestParam(required = false) Auction.AuctionStatus status) {
        return ResponseEntity.ok(auctionService.getAll(status));
    }

    /** GET /api/auctions/{id} — public, full detail */
    @GetMapping("/{id}")
    public ResponseEntity<Auction> getById(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.getById(id));
    }

    /**
     * GET /api/auctions/{id}/bids — public, paginated bid history newest first.
     * Example: GET /api/auctions/1/bids?page=0&size=20
     */
    @GetMapping("/{id}/bids")
    public ResponseEntity<Page<Bid>> getBidHistory(
            @PathVariable Long id,
            @PageableDefault(size = 20, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auctionService.getBidHistory(id, pageable));
    }

    /**
     * POST /api/auctions — ADMIN only.
     * Body: { gemstoneId, startingPrice, minIncrement, startTime, endTime }
     * Runs Part 2 validation. On success: gemstone.status flips to RESERVED.
     *
     * NOTE: Bid placement is WebSocket-only via @MessageMapping in AuctionWebSocketController.
     * There is intentionally no POST /api/auctions/{id}/bids REST endpoint.
     */
    @PostMapping
    public ResponseEntity<Auction> create(@Valid @RequestBody CreateAuctionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(auctionService.create(request));
    }

    /** PUT /api/auctions/{id} — ADMIN only, only while SCHEDULED */
    @PutMapping("/{id}")
    public ResponseEntity<Auction> update(@PathVariable Long id,
                                          @RequestBody CreateAuctionRequest request) {
        return ResponseEntity.ok(auctionService.update(id, request));
    }

    /** DELETE /api/auctions/{id} — ADMIN only, only while SCHEDULED; reverts gem to PUBLISHED */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        auctionService.delete(id);
        return ResponseEntity.ok(Map.of("deleted", true));
    }

    /** POST /api/auctions/{id}/end-early — ADMIN only, force-closes a LIVE auction */
    @PostMapping("/{id}/end-early")
    public ResponseEntity<Auction> endEarly(@PathVariable Long id) {
        return ResponseEntity.ok(auctionService.endEarly(id));
    }
}
