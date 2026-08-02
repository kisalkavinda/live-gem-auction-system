import { useState } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import DashboardLayout from '../../components/DashboardLayout'
import { updateBuyerStatus } from '../../services/adminService'

export default function AdminBuyersPage() {
  const { buyers, updateBuyerStatusState } = useDashboard()
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  const handleToggleStatus = async (buyerId, currentStatus) => {
    setIsUpdating(true)
    setError('')
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active'
    
    try {
      await updateBuyerStatus(buyerId, newStatus)
      updateBuyerStatusState(buyerId, newStatus)
    } catch (err) {
      setError(err.message || 'Failed to update buyer status')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span style={{ 
          display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', 
          background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', 
          color: '#4ADE80', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' 
        }}>
          Active
        </span>
      )
    }
    return (
      <span style={{ 
        display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', 
        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', 
        color: '#EF4444', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' 
      }}>
        Suspended
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, margin: '0 0 0.5rem 0' }}>
            Buyer Management
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
            Manage registered buyers and their platform access.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
          <div>Name</div>
          <div>Contact Email</div>
          <div>Join Date</div>
          <div>Bids</div>
          <div>Purchases</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {buyers.map(buyer => (
          <div key={buyer.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1.5fr', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center', transition: 'background 0.2s' }}
               onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{ color: '#fff', fontWeight: 500, marginBottom: '0.25rem' }}>{buyer.name}</div>
              {getStatusBadge(buyer.status)}
            </div>
            <div>{buyer.email}</div>
            <div>{buyer.joinDate}</div>
            <div>{buyer.bidsPlaced}</div>
            <div>{buyer.purchases}</div>
            <div style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleToggleStatus(buyer.id, buyer.status)}
                disabled={isUpdating}
                style={{
                  background: 'transparent',
                  border: `1px solid ${buyer.status === 'Active' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(74, 222, 128, 0.4)'}`,
                  color: buyer.status === 'Active' ? '#EF4444' : '#4ADE80',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '2px',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  opacity: isUpdating ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  if(!isUpdating) {
                    e.currentTarget.style.background = buyer.status === 'Active' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)'
                  }
                }}
                onMouseLeave={e => {
                  if(!isUpdating) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {buyer.status === 'Active' ? 'Suspend' : 'Reactivate'}
              </button>
            </div>
          </div>
        ))}
        {buyers.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            No buyers registered yet.
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
