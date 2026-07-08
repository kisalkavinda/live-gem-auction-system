import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { useDashboard } from '../../context/DashboardContext'
import { requestConsignGem } from '../../services/adminService'

export default function SellerDashboardPage() {
  // Using a mock seller ID 's1' (Ceylon Heritage Gems) for the Seller View
  const SELLER_ID = 's1'

  const { gems, auctions } = useDashboard()
  
  const myGems = useMemo(() => gems.filter(g => g.sellerId === SELLER_ID), [gems])
  
  // Find auctions for this seller's gems
  const myAuctions = useMemo(() => {
    const myGemIds = myGems.map(g => g.id)
    return auctions.filter(a => myGemIds.includes(a.gemId) && (a.status === 'Live' || a.status === 'Scheduled'))
  }, [auctions, myGems])

  const mySoldGems = useMemo(() => myGems.filter(g => g.status === 'Sold'), [myGems])
  
  const totalEarnings = mySoldGems.reduce((sum, g) => sum + Number(g.price || 0), 0)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '', type: 'Sapphire', carat: '', estimatedValue: '', description: ''
  })

  const handleRequestConsign = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccessMsg('')
    try {
      const res = await requestConsignGem({ ...formData, sellerId: SELLER_ID })
      setSuccessMsg(res.message)
      setTimeout(() => {
        setIsModalOpen(false)
        setSuccessMsg('')
        setFormData({ name: '', type: 'Sapphire', carat: '', estimatedValue: '', description: '' })
      }, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const isLive = status === 'Published' || status === 'Active'
    const isSold = status === 'Sold'
    
    let bg = 'rgba(201,168,76,0.15)'
    let border = 'rgba(201,168,76,0.4)'
    let color = '#C9A84C'

    if (isLive) {
      bg = 'rgba(74, 222, 128, 0.1)'
      border = 'rgba(74, 222, 128, 0.3)'
      color = '#4ADE80'
    } else if (isSold) {
      bg = 'rgba(255,255,255,0.05)'
      border = 'rgba(255,255,255,0.2)'
      color = '#fff'
    }

    return (
      <span style={{ 
        display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', 
        background: bg, border: `1px solid ${border}`, color: color, 
        fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' 
      }}>
        {status}
      </span>
    )
  }

  return (
    <DashboardLayout role="seller">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, margin: 0, letterSpacing: '-0.02em' }}>
            Seller Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Manage your consigned gemstones and track auction performance.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', borderRadius: '2px', color: '#0A0A0D',
            padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            transition: 'opacity 0.2s, transform 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
        >
          Request to Consign
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>My Gems Consigned</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#fff' }}>{myGems.length}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Active Auctions</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#C9A84C' }}>{myAuctions.length}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Items Sold</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#fff' }}>{mySoldGems.length}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Total Earnings</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#fff' }}>${totalEarnings.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Consigned Gems Table */}
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' }}>My Consigned Gems</h2>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
              <div>Gemstone</div>
              <div>Type</div>
              <div>Carat</div>
              <div>Listed Price</div>
              <div style={{ textAlign: 'right' }}>Status</div>
            </div>

            {myGems.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                You have not consigned any gems yet.
              </div>
            ) : (
              myGems.map(gem => (
                <div key={gem.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
                  <div style={{ color: '#fff', fontWeight: 500 }}>{gem.name}</div>
                  <div>{gem.type}</div>
                  <div>{gem.carat} ct</div>
                  <div>${gem.price?.toLocaleString()}</div>
                  <div style={{ textAlign: 'right' }}>{getStatusBadge(gem.status || 'Draft')}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Request Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px', background: '#050508', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, margin: 0 }}>Request to Consign</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            {successMsg ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#4ADE80', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '2px' }}>
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleRequestConsign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  Submit details of your gemstone. An admin will review and add it to the platform inventory if approved.
                </p>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Gem Name/Title</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }}>
                      <option style={{ background: '#050508' }}>Sapphire</option>
                      <option style={{ background: '#050508' }}>Ruby</option>
                      <option style={{ background: '#050508' }}>Emerald</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Carat Weight</label>
                    <input required type="number" step="0.01" value={formData.carat} onChange={e => setFormData({...formData, carat: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Estimated Value ($)</label>
                  <input required type="number" value={formData.estimatedValue} onChange={e => setFormData({...formData, estimatedValue: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.75rem 2rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px' }}>Cancel</button>
                  <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', color: '#0A0A0D', padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', opacity: isSubmitting ? 0.7 : 1 }}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
