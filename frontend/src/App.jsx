import './App.css'

const mockGems = [
  {
    id: 1,
    name: 'Burmese Ruby',
    carat: 3.2,
    cut: 'Oval',
    color: '#B91C1C',
    status: 'LIVE',
    currentBid: 12400,
    endsIn: '2h 14m',
  },
  {
    id: 2,
    name: 'Ceylon Sapphire',
    carat: 5.1,
    cut: 'Cushion',
    color: '#1D4ED8',
    status: 'LIVE',
    currentBid: 28900,
    endsIn: '4h 52m',
  },
  {
    id: 3,
    name: 'Colombian Emerald',
    carat: 2.8,
    cut: 'Emerald',
    color: '#15803D',
    status: 'UPCOMING',
    currentBid: null,
    endsIn: 'Starts in 1d',
  },
]

function GemCard({ gem }) {
  return (
    <div className="gem-card">
      <div className="gem-card-stone" style={{ '--gem-color': gem.color }}>
        <div className="gem-mini" />
      </div>
      <div className="gem-card-body">
        <div className="gem-card-header">
          <span className={`status-badge ${gem.status === 'LIVE' ? 'live' : 'upcoming'}`}>
            {gem.status === 'LIVE' && <span className="pulse-dot" />}
            {gem.status}
          </span>
          <span className="gem-card-timer">{gem.endsIn}</span>
        </div>
        <h3 className="gem-card-name">{gem.name}</h3>
        <div className="gem-card-specs">
          <span>{gem.carat} ct</span>
          <span>{gem.cut} Cut</span>
        </div>
        {gem.currentBid && (
          <div className="gem-card-bid">
            <span className="bid-label">Current Bid</span>
            <span className="bid-amount">${gem.currentBid.toLocaleString()}</span>
          </div>
        )}
        <button className="gem-card-btn">
          {gem.status === 'LIVE' ? 'Place Bid' : 'View Details'}
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="app">

      {/* ── Navbar ── */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="logo-gem">◆</span>
            <span className="logo-text">GEMHAVEN</span>
          </div>
          <div className="nav-links">
            <a href="#auctions" className="nav-link">Auctions</a>
            <a href="#how" className="nav-link">How It Works</a>
            <button className="btn-ghost">Log In</button>
            <button className="btn-primary">Register</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <span className="hero-eyebrow">Certified · Live · Rare</span>
            <h1 className="hero-title">
              Bid on<br />
              <span className="hero-title-accent">Exceptional</span><br />
              Gemstones
            </h1>
            <p className="hero-sub">
              Real-time auctions on conflict-free certified stones.
              Full geological data. No reserve surprises.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary btn-lg">Browse Live Auctions</button>
              <button className="btn-outline btn-lg">How It Works</button>
            </div>
            <div className="hero-trust">
              <span>GIA Certified</span>
              <span className="trust-dot">·</span>
              <span>Escrow Protected</span>
              <span className="trust-dot">·</span>
              <span>Real-time Bidding</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="gem-scene">
              <div className="gem-glow" />
              <div className="gem-shape">
                <div className="gem-table" />
              </div>
              <div className="gem-reflection" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat">
            <span className="stat-num">1,240+</span>
            <span className="stat-label">Gems Auctioned</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">$4.2M</span>
            <span className="stat-label">Total Volume</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">380+</span>
            <span className="stat-label">Verified Buyers</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">100%</span>
            <span className="stat-label">GIA Certified</span>
          </div>
        </div>
      </div>

      {/* ── Featured Auctions ── */}
      <section id="auctions" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Live Now</span>
            <h2 className="section-title">Featured Auctions</h2>
          </div>
          <div className="gem-grid">
            {mockGems.map(gem => <GemCard key={gem.id} gem={gem} />)}
          </div>
          <div className="section-footer">
            <button className="btn-outline">View All Auctions →</button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="section section-dark">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Process</span>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-num">01</div>
              <h3 className="step-title">Register &amp; Verify</h3>
              <p className="step-desc">
                Create an account. Our team verifies your identity before you bid —
                protecting every transaction on the platform.
              </p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h3 className="step-title">Browse Certified Gems</h3>
              <p className="step-desc">
                Every stone comes with GIA certification, geological origin data,
                carat weight, and high-resolution imaging.
              </p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h3 className="step-title">Bid in Real Time</h3>
              <p className="step-desc">
                Live auctions with instant updates. Win, pay securely via escrow,
                and receive your gem fully insured.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="cta-band">
        <div className="cta-inner">
          <h2 className="cta-title">Your next rare stone is live right now.</h2>
          <button className="btn-primary btn-lg">Start Bidding</button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="nav-logo">
            <span className="logo-gem">◆</span>
            <span className="logo-text">GEMHAVEN</span>
          </div>
          <p className="footer-copy">© 2026 GemHaven. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

export default App
