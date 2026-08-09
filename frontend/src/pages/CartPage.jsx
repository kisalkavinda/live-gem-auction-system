import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAlert } from '../context/AlertContext'

const LKR = (n) => 'LKR ' + Number(n || 0).toLocaleString('en-LK')

export default function CartPage() {
  const navigate = useNavigate()
  const pageRef = useRef(null)

  const {
    cartItems,
    cartTotal,
    loading,
    removeFromCart,
  } = useCart()

  const { showAlert } = useAlert()

  useEffect(() => {
    if (!pageRef.current) return

    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      }
    )
  }, [])

  const handleRemove = async (gemId) => {
    try {
      await removeFromCart(gemId)
    } catch {
      showAlert({
        type: 'error',
        title: 'Unable to remove item',
        message: 'Unable to remove this gem from the cart.',
      })
    }
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

      <main
        ref={pageRef}
        style={{
          padding: '9rem 6vw 7rem',
          maxWidth: '1200px',
          margin: '0 auto',
          opacity: 0,
        }}
      >
        <div style={{ marginBottom: '3rem' }}>
          <span
            style={{
              color: '#C9A84C',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            ◆ Your Selection
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 300,
              margin: '0.6rem 0',
            }}
          >
            Your Cart
          </h1>

          <p
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '0.8rem',
            }}
          >
            {cartItems.length} {cartItems.length === 1 ? 'gem' : 'gems'} selected
          </p>
        </div>

        {loading ? (
          <div
            style={{
              padding: '5rem',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            Loading cart...
          </div>
        ) : cartItems.length === 0 ? (
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '6rem 2rem',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.015)',
            }}
          >
            <div
              style={{
                fontSize: '3rem',
                color: '#C9A84C',
                opacity: 0.2,
                marginBottom: '1rem',
              }}
            >
              ◆
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              Your cart is empty
            </h2>

            <button
              onClick={() => navigate('/shop')}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                border: 'none',
                borderRadius: '2px',
                color: '#0A0A0D',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Browse Catalogue
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 330px',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.gemId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px minmax(0,1fr) auto',
                    gap: '1.25rem',
                    padding: '1rem',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      height: 120,
                      background: `radial-gradient(ellipse at center, ${item.color}30, rgba(5,5,8,0.95))`,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          background: `linear-gradient(135deg, ${item.color}CC, ${item.color}44)`,
                          clipPath:
                            'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)',
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <div
                      style={{
                        color: item.color,
                        fontSize: '0.58rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {item.type}
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.35rem',
                        fontWeight: 400,
                        margin: '0 0 0.4rem',
                      }}
                    >
                      {item.name}
                    </h3>

                    <div
                      style={{
                        fontSize: '0.65rem',
                        color: 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {item.caratWeight} ct · {item.cut} Cut · {item.clarity}
                    </div>

                    <div
                      style={{
                        marginTop: '0.8rem',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '1.25rem',
                      }}
                    >
                      {LKR(item.price)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.gemId)}
                    style={{
                      alignSelf: 'start',
                      padding: '0.45rem 0.65rem',
                      background: 'transparent',
                      border: '1px solid rgba(239,68,68,0.25)',
                      color: '#EF4444',
                      fontSize: '0.58rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <aside
              style={{
                border: '1px solid rgba(201,168,76,0.2)',
                background: 'rgba(201,168,76,0.035)',
                padding: '1.5rem',
                position: 'sticky',
                top: '100px',
              }}
            >
              <div
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  marginBottom: '1.5rem',
                }}
              >
                Order Summary
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.8rem',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.75rem',
                }}
              >
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span>Subtotal</span>
                <span>{LKR(cartTotal)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '1rem 0',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                >
                  Fulfilment
                </span>

                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#C9A84C',
                  }}
                >
                  In-Store Inspection & Pickup
                </span>
              </div>

              <button
                onClick={() =>
                  navigate('/checkout', {
                    state: {
                      mode: 'cart',
                    },
                  })
                }
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  marginTop: '0.75rem',
                  background:
                    'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                  border: 'none',
                  borderRadius: '2px',
                  color: '#0A0A0D',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/shop')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginTop: '0.6rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @media (max-width: 800px) {
          main > div:last-child {
            grid-template-columns: 1fr !important;
          }

          aside {
            position: static !important;
          }
        }

        @media (max-width: 600px) {
          main div[style*="grid-template-columns: 130px"] {
            grid-template-columns: 90px 1fr !important;
          }

          main div[style*="grid-template-columns: 130px"] > button {
            grid-column: 2;
            justify-self: start;
          }
        }
      `}</style>
    </div>
  )
}