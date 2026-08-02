import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useDashboard } from '../../context/DashboardContext'
import { useAlert } from '../../context/AlertContext'
import { createAuction, deleteAuction, endAuctionEarly, updateAuction } from '../../services/adminService'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function AdminAuctionsPage() {
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const { auctions, gems, addAuctionState, deleteAuctionState, updateAuctionState } = useDashboard()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Create Auction Form Data
  const [formData, setFormData] = useState({
    gemId: '',
    startingBid: '',
    minIncrement: '',
    startTime: null,
    endTime: null
  })

  const openCreateModal = () => {
    setEditingAuctionId(null)
    const publishedGems = gems.filter(g => g.status?.toUpperCase() === 'PUBLISHED')
    setFormData({
      gemId: publishedGems[0]?.id || '',
      startingBid: '',
      minIncrement: '',
      startTime: null,
      endTime: null
    })
    setIsModalOpen(true)
  }

  const openEditModal = (auction) => {
    setEditingAuctionId(auction.id)
    setFormData({
      gemId: auction.gemstone.id,
      startingBid: auction.startingPrice,
      minIncrement: auction.minIncrement,
      startTime: new Date(auction.startTime),
      endTime: new Date(auction.endTime)
    })
    setIsModalOpen(true)
  }

  const formatLocal = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const selectedGem = gems.find(g => g.id === formData.gemId) || gems.find(g => g.id === Number(formData.gemId))
      const newAuctionData = {
        gemstoneId: Number(formData.gemId),
        startingPrice: Number(formData.startingBid),
        minIncrement: Number(formData.minIncrement),
        startTime: formatLocal(formData.startTime),
        endTime: formatLocal(formData.endTime)
      }
      if (editingAuctionId) {
        const res = await updateAuction(editingAuctionId, newAuctionData)
        updateAuctionState(editingAuctionId, res.auction)
      } else {
        const res = await createAuction(newAuctionData)
        addAuctionState(res.auction)
      }
      setIsModalOpen(false)
      setEditingAuctionId(null)
    } catch (err) {
      console.error(err)
      showAlert({
        type: 'error',
        title: 'Validation Error',
        message: err.response?.data?.message || 'Failed to create auction. Please check your inputs.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEndEarly = async (id) => {
    if (!window.confirm("Are you sure you want to end this auction early?")) return;
    try {
      const res = await endAuctionEarly(id)
      updateAuctionState(id, res.auction)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this auction?")) return;
    try {
      await deleteAuction(id)
      deleteAuctionState(id)
    } catch (err) {
      console.error(err)
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'Live') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: 8, height: 8 }}>
            <div style={{ position: 'absolute', inset: 0, background: '#EF4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
            <div style={{ position: 'absolute', inset: 0, border: '1px solid #EF4444', borderRadius: '50%', animation: 'ripple 1.5s infinite' }} />
          </div>
          <span style={{ fontSize: '0.6rem', color: '#EF4444', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Live
          </span>
        </div>
      )
    } else if (status === 'Ended') {
      return (
        <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Ended
        </span>
      )
    }
    // Scheduled
    return (
      <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '2px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Scheduled
      </span>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, margin: 0, letterSpacing: '-0.02em' }}>
            Auction Management
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Schedule and manage live gemstone auctions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', borderRadius: '2px', color: '#0A0A0D',
            padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            transition: 'opacity 0.2s, transform 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
        >
          Create Auction
        </button>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
          <div>Gemstone</div>
          <div>Current Bid</div>
          <div>Status</div>
          <div>Schedule</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {auctions.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            No auctions found.
          </div>
        ) : (
          auctions.map(auction => (
            <div key={auction.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr 1.5fr', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 500 }}>{auction.gemstone?.name || 'Unknown Gem'}</div>
              <div>${(auction.currentBid || auction.startingPrice)?.toLocaleString()}</div>
              <div>{getStatusBadge(auction.status?.charAt(0).toUpperCase() + auction.status?.slice(1).toLowerCase())}</div>
              <div style={{ fontSize: '0.75rem' }}>
                <div>Start: {new Date(auction.startTime).toLocaleString()}</div>
                <div>End: {new Date(auction.endTime).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate(`/auctions/${auction.id}`)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '2px', color: '#fff',
                    padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  View Room
                </button>
                {auction.status?.toUpperCase() === 'SCHEDULED' && (
                  <button
                    onClick={() => openEditModal(auction)}
                    style={{
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '2px', color: '#fff',
                      padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                )}
                {auction.status?.toUpperCase() === 'LIVE' && (
                  <button
                    onClick={() => handleEndEarly(auction.id)}
                    style={{
                      background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px', color: '#C9A84C',
                      padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                    }}
                  >
                    End Early
                  </button>
                )}
                <button
                  onClick={() => handleDelete(auction.id)}
                  style={{
                    background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '2px', color: '#EF4444',
                    padding: '0.4rem 0.75rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Auction Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: '#050508', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 300, margin: 0 }}>
                {editingAuctionId ? 'Edit Auction' : 'Create Auction'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Select Gemstone</label>
                <select required disabled={!!editingAuctionId} value={formData.gemId} onChange={e => setFormData({...formData, gemId: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px', opacity: editingAuctionId ? 0.6 : 1 }}>
                  {gems.filter(g => g.status?.toUpperCase() === 'PUBLISHED' || g.id === Number(formData.gemId)).map(g => (
                    <option key={g.id} value={g.id} style={{ background: '#050508' }}>{g.name} - ${g.price?.toLocaleString()}</option>
                  ))}
                  {gems.filter(g => g.status?.toUpperCase() === 'PUBLISHED' || g.id === Number(formData.gemId)).length === 0 && (
                    <option value="" disabled style={{ background: '#050508' }}>No available gems.</option>
                  )}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Starting Bid ($)</label>
                  <input required type="number" value={formData.startingBid} onChange={e => setFormData({...formData, startingBid: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Min Increment ($)</label>
                  <input required type="number" value={formData.minIncrement} onChange={e => setFormData({...formData, minIncrement: e.target.value})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#fff', borderRadius: '2px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Start Time</label>
                  <DatePicker
                    selected={formData.startTime}
                    onChange={(date) => setFormData({ ...formData, startTime: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="custom-datepicker"
                    required
                    placeholderText="Select start date & time"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>End Time</label>
                  <DatePicker
                    selected={formData.endTime}
                    onChange={(date) => setFormData({ ...formData, endTime: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="custom-datepicker"
                    required
                    placeholderText="Select end date & time"
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '0.75rem 2rem', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '2px' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', border: 'none', color: '#0A0A0D', padding: '0.75rem 2rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSubmitting ? 'not-allowed' : 'pointer', borderRadius: '2px', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Saving...' : (editingAuctionId ? 'Update Auction' : 'Create Auction')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        
        /* React DatePicker Custom Dark Theme Styles */
        .custom-datepicker {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem;
          color: #fff;
          border-radius: 2px;
          font-family: inherit;
          font-size: 0.85rem;
          outline: none;
        }
        .custom-datepicker:focus {
          border-color: rgba(201,168,76,0.5);
        }
        .react-datepicker {
          background-color: #050508 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: #fff !important;
          font-family: inherit !important;
          border-radius: 4px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .react-datepicker__header {
          background-color: #0A0A0D !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
          padding-top: 0.5rem !important;
        }
        .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
          color: #fff !important;
          font-weight: 500 !important;
        }
        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
          color: rgba(255,255,255,0.65) !important;
        }
        .react-datepicker__day:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover {
          background-color: rgba(201,168,76,0.2) !important;
          color: #fff !important;
        }
        .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__quarter-text--selected, .react-datepicker__year-text--selected {
          background-color: #C9A84C !important;
          color: #050508 !important;
          font-weight: 600 !important;
        }
        .react-datepicker__day--keyboard-selected {
          background-color: rgba(201,168,76,0.3) !important;
          color: #fff !important;
        }
        .react-datepicker__time-container {
          border-left: 1px solid rgba(255,255,255,0.1) !important;
        }
        .react-datepicker__time-list-item {
          background-color: #050508 !important;
          color: rgba(255,255,255,0.65) !important;
        }
        .react-datepicker__time-list-item:hover {
          background-color: rgba(201,168,76,0.2) !important;
          color: #fff !important;
        }
        .react-datepicker__time-list-item--selected {
          background-color: #C9A84C !important;
          color: #050508 !important;
          font-weight: 600 !important;
        }
        .react-datepicker__input-container {
           display: block !important;
        }
        .react-datepicker-wrapper {
           display: block !important;
           width: 100% !important;
        }
      `}</style>

    </DashboardLayout>
  )
}
