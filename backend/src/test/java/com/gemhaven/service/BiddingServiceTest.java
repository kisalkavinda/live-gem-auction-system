package com.gemhaven.service;

import com.gemhaven.model.Auction;
import com.gemhaven.model.Bid;
import com.gemhaven.model.Gemstone;
import com.gemhaven.model.User;
import com.gemhaven.repository.AuctionRepository;
import com.gemhaven.repository.BidRepository;
import com.gemhaven.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for BiddingService.
 * Uses Mockito — no Spring context loaded, no real DB.
 */
@ExtendWith(MockitoExtension.class)
class BiddingServiceTest {

    @Mock private BidRepository bidRepository;
    @Mock private AuctionRepository auctionRepository;
    @Mock private UserRepository userRepository;
    @Mock private SimpMessageSendingOperations messagingTemplate;
    @Mock private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private BiddingService biddingService;

    private Auction auction;
    private User bidderA;
    private User bidderB;

    @BeforeEach
    void setUp() {
        // Build a reusable LIVE auction with currentBid=100, minIncrement=10
        Gemstone gem = new Gemstone();
        gem.setStatus(Gemstone.GemStatus.RESERVED);

        auction = new Auction();
        auction.setId(1L);
        auction.setGemstone(gem);
        auction.setStartingPrice(new BigDecimal("90"));
        auction.setCurrentBid(new BigDecimal("100"));
        auction.setMinIncrement(new BigDecimal("10"));
        auction.setStartTime(LocalDateTime.now().minusHours(1));
        auction.setEndTime(LocalDateTime.now().plusMinutes(5));
        auction.setStatus(Auction.AuctionStatus.LIVE);
        auction.setHighestBidderId(null);

        bidderA = new User();
        bidderA.setId(10L);
        bidderA.setEmail("userA@test.com");
        bidderA.setRole(User.Role.BUYER);

        bidderB = new User();
        bidderB.setId(20L);
        bidderB.setEmail("userB@test.com");
        bidderB.setRole(User.Role.BUYER);

        // Lenient stubs: some tests throw early before reaching save() calls.
        // Without lenient(), Mockito strict mode flags these as UnnecessaryStubbingException.
        lenient().when(bidRepository.save(any(Bid.class))).thenAnswer(inv -> inv.getArgument(0));
        lenient().when(auctionRepository.save(any(Auction.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    // ─── Test 1: Valid bid is accepted ───────────────────────────────────────

    @Test
    void testValidBidIsAccepted() {
        // currentBid=100, minIncrement=10 → minimum required = 110
        when(auctionRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(auction));

        Bid result = biddingService.placeNewBid(bidderA, 1L, new BigDecimal("110"));

        assertThat(result).isNotNull();
        assertThat(auction.getCurrentBid()).isEqualByComparingTo("110");
        assertThat(auction.getHighestBidderId()).isEqualTo(bidderA.getId());
        verify(bidRepository).save(any(Bid.class));
        verify(auctionRepository).save(auction);
    }

    // ─── Test 2: Bid below min increment is rejected ─────────────────────────

    @Test
    void testBidBelowMinIncrementIsRejected() {
        // currentBid=100, minIncrement=10 → need >=110, submitting 105
        when(auctionRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(auction));

        assertThatThrownBy(() -> biddingService.placeNewBid(bidderA, 1L, new BigDecimal("105")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("minimum increment");

        // currentBid must be unchanged
        assertThat(auction.getCurrentBid()).isEqualByComparingTo("100");
        // No Bid row should be saved
        verify(bidRepository, never()).save(any());
    }

    // ─── Test 3: Bid on non-LIVE auction is rejected ──────────────────────────

    @Test
    void testBidOnScheduledAuctionIsRejected() {
        auction.setStatus(Auction.AuctionStatus.SCHEDULED);
        when(auctionRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(auction));

        assertThatThrownBy(() -> biddingService.placeNewBid(bidderA, 1L, new BigDecimal("110")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not live");

        verify(bidRepository, never()).save(any());
    }

    @Test
    void testBidOnClosedAuctionIsRejected() {
        auction.setStatus(Auction.AuctionStatus.ENDED);
        when(auctionRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(auction));

        assertThatThrownBy(() -> biddingService.placeNewBid(bidderA, 1L, new BigDecimal("110")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not live");

        verify(bidRepository, never()).save(any());
    }

    // ─── Test 4: Anti-sniping extends endTime when < 30s remaining ───────────

    @Test
    void testAntiSnipingExtendsEndTime() {
        // endTime = NOW + 10 seconds → triggers anti-sniping
        LocalDateTime tenSecondsFromNow = LocalDateTime.now().plusSeconds(10);
        auction.setEndTime(tenSecondsFromNow);
        when(auctionRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(auction));

        biddingService.placeNewBid(bidderA, 1L, new BigDecimal("110"));

        // endTime should now be approximately NOW + 30 seconds (extended from original 10s)
        LocalDateTime expected = tenSecondsFromNow.plusSeconds(30);
        assertThat(auction.getEndTime()).isAfterOrEqualTo(LocalDateTime.now().plusSeconds(25));
        assertThat(auction.getEndTime()).isBeforeOrEqualTo(expected.plusSeconds(2));
        System.out.println("[Test4] Extended endTime: " + auction.getEndTime());
    }

    // ─── Test 5: Anti-sniping does NOT trigger when plenty of time remains ────

    @Test
    void testAntiSnipingDoesNotTriggerOutsideWindow() {
        // endTime = NOW + 5 minutes → well outside 30-second window
        LocalDateTime fiveMinutesFromNow = LocalDateTime.now().plusMinutes(5);
        auction.setEndTime(fiveMinutesFromNow);
        when(auctionRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(auction));

        biddingService.placeNewBid(bidderA, 1L, new BigDecimal("110"));

        // endTime must be unchanged
        assertThat(auction.getEndTime()).isEqualTo(fiveMinutesFromNow);
        System.out.println("[Test5] endTime unchanged: " + auction.getEndTime());
    }

    // ─── Test 6: Outbid notification sent to previous bidder only ────────────

    @Test
    void testOutbidNotificationSentToPreviousBidder() {
        // userA is the current highest bidder
        auction.setHighestBidderId(bidderA.getId());
        when(auctionRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(auction));

        // userB places a higher valid bid
        biddingService.placeNewBid(bidderB, 1L, new BigDecimal("110"));

        // Simulate the @TransactionalEventListener firing (in unit test, we trigger it manually)
        ArgumentCaptor<Object> eventCaptor = ArgumentCaptor.forClass(Object.class);
        verify(eventPublisher).publishEvent(eventCaptor.capture());

        Object publishedEvent = eventCaptor.getValue();
        assertThat(publishedEvent).isInstanceOf(BiddingService.BidPlacedEvent.class);

        BiddingService.BidPlacedEvent bidEvent = (BiddingService.BidPlacedEvent) publishedEvent;
        assertThat(bidEvent.previousHighestBidderId()).isEqualTo(bidderA.getId());
        assertThat(bidEvent.newBidderId()).isEqualTo(bidderB.getId());

        // Simulate the after-commit listener: look up userA and send outbid
        when(userRepository.findById(bidderA.getId())).thenReturn(Optional.of(bidderA));
        biddingService.onBidPlaced(bidEvent);

        // Verify outbid message sent to userA (by email/username), NOT to userB
        verify(messagingTemplate).convertAndSendToUser(
                eq(bidderA.getEmail()),
                eq("/queue/outbid"),
                any()
        );
        verify(messagingTemplate, never()).convertAndSendToUser(
                eq(bidderB.getEmail()),
                eq("/queue/outbid"),
                any()
        );
    }
}
