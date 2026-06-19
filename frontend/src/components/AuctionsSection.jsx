import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'

const gems = [
  {
    id: 1,
    name: 'Burmese Ruby',
    carat: 3.2,
    cut: 'Oval',
    color: '#B91C1C',
    colorName: 'Pigeon Blood',
    status: 'LIVE',
    currentBid: 12400,
    endsIn: '2h 14m',
    bids: 24,
  },
  {
    id: 2,
    name: 'Ceylon Sapphire',
    carat: 5.1,
    cut: 'Cushion',
    color: '#1D4ED8',
    colorName: 'Royal Blue',
    status: 'LIVE',
    currentBid: 28900,
    endsIn: '4h 52m',
    bids: 41,
  },
  {
    id: 3,
    name: 'Colombian Emerald',
    carat: 2.8,
    cut: 'Emerald',
    color: '#15803D',
    colorName: 'Vivid Green',
    status: 'UPCOMING',
    currentBid: null,
    endsIn: 'Starts in 1d',
    bids: 0,
  },
  {
    id: 4,
    name: 'Padparadscha Sapphire',
    carat: 1.9,
    cut: 'Oval',
    color: '#EA580C',
    colorName: 'Lotus Pink-Orange',
    status: 'LIVE',
    currentBid: 19800,
    endsIn: '1h 03m',
    bids: 17,
  },
]

function GemCard({ gem, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    // Entrance animation
    gsap.fromTo(
      card,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // 3D hover
    function onMove(e) {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, {
        rotateY: x * 14,
        rotateX: -y * 14,
        translateZ: 20,
        duration: 0.25,
        ease: 'power2.out',
        transformPerspective: 700,
      })
    }

    function onLeave() {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        translateZ: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [index])

  const isLive = gem.status === 'LIVE'

  return (
    <div
      ref={cardRef}
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
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${gem.color}60`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Gem visual */}
      <div style={{
        height: '180px',
        background: `radial-gradient(ellipse at 40% 40%, ${gem.color}30, rgba(5,5,8,0.9))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottom: `1px solid ${gem.color}20`,
      }}>
        {/* Faceted gem shape */}
        <div style={{
          width: 80,
          height: 80,
          background: `linear-gradient(135deg, ${gem.color}CC, ${gem.color}44)`,
          clipPath: 'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)',
          boxShadow: `0 0 40px ${gem.color}60, inset 0 0 20px rgba(255,255,255,0.1)`,
          animation: 'gemFloat 3s ease-in-out infinite',
          animationDelay: `${index * 0.5}s`,
        }} />

        {/* Status badge */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.6rem',
          background: isLive ? 'rgba(185,28,28,0.2)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isLive ? '#B91C1C60' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '2px',
          backdropFilter: 'blur(8px)',
        }}>
          {isLive && (
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#EF4444',
              display: 'inline-block',
              animation: 'pulseDot 1.5s ease-in-out infinite',
            }} />
          )}
          <span style={{
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: isLive ? '#EF4444' : 'rgba(255,255,255,0.5)',
          }}>
            {gem.status}
          </span>
        </div>

        {/* Timer */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.05em',
        }}>
          {gem.endsIn}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: gem.color,
          marginBottom: '0.4rem',
        }}>
          {gem.colorName}
        </div>

        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.25rem',
          fontWeight: 400,
          color: '#fff',
          marginBottom: '0.4rem',
        }}>
          {gem.name}
        </h3>

        <div style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '1rem',
          letterSpacing: '0.05em',
        }}>
          <span>{gem.carat} ct</span>
          <span>·</span>
          <span>{gem.cut} Cut</span>
          {gem.bids > 0 && <><span>·</span><span>{gem.bids} bids</span></>}
        </div>

        {gem.currentBid ? (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Current Bid
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.4rem',
                color: '#fff',
                fontWeight: 600,
              }}>
                ${gem.currentBid.toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: '2.5rem' }} />
        )}

        <button style={{
          width: '100%',
          padding: '0.7rem',
          background: isLive ? `linear-gradient(135deg, ${gem.color}CC, ${gem.color}88)` : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isLive ? gem.color + '60' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '2px',
          color: '#fff',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontWeight: 600,
          transition: 'opacity 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {isLive ? 'Place Bid' : 'View Details'}
        </button>
      </div>
    </div>
  )
}

export default function AuctionsSection() {
  const headingRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
      }
    )
  }, [])

  return (
    <section
      id="auctions"
      style={{
        background: '#07070A',
        padding: '8rem 6vw',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={headingRef} style={{
          opacity: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '0.75rem',
            }}>Live Now</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 300,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}>Featured Auctions</h2>
          </div>
          <button style={{
            padding: '0.6rem 1.5rem',
            background: 'transparent',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '2px',
            color: '#C9A84C',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = '#C9A84C' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
          >
            View All →
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {gems.map((gem, i) => (
            <GemCard key={gem.id} gem={gem} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
