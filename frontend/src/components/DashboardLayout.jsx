 import { useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from '../utils/gsap'

const ADMIN_LINKS = [
  { label: 'Overview', to: '/admin' },
  { label: 'Inventory', to: '/admin/inventory' },
  { label: 'Auctions', to: '/admin/auctions' },
  { label: 'Land Listings', to: '/admin/land' },
  { label: 'Buyers', to: '/admin/buyers' },
  { label: 'Reservations', to: '/admin/reservations' }
];

export default function DashboardLayout({ children }) {
  const location = useLocation()
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [location.pathname])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050508', color: '#fff' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        background: '#030305',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.2rem', color: '#C9A84C', lineHeight: 1 }}>◆</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem',
              letterSpacing: '0.22em',
              color: '#fff',
              fontWeight: 300,
            }}>THENNAKOON GEMS</span>
          </Link>
          <div style={{
            marginTop: '0.75rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.15em', textTransform: 'uppercase'
          }}>
            Admin Portal
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ADMIN_LINKS.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '0.85rem 1.5rem',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  borderLeft: `2px solid ${isActive ? '#C9A84C' : 'transparent'}`,
                  background: isActive ? 'rgba(201,168,76,0.05)' : 'transparent',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 400
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none'
          }}>
            ← Return to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div ref={contentRef} style={{ padding: '2.5rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

    </div>
  )
}
