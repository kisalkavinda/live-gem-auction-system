import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from '../utils/gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MOCK_AUCTIONS } from '../hooks/useAuctionSocket';
import { getAuctionStatus } from '../utils/auctionStatus';

const LKR = (n) => 'LKR ' + n.toLocaleString('en-LK');

function formatTime(diffInSeconds) {
  if (diffInSeconds <= 0) return '00:00:00';
  const h = Math.floor(diffInSeconds / 3600);
  const m = Math.floor((diffInSeconds % 3600) / 60);
  const s = diffInSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function LiveBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.3rem 0.6rem', background: 'rgba(185,28,28,0.2)',
      border: '1px solid #B91C1C60', borderRadius: '2px', backdropFilter: 'blur(8px)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulseDot 1.5s ease-in-out infinite' }} />
      <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#EF4444', fontWeight: 600 }}>LIVE</span>
    </div>
  );
}

function UpcomingBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.3rem 0.6rem', background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px', backdropFilter: 'blur(8px)',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
      <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>UPCOMING</span>
    </div>
  );
}

function AuctionCard({ auction, index }) {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        delay: (index % 6) * 0.08,
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
      }
    );

    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotateY: x * 12, rotateX: -y * 12, translateZ: 16, duration: 0.25, ease: 'power2.out', transformPerspective: 700 });
    }
    function onLeave() {
      gsap.to(card, { rotateY: 0, rotateX: 0, translateZ: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); };
  }, [index]);

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const end = new Date(auction.endsAt || auction.endTime || auction.end || 0).getTime();
      setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [auction.endsAt, auction.endTime, auction.end]);

  const displayStatus = getAuctionStatus(auction);
  const isUrgent = displayStatus === 'LIVE' && timeLeft < 60 && timeLeft > 0;

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/auctions/${auction.id}`)}
      style={{
        opacity: 0,
        position: 'relative',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.3s',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${auction.color}60`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Gem visual */}
      <div style={{
        height: 180,
        background: `radial-gradient(ellipse at 38% 38%, ${auction.color}35, rgba(5,5,8,0.92))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        borderBottom: `1px solid ${auction.color}20`,
      }}>
        {auction.imageUrl ? (
          <img
            src={auction.imageUrl}
            alt={auction.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0, left: 0,
            }}
          />
        ) : (
          <div style={{
            width: 76, height: 76,
            background: `linear-gradient(135deg, ${auction.color}CC, ${auction.color}44)`,
            clipPath: 'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)',
            boxShadow: `0 0 36px ${auction.color}55, inset 0 0 18px rgba(255,255,255,0.1)`,
            animation: 'gemFloat 3s ease-in-out infinite',
            animationDelay: `${index * 0.4}s`,
          }} />
        )}

        {/* Badges */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
          {displayStatus === 'LIVE' ? <LiveBadge /> : <UpcomingBadge />}
        </div>
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          padding: '0.25rem 0.45rem',
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '2px',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: '#C9A84C' }}>
            {auction.certAuthority}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: auction.color, marginBottom: '0.35rem' }}>
          {auction.colorName}
        </div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.25rem', fontWeight: 400, color: '#fff',
          marginBottom: '1rem', lineHeight: 1.25,
        }}>
          {auction.name}
        </h3>
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                {displayStatus === 'LIVE' ? 'Current Bid' : 'Starting Bid'}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#fff', fontWeight: 600 }}>
                {LKR(auction.startingBid)} {/* Mock displays starting bid as base for list */}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.55rem', color: isUrgent ? '#EF4444' : 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                {displayStatus === 'LIVE' ? 'Ends In' : 'Starts In'}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: isUrgent ? '#EF4444' : '#fff', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {timeLeft > 0 ? formatTime(timeLeft) : 'Ended'}
              </div>
            </div>
          </div>

              <button
            onClick={e => { e.stopPropagation(); navigate(`/auctions/${auction.id}`); }}
            style={{
              width: '100%', padding: '0.75rem',
              background: auction.status === 'LIVE' ? `linear-gradient(135deg, ${auction.color}CC, ${auction.color}77)` : 'transparent',
              border: `1px solid ${auction.status === 'LIVE' ? `${auction.color}55` : 'rgba(255,255,255,0.15)'}`,
              borderRadius: '2px', color: '#fff',
              fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', fontWeight: 700, transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              if (auction.status === 'LIVE') {
                e.currentTarget.style.opacity = '0.75';
              } else {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }
            }}
            onMouseLeave={e => {
              if (auction.status === 'LIVE') {
                e.currentTarget.style.opacity = '1';
              } else {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
              >
            {displayStatus === 'LIVE' ? 'Enter Auction Room' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuctionListPage() {
  const headingRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
      <Navbar visible={true} />

      {/* Page header */}
      <section style={{ background: '#050508', padding: '10rem 6vw 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50vw', height: '50vw',
          background: 'radial-gradient(ellipse, rgba(185,28,28,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div ref={headingRef} style={{ maxWidth: '1200px', margin: '0 auto', opacity: 0 }}>
          <span style={{
            display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#EF4444', marginBottom: '0.75rem',
            fontWeight: 600
          }}>
            ◆ Live Bidding
          </span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300, color: '#fff', letterSpacing: '-0.02em',
            marginBottom: '0.75rem', lineHeight: 1.1,
          }}>
            Exclusive Auctions
          </h1>
          <p style={{
            fontSize: 'clamp(0.78rem, 1.2vw, 0.9rem)',
            color: 'rgba(255,255,255,0.38)', maxWidth: 480,
            lineHeight: 1.72, fontWeight: 300,
          }}>
            Compete for the world's most magnificent and rarest gems in real time. 
            All stones are independently certified and conflict-free.
          </p>
        </div>
      </section>

      {/* Catalog grid */}
      <section style={{ background: '#07070A', padding: '4rem 6vw 8rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {MOCK_AUCTIONS.map((auction, i) => (
              <AuctionCard key={auction.id} auction={auction} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
