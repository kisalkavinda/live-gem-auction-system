import { useState, useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import Navbar from '../components/Navbar'
import { fetchMyBookings } from '../services/landService'

export default function MyAccountPage() {
  const containerRef = useRef(null)
  const [myBookings, setMyBookings] = useState([
    { id: 'b-1', plotName: 'Ratnapura Blue Vein Plot', date: '2026-08-15', status: 'CONFIRMED' },
    { id: 'b-2', plotName: 'Opanayake Deep Seam', date: '2026-09-02', status: 'PENDING' }
  ])

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }

    async function loadBookings() {
      const data = await fetchMyBookings();
      if (data && data.length > 0) {
        setMyBookings(data.map(b => ({
          id: b.id,
          plotName: b.landPlot?.name || `Plot #${b.landPlot?.id || ''}`,
          date: b.preferredVisitDate,
          status: b.status
        })));
      }
    }
    loadBookings();
  }, [])

  // Mock data for a logged-in buyer
  const myBids = [
    { id: 1, gemName: 'Burmese Pigeon Blood Ruby', type: 'Auction', amount: 1850000, status: 'Winning', date: '2026-07-08' },
    { id: 2, gemName: 'Kashmiri Blue Sapphire', type: 'Auction', amount: 12100000, status: 'Outbid', date: '2026-07-07' }
  ]

  const myPurchases = [
    { id: 101, gemName: 'Colombian Vivid Green Emerald', type: 'Direct Buy', amount: 2450000, date: '2026-05-12', status: 'Delivered' }
  ]

  const getStatusBadge = (status) => {
    let bg = 'rgba(255,255,255,0.05)'
    let border = 'rgba(255,255,255,0.2)'
    let color = '#fff'

    if (status === 'Winning' || status === 'Confirmed' || status === 'Delivered') {
      bg = 'rgba(74, 222, 128, 0.1)'
      border = 'rgba(74, 222, 128, 0.3)'
      color = '#4ADE80'
    } else if (status === 'Pending') {
      bg = 'rgba(201,168,76,0.15)'
      border = 'rgba(201,168,76,0.4)'
      color = '#C9A84C'
    } else if (status === 'Outbid') {
      bg = 'rgba(239, 68, 68, 0.1)'
      border = 'rgba(239, 68, 68, 0.3)'
      color = '#EF4444'
    }

    return (
      <span style={{ 
        display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', 
        background: bg, border: `1px solid ${border}`, color, 
        fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' 
      }}>
        {status}
      </span>
    )
  }

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <Navbar visible={true} />
      
      <main style={{ flex: 1, padding: '8rem 1.5rem 4rem 1.5rem', position: 'relative' }}>
        
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '60vw', height: '60vw', background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 60%)',
          pointerEvents: 'none', zIndex: 0
        }} />

        <div ref={containerRef} style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem' }}>
              Buyer Profile
            </span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
              My Account
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Manage your active bids, purchase history, and site visits.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Account Details */}
            {(() => {
              const userStr = localStorage.getItem('user');
              const user = userStr ? JSON.parse(userStr) : null;
              
              if (!user) return null;

              return (
                <section>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.25rem' }}>Account Details</h2>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>Full Name</span>
                      <span style={{ fontSize: '0.9rem', color: '#fff' }}>{user.fullName || 'N/A'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>Email Address</span>
                      <span style={{ fontSize: '0.9rem', color: '#fff' }}>{user.email || 'N/A'}</span>
                    </div>

                  </div>
                </section>
              );
            })()}

            {/* My Bids */}
            <section>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.25rem' }}>My Bids</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
                  <div>Item</div>
                  <div>Date</div>
                  <div>Amount</div>
                  <div style={{ textAlign: 'right' }}>Status</div>
                </div>
                {myBids.map(bid => (
                  <div key={bid.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{bid.gemName}</div>
                    <div>{bid.date}</div>
                    <div>${bid.amount.toLocaleString()}</div>
                    <div style={{ textAlign: 'right' }}>{getStatusBadge(bid.status)}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* My Purchases */}
            <section>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.25rem' }}>My Purchases</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
                  <div>Item</div>
                  <div>Purchase Date</div>
                  <div>Amount</div>
                  <div style={{ textAlign: 'right' }}>Status</div>
                </div>
                {myPurchases.map(purchase => (
                  <div key={purchase.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{purchase.gemName}</div>
                    <div>{purchase.date}</div>
                    <div>${purchase.amount.toLocaleString()}</div>
                    <div style={{ textAlign: 'right' }}>{getStatusBadge(purchase.status)}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* My Site Visit Bookings */}
            <section>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.25rem' }}>Site Visit Bookings</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
                  <div>Land Plot</div>
                  <div>Scheduled Date</div>
                  <div style={{ textAlign: 'right' }}>Status</div>
                </div>
                {myBookings.map(booking => (
                  <div key={booking.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 500 }}>{booking.plotName}</div>
                    <div>{booking.date}</div>
                    <div style={{ textAlign: 'right' }}>{getStatusBadge(booking.status)}</div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}
