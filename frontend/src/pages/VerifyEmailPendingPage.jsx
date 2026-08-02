import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { resendVerificationEmail } from '../services/authService'
import Navbar from '../components/Navbar'

export default function VerifyEmailPendingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const cardRef = useRef(null)

  const email = location.state?.email || 'your email'
  
  const [isResending, setIsResending] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }
  }, [])

  const handleResend = async () => {
    if (isResending) return
    setIsResending(true)
    setToastMessage('')
    try {
      await resendVerificationEmail(email)
      setToastMessage('Verification email resent successfully.')
    } catch (error) {
      setToastMessage('Failed to resend email. Please try again later.')
    } finally {
      setIsResending(false)
      // Hide toast after 3 seconds
      setTimeout(() => setToastMessage(''), 3000)
    }
  }

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
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '4px', padding: '3rem 2.5rem',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ display: 'block', fontSize: '2rem', color: '#C9A84C', marginBottom: '1rem', opacity: 0.8 }}>✉</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', margin: 0, marginBottom: '1rem' }}>
              Check Your Email
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              We've sent a verification link to <br/>
              <span style={{ color: '#C9A84C', fontWeight: 600 }}>{email}</span>. <br/>
              Please check your inbox and verify your address to continue.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleResend}
              disabled={isResending}
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '2px',
                color: '#C9A84C',
                padding: '0.75rem 2rem',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: isResending ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s',
                opacity: isResending ? 0.7 : 1
              }}
              onMouseEnter={e => { if(!isResending) { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.8)' } }}
              onMouseLeave={e => { if(!isResending) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' } }}
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
            
            <div style={{ minHeight: '1.2rem' }}>
              {toastMessage && (
                <span style={{ fontSize: '0.75rem', color: toastMessage.includes('Failed') ? '#EF4444' : '#10B981' }}>
                  {toastMessage}
                </span>
              )}
            </div>

            <button type="button" onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', marginTop: '1rem' }}>
              ← Back to Login
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
