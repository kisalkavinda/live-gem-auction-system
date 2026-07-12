import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from '../utils/gsap'

const NAV_LINKS = [
  { label: 'Auctions', path: '/#auctions' },
  { label: 'Shop', path: '/shop' },
  { label: 'Education', path: '/#education' },
  { label: 'About', path: '/#about' }
]

// ─────────────────────────────────────────────────────────────────────────────
// MagneticItem — gives nested navbar elements an elite magnetic cursor-pull effect
// ─────────────────────────────────────────────────────────────────────────────
function MagneticItem({ children, range = 38, strength = 12 }) {
  const itemRef = useRef(null)

  useEffect(() => {
    const el = itemRef.current
    if (!el) return

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      // Calculate center coordinates of the element
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      // Vector from element center to cursor
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < range) {
        // Pull strength decreases as distance from item increases
        const pull = (1 - distance / range) * strength
        gsap.to(el, {
          x: (dx / distance) * pull,
          y: (dy / distance) * pull,
          duration: 0.35,
          ease: 'power2.out',
        })
      } else {
        // Outside range, spring back smoothly
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.75,
        ease: 'elastic.out(1.1, 0.48)',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [range, strength])

  return (
    <div ref={itemRef} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </div>
  )
}

export default function Navbar({ visible }) {
  const navRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : -24,
      duration: 0.7,
      ease: 'power3.out',
      pointerEvents: visible ? 'auto' : 'none',
    })
  }, [visible])

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        opacity: 0,
        translateY: '-24px',
        width: 'min(900px, calc(100vw - 48px))',
      }}
    >
      {/* 1. Glowing perimeter spinner border container */}
      <div style={{
        position: 'absolute',
        inset: '-1px',
        borderRadius: '100px',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <div 
          className="gh-nav-glow-spinner"
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: 'conic-gradient(from 0deg, transparent, #C9A84C 15%, transparent 35%, transparent 65%, #C9A84C 80%, transparent)',
            animation: 'navGlowRotate 7s linear infinite',
          }}
        />
        {/* Dark core body mask (creates 1px outline border) */}
        <div style={{
          position: 'absolute',
          inset: '1.5px',
          borderRadius: '100px',
          background: 'rgba(8,7,12,0.7)',
          zIndex: 1,
        }} />
      </div>

      {/* 2. Glassmorphic main body capsule */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.5rem',
        borderRadius: '100px',
        background: 'rgba(8,7,12,0.48)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        zIndex: 2,
      }}>
        
        {/* Logo */}
        <MagneticItem range={45} strength={8}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, textDecoration: 'none', padding: '4px' }}>
            <span style={{ fontSize: '1.1rem', color: '#C9A84C', lineHeight: 1 }}>◆</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.02rem',
              letterSpacing: '0.22em',
              color: '#fff',
              fontWeight: 300,
            }}>GEMHAVEN</span>
          </Link>
        </MagneticItem>

        {/* Nav Links Grid */}
        <div style={{ display: 'flex', gap: '2.2rem', alignItems: 'center' }}>
          {NAV_LINKS.map((item) => (
            <MagneticItem key={item.label} range={35} strength={10}>
              <Link
                to={item.path}
                style={{
                  display: 'inline-block',
                  color: 'rgba(232,224,208,0.65)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'color 0.25s ease',
                  padding: '6px 4px',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(232,224,208,0.65)'}
              >
                {item.label}
              </Link>
            </MagneticItem>
          ))}
        </div>

        {/* Actions Button Panel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <MagneticItem range={38} strength={11}>
            <button
              style={{
                padding: '0.45rem 1.15rem',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.01)',
                color: 'rgba(232,224,208,0.8)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.08)'
                e.currentTarget.style.borderColor = '#C9A84C'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.01)'
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
                e.currentTarget.style.color = 'rgba(232,224,208,0.8)'
              }}
            >
              Log In
            </button>
          </MagneticItem>

          <MagneticItem range={38} strength={12}>
            <button
              style={{
                padding: '0.45rem 1.35rem',
                border: 'none',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                color: '#0A0A0D',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'opacity 0.25s, transform 0.25s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Register
            </button>
          </MagneticItem>
        </div>
      </div>

      <style>{`
        @keyframes navGlowRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </nav>
  )
}
