import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LKR = n =>
  'LKR ' + Number(n || 0).toLocaleString('en-LK')

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const orderNumber =
    location.state?.orderNumber || 'GH-PENDING'

  const total = location.state?.total || 0

  const customer =
    location.state?.customer || 'Customer'

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
        style={{
          minHeight: '75vh',
          padding: '10rem 6vw 6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 'min(600px, 100%)',
            textAlign: 'center',
            padding: '3rem 2rem',
            background:
              'rgba(255,255,255,0.02)',
            border:
              '1px solid rgba(201,168,76,0.22)',
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              margin: '0 auto 1.5rem',
              border:
                '1px solid rgba(201,168,76,0.5)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A84C',
              fontSize: '1.6rem',
            }}
          >
            ✓
          </div>

          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C9A84C',
            }}
          >
            Order Received
          </span>

          <h1
            style={{
              fontFamily:
                "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 300,
              margin:
                '0.6rem 0 1rem',
            }}
          >
            Thank You, {customer}
          </h1>

          <p
            style={{
              color:
                'rgba(255,255,255,0.4)',
              fontSize: '0.8rem',
              lineHeight: 1.7,
              maxWidth: 430,
              margin: '0 auto 2rem',
            }}
          >
            Your order has been received.
            This frontend confirmation will
            later be connected to THENNAKOON GEMS
            order system.
          </p>

          <div
            style={{
              padding: '1.25rem',
              background:
                'rgba(201,168,76,0.05)',
              border:
                '1px solid rgba(201,168,76,0.12)',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                marginBottom:
                  '0.7rem',
                fontSize: '0.65rem',
              }}
            >
              <span
                style={{
                  color:
                    'rgba(255,255,255,0.3)',
                  textTransform:
                    'uppercase',
                  letterSpacing:
                    '0.1em',
                }}
              >
                Order
              </span>

              <span
                style={{
                  color: '#C9A84C',
                }}
              >
                {orderNumber}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                fontSize: '0.65rem',
              }}
            >
              <span
                style={{
                  color:
                    'rgba(255,255,255,0.3)',
                  textTransform:
                    'uppercase',
                  letterSpacing:
                    '0.1em',
                }}
              >
                Total
              </span>

              <span
                style={{
                  fontFamily:
                    "'Cormorant Garamond', serif",
                  fontSize: '1.2rem',
                }}
              >
                {LKR(total)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/shop')}
            style={{
              padding: '0.8rem 1.8rem',
              background:
                'linear-gradient(135deg, #C9A84C, #E8D5A3)',
              color: '#0A0A0D',
              border: 'none',
              borderRadius: '2px',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Return to Catalogue
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}