import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'

export default function Navbar({ visible }) {
  const navRef = useRef(null)
  const scrolled = useRef(false)

  useEffect(() => {
    if (!navRef.current) return
    gsap.to(navRef.current, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : -20,
      duration: 0.6,
      ease: 'power2.out',
      pointerEvents: visible ? 'all' : 'none',
    })
  }, [visible])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    function onScroll() {
      const past = window.scrollY > 60
      if (past !== scrolled.current) {
        scrolled.current = past
        nav.style.background = past
          ? 'rgba(5,5,8,0.85)'
          : 'transparent'
        nav.style.backdropFilter = past ? 'blur(20px)' : 'none'
        nav.style.borderBottom = past
          ? '1px solid rgba(201,168,76,0.15)'
          : '1px solid transparent'
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        opacity: 0,
        transform: 'translateY(-20px)',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        borderBottom: '1px solid transparent',
      }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.25rem', color: '#C9A84C' }}>◆</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem',
            letterSpacing: '0.25em',
            color: '#fff',
            fontWeight: 300,
          }}>GEMHAVEN</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {['Auctions', 'How It Works', 'About'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => e.target.style.color = '#C9A84C'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >
              {label}
            </a>
          ))}
          <button style={{
            padding: '0.5rem 1.25rem',
            border: '1px solid rgba(201,168,76,0.5)',
            borderRadius: '2px',
            background: 'transparent',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(201,168,76,0.1)'
            e.currentTarget.style.borderColor = '#C9A84C'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
          }}
          >
            Log In
          </button>
          <button style={{
            padding: '0.5rem 1.5rem',
            border: 'none',
            borderRadius: '2px',
            background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
            color: '#0A0A0D',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  )
}
