import {
  useState,
  useEffect,
  useRef,
} from 'react'

import {
  useParams,
  useNavigate,
} from 'react-router-dom'

import { gsap } from '../utils/gsap'

import { fetchGemById } from '../services/gemService'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { useCart } from '../context/CartContext'

const LKR = n =>
  'LKR ' +
  Number(n || 0).toLocaleString('en-LK')

const SPEC_ROWS = [
  {
    key: 'caratWeight',
    label: 'Carat Weight',
    fmt: v => `${v} ct`,
  },
  {
    key: 'cut',
    label: 'Cut',
  },
  {
    key: 'clarity',
    label: 'Clarity',
  },
  {
    key: 'origin',
    label: 'Origin',
  },
  {
    key: 'colorName',
    label: 'Colour Grade',
  },
  {
    key: 'certAuthority',
    label: 'Certification',
  },
  {
    key: 'certNumber',
    label: 'Certificate No.',
  },
]

export default function GemDetailPage() {
  const { id } = useParams()

  const navigate = useNavigate()

  const { addToCart } = useCart()

  const [gem, setGem] = useState(null)

  const [loading, setLoading] =
    useState(true)

  const [cartAdded, setCartAdded] =
    useState(false)

  const [adding, setAdding] =
    useState(false)

  const heroRef = useRef(null)

  const infoRef = useRef(null)

  const gemVisualRef = useRef(null)

  useEffect(() => {
    setLoading(true)

    setCartAdded(false)

    fetchGemById(id)
      .then(data => {
        setGem(data)
      })
      .catch(error => {
        console.error(
          'Error loading gem:',
          error
        )

        setGem(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (
      !gem ||
      !heroRef.current
    ) {
      return
    }

    const tl = gsap.timeline({
      delay: 0.1,
    })

    tl.fromTo(
      gemVisualRef.current,
      {
        opacity: 0,
        scale: 0.85,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
      }
    )

    tl.fromTo(
      infoRef.current?.querySelectorAll(
        '.detail-row'
      ) ?? [],
      {
        opacity: 0,
        x: 24,
      },
      {
        opacity: 1,
        x: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: 'power3.out',
      },
      '-=0.5'
    )
  }, [gem])

  function isLoggedIn() {
    const token =
      localStorage.getItem('token')

    const user =
      localStorage.getItem('user')

    return Boolean(token && user)
  }

  function goToLogin() {
    navigate('/login', {
      state: {
        from: `/shop/${gem.id}`,
      },
    })
  }

  async function handleAddToCart() {
    if (!isLoggedIn()) {
      goToLogin()
      return
    }

    try {
      setAdding(true)

      await addToCart(gem)

      setCartAdded(true)

      setTimeout(() => {
        setCartAdded(false)
      }, 2200)
    } catch (error) {
      console.error(
        'Add to cart error:',
        error
      )

      if (
        error.message ===
        'LOGIN_REQUIRED'
      ) {
        goToLogin()
        return
      }

      showAlert({
        type: 'error',
        title: 'Unable to add to cart',
        message: 'Unable to add this gem to the cart. Please try again.',
      })
    } finally {
      setAdding(false)
    }
  }

  function handleBuyNow() {
    if (!isLoggedIn()) {
      goToLogin()
      return
    }

    if (!gem) {
      return
    }

    const buyNowItem = {
      gemId: gem.id,

      name: gem.name,

      type: gem.type,

      price: Number(
        gem.price || 0
      ),

      imageUrl:
        gem.imageUrl || null,

      color:
        gem.color ||
        '#C9A84C',

      colorName:
        gem.colorName || '',

      caratWeight:
        gem.caratWeight || '',

      cut:
        gem.cut || '',

      clarity:
        gem.clarity || '',

      certNumber:
        gem.certNumber || '',

      certAuthority:
        gem.certAuthority || '',

      origin:
        gem.origin || '',

      description:
        gem.description || '',

      quantity: 1,
    }

    navigate('/checkout', {
      state: {
        mode: 'buyNow',
        buyNowItem,
      },
    })
  }

  if (loading) {
    return (
      <div
        style={{
          background: '#050508',
          minHeight: '100vh',
          color: '#fff',
        }}
      >
        <Navbar visible={true} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              border:
                '2px solid rgba(201,168,76,0.12)',
              borderTop:
                '2px solid #C9A84C',
              borderRadius: '50%',
              animation:
                'spin 0.9s linear infinite',
            }}
          />
        </div>

        <Footer />

        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }

  if (!gem) {
    return (
      <div
        style={{
          background: '#050508',
          minHeight: '100vh',
          color: '#fff',
        }}
      >
        <Navbar visible={true} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              opacity: 0.12,
            }}
          >
            ◆
          </div>

          <p
            style={{
              fontFamily:
                "'Cormorant Garamond', serif",
              fontSize: '2rem',
              fontWeight: 300,
              color:
                'rgba(255,255,255,0.3)',
            }}
          >
            Stone not found
          </p>

          <button
            onClick={() =>
              navigate('/shop')
            }
            style={{
              padding:
                '0.65rem 1.75rem',
              background:
                'transparent',
              border:
                '1px solid rgba(201,168,76,0.3)',
              borderRadius: '2px',
              color: '#C9A84C',
              fontSize: '0.65rem',
              letterSpacing:
                '0.12em',
              textTransform:
                'uppercase',
              cursor: 'pointer',
            }}
          >
            ← Return to Catalogue
          </button>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#050508',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <Navbar visible={true} />

      <div
        style={{
          padding:
            '8rem 6vw 0',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <nav
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            marginBottom:
              '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            onClick={() =>
              navigate('/')
            }
            style={breadcrumbStyle(
              true
            )}
          >
            Home
          </span>

          <span>/</span>

          <span
            onClick={() =>
              navigate('/shop')
            }
            style={breadcrumbStyle(
              true
            )}
          >
            Catalogue
          </span>

          <span>/</span>

          <span
            style={breadcrumbStyle(
              false
            )}
          >
            {gem.name}
          </span>
        </nav>
      </div>

      <section
        ref={heroRef}
        style={{
          padding:
            '0 6vw 8rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          {/* LEFT */}

          <div
            ref={gemVisualRef}
            style={{
              opacity: 0,
            }}
          >
            <div
              style={{
                background: `radial-gradient(ellipse at 38% 35%, ${
                  gem.color
                }30, rgba(5,5,8,0.95))`,
                border: `1px solid ${gem.color}25`,
                borderRadius: '4px',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position:
                    'absolute',
                  inset: 0,
                  background: `radial-gradient(ellipse at 40% 40%, ${gem.color}15 0%, transparent 65%)`,
                  pointerEvents:
                    'none',
                }}
              />

              {gem.imageUrl ? (
                <img
                  src={gem.imageUrl}
                  alt={gem.name}
                  style={{
                    position:
                      'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1,
                  }}
                />
              ) : (
                <div
                  style={{
                    position:
                      'relative',
                    zIndex: 1,
                    width: 200,
                    height: 200,
                    background: `linear-gradient(135deg, ${gem.color}DD, ${gem.color}55)`,
                    clipPath:
                      'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)',
                    boxShadow: `0 0 80px ${gem.color}55`,
                    animation:
                      'gemFloat 4s ease-in-out infinite',
                  }}
                />
              )}

              <div
                style={{
                  position:
                    'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding:
                    '0.35rem 0.7rem',
                  background:
                    'rgba(201,168,76,0.08)',
                  border:
                    '1px solid rgba(201,168,76,0.22)',
                  borderRadius: '2px',
                  backdropFilter:
                    'blur(12px)',
                  zIndex: 3,
                }}
              >
                <span
                  style={{
                    fontSize:
                      '0.58rem',
                    letterSpacing:
                      '0.15em',
                    color: '#C9A84C',
                  }}
                >
                  {gem.certAuthority}{' '}
                  Certified
                </span>
              </div>

              <div
                style={{
                  position:
                    'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding:
                    '0.35rem 0.7rem',
                  background: `${gem.color}18`,
                  border: `1px solid ${gem.color}40`,
                  borderRadius: '2px',
                  backdropFilter:
                    'blur(12px)',
                  zIndex: 3,
                }}
              >
                <span
                  style={{
                    fontSize:
                      '0.58rem',
                    letterSpacing:
                      '0.15em',
                    color:
                      gem.color,
                  }}
                >
                  {gem.type}
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop:
                  '0.75rem',
                padding:
                  '0.75rem 1rem',
                background:
                  'rgba(255,255,255,0.02)',
                border:
                  '1px solid rgba(255,255,255,0.06)',
                borderRadius: '4px',
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
                gap: '1rem',
              }}
            >
              <span
                style={{
                  fontSize:
                    '0.58rem',
                  letterSpacing:
                    '0.12em',
                  textTransform:
                    'uppercase',
                  color:
                    'rgba(255,255,255,0.25)',
                }}
              >
                Certificate Number
              </span>

              <span
                style={{
                  fontSize:
                    '0.72rem',
                  letterSpacing:
                    '0.08em',
                  color:
                    '#C9A84C',
                }}
              >
                {gem.certNumber}
              </span>
            </div>
          </div>

          {/* RIGHT */}

          <div ref={infoRef}>
            <div
              className="detail-row"
              style={{
                opacity: 0,
                marginBottom:
                  '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize:
                    '0.6rem',
                  letterSpacing:
                    '0.25em',
                  textTransform:
                    'uppercase',
                  color:
                    gem.color,
                }}
              >
                {gem.colorName}
              </span>
            </div>

            <h1
              className="detail-row"
              style={{
                opacity: 0,
                fontFamily:
                  "'Cormorant Garamond', serif",
                fontSize:
                  'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 300,
                color: '#fff',
                lineHeight: 1.15,
                marginBottom:
                  '0.35rem',
              }}
            >
              {gem.name}
            </h1>

            <div
              className="detail-row"
              style={{
                opacity: 0,
                marginBottom:
                  '2rem',
              }}
            >
              <span
                style={{
                  fontSize:
                    '0.68rem',
                  color:
                    'rgba(255,255,255,0.35)',
                }}
              >
                Origin: {gem.origin}
              </span>
            </div>

            <div
              className="detail-row"
              style={{
                opacity: 0,
                height: 1,
                background:
                  'rgba(255,255,255,0.06)',
                marginBottom:
                  '1.75rem',
              }}
            />

            <div
              className="detail-row"
              style={{
                opacity: 0,
                marginBottom:
                  '2rem',
              }}
            >
              {SPEC_ROWS.map(
                ({
                  key,
                  label,
                  fmt,
                }) => (
                  <div
                    key={key}
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                      padding:
                        '0.65rem 0',
                      borderBottom:
                        '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <span
                      style={{
                        fontSize:
                          '0.6rem',
                        letterSpacing:
                          '0.15em',
                        textTransform:
                          'uppercase',
                        color:
                          'rgba(255,255,255,0.3)',
                      }}
                    >
                      {label}
                    </span>

                    <span
                      style={{
                        fontSize:
                          '0.78rem',
                        color:
                          'rgba(255,255,255,0.75)',
                      }}
                    >
                      {fmt
                        ? fmt(
                            gem[
                              key
                            ]
                          )
                        : gem[
                            key
                          ]}
                    </span>
                  </div>
                )
              )}
            </div>

            <div
              className="detail-row"
              style={{
                opacity: 0,
                marginBottom:
                  '2.5rem',
              }}
            >
              <p
                style={{
                  fontSize:
                    'clamp(0.78rem, 1.1vw, 0.88rem)',
                  color:
                    'rgba(255,255,255,0.42)',
                  lineHeight: 1.78,
                  fontWeight: 300,
                }}
              >
                {gem.description}
              </p>
            </div>

            <div
              className="detail-row"
              style={{
                opacity: 0,
                marginBottom:
                  '1.5rem',
              }}
            >
              <div
                style={{
                  fontSize:
                    '0.55rem',
                  letterSpacing:
                    '0.18em',
                  textTransform:
                    'uppercase',
                  color:
                    'rgba(255,255,255,0.28)',
                  marginBottom:
                    '0.35rem',
                }}
              >
                Listed Price
              </div>

              <div
                style={{
                  fontFamily:
                    "'Cormorant Garamond', serif",
                  fontSize:
                    'clamp(1.6rem, 2.8vw, 2.2rem)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                {LKR(gem.price)}
              </div>
            </div>

            {/* BUTTONS */}

            <div
              className="detail-row"
              style={{
                opacity: 0,
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding:
                    '0.85rem 1.5rem',
                  background:
                    'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                  color: '#0A0A0D',
                  border: 'none',
                  borderRadius: '2px',
                  fontSize:
                    '0.68rem',
                  letterSpacing:
                    '0.15em',
                  textTransform:
                    'uppercase',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Buy Now
              </button>

              <button
                onClick={
                  handleAddToCart
                }
                disabled={adding}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding:
                    '0.85rem 1.5rem',
                  background:
                    cartAdded
                      ? 'rgba(201,168,76,0.12)'
                      : 'transparent',
                  border: `1px solid ${
                    cartAdded
                      ? '#C9A84C'
                      : 'rgba(201,168,76,0.3)'
                  }`,
                  borderRadius: '2px',
                  color:
                    cartAdded
                      ? '#C9A84C'
                      : 'rgba(255,255,255,0.6)',
                  fontSize:
                    '0.68rem',
                  letterSpacing:
                    '0.15em',
                  textTransform:
                    'uppercase',
                  cursor: adding
                    ? 'not-allowed'
                    : 'pointer',
                }}
              >
                {adding
                  ? 'Adding...'
                  : cartAdded
                    ? '✓ Added to Cart'
                    : 'Add to Cart'}
              </button>
            </div>

            <div
              className="detail-row"
              style={{
                opacity: 0,
                marginTop:
                  '2rem',
              }}
            >
              <button
                onClick={() =>
                  navigate('/shop')
                }
                style={{
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize:
                    '0.62rem',
                  letterSpacing:
                    '0.1em',
                  textTransform:
                    'uppercase',
                  color:
                    'rgba(255,255,255,0.25)',
                }}
              >
                ← Back to Catalogue
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes gemFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }

          50% {
            transform: translateY(-12px) rotate(4deg);
          }
        }

        @media (max-width: 760px) {
          section > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function breadcrumbStyle(
  clickable
) {
  return {
    fontSize: '0.6rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: clickable
      ? 'rgba(255,255,255,0.35)'
      : 'rgba(255,255,255,0.6)',
    cursor: clickable
      ? 'pointer'
      : 'default',
  }
}