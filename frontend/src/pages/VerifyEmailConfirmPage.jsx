import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { verifyEmailToken } from '../services/authService'
import Navbar from '../components/Navbar'

export default function VerifyEmailConfirmPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const hasRun = useRef(false)

  useEffect(() => {
    let mounted = true
    
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
    }

    async function verify() {
      try {
        await verifyEmailToken(token)
        if (mounted) {
          setStatus('success')
        }
      } catch (err) {
        if (mounted) {
          setStatus('error')
          setErrorMsg(err.message || 'Verification failed.')
        }
      }
    }
    
    verify()

    return () => { mounted = false }
  }, [token])

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Navbar visible={true} />
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem', position: 'relative' }}>
        
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '50vw', height: '50vw', background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0
        }} />

        <div ref={cardRef} style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '440px',
          background: 'rgba(255,255,255,0.02)',
          border: status === 'success' ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.07)',
          borderRadius: '4px', padding: '3rem 2.5rem',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          transition: 'border-color 0.5s ease'
        }}>
          
          {status === 'verifying' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              <div style={{ position: 'relative', width: 40, height: 40 }}>
                {/* Pulsing dot spinner */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: 12, height: 12, background: '#C9A84C', borderRadius: '50%',
                  animation: 'pulse 1.5s infinite'
                }} />
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: 12, height: 12, border: '1px solid #C9A84C', borderRadius: '50%',
                  animation: 'ripple 1.5s infinite'
                }} />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Verifying your email...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ display: 'block', fontSize: '2.5rem', color: '#10B981', marginBottom: '1rem', textShadow: '0 0 15px rgba(16, 185, 129, 0.4)' }}>✓</span>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', margin: 0, marginBottom: '1rem' }}>
                Email Verified
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Thank you for verifying your email address. Your GemHaven account is now fully active.
              </p>
              <button
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                  border: 'none',
                  borderRadius: '2px',
                  color: '#0A0A0D',
                  padding: '0.85rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
              >
                Continue to GemHaven
              </button>
            </div>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ display: 'block', fontSize: '2.5rem', color: '#EF4444', marginBottom: '1rem', textShadow: '0 0 15px rgba(239, 68, 68, 0.4)' }}>✗</span>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', margin: 0, marginBottom: '1rem' }}>
                Verification Failed
              </h1>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '2rem' }}>
                {errorMsg}
              </p>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '2px',
                  color: '#fff',
                  padding: '0.75rem 2rem',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
              >
                Back to Registration
              </button>
            </div>
          )}

        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
        }
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
