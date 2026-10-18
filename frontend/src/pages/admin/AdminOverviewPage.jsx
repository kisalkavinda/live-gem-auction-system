import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useDashboard } from '../../context/DashboardContext'

export default function AdminOverviewPage() {
  const navigate = useNavigate()
  const { gems, auctions, buyers, stats, recentActivity } = useDashboard()

  const totalGems = stats?.totalGems !== undefined ? stats.totalGems : gems.length
  const activeAuctions = stats?.activeAuctions !== undefined ? stats.activeAuctions : auctions.filter(a => a.status === 'LIVE' || a.status === 'SCHEDULED').length
  const totalBuyers = stats?.totalBuyers !== undefined ? stats.totalBuyers : buyers.length
  
  const formattedRevenue = stats?.revenueThisMonth 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(stats.revenueThisMonth)
    : '$0'

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
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#fff' }}>{formattedRevenue}</div>
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
          
          {/* Dynamic Rows */}
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
                <div>{new Date(activity.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                
                {activity.type === 'BID' ? (
                  <div>New bid placed: <span style={{ color: '#fff' }}>${activity.amount}</span> on Auction #{activity.auctionId}</div>
                ) : (
                  <div>{activity.type}</div>
                )}
                
                <div>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', color: '#4ADE80', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {activity.type === 'BID' ? 'Placed' : activity.type}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              No recent activity found.
            </div>
          )}

        </div>
      </div>

    </DashboardLayout>
  )
}
