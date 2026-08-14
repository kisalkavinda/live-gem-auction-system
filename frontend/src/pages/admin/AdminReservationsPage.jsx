import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { useDashboard } from '../../context/DashboardContext'
import { updateReservationStatus } from '../../services/adminService'
import { useAlert } from '../../context/AlertContext'

export default function AdminReservationsPage() {
  const { reservations = [], updateReservationStatusState } = useDashboard()
  const { showAlert } = useAlert()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  // Filtered reservations list
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchStatus = selectedStatus === 'ALL' || res.status === selectedStatus
      const searchLower = searchTerm.toLowerCase()
      const matchSearch =
        !searchTerm ||
        (res.customerName && res.customerName.toLowerCase().includes(searchLower)) ||
        (res.customerPhone && res.customerPhone.toLowerCase().includes(searchLower)) ||
        (res.city && res.city.toLowerCase().includes(searchLower)) ||
        (res.gemstone?.name && res.gemstone.name.toLowerCase().includes(searchLower)) ||
        res.id.toString().includes(searchLower)
      return matchStatus && matchSearch
    })
  }, [reservations, selectedStatus, searchTerm])

  // Summary Counters
  const counts = useMemo(() => {
    return {
      total: reservations.length,
      confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
      pending: reservations.filter(r => r.status === 'PENDING_INSPECTION').length,
      completed: reservations.filter(r => r.status === 'COMPLETED').length,
      cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
    }
  }, [reservations])

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id)
      await updateReservationStatus(id, newStatus)
      if (updateReservationStatusState) {
        updateReservationStatusState(id, newStatus)
      }
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation(prev => ({ ...prev, status: newStatus }))
      }
      showAlert({
        type: 'success',
        title: 'Status Updated',
        message: `Reservation #${id} status changed to ${newStatus}.`
      })
    } catch (err) {
      console.error('Failed to update reservation status:', err)
      showAlert({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update reservation status.'
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#60A5FA' }
      case 'PENDING_INSPECTION':
        return { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', color: '#FACC15' }
      case 'COMPLETED':
        return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', color: '#4ADE80' }
      case 'CANCELLED':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#F87171' }
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', color: '#9CA3AF' }
    }
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, margin: 0, letterSpacing: '-0.02em' }}>
          Customer Reservations
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Manage customer gemstone showroom reservations, inspection status, and purchase completions.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Total Reservations</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: '#fff' }}>{counts.total}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Confirmed</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: '#60A5FA' }}>{counts.confirmed}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Pending Inspection</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: '#FACC15' }}>{counts.pending}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Completed</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: '#4ADE80' }}>{counts.completed}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>Cancelled</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: '#F87171' }}>{counts.cancelled}</div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by customer name, phone, city, or gem..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '2px',
            color: '#fff',
            padding: '0.65rem 1rem',
            fontSize: '0.75rem',
            width: '320px',
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'CONFIRMED', 'PENDING_INSPECTION', 'COMPLETED', 'CANCELLED'].map(status => {
            const isActive = selectedStatus === status
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={{
                  background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
                  border: `1px solid ${isActive ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
                  color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.62rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {status.replace('_', ' ')}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table of Customer Reservations */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.01)' }}>
              <th style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ID</th>
              <th style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer</th>
              <th style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Gemstone</th>
              <th style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount</th>
              <th style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payment</th>
              <th style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
              <th style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</th>
              <th style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map(res => {
                const badge = getStatusBadgeStyle(res.status)
                const formattedPrice = res.totalAmount
                  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(res.totalAmount)
                  : '$' + (res.gemstone?.price || 0).toLocaleString()

                return (
                  <tr key={res.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem', color: '#C9A84C', fontWeight: 600 }}>#{res.id}</td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{res.customerName}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '0.15rem' }}>
                        📞 {res.customerPhone} • {res.city}, {res.province}
                      </div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {res.gemstone?.imageUrl && (
                          <img
                            src={res.gemstone.imageUrl}
                            alt={res.gemstone.name}
                            style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                        )}
                        <div>
                          <div style={{ color: '#fff' }}>{res.gemstone?.name || 'Gemstone #' + res.gemstone?.id}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
                            {res.gemstone?.type} {res.gemstone?.caratWeight ? `• ${res.gemstone.caratWeight} ct` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 600 }}>
                      {formattedPrice}
                    </td>

                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
                      {res.paymentMethod || 'IN_STORE_PICKUP'}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <select
                        value={res.status}
                        disabled={updatingId === res.id}
                        onChange={e => handleStatusChange(res.id, e.target.value)}
                        style={{
                          background: badge.bg,
                          border: `1px solid ${badge.border}`,
                          color: badge.color,
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          padding: '0.3rem 0.5rem',
                          borderRadius: '2px',
                          outline: 'none',
                          cursor: 'pointer',
                          textTransform: 'uppercase'
                        }}
                      >
                        <option value="CONFIRMED" style={{ background: '#0a0a0d', color: '#60A5FA' }}>CONFIRMED</option>
                        <option value="PENDING_INSPECTION" style={{ background: '#0a0a0d', color: '#FACC15' }}>PENDING INSPECTION</option>
                        <option value="COMPLETED" style={{ background: '#0a0a0d', color: '#4ADE80' }}>COMPLETED</option>
                        <option value="CANCELLED" style={{ background: '#0a0a0d', color: '#F87171' }}>CANCELLED</option>
                      </select>
                    </td>

                    <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                      {res.createdAt ? new Date(res.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>

                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedReservation(res)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(201,168,76,0.3)',
                          color: '#C9A84C',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.6rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  No customer gemstone reservations found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem'
        }}>
          <div style={{
            background: '#0c0c12', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '4px',
            maxWidth: '650px', width: '100%', padding: '2rem', color: '#fff', position: 'relative',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button
              onClick={() => setSelectedReservation(null)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent',
                border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, marginTop: 0, marginBottom: '0.5rem' }}>
              Reservation #{selectedReservation.id}
            </h2>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Placed on {selectedReservation.createdAt ? new Date(selectedReservation.createdAt).toLocaleString() : 'N/A'}
            </div>

            {/* Customer Details */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C9A84C', marginBottom: '0.75rem', fontWeight: 700 }}>
                Customer Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Full Name:</span> {selectedReservation.customerName}</div>
                <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Phone:</span> {selectedReservation.customerPhone}</div>
                <div style={{ gridColumn: 'span 2' }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Address:</span> {selectedReservation.customerAddress}</div>
                <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>City:</span> {selectedReservation.city}</div>
                <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>District:</span> {selectedReservation.district}</div>
                <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Province:</span> {selectedReservation.province}</div>
                <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Postal Code:</span> {selectedReservation.postalCode}</div>
              </div>
            </div>

            {/* Gemstone Details */}
            {selectedReservation.gemstone && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C9A84C', marginBottom: '0.75rem', fontWeight: 700 }}>
                  Reserved Gemstone
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {selectedReservation.gemstone.imageUrl && (
                    <img
                      src={selectedReservation.gemstone.imageUrl}
                      alt={selectedReservation.gemstone.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  )}
                  <div style={{ fontSize: '0.8rem' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{selectedReservation.gemstone.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                      {selectedReservation.gemstone.type} • {selectedReservation.gemstone.caratWeight} ct • Cut: {selectedReservation.gemstone.cut}
                    </div>
                    {selectedReservation.gemstone.certNumber && (
                      <div style={{ color: '#C9A84C', fontSize: '0.7rem', marginTop: '0.2rem' }}>
                        Certificate #{selectedReservation.gemstone.certNumber} ({selectedReservation.gemstone.certAuthority})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment & Action Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Reservation Amount</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#C9A84C', fontWeight: 600 }}>
                  {selectedReservation.totalAmount
                    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(selectedReservation.totalAmount)
                    : '$' + (selectedReservation.gemstone?.price || 0).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setSelectedReservation(null)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                    padding: '0.65rem 1.25rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px'
                  }}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
