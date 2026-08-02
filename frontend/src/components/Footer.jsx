export default function Footer() {
  return (
    <footer style={{
      background: '#030305',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '3rem 6vw',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.1rem', color: '#C9A84C' }}>◆</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1rem',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.6)',
            fontWeight: 300,
          }}>GEMHAVEN</span>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy', 'Terms', 'Contact', 'Certification'].map(link => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}
            >
              {link}
            </a>
          ))}
        </div>

        <p style={{
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.05em',
        }}>
          © 2026 GemHaven. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
