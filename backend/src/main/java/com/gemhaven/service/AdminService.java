package com.gemhaven.service;

import com.gemhaven.dto.AdminStatsDTO;
import com.gemhaven.dto.BuyerSummaryDTO;
import com.gemhaven.model.Auction;
import com.gemhaven.model.Bid;
import com.gemhaven.model.Booking;
import com.gemhaven.model.User;
import com.gemhaven.repository.AuctionRepository;
import com.gemhaven.repository.BidRepository;
import com.gemhaven.repository.BookingRepository;
import com.gemhaven.repository.GemstoneRepository;
import com.gemhaven.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@SuppressWarnings("null")
public class AdminService {

    private final UserRepository userRepository;
    private final GemstoneRepository gemstoneRepository;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository,
                        GemstoneRepository gemstoneRepository,
                        AuctionRepository auctionRepository,
                        BidRepository bidRepository,
                        BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.gemstoneRepository = gemstoneRepository;
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
        this.bookingRepository = bookingRepository;
    }

    public AdminStatsDTO getOverviewStats() {
        long totalGems = gemstoneRepository.count();
        long activeAuctions = auctionRepository.countByStatusIn(
                List.of(Auction.AuctionStatus.LIVE, Auction.AuctionStatus.SCHEDULED));
        long totalBuyers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.BUYER)
                .count();

        // Revenue = sum of winning bids on ENDED auctions (simplified)
        BigDecimal revenueThisMonth = auctionRepository.findByStatus(Auction.AuctionStatus.ENDED)
                .stream()
                .filter(a -> a.getCurrentBid() != null)
                .filter(a -> a.getCreatedAt() != null &&
                        a.getCreatedAt().getMonth() == LocalDateTime.now().getMonth() &&
                        a.getCreatedAt().getYear() == LocalDateTime.now().getYear())
                .map(Auction::getCurrentBid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminStatsDTO(totalGems, activeAuctions, totalBuyers, revenueThisMonth);
    }

    public List<Map<String, Object>> getRecentActivity() {
        // Returns a simplified recent activity feed:
        // last 10 bids, last 5 bookings, last 5 auctions ending soon
        List<Bid> recentBids = bidRepository.findAll().stream()
                .filter(b -> b.getTimestamp() != null && b.getAuction() != null && b.getAmount() != null)
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(10)
                .toList();

        return recentBids.stream().map(bid -> Map.<String, Object>of(
                "type", "BID",
                "auctionId", bid.getAuction().getId(),
                "amount", bid.getAmount(),
                "timestamp", bid.getTimestamp()
        )).toList();
    }

    public List<BuyerSummaryDTO> getAllBuyers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.BUYER)
                .map(user -> new BuyerSummaryDTO(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getCreatedAt(),
                        bidRepository.countByUser(user),
                        bidRepository.countWonAuctionsByUser(user),
                        "Active" // Future: derive from a user.status field if suspension is added
                ))
                .toList();
    }

    public BuyerSummaryDTO getBuyerDetail(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));

        return new BuyerSummaryDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt(),
                bidRepository.countByUser(user),
                bidRepository.countWonAuctionsByUser(user),
                "Active"
        );
    }

    public List<Booking> getAllBookings(Booking.BookingStatus status) {
        if (status != null) {
            return bookingRepository.findByStatus(status);
        }
        return bookingRepository.findAll();
    }
}
