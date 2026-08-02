# GemHaven API Contract & Schema

This document reconciles the current backend state (`BACKEND_STATUS.md`) with what the frontend (Shop, Live Auction, Land Reservation, Knowledge Hub, Auth, Admin Dashboard) already expects from mock services. It's meant to be handed to the backend implementation agent as the source of truth.

---

## 1. Role Model (correction from current backend)

Current `Role` enum is `BUYER, ADMIN, INVESTOR`. **Change to:**

```java
public enum Role {
    BUYER,
    ADMIN
}
```

- **ADMIN**: single super-user account (seeded directly, not self-registered). Manages all gems, auctions, land listings, bookings, articles.
- **BUYER**: public self-registration. Can browse, bid, buy gems outright, and book land site visits.

Add to `User` entity:
- `emailVerified` (boolean, default false)
- `verificationToken` (String, nullable)

---

## 2. Entity Changes

Confirmed against `PROJECT_STATUS.md` audit (Part 4 gaps) — this section now specifies the exact target field set, not just additions.

### `User` (adjust)
**Decision: drop `username` entirely, use `email` as the unique login field.**
- Remove `username` column/field.
- Add `email` (String, unique, NOT NULL) — this becomes the login identifier.
- Add `fullName` (String, NOT NULL).
- Add `emailVerified` (boolean, default false).
- Add `verificationToken` (String, nullable).
Enum: trim `Role` to `BUYER, ADMIN` (currently `BUYER, ADMIN, INVESTOR`).

### `Gemstone` (significant gap — frontend needs 8 fields that don't exist yet)
Target field set, matching `mockGems.js` exactly:
- `name` (String) — missing, add
- `type` (String) — missing, add (e.g. "Sapphire", "Ruby")
- `caratWeight` (BigDecimal) — rename from `carat`
- `cut` (String) — exists
- `color` (String) — exists, this is the hex code
- `colorName` (String) — missing, add (e.g. "Royal Blue")
- `clarity` (String) — missing, add
- `origin` (String) — missing, add
- `certNumber` (String) — missing, add
- `certAuthority` (String) — missing, add
- `certificationPdfUrl` (String) — exists, keep
- `price` (BigDecimal) — missing, add — needed for direct Shop purchase separate from auction bidding
- `description` (String) — missing, add
- `imageUrl` (String) — missing, add (frontend mock uses a single image, not an array — confirm if a multi-image gallery is wanted later)
- `reservationStatus` enum — rename values to `DRAFT, PUBLISHED, SOLD` (currently `AVAILABLE, RESERVED, SOLD`, doesn't match Admin inventory table's Draft/Published/Sold states)
- `owner` (User FK) — exists, keep, nullable since Admin adds gems directly

### `Auction` (add fields)
- `minIncrement` (BigDecimal) — Live Auction UI requires this for bid validation
- `status` (enum: `SCHEDULED, LIVE, ENDED`) — currently inferred from `endTime` only; explicit status simplifies queries and Admin table display
- Keep `@OneToOne` on `Gemstone` — confirms one-time auction per gem, matches current schema, no change needed unless re-auctioning is wanted later

### `MiningPlot` (significant gap — frontend needs a much richer shape than the `geologicalData` JSONB alone provides)
Target field set, matching `mockLandPlots.js` exactly:
- `name` (String) — exists, maps to frontend's `locationName`, rename for clarity or alias in DTO
- `region` (String) — missing, add
- `sizePerch` (BigDecimal) — missing, add
- `sizeAcres` (BigDecimal) — missing, add
- `yieldPotential` (String label, e.g. "High") vs existing `yieldEstimate` (BigDecimal) — frontend expects a String label, not a number. Recommend keeping both: `yieldEstimate` (precise numeric value) plus `yieldPotential` (String display label)
- `status` (enum) — missing, add (`AVAILABLE, RESERVED, UNDER_SURVEY`)
- `images` (List<String>) — missing, add — land plots need a gallery, unlike single-image gems
- `surveyDate` (LocalDate) — missing, add
- `soilComposition` (String) — missing, add — currently would need to live inside `geologicalData` JSONB; recommend promoting to its own column since frontend treats it as a discrete spec row
- `historicalYieldData` (String) — missing, add, same reasoning
- `description` (String) — missing, add
- `coordinates` (String) — missing, add
- `geologicalData` (JSONB) — keep as a catch-all for any additional/variable survey data not covered by the discrete columns above
- `owner` (User FK) — exists, keep

### New: `Booking` entity
**Decision: use the fuller field set from the original Land Reservation booking form, not just the Admin table summary shape.**
```java
@Entity
public class Booking {
    Long id;
    String name;
    String email;
    String phone;
    LocalDate date; // frontend field name is "date"
    Integer numVisitors;
    String message; // optional notes/special requests
    @ManyToOne @JoinColumn(name = "land_plot_id") MiningPlot landPlot;
    BookingStatus status; // PENDING, CONFIRMED, COMPLETED
    LocalDateTime createdAt;
}
```
`phone`, `numVisitors`, and `message` are collected by the actual booking form on the Land Detail page but weren't visible in the Admin table's mock data shape (which only needs a subset for display). The Admin bookings table can continue showing just `name, email, date, landPlot, status` while the full record is available on click-through/detail view.

### New: `Article` entity
Frontend has `mockArticles.js`, backend has nothing. Fields to match: `id`, `slug`, `title`, `category`, `excerpt`, `coverImage` (frontend field name, not `coverImageUrl`), `author`, `publishedDate`, `readTime` (frontend stores this as a String like "5 min read", not an Integer), `featured` (Boolean), `content` (JSONB array of objects with `type`, `value`, `url`, `caption` — matches frontend's nested content block shape exactly).

### New: Buyer stats — needs a DTO, not entity fields
Frontend's `mockBuyers.js` expects `bidsPlaced` and `purchases` as aggregate counts. These should NOT be columns on `User` — they're computed via `COUNT` queries on `Bid` and purchase records. Build a `BuyerSummaryDTO` in the service layer that aggregates this at query time for the `/admin/buyers` endpoint, rather than storing denormalized counts.

### ID Type Note
Frontend mock data currently uses string IDs (`'1'`, `'l-1'`). This is very likely just an artifact of mock data authoring, not a real constraint — JSON serializes `Long` as a number and JavaScript handles numeric IDs fine. Recommend keeping backend IDs as `Long`, no backend change needed — just flag this to whoever wires up the real `fetch` calls so it isn't assumed to require a String ID column on the backend.

### New entities needed

**Booking** (site visit reservations — currently has nowhere to land):
```java
@Entity
public class Booking {
    Long id;
    @ManyToOne MiningPlot landPlot;
    @ManyToOne(optional = true) User user; // nullable if guest booking allowed
    String fullName;
    String email;
    String phone;
    LocalDate preferredVisitDate;
    Integer numVisitors;
    String message;
    BookingStatus status; // PENDING, CONFIRMED, COMPLETED
    LocalDateTime createdAt;
}
```

**Article** (Knowledge Hub — nothing exists for this yet):
```java
@Entity
public class Article {
    Long id;
    String slug;
    String title;
    String category; // "Gem History", "Buying Guide", "Certification & Grading", "Mining & Origin"
    String excerpt;
    String coverImageUrl;
    String author;
    LocalDate publishedDate;
    Integer readTimeMinutes;
    Boolean featured;
    String contentBlocks; // JSONB array: [{type: 'paragraph'|'heading'|'quote'|'image', ...}]
    LocalDateTime createdAt;
}
```

---

## 3. REST Endpoints

Base path: `/api`

### Auth (`/api/auth`) — public
| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | `{fullName, email, password}` | `{userId, email, verificationSent: true}` | Buyer-only registration |
| POST | `/auth/login` | `{email, password}` | `{token, user: {id, fullName, email, role}}` | JWT recommended given no session infra yet |
| POST | `/auth/resend-verification` | `{email}` | `{sent: true}` | |
| GET | `/auth/verify-email/{token}` | — | `{verified: true, email}` | |
| GET | `/auth/me` | — (auth header) | `{id, fullName, email, role, emailVerified}` | For "My Account" page |

### Gems / Shop (`/api/gems`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/gems` | public | query params: `type, minPrice, maxPrice, clarity, sort, status=PUBLISHED` (buyers only see published) |
| GET | `/gems/{id}` | public | full detail |
| POST | `/gems` | ADMIN | create |
| PUT | `/gems/{id}` | ADMIN | update |
| DELETE | `/gems/{id}` | ADMIN | delete |
| POST | `/gems/{id}/publish` | ADMIN | DRAFT → PUBLISHED |
| POST | `/gems/{id}/purchase` | BUYER | direct buy, sets status SOLD |

### Auctions (`/api/auctions`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/auctions` | public | list with status filter |
| GET | `/auctions/{id}` | public | includes gem detail + bid history |
| POST | `/auctions` | ADMIN | create, references existing gem |
| PUT | `/auctions/{id}` | ADMIN | edit before it goes live |
| DELETE | `/auctions/{id}` | ADMIN | |
| POST | `/auctions/{id}/end-early` | ADMIN | force status → ENDED |
| POST | `/auctions/{id}/bids` | BUYER | body `{amount}` — routes to existing `BiddingService.placeNewBid` |
| GET | `/auctions/{id}/bids` | public | bid history feed |

### Land (`/api/land`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/land` | public | filters: region, size range, yield, status |
| GET | `/land/{id}` | public | full detail incl. geological data |
| POST | `/land` | ADMIN | create |
| PUT | `/land/{id}` | ADMIN | update |
| DELETE | `/land/{id}` | ADMIN | delete |
| POST | `/land/{id}/bookings` | public or BUYER | site visit booking form submit |
| GET | `/land/bookings` | ADMIN | all booking requests, filterable by status |
| PUT | `/land/bookings/{id}/status` | ADMIN | confirm/complete a booking |

### Knowledge Hub (`/api/articles`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/articles` | public | filter by category, featured |
| GET | `/articles/{slug}` | public | full detail incl. content blocks |
| POST | `/articles` | ADMIN | create |
| PUT | `/articles/{id}` | ADMIN | update |
| DELETE | `/articles/{id}` | ADMIN | delete |

### Admin — Buyers (`/api/admin/buyers`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/admin/buyers` | ADMIN | list with bid/purchase counts |
| GET | `/admin/buyers/{id}` | ADMIN | detail: bid history, purchases |
| PUT | `/admin/buyers/{id}/status` | ADMIN | suspend/reactivate |

### Admin — Dashboard stats (`/api/admin/stats`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/admin/stats/overview` | ADMIN | totals: gems, active auctions, buyers, revenue this month |
| GET | `/admin/activity` | ADMIN | recent activity feed (sales, registrations, bookings, auctions ending soon) |

---

## 4. WebSocket / STOMP Contract (Live Auction)

Config needed: `@EnableWebSocketMessageBroker`, endpoint `/ws` (SockJS fallback recommended for broader compatibility).

**Client subscribes to:**
`/topic/auctions/{auctionId}` — receives:
```json
{
  "type": "BID_PLACED",
  "auctionId": 12,
  "currentBid": 45000,
  "bidder": "Bidder ****42",
  "timestamp": "2026-07-09T14:32:00Z"
}
```
```json
{ "type": "AUCTION_ENDED", "auctionId": 12, "winningBid": 52000, "winner": "Bidder ****17" }
```

**Client sends to:**
`/app/auctions/{auctionId}/bid` — body `{amount}` → server validates via `BiddingService.placeNewBid`, then broadcasts `BID_PLACED` to the topic, and optionally sends a targeted `/user/queue/outbid` message to the previous highest bidder for the "You've been outbid" toast.

This maps directly to the frontend's `useMockAuctionSocket(auctionId)` hook interface (`currentBid, bidHistory, timeRemaining, placeBid(amount), connectionStatus`) — swap the mock internals for a STOMP client (e.g. `@stomp/stompjs` + `sockjs-client`) pointed at these destinations.

---

## 5. Security Notes

- Add `spring-boot-starter-security` and `spring-boot-starter-validation` (both currently missing).
- JWT recommended over session auth since frontend is a separate SPA — avoids CORS/cookie complications.
- Password encoding: BCrypt via `PasswordEncoder` bean.
- Secure endpoint rules: everything under `/api/admin/**` and all POST/PUT/DELETE on `/gems`, `/auctions`, `/land`, `/articles` → `ADMIN` only. Bid placement and bookings → `BUYER` (authenticated). GET endpoints on gems/auctions/land/articles → public.
- CORS: allow the Vite dev origin (`http://localhost:5173` or whatever port is configured) and the eventual production frontend domain.

---

## 6. What's Not Addressed Here

- Image upload handling (frontend currently uses placeholder URLs — decide on S3/Cloudinary/local storage before wiring `imageUrls` fields for real)
- Payment gateway integration for direct gem purchases (proposal mentions this as a requirement but no implementation details discussed yet)
- Actual email sending for verification (currently mocked on frontend — needs a mail provider like SendGrid/SMTP config)
