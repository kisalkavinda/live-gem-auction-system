import {
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  loginUser,
} from '../services/authService'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LoginPage() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  // -----------------------------------------
  // LOGIN
  // -----------------------------------------

  const handleLogin =
    async e => {
      e.preventDefault()

      setError('')

      if (!email.trim()) {
        setError(
          'Please enter your email.'
        )

        return
      }

      if (!password) {
        setError(
          'Please enter your password.'
        )

        return
      }

      try {
          setLoading(true)

        const response =
          await loginUser({
            email: email.trim(),
            password,
          })

        console.log(
          'Login response:',
          response
        )

        const token =
          response.token

        if (!token) {
          throw new Error(
            'Login response did not contain a token.'
          )
        }

        // -----------------------------------------
        // INFORM CART CONTEXT
        // -----------------------------------------

        window.dispatchEvent(
          new Event(
            'gemhaven-auth-updated'
          )
        )

        // -----------------------------------------
        // RETURN TO PREVIOUS ACTION
        // -----------------------------------------

        const from =
          location.state?.from

        const action =
          location.state?.action

        console.log(
          'Login action:',
          action
        )

        console.log(
          'Return path:',
          from
        )

        if (from) {
          navigate(from, {
            replace: true,

            state: {
              continueAction:
                action,
            },
          })

          return
        }

        // Default
        navigate('/', {
          replace: true,
        })

      } catch (err) {
        console.error(
          'Login error:',
          err
        )

        if (
          err.response?.data
            ?.message
        ) {
          setError(
            err.response.data.message
          )
        } else if (
          err.response?.data
            ?.error
        ) {
          setError(
            err.response.data.error
          )
        } else if (
          err.response
            ?.status === 401
        ) {
          setError(
            'Invalid email or password.'
          )
        } else {
          setError(
            'Unable to login. Please try again.'
          )
        }

      } finally {
        setLoading(false)
      }
    }

  return (
    <div
      style={{
        background:
          '#050508',
        minHeight:
          '100vh',
        color: '#fff',
        display:
          'flex',
        flexDirection:
          'column',
      }}
    >
      <Navbar
        visible={true}
      />

      <main
        style={{
          flex: 1,
          display:
            'flex',
          alignItems:
            'center',
          justifyContent:
            'center',
          padding:
            '8rem 1.5rem 5rem',
        }}
      >
        <div
          style={{
            width:
              '100%',
            maxWidth:
              '460px',
          }}
        >
          {/* HEADER */}

          <div
            style={{
              textAlign:
                'center',
              marginBottom:
                '2.5rem',
            }}
          >
            <div
              style={{
                color:
                  '#C9A84C',
                fontSize:
                  '0.6rem',
                letterSpacing:
                  '0.25em',
                textTransform:
                  'uppercase',
                marginBottom:
                  '0.7rem',
              }}
            >
              ◆ GemHaven
            </div>

            <h1
              style={{
                fontFamily:
                  "'Cormorant Garamond', serif",
                fontSize:
                  'clamp(2.3rem, 5vw, 3.5rem)',
                fontWeight:
                  300,
                margin:
                  0,
              }}
            >
              Welcome Back
            </h1>

            <p
              style={{
                color:
                  'rgba(255,255,255,0.35)',
                fontSize:
                  '0.75rem',
                marginTop:
                  '0.6rem',
              }}
            >
              Sign in to continue
            </p>
          </div>

          {/* LOGIN CARD */}

          <form
            onSubmit={
              handleLogin
            }
            style={{
              padding:
                '2rem',
              border:
                '1px solid rgba(255,255,255,0.08)',
              background:
                'rgba(255,255,255,0.015)',
            }}
          >

            {/* EMAIL */}

            <label
              style={{
                display:
                  'block',
                marginBottom:
                  '1.25rem',
              }}
            >
              <span
                style={{
                  display:
                    'block',
                  fontSize:
                    '0.58rem',
                  letterSpacing:
                    '0.15em',
                  textTransform:
                    'uppercase',
                  color:
                    'rgba(255,255,255,0.35)',
                  marginBottom:
                    '0.5rem',
                }}
              >
                Email
              </span>

              <input
                type="email"
                value={
                  email
                }
                onChange={e =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email"
                autoComplete="email"
                style={{
                  width:
                    '100%',
                  boxSizing:
                    'border-box',
                  padding:
                    '0.85rem',
                  background:
                    'rgba(255,255,255,0.025)',
                  border:
                    '1px solid rgba(255,255,255,0.1)',
                  color:
                    '#fff',
                  outline:
                    'none',
                  borderRadius:
                    '2px',
                  fontSize:
                    '0.75rem',
                }}
              />
            </label>

            {/* PASSWORD */}

            <label
              style={{
                display:
                  'block',
                marginBottom:
                  '1.25rem',
              }}
            >
              <span
                style={{
                  display:
                    'block',
                  fontSize:
                    '0.58rem',
                  letterSpacing:
                    '0.15em',
                  textTransform:
                    'uppercase',
                  color:
                    'rgba(255,255,255,0.35)',
                  marginBottom:
                    '0.5rem',
                }}
              >
                Password
              </span>

              <input
                type="password"
                value={
                  password
                }
                onChange={e =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{
                  width:
                    '100%',
                  boxSizing:
                    'border-box',
                  padding:
                    '0.85rem',
                  background:
                    'rgba(255,255,255,0.025)',
                  border:
                    '1px solid rgba(255,255,255,0.1)',
                  color:
                    '#fff',
                  outline:
                    'none',
                  borderRadius:
                    '2px',
                  fontSize:
                    '0.75rem',
                }}
              />
            </label>

            {/* ERROR */}

            {error && (
              <div
                style={{
                  padding:
                    '0.8rem',
                  marginBottom:
                    '1rem',
                  background:
                    'rgba(239,68,68,0.08)',
                  border:
                    '1px solid rgba(239,68,68,0.25)',
                  color:
                    '#f87171',
                  fontSize:
                    '0.68rem',
                  lineHeight:
                    1.5,
                }}
              >
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={
                loading
              }
              style={{
                width:
                  '100%',
                padding:
                  '0.95rem',
                background:
                  'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                border:
                  'none',
                borderRadius:
                  '2px',
                color:
                  '#0A0A0D',
                fontWeight:
                  700,
                fontSize:
                  '0.65rem',
                letterSpacing:
                  '0.14em',
                textTransform:
                  'uppercase',
                cursor:
                  loading
                    ? 'not-allowed'
                    : 'pointer',
                opacity:
                  loading
                    ? 0.6
                    : 1,
              }}
            >
              {loading
                ? 'Signing In...'
                : 'Sign In'}
            </button>

            {/* REGISTER */}

            <div
              style={{
                textAlign:
                  'center',
                marginTop:
                  '1.5rem',
                fontSize:
                  '0.68rem',
                color:
                  'rgba(255,255,255,0.35)',
              }}
            >
              Don't have an account?{' '}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/register'
                  )
                }
                style={{
                  background:
                    'none',
                  border:
                    'none',
                  padding: 0,
                  color:
                    '#C9A84C',
                  cursor:
                    'pointer',
                  fontSize:
                    'inherit',
                }}
              >
                Create Account
              </button>
            </div>
          </form>

          {/* BACK */}

          <button
            onClick={() =>
              navigate('/shop')
            }
            style={{
              display:
                'block',
              margin:
                '1.5rem auto 0',
              padding: 0,
              background:
                'none',
              border:
                'none',
              color:
                'rgba(255,255,255,0.25)',
              fontSize:
                '0.6rem',
              letterSpacing:
                '0.1em',
              textTransform:
                'uppercase',
              cursor:
                'pointer',
            }}
          >
            ← Back to Catalogue
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}