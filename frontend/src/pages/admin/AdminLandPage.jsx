import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { useDashboard } from '../../context/DashboardContext'
import { addLandListing, deleteLandListing, updateBookingStatus, uploadImage } from '../../services/adminService'
import ConfirmModal from '../../components/ConfirmModal'

export default function AdminLandPage() {
  const { lands, bookings, addLandState, deleteLandState, updateBookingStatusState } = useDashboard()
  const { showAlert } = useAlert()
  const [activeTab, setActiveTab] = useState('listings') // 'listings' | 'bookings'

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, id: null, title: '', message: '', confirmText: '', confirmColor: '' })
  
  // Land form data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    region: 'Ratnapura',
    size: '',
    yieldPotential: '',
    description: '',
    status: 'Available'
  })

  const openAddModal = () => {
    setFormData({
      name: '',
      location: '',
      region: 'Ratnapura',
      size: '',
      yieldPotential: '',
      description: '',
      status: 'Available'
    })
    setSelectedFile(null)
    setIsModalOpen(true)
  }

  const handleSaveLand = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      let statusEnum = 'AVAILABLE';
      if (formData.status === 'Reserved') statusEnum = 'RESERVED';
      if (formData.status === 'Under Survey') statusEnum = 'UNDER_SURVEY';
      
      let imageUrl = null;
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile);
        imageUrl = uploadRes.url;
      }
      
      const payload = {
        name: formData.name,
        region: formData.region,
        sizeAcres: parseFloat(formData.size) || null,
        yieldPotential: formData.yieldPotential,
        description: formData.description,
        status: statusEnum,
        images: imageUrl ? [imageUrl] : []
      };

      const res = await addLandListing(payload)
      addLandState(res.land)
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (land) => {
    setConfirmConfig({
      isOpen: true,
      id: land.id,
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete <strong>${land.name}</strong>? This action cannot be undone.`,
      confirmText: 'Delete',
      confirmColor: '#EF4444'
    })
  }

  const handleConfirmDelete = async () => {
    const { id } = confirmConfig;
    if (!id) return;
    setIsSubmitting(true);
    try {
      await deleteLandListing(id)
      deleteLandState(id)
      setConfirmConfig({ isOpen: false, id: null, title: '', message: '', confirmText: '', confirmColor: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleConfirmBooking = async (id) => {
    try {
      await updateBookingStatus(id, 'CONFIRMED')
      updateBookingStatusState(id, 'CONFIRMED')
    } catch (err) {
      console.error(err)
    }
  }

  const handleCompleteBooking = async (id) => {
    try {
      await updateBookingStatus(id, 'COMPLETED')
      updateBookingStatusState(id, 'COMPLETED')
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusBadge = (status) => {
    let bg = 'rgba(255,255,255,0.05)'
    let border = 'rgba(255,255,255,0.2)'
    let color = '#fff'

    const s = (status || '').toUpperCase();
    if (s === 'AVAILABLE' || s === 'ACTIVE' || s === 'CONFIRMED' || s === 'COMPLETED') {
      bg = 'rgba(74, 222, 128, 0.1)'
      border = 'rgba(74, 222, 128, 0.3)'
      color = '#4ADE80'
    } else if (s === 'PENDING' || s === 'RESERVED' || s === 'UNDER_SURVEY' || s === 'UNDER SURVEY') {
      bg = 'rgba(201,168,76,0.15)'
      border = 'rgba(201,168,76,0.4)'
      color = '#C9A84C'
    }

    return (
      <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', background: bg, border: `1px solid ${border}`, color, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {status}
      </span>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, margin: 0, letterSpacing: '-0.02em' }}>
            Land Management
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Manage land plots and site visit bookings.
          </p>
        </div>
        {activeTab === 'listings' && (
          <button
            onClick={openAddModal}
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', borderRadius: '2px', color: '#0A0A0D',
              padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'opacity 0.2s, transform 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
          >
            Add Land Listing
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            background: 'transparent', border: 'none', color: activeTab === 'listings' ? '#C9A84C' : 'rgba(255,255,255,0.5)',
            padding: '0.75rem 0', fontSize: '0.75rem', fontWeight: activeTab === 'listings' ? 700 : 400, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer', borderBottom: `2px solid ${activeTab === 'listings' ? '#C9A84C' : 'transparent'}`,
            transition: 'all 0.2s'
          }}
        >
          Land Listings
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            background: 'transparent', border: 'none', color: activeTab === 'bookings' ? '#C9A84C' : 'rgba(255,255,255,0.5)',
            padding: '0.75rem 0', fontSize: '0.75rem', fontWeight: activeTab === 'bookings' ? 700 : 400, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer', borderBottom: `2px solid ${activeTab === 'bookings' ? '#C9A84C' : 'transparent'}`,
            transition: 'all 0.2s'
          }}
        >
          Site Visit Bookings
        </button>
      </div>

      {activeTab === 'listings' ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
            <div>Location / Name</div>
            <div>Region</div>
            <div>Size</div>
            <div>Yield Potential</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {lands.map(land => (
            <div key={land.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 500 }}>{land.name || land.location}</div>
              <div>{land.region}</div>
              <div>{land.sizeAcres ? `${land.sizeAcres} Acres` : land.size}</div>
              <div>{land.yieldPotential}</div>
              <div>{getStatusBadge(land.status === 'UNDER_SURVEY' ? 'Under Survey' : land.status === 'RESERVED' ? 'Reserved' : 'Available')}</div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleDeleteClick(land)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '2px', color: '#EF4444',
                    padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
            <div>Date</div>
            <div>Requester</div>
            <div>Email</div>
            <div>Land Plot</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {bookings.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              No site visit bookings found.
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
                <div>{new Date(booking.preferredVisitDate || booking.date).toLocaleDateString()}</div>
                <div style={{ color: '#fff', fontWeight: 500 }}>{booking.fullName || booking.name}</div>
                <div>{booking.email}</div>
                <div>{booking.landPlot?.name || booking.landPlotId}</div>
                <div>{getStatusBadge(booking.status)}</div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {(booking.status === 'PENDING' || booking.status === 'Pending') && (
                    <button
                      onClick={() => handleConfirmBooking(booking.id)}
                      style={{
                        background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px', color: '#C9A84C',
                        padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                      }}
                    >
                      Confirm
                    </button>
                  )}
                  {(booking.status === 'CONFIRMED' || booking.status === 'Confirmed') && (
                    <button
                      onClick={() => handleCompleteBooking(booking.id)}
                      style={{
                        background: 'transparent', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '2px', color: '#4ADE80',
                        padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                      }}
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Land Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: '#050508', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, margin: 0 }}>Add Land Listing</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSaveLand} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Name/Title</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Region</label>
                  <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }}>
                    <option style={{ background: '#050508' }}>Ratnapura</option>
                    <option style={{ background: '#050508' }}>Pelmadulla</option>
                    <option style={{ background: '#050508' }}>Elahera</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Size (e.g., 2 Acres)</label>
                  <input required type="text" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Yield Potential</label>
                  <select value={formData.yieldPotential} onChange={e => setFormData({...formData, yieldPotential: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }}>
                    <option style={{ background: '#050508' }}>High</option>
                    <option style={{ background: '#050508' }}>Medium</option>
                    <option style={{ background: '#050508' }}>Moderate</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }}>
                    <option style={{ background: '#050508' }}>Available</option>
                    <option style={{ background: '#050508' }}>Reserved</option>
                    <option style={{ background: '#050508' }}>Under Survey</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Image</label>
                  <input type="file" onChange={e => setSelectedFile(e.target.files[0])} accept="image/*" style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.65rem', color: '#fff', borderRadius: '2px', fontSize: '0.75rem' }} />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.75rem 2rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', color: '#0A0A0D', padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Saving...' : 'Add Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmColor={confirmConfig.confirmColor}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />

    </DashboardLayout>
  )
}
