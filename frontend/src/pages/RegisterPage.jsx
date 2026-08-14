import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { registerUser, isLoggedIn } from '../services/authService'
import Navbar from '../components/Navbar'

// Helpers
function getPasswordStrength(password) {
  if (!password) return { text: '', color: 'transparent' }
  if (password.length < 6) return { text: 'Weak', color: '#EF4444' }
  if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) return { text: 'Strong', color: '#10B981' }
  return { text: 'Medium', color: '#F59E0B' }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/account', { replace: true })
      return
    }

    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setServerError('')
    
    // Validation
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required.'
    if (!formData.email.trim()) newErrors.email = 'Email is required.'
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address.'
    
    if (!formData.password) newErrors.password = 'Password is required.'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.'
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await registerUser({ ...formData, role: 'buyer' })
      
      // Dispatch event so Navbar/AuthContext can update
      window.dispatchEvent(new Event('gemhaven-auth-updated'))
      
      // On success, redirect to home (or account)
      navigate('/')
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const passStrength = getPasswordStrength(formData.password)

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
          borderRadius: '4px', padding: '2.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem' }}>
              Create Your Account
            </span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
              Join THENNAKOON GEMS
            </h1>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {serverError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '0.75rem', fontSize: '0.8rem', borderRadius: '2px', textAlign: 'center' }}>
                {serverError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px', padding: '0.75rem', color: '#fff', fontSize: '0.9rem',
                  transition: 'border-color 0.3s', outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              {errors.name && <div style={{ color: '#EF4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.name}</div>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px', padding: '0.75rem', color: '#fff', fontSize: '0.9rem',
                  transition: 'border-color 0.3s', outline: 'none'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              {errors.email && <div style={{ color: '#EF4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.email}</div>}
            </div>



            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                <span>Password</span>
                <span style={{ color: passStrength.color, textTransform: 'none', letterSpacing: 'normal' }}>{passStrength.text}</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2px', padding: '0.75rem 3rem 0.75rem 0.75rem', color: '#fff', fontSize: '0.9rem',
                    transition: 'border-color 0.3s', outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    fontSize: '0.62rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '4px',
                    transition: 'color 0.2s',
                    fontWeight: 600,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <div style={{ color: '#EF4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.password}</div>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2px', padding: '0.75rem 3rem 0.75rem 0.75rem', color: '#fff', fontSize: '0.9rem',
                    transition: 'border-color 0.3s', outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    fontSize: '0.62rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '4px',
                    transition: 'color 0.2s',
                    fontWeight: 600,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && <div style={{ color: '#EF4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</div>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
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
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                transition: 'opacity 0.2s, transform 0.2s',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseEnter={e => { if(!isSubmitting) e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.9' }}
              onMouseLeave={e => { if(!isSubmitting) e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: '#C9A84C', fontSize: '0.75rem', cursor: 'pointer' }}>
                Already have an account? Log in
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  )
}
