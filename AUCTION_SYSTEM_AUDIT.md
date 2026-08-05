# Live Auction Backend Module Audit

## Spec Verification Table

| Spec Item # | Status | Notes |
|---|---|---|
| 1 | Different | `Auction.java` has `startTime`, `minIncrement`, `highestBidderId`, and a `@ManyToOne` gemstone relationship. However, the `status` enum uses `ENDED` instead of the specified `CLOSED`. |
| 2 | Done | `Gemstone.java` has a unified `status` enum (mapped to `reservation_status` column) with `DRAFT`, `PUBLISHED`, `RESERVED`, `SOLD`. |
| 3 | Done | `Bid.java` is correctly unchanged and contains `auction`, `user`, `amount`, and `timestamp` fields. |
| 4 | Done | `AuctionService.create` validates `startTime` must be in the future (or within 5 seconds of now). |
| 5 | Done | `AuctionService.create` validates `endTime` must be strictly after `startTime`. |
| 6 | Done | `AuctionService.create` validates `startingPrice` > 0 (`signum() > 0` and `@Positive`). |
| 7 | Done | `AuctionService.create` validates `minIncrement` > 0 (`signum() > 0` and `@Positive`). |
| 8 | Done | `AuctionService.create` checks `gem.getStatus() != Gemstone.GemStatus.PUBLISHED` and rejects if not `PUBLISHED`. |
| 9 | Done | `AuctionService.create` sets `gem.setStatus(Gemstone.GemStatus.RESERVED)` on success. |
| 10 | Done | `BiddingService.placeNewBid` uses `auctionRepository.findByIdWithPessimisticLock(auctionId)`. |
| 11 | Done | `BiddingService.placeNewBid` validates `auction.getStatus() == LIVE` and throws `IllegalStateException` otherwise. |
| 12 | Done | `BiddingService.placeNewBid` validates `bidAmount >= currentBid + minIncrement` (falling back to `startingPrice` if no current bid). |
| 13 | Done | Updates `currentBid` and `highestBidderId`. Saves a new `Bid` row with a database-generated timestamp (`insertable = false, updatable = false`). |
| 14 | Done | Calculates `secondsRemaining`; if `< 30`, it extends `endTime` by 30 seconds (`auction.getEndTime().plusSeconds(30)`). |
| 15 | Done | `onBidPlaced` method (using `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)`) broadcasts `BID_PLACED` to `/topic/auctions/{auctionId}` via `SimpMessagingTemplate`. |
| 16 | Done | `onBidPlaced` correctly sends a targeted message to `/queue/outbid` using `convertAndSendToUser`, ensuring it goes only to the previous highest bidder if they are a different user. |
| 17 | Done | `WebSocketConfig.java` has `@EnableWebSocketMessageBroker`, registers `/ws` with SockJS, and configures `/topic`, `/queue`, and `/app` prefixes. |
| 18 | Done | `AuctionWebSocketController.java` exists with `@MessageMapping("/auctions/{auctionId}/bid")`, catches exceptions, and uses `sendError` instead of throwing to prevent crashing the session. |
| 19 | Done | There is NO REST endpoint for placing bids. `AuctionController.java` intentionally omits `POST /api/auctions/{id}/bids` with an explicit comment. |
| 20 | Done | `AuctionSchedulerService.java` exists and uses `@Scheduled(fixedRate = 5_000)` on its sweeping methods. |
| 21 | Done | `activateScheduledAuctions` transitions `SCHEDULED` → `LIVE` when `startTime` is passed, and calls `biddingService.publishAuctionStartedEvent`. |
| 22 | Different | `closeExpiredAuctions` acquires the pessimistic lock and re-checks `endTime` before closing, but it transitions the state to `ENDED` instead of `CLOSED`. |
| 23 | Done | Helper method `closeAuction` sets `gem.setStatus(SOLD)` if there is a winner, or `PUBLISHED` if there are no bids, then publishes the `AUCTION_ENDED` broadcast. |
| 24 | Done | `GET /api/auctions`, `GET /api/auctions/{id}`, `GET /api/auctions/{id}/bids` all exist in `AuctionController` and are public. |
| 25 | Done | `POST /api/auctions` exists and runs validations. Admin requirement is enforced at the SecurityConfig level. |
| 26 | Done | `PUT /api/auctions/{id}` exists and verifies `getStatus() == SCHEDULED`. |
| 27 | Done | `DELETE /api/auctions/{id}` exists, verifies `SCHEDULED`, and reverts the gem's status to `PUBLISHED`. |
| 28 | Done | `POST /api/auctions/{id}/end-early` exists, and reuses the exact same `auctionService.closeAuction(auction)` method used by the scheduler. |
| 29 | Done | `SecurityConfig.java` specifies `requestMatchers(HttpMethod.GET, "/api/auctions/**").permitAll()`. |
| 30 | Done | `SecurityConfig.java` requires `hasRole("ADMIN")` for POST, PUT, and DELETE on `/api/auctions/**`. |
| 31 | Done | `SecurityConfig.java` specifies `.requestMatchers("/ws/**").permitAll()`. |
| 32 | Done | `BiddingServiceTest.java` exists. Methods: `testValidBidIsAccepted`, `testBidBelowMinIncrementIsRejected`, `testBidOnScheduledAuctionIsRejected`, `testBidOnClosedAuctionIsRejected`, `testAntiSnipingExtendsEndTime`, `testAntiSnipingDoesNotTriggerOutsideWindow`, `testOutbidNotificationSentToPreviousBidder`. |
| 33 | Done | `BiddingConcurrencyTest.java` exists. Methods: `testConcurrentBidsOnSameAuctionAreSerializedCorrectly`, `testConcurrentIdenticalBidsOnlyOneSucceeds`. |
| 34 | Done | All tests in both classes contain real assertion logic (`assertThat`, `assertThatThrownBy`, `verify`, etc.). None are empty placeholders. |
| 35 | Done | The concurrency test is a real `@SpringBootTest` integrating with PostgreSQL. It uses an `ExecutorService` with 10 (and 5) threads, synchronized by a `CountDownLatch` (`startGate.await()`) so all threads fire their transactions genuinely simultaneously. |

## Raw Test Output

```
2026-08-02T19:57:36.185+05:30  INFO 10492 --- [gemhaven-backend] [           main] c.g.service.BiddingConcurrencyTest       : The following 1 profile is active: "test"
2026-08-02T19:57:36.914+05:30  INFO 10492 --- [gemhaven-backend] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-08-02T19:57:37.007+05:30  INFO 10492 --- [gemhaven-backend] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 86 ms. Found 7 JPA repository interfaces.
2026-08-02T19:57:37.438+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [name: default]
2026-08-02T19:57:37.483+05:30  INFO 10492 --- [gemhaven-backend] [           main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 6.4.4.Final
2026-08-02T19:57:37.508+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.h.c.internal.RegionFactoryInitiator    : HHH000026: Second-level cache disabled
2026-08-02T19:57:37.785+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.s.o.j.p.SpringPersistenceUnitInfo      : No LoadTimeWeaver setup: ignoring JPA class transformer
2026-08-02T19:57:37.816+05:30  INFO 10492 --- [gemhaven-backend] [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2026-08-02T19:57:38.003+05:30  INFO 10492 --- [gemhaven-backend] [           main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@21733cbe
2026-08-02T19:57:38.005+05:30  INFO 10492 --- [gemhaven-backend] [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2026-08-02T19:57:38.034+05:30  WARN 10492 --- [gemhaven-backend] [           main] org.hibernate.orm.deprecation            : HHH90000025: PostgreSQLDialect does not need to be specified explicitly using 'hibernate.dialect' (remove the property setting and it will be selected by default)
2026-08-02T19:57:42.216+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2026-08-02T19:57:42.613+05:30  INFO 10492 --- [gemhaven-backend] [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-08-02T19:57:44.994+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.s.d.j.r.query.QueryEnhancerFactory     : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-08-02T19:57:48.390+05:30  WARN 10492 --- [gemhaven-backend] [           main] JpaBaseConfiguration$JpaWebConfiguration : spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. Explicitly configure spring.jpa.open-in-view to disable this warning
2026-08-02T19:57:49.867+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with [org.springframework.security.web.session.DisableEncodeUrlFilter@127c5f20, org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@417c9b17, org.springframework.security.web.context.SecurityContextHolderFilter@ebd4486, org.springframework.security.web.header.HeaderWriterFilter@50061d56, org.springframework.web.filter.CorsFilter@17d13926, org.springframework.security.web.authentication.logout.LogoutFilter@770635f8, com.gemhaven.security.JwtAuthFilter@264f18fe, org.springframework.security.web.savedrequest.RequestCacheAwareFilter@7d6f094e, org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@6b886e86, org.springframework.security.web.authentication.AnonymousAuthenticationFilter@511cc6fc, org.springframework.security.web.session.SessionManagementFilter@2a59a8fe, org.springframework.security.web.access.ExceptionTranslationFilter@4398d, org.springframework.security.web.access.intercept.AuthorizationFilter@10387d6d]
WARNING: A restricted method in java.lang.System has been called
WARNING: java.lang.System::load has been called by org.apache.tomcat.jni.Library in an unnamed module (file:/C:/Users/LOQ/.m2/repository/org/apache/tomcat/embed/tomcat-embed-core/10.1.19/tomcat-embed-core-10.1.19.jar)
WARNING: Use --enable-native-access=ALL-UNNAMED to avoid a warning for callers in this module
WARNING: Restricted methods will be blocked in a future release unless native access is enabled

2026-08-02T19:57:51.304+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.s.m.s.b.SimpleBrokerMessageHandler     : Starting...
2026-08-02T19:57:51.305+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.s.m.s.b.SimpleBrokerMessageHandler     : BrokerAvailabilityEvent[available=true, SimpleBrokerMessageHandler [org.springframework.messaging.simp.broker.DefaultSubscriptionRegistry@dc9033f]]
2026-08-02T19:57:51.313+05:30  INFO 10492 --- [gemhaven-backend] [           main] o.s.m.s.b.SimpleBrokerMessageHandler     : Started.
2026-08-02T19:57:51.355+05:30  INFO 10492 --- [gemhaven-backend] [           main] c.g.service.BiddingConcurrencyTest       : Started BiddingConcurrencyTest in 15.397 seconds (process running for 16.287)
[INFO] Gemstones already exist. Skipping seed.
[INFO] Admin user already exists. Skipping admin seed.
Java HotSpot(TM) 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (C:\Users\LOQ\.m2\repository\net\bytebuddy\byte-buddy-agent\1.14.12\byte-buddy-agent-1.14.12.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
[Concurrency Test] Setup: auctionId=5 currentBid=100, minIncrement=10
[Test7] Final currentBid: 200.00
[Test7] Total bid rows: 2
[Test7] Exceptions: 8
  ? IllegalArgumentException: Bid does not meet minimum increment
  ? IllegalArgumentException: Bid does not meet minimum increment
  ? IllegalArgumentException: Bid does not meet minimum increment
  ? IllegalArgumentException: Bid does not meet minimum increment
  ? IllegalArgumentException: Bid does not meet minimum increment
  ? IllegalArgumentException: Bid does not meet minimum increment
  ? IllegalArgumentException: Bid does not meet minimum increment
  ? IllegalArgumentException: Bid does not meet minimum increment
[Concurrency Test] Setup: auctionId=6 currentBid=100, minIncrement=10
[Test8] Expected rejection: Bid does not meet minimum increment
[Test8] Expected rejection: Bid does not meet minimum increment
[Test8] Expected rejection: Bid does not meet minimum increment
[Test8] Expected rejection: Bid does not meet minimum increment
[Test8] Final currentBid: 110.00
[Test8] Successful bids: 1
[Test8] Rejected bids: 4
[Test8] Total bid rows in DB: 1
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 18.07 s -- in com.gemhaven.service.BiddingConcurrencyTest
[INFO] Running com.gemhaven.service.BiddingServiceTest
[Test5] endTime unchanged: 2026-08-02T20:02:54.924117700
[Test4] Extended endTime: 2026-08-02T19:58:34.961114400
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.319 s -- in com.gemhaven.service.BiddingServiceTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  32.746 s
[INFO] Finished at: 2026-08-02T19:57:55+05:30
[INFO] ------------------------------------------------------------------------
```

## Differences from Spec

- **Auction Status Naming:** The spec required the final state of an auction to be labeled `CLOSED` (exact naming). The codebase instead uses `ENDED` for this enum value (`Auction.AuctionStatus.ENDED`). This causes items 1 and 22 in the spec verification to be slightly out of alignment with the actual implementation, although the structural logic performs identically to what was requested (transitioning `LIVE` -> `ENDED` instead of `LIVE` -> `CLOSED`).
