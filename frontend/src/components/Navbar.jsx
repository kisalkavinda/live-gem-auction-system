import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'

export default function Navbar({ visible }) {
  const navRef = useRef(null)

  useEffect(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : -24,
      duration: 0.7,
      ease: 'power3.out',
      pointerEvents: visible ? 'all' : 'none',
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.7rem 1.5rem',
        borderRadius: '100px',
        background: 'rgba(8,7,12,0.55)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: '1px solid rgba(201,168,76,0.18)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontSize: '1.1rem', color: '#C9A84C', lineHeight: 1 }}>◆</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1rem',
            letterSpacing: '0.22em',
            color: '#fff',
            fontWeight: 300,
          }}>GEMHAVEN</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['Auctions', 'How It Works', 'About'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                color: 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.25s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.target.style.color = '#C9A84C' }}
              onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.65)' }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
          <button
            style={{
              padding: '0.45rem 1.1rem',
              border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: '100px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
              e.currentTarget.style.borderColor = '#C9A84C'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
            }}
          >
            Log In
          </button>
          <button
            style={{
              padding: '0.45rem 1.25rem',
              border: 'none',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
              color: '#0A0A0D',
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
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
        </div>
      </div>
    </nav>
  )
}
