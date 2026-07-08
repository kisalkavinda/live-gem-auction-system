import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { useDashboard } from '../../context/DashboardContext'
import { updateSellerStatus } from '../../services/adminService'

export default function AdminSellersPage() {
  const { sellers, updateSellerStatusState } = useDashboard()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active'
    if (!window.confirm(`Are you sure you want to change this seller's status to ${newStatus}?`)) return;
    
    setIsSubmitting(true)
    try {
      await updateSellerStatus(id, newStatus)
      updateSellerStatusState(id, newStatus)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async (id) => {
    setIsSubmitting(true)
    try {
      await updateSellerStatus(id, 'Active')
      updateSellerStatusState(id, 'Active')
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    let bg = 'rgba(255,255,255,0.05)'
    let border = 'rgba(255,255,255,0.2)'
    let color = '#fff'

    if (status === 'Active') {
      bg = 'rgba(74, 222, 128, 0.1)'
      border = 'rgba(74, 222, 128, 0.3)'
      color = '#4ADE80'
    } else if (status === 'Pending') {
      bg = 'rgba(201,168,76,0.15)'
      border = 'rgba(201,168,76,0.4)'
      color = '#C9A84C'
    } else if (status === 'Suspended') {
      bg = 'rgba(239, 68, 68, 0.1)'
      border = 'rgba(239, 68, 68, 0.3)'
      color = '#EF4444'
    }

    return (
      <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', background: bg, border: `1px solid ${border}`, color, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {status}
      </span>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, margin: 0, letterSpacing: '-0.02em' }}>
          Seller Management
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Review registrations, manage active sellers, and monitor performance.
        </p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
          <div>Business Name</div>
          <div>Contact Info</div>
          <div>Gems</div>
          <div>Total Sales</div>
          <div>Status</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {sellers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            No sellers found.
          </div>
        ) : (
          sellers.map(seller => (
            <div key={seller.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 500 }}>{seller.businessName}</div>
              <div style={{ fontSize: '0.75rem' }}>
                <div>{seller.contactName}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)' }}>{seller.email}</div>
              </div>
              <div>{seller.totalGems}</div>
              <div>${seller.totalSales?.toLocaleString()}</div>
              <div>{getStatusBadge(seller.status)}</div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {seller.status === 'Pending' ? (
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleApprove(seller.id)}
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', borderRadius: '2px', color: '#0A0A0D',
                      padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleStatusChange(seller.id, seller.status)}
                    style={{
                      background: 'transparent', border: `1px solid ${seller.status === 'Active' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(74, 222, 128, 0.3)'}`, borderRadius: '2px', color: seller.status === 'Active' ? '#EF4444' : '#4ADE80',
                      padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {seller.status === 'Active' ? 'Suspend' : 'Reactivate'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </DashboardLayout>
  )
}
