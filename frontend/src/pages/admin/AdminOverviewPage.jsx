import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useDashboard } from '../../context/DashboardContext'

export default function AdminOverviewPage() {
  const navigate = useNavigate()
  const { gems, auctions, buyers } = useDashboard()

  const totalGems = gems.length
  const activeAuctions = auctions.filter(a => a.status === 'Live' || a.status === 'Scheduled').length
  const totalBuyers = buyers.length
  
  // Mock revenue
  const revenue = '$4,250,000'

  return (
    <DashboardLayout role="admin">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, margin: 0, letterSpacing: '-0.02em' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Welcome back to the GemHaven management portal.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Total Gems</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#fff' }}>{totalGems}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Active Auctions</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#C9A84C' }}>{activeAuctions}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Total Buyers</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#fff' }}>{totalBuyers}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Monthly Revenue</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#fff' }}>{revenue}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/admin/inventory')}
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', borderRadius: '2px', color: '#0A0A0D',
              padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'opacity 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
          >
            Manage Inventory
          </button>
          
          <button
            onClick={() => navigate('/admin/auctions')}
            style={{
              background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px', color: '#C9A84C',
              padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            Manage Auctions
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' }}>Recent Activity</h2>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
          
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
            <div>Time</div>
            <div>Event</div>
            <div>Status</div>
          </div>
          
          {/* Mock Rows */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
            <div>10 mins ago</div>
            <div>New buyer registration: <span style={{ color: '#fff' }}>Sophia Laurent</span></div>
            <div>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', color: '#4ADE80', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Approved
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
            <div>2 hours ago</div>
            <div>Auction ended: <span style={{ color: '#fff' }}>The Crimson Heart</span></div>
            <div>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Completed
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
            <div>Yesterday</div>
            <div>Land Plot L-001 reserved by <span style={{ color: '#fff' }}>James Winchester</span></div>
            <div>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Pending Review
              </span>
            </div>
          </div>

        </div>
      </div>

    </DashboardLayout>
  )
}
