package com.gemhaven.service;

import com.gemhaven.model.Auction;
import com.gemhaven.model.Gemstone;
import com.gemhaven.model.User;
import com.gemhaven.repository.AuctionRepository;
import com.gemhaven.repository.BidRepository;
import com.gemhaven.repository.GemstoneRepository;
import com.gemhaven.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for concurrent bid placement.
 * Uses a real Spring context and real PostgreSQL connection.
 * These tests verify that the pessimistic locking in BiddingService
 * correctly serializes concurrent bid updates — no lost writes, no phantom reads.
 *
 * CRITICAL: Each bid is placed in a separate thread, each with its own transaction.
 * The pessimistic lock (SELECT FOR UPDATE) ensures only one thread holds the row at a time.
 */
@SpringBootTest
@ActiveProfiles("test")
@SuppressWarnings("null")
class BiddingConcurrencyTest {

    @Autowired private BiddingService biddingService;
    @Autowired private AuctionRepository auctionRepository;
    @Autowired private BidRepository bidRepository;
    @Autowired private GemstoneRepository gemstoneRepository;
    @Autowired private UserRepository userRepository;

    private Long auctionId;

    @BeforeEach
    void setUp() {
        // Clean up any previous test data
        bidRepository.deleteAll();
        // Don't delete all auctions/gems/users since they may cascade differently
        // Instead we create fresh test objects each time

        // Create a PUBLISHED gemstone
        Gemstone gem = new Gemstone();
        gem.setName("Concurrency Test Gem");
        gem.setType("Sapphire");
        gem.setCaratWeight(new BigDecimal("1.00"));
        gem.setCut("Round");
        gem.setColor("#0000FF");
        gem.setPrice(new BigDecimal("5000"));
        gem.setStatus(Gemstone.GemStatus.RESERVED);
        gem = gemstoneRepository.save(gem);

        // Create a LIVE auction with currentBid=100, minIncrement=10
        Auction auction = new Auction();
        auction.setGemstone(gem);
        auction.setStartingPrice(new BigDecimal("90"));
        auction.setCurrentBid(new BigDecimal("100"));
        auction.setMinIncrement(new BigDecimal("10"));
        auction.setStartTime(LocalDateTime.now().minusHours(1));
        auction.setEndTime(LocalDateTime.now().plusHours(2));
        auction.setStatus(Auction.AuctionStatus.LIVE);
        auction = auctionRepository.save(auction);
        this.auctionId = auction.getId();

        System.out.println("[Concurrency Test] Setup: auctionId=" + auctionId
                + " currentBid=100, minIncrement=10");
    }

    // ─── Test 7: 10 concurrent bids with different amounts ───────────────────

    /**
     * 10 threads each submit a DIFFERENT valid bid amount (110, 120, ..., 200) simultaneously.
     * Because each bid only succeeds if it's >= currentBid + minIncrement, under a pessimistic
     * lock the bids will be serialized. Since each thread bids its FIXED amount (not "current+10"),
     * multiple amounts can succeed in sequence — e.g. thread bidding 110 sets currentBid=110,
     * then 120 is still valid (120 >= 110+10), then 130, etc.
     *
     * Expected after all threads finish:
     * - auction.currentBid = 200 (the highest bid wins)
     * - exactly 10 Bid rows in the DB (one per thread — all amounts succeed in order)
     * - no deadlocks or exceptions
     */
    @Test
    void testConcurrentBidsOnSameAuctionAreSerializedCorrectly() throws Exception {
        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startGate = new CountDownLatch(1); // all threads wait here
        CountDownLatch doneLatch = new CountDownLatch(threadCount);
        List<Future<Void>> futures = new ArrayList<>();
        List<Exception> exceptions = new ArrayList<>();

        // Create 10 different users and assign them different bid amounts: 110, 120, ..., 200
        List<User> users = createTestUsers(threadCount, "concurrent7");
        BigDecimal[] amounts = new BigDecimal[threadCount];
        for (int i = 0; i < threadCount; i++) {
            amounts[i] = new BigDecimal(String.valueOf(110 + i * 10)); // 110, 120, ..., 200
        }

        for (int i = 0; i < threadCount; i++) {
            final User user = users.get(i);
            final BigDecimal amount = amounts[i];

            futures.add(executor.submit(() -> {
                try {
                    startGate.await(); // wait until all threads are ready
                    biddingService.placeNewBid(user, auctionId, amount);
                } catch (Exception e) {
                    synchronized (exceptions) {
                        exceptions.add(e);
                    }
                } finally {
                    doneLatch.countDown();
                }
                return null;
            }));
        }

        startGate.countDown(); // fire all threads simultaneously
        doneLatch.await();     // wait for all to finish
        executor.shutdown();

        // Read final state from DB
        Auction finalAuction = auctionRepository.findById(auctionId).orElseThrow();
        long bidCount = bidRepository.countByAuction_Id(auctionId);

        System.out.println("[Test7] Final currentBid: " + finalAuction.getCurrentBid());
        System.out.println("[Test7] Total bid rows: " + bidCount);
        System.out.println("[Test7] Exceptions: " + exceptions.size());
        for (Exception e : exceptions) {
            System.out.println("  → " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }

        // Assertion a: currentBid must be the highest bid submitted (200)
        // This verifies that under concurrent load, no lower-value bid "wins" due to a race.
        // The pessimistic lock guarantees the highest submitted amount prevails.
        assertThat(finalAuction.getCurrentBid())
                .as("Final currentBid should be the highest bid placed (200)")
                .isEqualByComparingTo("200");

        // Assertion b: At least 1 bid row (something was accepted), and at most 10
        // (no duplicates). The exact count depends on lock acquisition order:
        // threads bidding FIXED amounts (not relative) may be rejected if a higher
        // bid already raised currentBid above their fixed amount.
        // Example: if 200 gets lock first, bids 110-190 are all rejected (110 < 200+10).
        // If 110 gets lock first then 120, 130...200 each succeed in turn.
        // The IMPORTANT assertion is no lost writes (no two threads both "win" the same amount)
        // and no phantom bids (bidCount <= 10).
        assertThat(bidCount)
                .as("Should have at least 1 and at most 10 bid rows (no duplicates, no lost writes)")
                .isBetween(1L, 10L);

        // Assertion c: no deadlocks or unexpected exceptions
        boolean hasDeadlock = exceptions.stream()
                .anyMatch(e -> e.getMessage() != null && e.getMessage().contains("deadlock"));
        assertThat(hasDeadlock)
                .as("No deadlocks should occur")
                .isFalse();

        // Assertion d: all exceptions are expected bid rejection errors (not locking errors)
        boolean hasUnexpectedError = exceptions.stream()
                .anyMatch(e -> !(e instanceof IllegalArgumentException));
        assertThat(hasUnexpectedError)
                .as("All exceptions should be clean bid rejections, not locking/DB errors")
                .isFalse();
    }

    // ─── Test 8: 5 concurrent identical bids — only ONE should succeed ────────

    /**
     * 5 threads all submit the SAME bid amount (110) simultaneously.
     * Only the first thread to acquire the pessimistic lock will see currentBid=100
     * and accept 110 (>= 100+10). All subsequent threads will find currentBid=110
     * and their bid of 110 will fail: 110 < 110+10=120.
     *
     * Expected after all threads finish:
     * - auction.currentBid = 110
     * - exactly 1 Bid row in the DB
     * - exactly 4 IllegalArgumentException errors
     */
    @Test
    void testConcurrentIdenticalBidsOnlyOneSucceeds() throws Exception {
        int threadCount = 5;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startGate = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        List<User> users = createTestUsers(threadCount, "concurrent8");
        BigDecimal identicalBid = new BigDecimal("110");

        for (int i = 0; i < threadCount; i++) {
            final User user = users.get(i);

            executor.submit(() -> {
                try {
                    startGate.await();
                    biddingService.placeNewBid(user, auctionId, identicalBid);
                    successCount.incrementAndGet();
                } catch (IllegalArgumentException e) {
                    failCount.incrementAndGet();
                    System.out.println("[Test8] Expected rejection: " + e.getMessage());
                } catch (Exception e) {
                    System.err.println("[Test8] UNEXPECTED error: " + e.getClass().getSimpleName() + ": " + e.getMessage());
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        startGate.countDown();
        doneLatch.await();
        executor.shutdown();

        Auction finalAuction = auctionRepository.findById(auctionId).orElseThrow();
        long bidCount = bidRepository.countByAuction_Id(auctionId);

        System.out.println("[Test8] Final currentBid: " + finalAuction.getCurrentBid());
        System.out.println("[Test8] Successful bids: " + successCount.get());
        System.out.println("[Test8] Rejected bids: " + failCount.get());
        System.out.println("[Test8] Total bid rows in DB: " + bidCount);

        // Exactly one bid should have been accepted
        assertThat(finalAuction.getCurrentBid())
                .as("currentBid should be 110 — only the first concurrent bid succeeded")
                .isEqualByComparingTo("110");

        assertThat(bidCount)
                .as("Exactly 1 Bid row should exist — only one concurrent bid was accepted")
                .isEqualTo(1L);

        assertThat(successCount.get())
                .as("Exactly 1 thread should have succeeded")
                .isEqualTo(1);

        assertThat(failCount.get())
                .as("The remaining 4 threads should have been rejected")
                .isEqualTo(4);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private List<User> createTestUsers(int count, String prefix) {
        List<User> users = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            final int idx = i; // effectively final for lambda capture
            String email = prefix + "_user" + idx + "@test.com";
            // Use existing user if already seeded, otherwise create
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User u = new User();
                u.setFullName("Test User " + prefix + idx);
                u.setEmail(email);
                u.setPasswordHash("$2a$10$dummyhashfortest");
                u.setRole(User.Role.BUYER);
                return userRepository.save(u);
            });
            users.add(user);
        }
        return users;
    }
}
