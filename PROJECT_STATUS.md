=== PART 1: DATABASE ===

1. **Database engine and version, connection config:**
   - **Engine:** PostgreSQL (implied by `org.hibernate.dialect.PostgreSQLDialect` and JDBC URL).
   - **Connection Config:** Host is `localhost:5432`, Database name is `gemhaven_db`. (No credentials noted).

2. **Full list of tables currently in the schema:**
   - **`users`**
     - `id`: BIGSERIAL (Primary Key)
     - `username`: VARCHAR(100) (UNIQUE, NOT NULL)
     - `password_hash`: VARCHAR(255) (NOT NULL)
     - `role`: VARCHAR(50) (NOT NULL)
     - `profile_info`: JSONB (Nullable)
     - `created_at`: TIMESTAMP (DEFAULT CURRENT_TIMESTAMP)
   - **`gemstones`**
     - `id`: BIGSERIAL (Primary Key)
     - `carat`: DECIMAL(10,3) (NOT NULL)
     - `cut`: VARCHAR(50) (NOT NULL)
     - `color`: VARCHAR(50) (NOT NULL)
     - `certification_pdf_url`: VARCHAR(255) (Nullable)
     - `reservation_status`: VARCHAR(50) (DEFAULT 'AVAILABLE')
     - `owner_id`: BIGINT (Nullable)
     - `created_at`: TIMESTAMP (DEFAULT CURRENT_TIMESTAMP)
   - **`auctions`**
     - `id`: BIGSERIAL (Primary Key)
     - `gemstone_id`: BIGINT (UNIQUE, NOT NULL)
     - `starting_price`: DECIMAL(15,2) (NOT NULL)
     - `current_bid`: DECIMAL(15,2) (Nullable)
     - `end_time`: TIMESTAMP (NOT NULL)
     - `created_at`: TIMESTAMP (DEFAULT CURRENT_TIMESTAMP)
   - **`bids`**
     - `id`: BIGSERIAL (Primary Key)
     - `auction_id`: BIGINT (NOT NULL)
     - `user_id`: BIGINT (NOT NULL)
     - `amount`: DECIMAL(15,2) (NOT NULL)
     - `timestamp`: TIMESTAMP (DEFAULT CURRENT_TIMESTAMP)
   - **`mining_plots`**
     - `id`: BIGSERIAL (Primary Key)
     - `name`: VARCHAR(100) (NOT NULL)
     - `geological_data`: JSONB (NOT NULL)
     - `yield_estimate`: DECIMAL(10,2) (Nullable)
     - `owner_id`: BIGINT (Nullable)
     - `created_at`: TIMESTAMP (DEFAULT CURRENT_TIMESTAMP)

3. **Foreign key relationships:**
   - `gemstones.owner_id` -> `users.id`
   - `auctions.gemstone_id` -> `gemstones.id`
   - `bids.auction_id` -> `auctions.id`
   - `bids.user_id` -> `users.id`
   - `mining_plots.owner_id` -> `users.id`

4. **Enums/check constraints:**
   - No explicitly defined enums or check constraints at the DB level (roles and statuses are stored as `VARCHAR(50)`).

5. **ddl-auto and schema source of truth:**
   - `spring.jpa.hibernate.ddl-auto` is set to `validate`.
   - `schema.sql` is the actual source of truth. Spring Boot is configured to execute it on startup (`spring.sql.init.mode=always`, `spring.sql.init.platform=postgres`).

6. **Seed/sample data:**
   - None. There is no `data.sql` or similar file to load data into the database.

7. **Unused tables/columns:**
   - None. Every table and column defined in `schema.sql` is actively mapped in a backend `@Entity` class.

=== PART 2: BACKEND (Spring Boot) ===

1. **Project setup:**
   - **Build tool:** Maven
   - **Java version:** 17
   - **Spring Boot version:** 3.2.4
   - **Dependencies:** `spring-boot-starter-data-jpa`, `spring-boot-starter-web`, `spring-boot-starter-websocket`, `postgresql`, `spring-boot-starter-test`.

2. **Package structure:**
   ```
   src/main/java/com/gemhaven
   ├── GemhavenBackendApplication.java
   ├── model/
   │   ├── Auction.java
   │   ├── Bid.java
   │   ├── Gemstone.java
   │   ├── MiningPlot.java
   │   └── User.java
   ├── repository/
   │   ├── AuctionRepository.java
   │   ├── BidRepository.java
   │   └── GemstoneRepository.java
   └── service/
       └── BiddingService.java
   ```

3. **@Entity classes:**
   - **`User`**: Fields: `id` (Long), `username` (String), `passwordHash` (String), `role` (Role Enum), `profileInfo` (String mapped as JSONB via `@JdbcTypeCode(SqlTypes.JSON)`), `createdAt` (LocalDateTime). Annotations: `@Entity`, `@Table(name = "users")`, `@Id`, `@GeneratedValue`, `@Column`, `@Enumerated(EnumType.STRING)`. Enums used: `Role` (BUYER, ADMIN, INVESTOR).
   - **`Gemstone`**: Fields: `id` (Long), `carat` (BigDecimal), `cut` (String), `color` (String), `certificationPdfUrl` (String), `reservationStatus` (ReservationStatus Enum), `owner` (User), `createdAt` (LocalDateTime). Annotations: `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@Enumerated(EnumType.STRING)`, `@ManyToOne`, `@JoinColumn`. Enums used: `ReservationStatus` (AVAILABLE, RESERVED, SOLD).
   - **`Auction`**: Fields: `id` (Long), `gemstone` (Gemstone), `startingPrice` (BigDecimal), `currentBid` (BigDecimal), `endTime` (LocalDateTime), `createdAt` (LocalDateTime). Annotations: `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@OneToOne`, `@JoinColumn`, `@Column`.
   - **`Bid`**: Fields: `id` (Long), `auction` (Auction), `user` (User), `amount` (BigDecimal), `timestamp` (LocalDateTime). Annotations: `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@JoinColumn`, `@Column`.
   - **`MiningPlot`**: Fields: `id` (Long), `name` (String), `geologicalData` (String mapped as JSONB via `@JdbcTypeCode(SqlTypes.JSON)`), `yieldEstimate` (BigDecimal), `owner` (User), `createdAt` (LocalDateTime). Annotations: `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@ManyToOne`, `@JoinColumn`.

4. **Repository interfaces:**
   - **`AuctionRepository`** (tied to `Auction`): Custom method `Optional<Auction> findByIdWithPessimisticLock(@Param("id") Long id)` with `@Lock(LockModeType.PESSIMISTIC_WRITE)` and `@Query`.
   - **`BidRepository`** (tied to `Bid`): No custom query methods.
   - **`GemstoneRepository`** (tied to `Gemstone`): Custom method `Optional<Gemstone> findByIdWithPessimisticLock(@Param("id") Long id)` with `@Lock(LockModeType.PESSIMISTIC_WRITE)` and `@Query`.

5. **Service classes:**
   - **`BiddingService`**:
     - `placeNewBid(User user, Long auctionId, BigDecimal bidAmount)`: Returns `Bid`. Validates auction exists and is active, validates bid amount is strictly greater than current top bid/starting price, creates new `Bid`, updates `Auction`'s current max bid, and persists both.

6. **Controllers:**
   - **None exist.** The project currently completely lacks a controller layer (no REST API endpoints are exposed).

7. **DTOs:**
   - **None exist.**

8. **Security:**
   - `spring-boot-starter-security` is **not present**. There is no `SecurityConfig`, filter chain, JWT handling, or password encoder bean.

9. **WebSocket:**
   - `spring-boot-starter-websocket` is in dependencies, but `@EnableWebSocketMessageBroker` is **not configured** and there are no STOMP endpoints or `@MessageMapping` methods implemented.

10. **CORS:**
    - **None exists.**

11. **Validation:**
    - `spring-boot-starter-validation` is **not present**. No `@Valid` or Bean Validation annotations are in use.

12. **Exception handling:**
    - **None exists.** No `@ControllerAdvice` or `@ExceptionHandler` is configured. Errors trigger default Spring Boot unhandled responses.

13. **Application properties:**
    - `spring.application.name`
    - `spring.datasource.url`
    - `spring.datasource.username`
    - `spring.datasource.password`
    - `spring.jpa.properties.hibernate.dialect`
    - `spring.jpa.show-sql`
    - `spring.jpa.format-sql`
    - `spring.jpa.hibernate.ddl-auto`
    - `spring.sql.init.mode`
    - `spring.sql.init.platform`

14. **Build check:**
    - The project **compiles successfully** (`mvnw clean compile` runs with no errors).

=== PART 3: FRONTEND (React + Vite) ===

1. **Project setup:**
   - **Dependencies:** React 19.2.4, React Router DOM 7.18.1, Vite 8.0.1, GSAP 3.15.0, Lenis 1.3.23, Tailwind CSS 4.2.2.
   - **Vite config:** Standard config with React plugin.

2. **Folder structure (under src/):**
   ```
   src
   ├── assets/
   ├── components/
   ├── context/
   ├── data/
   ├── hooks/
   ├── pages/
   │   ├── admin/
   │   └── seller/
   ├── services/
   └── utils/
   ```

3. **Pages/Routes currently implemented:**
   - `/` (`src/App.jsx`): Renders `<LandingPage>`, composed of Preloader, Navbar, TunnelScrollHero, GemHistory, FeaturesSection, AuctionsSection, HowItWorks, CTABand, Footer.
   - `/shop` (`src/pages/ShopPage.jsx`): Renders a gem listings grid with filtering.
   - `/shop/:id` (`src/pages/GemDetailPage.jsx`): Renders details of a single gem (images, specs, certs).
   - `/auctions` (`src/pages/AuctionListPage.jsx`): Renders active auctions.
   - `/auctions/:id` (`src/pages/AuctionRoomPage.jsx`): Renders a live auction room (bidding UI).
   - `/land` (`src/pages/LandListingPage.jsx`): Renders mining plot listings.
   - `/land/:id` (`src/pages/LandDetailPage.jsx`): Renders plot details and a site visit booking form.
   - `/knowledge-hub` (`src/pages/KnowledgeHubPage.jsx`): Renders an articles/guides grid.
   - `/knowledge-hub/:slug` (`src/pages/ArticleDetailPage.jsx`): Renders a single article's contents.
   - `/register` (`src/pages/RegisterPage.jsx`): Renders user registration form.
   - `/login` (`src/pages/LoginPage.jsx`): Renders user login form.
   - `/verify-email` (`src/pages/VerifyEmailPendingPage.jsx`): Renders a "Check your email" screen.
   - `/verify-email/:token` (`src/pages/VerifyEmailConfirmPage.jsx`): Renders a verification spinner with success/failure state.
   - `/account` (`src/pages/MyAccountPage.jsx`): Renders a basic user account info/dashboard screen.
   - `/admin` (`src/pages/admin/AdminOverviewPage.jsx`): Renders admin high-level metrics.
   - `/admin/inventory` (`src/pages/admin/AdminInventoryPage.jsx`): Renders gem inventory management.
   - `/admin/auctions` (`src/pages/admin/AdminAuctionsPage.jsx`): Renders admin controls for auctions.
   - `/admin/land` (`src/pages/admin/AdminLandPage.jsx`): Renders admin controls for land plots.
   - `/admin/buyers` (`src/pages/admin/AdminBuyersPage.jsx`): Renders a registered buyers list.

4. **Mock service files:**
   - **`authService.js`**:
     - `registerUser(formData)`: Simulates delay, rejects if email is 'test@example.com', resolves mock user object.
     - `loginUser(credentials)`: Simulates delay, resolves mock token `'mock-jwt-token-xyz'` if matched to 'test@example.com'/'password123', otherwise throws error.
     - `resendVerificationEmail(email)`: Simulates delay, resolves success boolean.
     - `verifyEmailToken(token)`: Simulates delay, throws error if token is 'invalid-token', resolves success boolean.
   - **`adminService.js`**:
     - `addGem(gemData)`: Simulates delay, resolves generated mock ID.
     - `updateGem(id, gemData)`: Simulates delay, resolves success.
     - `deleteGem(id)`: Simulates delay, resolves success.
     - `createAuction(auctionData)`: Simulates delay, resolves generated mock ID.
     - `endAuctionEarly(id)`: Simulates delay, resolves success.
     - `deleteAuction(id)`: Simulates delay, resolves success.
     - `addLandListing(landData)`: Simulates delay, resolves generated mock ID.
     - `deleteLandListing(id)`: Simulates delay, resolves success.
     - `updateBuyerStatus(buyerId, status)`: Simulates delay, resolves success.
     - `updateBookingStatus(bookingId, status)`: Simulates delay, resolves success.

5. **Mock data files:**
   - **`mockGems.js`**: Contains `MOCK_GEMS` array. Exact shape: `id` (String), `name` (String), `type` (String), `caratWeight` (Number), `certNumber` (String), `certAuthority` (String), `price` (Number), `clarity` (String), `cut` (String), `origin` (String), `color` (String hex code), `colorName` (String), `description` (String), `imageUrl` (String).
   - **`mockLandPlots.js`**: Contains `MOCK_LAND_PLOTS` array. Exact shape: `id` (String), `locationName` (String), `region` (String), `sizePerch` (Number), `sizeAcres` (Number), `yieldPotential` (String), `status` (String), `images` (Array of Strings), `surveyDate` (String), `soilComposition` (String), `historicalYieldData` (String), `description` (String), `coordinates` (String).
   - **`mockArticles.js`**: Contains `MOCK_ARTICLES` array. Exact shape: `id` (String), `slug` (String), `title` (String), `category` (String), `excerpt` (String), `coverImage` (String), `author` (String), `publishedDate` (String), `readTime` (String), `featured` (Boolean), `content` (Array of nested objects with `type`, `value`, `url`, `caption`).
   - **`mockBookings.js`**: Contains `mockBookings` array. Exact shape: `id` (String), `name` (String), `email` (String), `date` (String), `landPlotId` (String), `status` (String).
   - **`mockBuyers.js`**: Contains `mockBuyers` array. Exact shape: `id` (String), `name` (String), `email` (String), `joinDate` (String), `bidsPlaced` (Number), `purchases` (Number), `status` (String).

6. **Shared/reusable components:**
   - **`Navbar`**: Props: `visible`
   - **`Preloader`**: Props: `onComplete`
   - **`Footer`, `TunnelScrollHero`, `GemHistory`, `FeaturesSection`, `AuctionsSection`, `HowItWorks`, `CTABand`**: Props: none.

7. **State management approach:**
   - Plain React state (`useState`) and context (`useContext`). `DashboardContext` wraps the application routing. No Redux, Zustand, etc., is present.

8. **Hardcoded/placeholder values:**
   - API endpoints are mocked via JavaScript `setTimeout` promises in services rather than actual network requests to an API base URL.
   - JWT tokens are hardcoded to `"mock-jwt-token-xyz"`.
   - Asset URLs heavily rely on static hardcoded paths (e.g., `'/images/gems/ruby.png'`).

9. **Incomplete pages/components:**
   - The entire frontend relies on mock data and functions; there are no actual API calls implemented.

10. **Build check:**
    - The project **builds successfully**. `npm run build` succeeds (output warns of some chunks exceeding 500kB, but there are no fatal errors).

=== PART 4: GAPS / MISMATCHES ===

**Critical Mismatches Between Frontend Expected Shape and Backend Entity Structure:**

1. **ID Types:**
   - **Frontend:** Expects string IDs for entities (e.g., `'1'`, `'l-1'`, `'a-1'`).
   - **Backend:** Models define `id` as `Long` (generates numerical IDs).

2. **Gemstone Entity Mismatches:**
   - **Frontend expects:** `name`, `type`, `caratWeight`, `certNumber`, `certAuthority`, `price`, `clarity`, `cut`, `origin`, `color`, `colorName`, `description`, `imageUrl`.
   - **Backend has:** `carat` (differs from `caratWeight`), `cut`, `color`, `certificationPdfUrl`, `reservationStatus`, `owner_id`.
   - **Missing Backend Fields:** The backend entirely lacks properties for `name`, `type`, `certNumber`, `certAuthority`, `price`, `clarity`, `origin`, `colorName`, `description`, and `imageUrl`.

3. **MiningPlot / Land Plot Mismatches:**
   - **Frontend expects:** `locationName`, `region`, `sizePerch`, `sizeAcres`, `yieldPotential`, `status`, `images`, `surveyDate`, `soilComposition`, `historicalYieldData`, `description`, `coordinates`.
   - **Backend has:** `name`, `geologicalData` (JSONB), `yieldEstimate`. 
   - **Structural mismatch:** The backend must rely heavily on stuffing all these rich frontend attributes into the unstructured `geologicalData` JSONB field, as there are no discrete mapped columns for region, coordinates, images, status, etc.

4. **Missing Backend Models (Stubbed entirely on Frontend):**
   - **Articles:** The frontend expects Knowledge Hub data (`mockArticles.js`), but there is no `Article` model/table in the backend.
   - **Bookings:** The frontend expects Site Visit Bookings (`mockBookings.js`), but there is no `Booking` model/table in the backend.

5. **User / Buyer Metrics:**
   - **Frontend expects:** Aggregated stats like `bidsPlaced`, `purchases`, and `status`.
   - **Backend has:** Only `username`, `passwordHash`, `role`, and `profileInfo`. Aggregations would need custom DTOs which are completely absent.

6. **Auctions:**
   - The backend supports `startingPrice`, `currentBid`, and `endTime`.
   - The frontend's `adminService` submits raw auction objects directly, but there is no explicitly defined standard frontend mock schema that aligns field-for-field with the backend.

*(End of audit)*
