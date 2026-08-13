import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from '../utils/gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuctionSocket } from '../hooks/useAuctionSocket'
import { getAuctionStatus, parseDatePossible } from '../utils/auctionStatus'
import { useAlert } from '../context/AlertContext'
import { isLoggedIn } from '../services/authService'

const LKR = (n) => 'LKR ' + n?.toLocaleString('en-LK');

function formatTime(diffInSeconds) {
  if (diffInSeconds <= 0) return '00:00:00';
  const h = Math.floor(diffInSeconds / 3600);
  const m = Math.floor((diffInSeconds % 3600) / 60);
  const s = diffInSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const SPEC_ROWS = [
  { key: 'caratWeight', label: 'Carat Weight', fmt: v => `${v} ct` },
  { key: 'cut', label: 'Cut' },
  { key: 'clarity', label: 'Clarity' },
  { key: 'origin', label: 'Origin' },
  { key: 'colorName', label: 'Colour Grade' },
  { key: 'certAuthority', label: 'Certification' },
  { key: 'certNumber', label: 'Certificate No.' },
];

export default function AuctionRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    auction,
    currentBid,
    bidHistory,
    timeRemaining,
    connectionStatus,
    winner,
    placeBid
  } = useAuctionSocket(id);

  const { showAlert } = useAlert()

  const goToLogin = () => {
    showAlert({
      type: 'login',
      title: 'Login required',
      message: 'Please log in to place a bid.',
      actions: [
        {
          label: 'Login',
          primary: true,
          onClick: () => navigate('/login', {
            state: {
              from: location.pathname,
            },
          }),
        },
        {
          label: 'Cancel',
        },
      ],
    })
  }

  const [bidAmountStr, setBidAmountStr] = useState('');
  const [toast, setToast] = useState(null);

  const heroRef = useRef(null);
  const gemVisualRef = useRef(null);
  const infoRef = useRef(null);
  
  // Keep track of history length to detect outbid
  const prevHistoryLength = useRef(0);
  const userBidAmount = useRef(0);

  useEffect(() => {
    if (!auction || !heroRef.current) return;
    
    // Initial entry animations
    const tl = gsap.timeline({ delay: 0.1 });
    tl.from(gemVisualRef.current,
      { opacity: 0, scale: 0.85, duration: 0.9, ease: 'power3.out' }
    );
    tl.from(infoRef.current?.querySelectorAll('.detail-row') ?? [],
      { opacity: 0, x: 24, stagger: 0.07, duration: 0.5, ease: 'power3.out' },
      '-=0.5'
    );
  }, [auction]);

  // Outbid detection logic
  useEffect(() => {
    if (bidHistory.length > prevHistoryLength.current && prevHistoryLength.current > 0) {
      const latestBid = bidHistory[0];
      
      // If a new bid came in and we previously placed a bid, but we are no longer highest
      if (userBidAmount.current > 0 && !latestBid.isUser && !latestBid.isSystem && latestBid.amount > userBidAmount.current) {
        showToast("You've been outbid!");
        userBidAmount.current = 0; // Reset so we don't spam
      }
    }
    prevHistoryLength.current = bidHistory.length;
  }, [bidHistory]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const handleBidChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setBidAmountStr(val);
  };

  const submitBid = (e) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      goToLogin();
      return;
    }

    const amount = parseInt(bidAmountStr, 10);
    if (isNaN(amount)) return;

    const result = placeBid(amount);
    if (!result.success) {
      showToast(result.message);
    } else {
      userBidAmount.current = amount;
      setBidAmountStr('');
    }
  };

  if (connectionStatus === 'CONNECTING') return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
      <Navbar visible={true} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <div style={{
          width: 36, height: 36,
          border: '2px solid rgba(201,168,76,0.12)',
          borderTop: '2px solid #C9A84C',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }} />
      </div>
      <Footer />
    </div>
  );

  if (!auction) return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
      <Navbar visible={true} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: '1.5rem' }}>
        <div style={{ fontSize: '3rem', opacity: 0.12 }}>◆</div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>
          Auction not found
        </p>
        <button
          onClick={() => navigate('/auctions')}
          style={{
            padding: '0.65rem 1.75rem', background: 'transparent',
            border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px',
            color: '#C9A84C', fontSize: '0.65rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = '#C9A84C' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
        >
          ← Return to Live Auctions
        </button>
      </div>
      <Footer />
    </div>
  );

  const minNextBid = currentBid + auction.minIncrement;
  const status = getAuctionStatus(auction);
  const isUpcoming = status === 'UPCOMING';
  const isLive = status === 'LIVE';
  const isFinished = status === 'ENDED' || Boolean(winner);
  const isUrgent = isLive && timeRemaining < 30 && timeRemaining > 0;

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isWinner = isFinished && currentUser && auction.highestBidderId === currentUser.id;

  // Compute a countdown target depending on status: if upcoming, count to start; if live, count to end
  const startDate = parseDatePossible(auction.startTime || auction.startsAt || auction.start);
  const upcomingSeconds = startDate ? Math.max(0, Math.floor((new Date(startDate).getTime() - Date.now()) / 1000)) : 0;

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff', position: 'relative' }}>
      <Navbar visible={true} />

      {/* Outbid Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '5.5rem', right: '1.5rem', zIndex: 100,
          background: 'rgba(10,10,13,0.95)',
          border: '1px solid #C9A84C',
          borderRadius: '4px',
          padding: '1rem 1.5rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '1rem',
          animation: 'slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        }}>
          <span style={{ color: '#C9A84C', fontSize: '1.25rem' }}>⚠</span>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.05em', color: '#fff' }}>{toast}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ padding: '8rem 6vw 0', maxWidth: '1200px', margin: '0 auto' }}>
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2.5rem' }}>
          {[
            { label: 'Home', onClick: () => navigate('/') },
            { label: '/', onClick: null },
            { label: 'Live Auctions', onClick: () => navigate('/auctions') },
            { label: '/', onClick: null },
            { label: auction.name, onClick: null },
          ].map((item, i) => (
            <span
              key={i}
              onClick={item.onClick || undefined}
              style={{
                fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: item.onClick ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.6)',
                cursor: item.onClick ? 'pointer' : 'default',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { if (item.onClick) e.currentTarget.style.color = '#C9A84C' }}
              onMouseLeave={e => { if (item.onClick) e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
            >
              {item.label}
            </span>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <section ref={heroRef} style={{ padding: '0 6vw 8rem' }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
          gap: '4rem', alignItems: 'start',
        }}>

          {/* LEFT — Visual & Specs */}
          <div ref={gemVisualRef}>
            {/* Main gem display */}
            <div style={{
              background: `radial-gradient(ellipse at 38% 35%, ${auction.color}30, rgba(5,5,8,0.95))`,
              border: `1px solid ${auction.color}25`,
              borderRadius: '4px',
              aspectRatio: '1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at 40% 40%, ${auction.color}15 0%, transparent 65%)`,
                pointerEvents: 'none',
              }} />

              {auction.imageUrl ? (
                <img
                  src={auction.imageUrl}
                  alt={auction.name}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    zIndex: 1,
                  }}
                />
              ) : (
                <div style={{
                  position: 'relative', zIndex: 1,
                  width: 200, height: 200,
                  background: `linear-gradient(135deg, ${auction.color}DD, ${auction.color}55)`,
                  clipPath: 'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)',
                  boxShadow: `0 0 80px ${auction.color}55, 0 0 160px ${auction.color}22, inset 0 0 40px rgba(255,255,255,0.12)`,
                  animation: 'gemFloat 4s ease-in-out infinite',
                }} />
              )}

              {/* Badges */}
              <div style={{
                position: 'absolute', top: '1rem', right: '1rem',
                padding: '0.35rem 0.7rem',
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.22)',
                borderRadius: '2px', backdropFilter: 'blur(12px)',
              }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.15em', color: '#C9A84C' }}>
                  {auction.certAuthority} Certified
                </span>
              </div>
              <div style={{
                position: 'absolute', top: '1rem', left: '1rem',
                padding: '0.35rem 0.7rem',
                background: `${auction.color}18`,
                border: `1px solid ${auction.color}40`,
                borderRadius: '2px', backdropFilter: 'blur(12px)',
              }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.15em', color: auction.color }}>
                  {auction.type}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                color: auction.color, marginBottom: '0.5rem'
              }}>
                {auction.colorName}
              </div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 300, color: '#fff',
                letterSpacing: '-0.02em', lineHeight: 1.15,
                marginBottom: '1rem',
              }}>
                {auction.name}
              </h1>
              <p style={{
                fontSize: 'clamp(0.78rem, 1.1vw, 0.88rem)',
                color: 'rgba(255,255,255,0.42)',
                lineHeight: 1.78, fontWeight: 300,
              }}>
                {auction.description}
              </p>
            </div>

            {/* Specs table */}
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
                Specifications
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {SPEC_ROWS.map(({ key, label, fmt }) => (
                  <div key={key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.65rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em' }}>
                      {fmt ? fmt(auction[key]) : auction[key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Live Bidding Panel */}
          <div ref={infoRef} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '4px',
            padding: '2rem',
            position: 'sticky',
            top: '8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {/* Header: Status and Timer */}
            <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.3rem 0.6rem', background: isFinished ? 'rgba(201,168,76,0.1)' : (isUpcoming ? 'rgba(255,255,255,0.05)' : 'rgba(185,28,28,0.2)'),
                  border: `1px solid ${isFinished ? 'rgba(201,168,76,0.3)' : (isUpcoming ? 'rgba(255,255,255,0.15)' : '#B91C1C60')}`, 
                  borderRadius: '2px', backdropFilter: 'blur(8px)',
                  display: 'inline-flex', marginBottom: '0.5rem'
                }}>
                  {!isFinished && isLive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulseDot 1.5s ease-in-out infinite' }} />}
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: isFinished ? '#C9A84C' : (isUpcoming ? 'rgba(255,255,255,0.6)' : '#EF4444') }}>
                    {isFinished ? 'Auction Ended' : (isUpcoming ? 'Upcoming' : 'Live Bidding')}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.2rem' }}>
                  {isFinished ? 'Final Status' : 'Time Remaining'}
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: isFinished ? '#C9A84C' : (isUrgent ? '#EF4444' : '#fff'),
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1
                }}>
                  {isUpcoming ? formatTime(upcomingSeconds) : formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            {/* Current Bid Display */}
            <div className="detail-row" style={{ padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                {isFinished ? 'Winning Bid' : 'Current Highest Bid'}
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                color: '#C9A84C',
                fontWeight: 300,
                lineHeight: 1
              }}>
                {LKR(currentBid)}
              </div>
            </div>

            {/* Input / Winner state */}
            <div className="detail-row">
              {isFinished ? (
                isWinner ? (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.02))',
                    border: '1px solid rgba(201,168,76,0.4)',
                    borderRadius: '4px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#C9A84C', fontWeight: 300, marginBottom: '0.5rem' }}>
                      You won this auction!
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                      Congratulations! We will contact you shortly with next steps.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '4px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#fff', fontWeight: 300, marginBottom: '0.5rem' }}>
                      Auction Ended
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                      This auction has been concluded.
                      {winner?.bidder && winner.bidder !== 'None' && (
                        <>
                          <br />
                          <span style={{ color: '#C9A84C' }}>Winner: {winner.bidder}</span>
                        </>
                      )}
                    </p>
                  </div>
                )
              ) : isUpcoming ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '4px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#fff', fontWeight: 300, marginBottom: '0.5rem' }}>
                    This auction has not started yet.
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                    Bidding will be available when the auction goes live.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitBid} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder={LKR(minNextBid)}
                        value={bidAmountStr}
                        onChange={handleBidChange}
                        style={{
                          flex: 1,
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '2px',
                          padding: '1rem',
                          color: '#fff',
                          fontSize: '1rem',
                          fontFamily: "'Inter', sans-serif",
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = '#C9A84C'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                      />
                      <button
                        type="submit"
                        disabled={!isLive || parseInt(bidAmountStr, 10) < minNextBid || !bidAmountStr}
                        style={{
                          background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                          color: '#0A0A0D', border: 'none', borderRadius: '2px',
                          padding: '0 2rem',
                          fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                          fontWeight: 700, cursor: 'pointer',
                          transition: 'opacity 0.25s',
                          opacity: (!isLive || parseInt(bidAmountStr, 10) < minNextBid || !bidAmountStr) ? 0.5 : 1,
                        }}
                      >
                        Place Bid
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {[auction.minIncrement, auction.minIncrement * 2, auction.minIncrement * 5].map(inc => (
                        <button
                          key={inc}
                          type="button"
                          onClick={() => {
                            const base = parseInt(bidAmountStr, 10) || currentBid;
                            setBidAmountStr(String(base + inc));
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '2px',
                            padding: '0.4rem 0.8rem',
                            color: '#fff',
                            fontSize: '0.65rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
                        >
                          + {LKR(inc).replace('LKR ', '')}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setBidAmountStr(String(minNextBid))}
                        style={{
                          background: 'rgba(201,168,76,0.1)',
                          border: '1px solid rgba(201,168,76,0.3)',
                          borderRadius: '2px',
                          padding: '0.4rem 0.8rem',
                          color: '#C9A84C',
                          fontSize: '0.65rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          marginLeft: 'auto'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.2)'; e.currentTarget.style.borderColor = '#C9A84C' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
                      >
                        Min Bid
                      </button>
                    </div>

                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.75rem', letterSpacing: '0.05em' }}>
                      Minimum next bid: <span style={{ color: '#C9A84C' }}>{LKR(minNextBid)}</span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* History Feed */}
            <div className="detail-row" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
                Live Bid History
              </div>
              <div style={{
                flex: 1, overflowY: 'auto', maxHeight: '240px',
                paddingRight: '0.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
              }}>
                {bidHistory.map((entry, idx) => (
                  <div key={entry.id + idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    opacity: idx === 0 ? 1 : Math.max(0.3, 1 - (idx * 0.15)),
                    animation: idx === 0 ? 'slideDown 0.3s ease-out' : 'none'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: entry.isUser ? '#C9A84C' : (entry.isSystem ? 'rgba(255,255,255,0.4)' : '#fff'),
                        marginBottom: '0.2rem'
                      }}>
                        {entry.bidder} {entry.isUser && '(You)'}
                      </div>
                      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '1.1rem',
                      color: entry.isSystem ? 'rgba(255,255,255,0.4)' : '#fff'
                    }}>
                      {entry.message} {LKR(entry.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes gemFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(4deg); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 960px) {
          section > div[style] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
