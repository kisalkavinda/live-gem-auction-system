import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { fetchLandPlotById, submitSiteVisitBooking } from '../data/mockLandPlots'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Shared Styles ────────────────────────────────────────────────────────
const labelStyle = {
  fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.28)', marginBottom: '0.5rem', display: 'block'
}
const inputStyle = {
  width: '100%', padding: '0.75rem',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '2px', color: '#fff',
  fontSize: '0.85rem', outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: 'border-color 0.2s',
  marginBottom: '0.25rem'
}
const errorStyle = {
  color: '#EF4444', fontSize: '0.65rem', marginTop: '0.2rem', minHeight: '1rem'
}

export default function LandDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [plot, setPlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  
  // Booking Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', visitors: 1, notes: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [bookingStatus, setBookingStatus] = useState('idle') // idle, submitting, success
  const [bookingRef, setBookingRef] = useState('')

  const contentRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchLandPlotById(id)
      if (data) {
        setPlot(data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  useEffect(() => {
    if (!loading && plot && contentRef.current) {
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [loading, plot])

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email address'
    }
    if (!formData.date) {
      errors.date = 'Date is required'
    } else if (new Date(formData.date) <= new Date()) {
      errors.date = 'Date must be in the future'
    }
    if (formData.visitors < 1) errors.visitors = 'At least 1 visitor required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setBookingStatus('submitting')
    try {
      const res = await submitSiteVisitBooking({ ...formData, plotId: plot.id })
      setBookingRef(res.bookingReference)
      setBookingStatus('success')
    } catch (err) {
      setBookingStatus('idle')
      alert("Failed to submit booking.")
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', fontSize: '0.8rem', textTransform: 'uppercase' }}>
          Loading Survey Data...
        </div>
      </div>
    )
  }

  if (!plot) {
    return (
      <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
        <Navbar visible={true} />
        <div style={{ padding: '12rem 6vw', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', marginBottom: '1rem' }}>Plot Not Found</h1>
          <button onClick={() => navigate('/land')} style={{ background: 'transparent', color: '#C9A84C', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ← Back to Listings
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return '#10B981';
      case 'Reserved': return '#C9A84C';
      case 'Under Survey': return '#3B82F6';
      default: return '#fff';
    }
  }
  const statusColor = getStatusColor(plot.status);

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
      <Navbar visible={true} />

      <main ref={contentRef} style={{ maxWidth: '1200px', margin: '0 auto', padding: '10rem 6vw 6rem', opacity: 1 }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '3rem' }}>
          <button
            onClick={() => navigate('/land')}
            style={{
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
              fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <span>←</span> Back to Plots
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
          
          {/* Left Col: Images */}
          <div>
            <div style={{
              width: '100%', aspectRatio: '4/3', background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px',
              overflow: 'hidden', position: 'relative', marginBottom: '1rem'
            }}>
              {plot.images && plot.images.length > 0 ? (
                <img
                  src={plot.images[activeImage]}
                  alt={`${plot.locationName} view ${activeImage + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.2)' }}>
                  No Image Available
                </div>
              )}
              
              <div style={{
                position: 'absolute', top: '1rem', left: '1rem',
                padding: '0.35rem 0.65rem',
                background: 'rgba(0,0,0,0.6)',
                border: `1px solid ${statusColor}40`,
                borderRadius: '2px', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: statusColor, textTransform: 'uppercase' }}>
                  {plot.status}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {plot.images && plot.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {plot.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    style={{
                      width: '4rem', aspectRatio: '4/3', padding: 0,
                      background: 'rgba(255,255,255,0.02)', cursor: 'pointer',
                      border: activeImage === idx ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px', overflow: 'hidden', transition: 'border-color 0.2s',
                      opacity: activeImage === idx ? 1 : 0.6
                    }}
                    onMouseEnter={e => { if (activeImage !== idx) e.currentTarget.style.opacity = 0.8 }}
                    onMouseLeave={e => { if (activeImage !== idx) e.currentTarget.style.opacity = 0.6 }}
                  >
                    <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Col: Details */}
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
              {plot.region}
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
              fontWeight: 300, color: '#fff', letterSpacing: '-0.02em',
              marginBottom: '2rem', lineHeight: 1.1,
            }}>
              {plot.locationName}
            </h1>

            {/* Key Stats Block */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
              padding: '1.5rem', background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px',
              marginBottom: '2.5rem'
            }}>
              <div>
                <span style={labelStyle}>Size</span>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#fff', lineHeight: 1 }}>
                  {plot.sizeAcres} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>Acres</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>({plot.sizePerch} Perches)</div>
              </div>
              <div>
                <span style={labelStyle}>Yield Potential</span>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#C9A84C', lineHeight: 1.2 }}>
                  {plot.yieldPotential}
                </div>
              </div>
              <div>
                <span style={labelStyle}>Survey Date</span>
                <div style={{ fontSize: '0.9rem', color: '#fff' }}>{plot.surveyDate}</div>
              </div>
              <div>
                <span style={labelStyle}>Coordinates</span>
                <div style={{ fontSize: '0.9rem', color: '#fff' }}>{plot.coordinates}</div>
              </div>
            </div>

            <p style={{
              fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.8, fontWeight: 300, marginBottom: '2.5rem'
            }}>
              {plot.description}
            </p>

            {/* Geo Survey Data List */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', marginBottom: '1rem' }}>
                Geological Survey Specs
              </h3>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ width: '40%', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Soil Composition</span>
                  <span style={{ width: '60%', fontSize: '0.85rem', color: '#fff' }}>{plot.soilComposition}</span>
                </div>
                <div style={{ display: 'flex', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ width: '40%', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>Historical Yield</span>
                  <span style={{ width: '60%', fontSize: '0.85rem', color: '#fff' }}>{plot.historicalYieldData}</span>
                </div>
              </div>
            </div>

            <button
              onClick={scrollToForm}
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                border: 'none', borderRadius: '2px', color: '#0A0A0D',
                padding: '1rem 2.5rem', fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.2s', width: '100%',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 0.9; e.currentTarget.style.transform = 'scale(1.01)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Reserve a Site Visit
            </button>
          </div>
        </div>
      </main>

      {/* Booking Form Section */}
      <section ref={formRef} style={{ background: '#07070A', padding: '6rem 6vw', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem' }}>
              Schedule Inspection
            </span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: '#fff' }}>
              Reserve a Site Visit
            </h2>
          </div>

          {bookingStatus === 'success' ? (
            <div style={{
              background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '4px', padding: '3rem 2rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', color: '#C9A84C', marginBottom: '1rem' }}>✓</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>
                Visit Reserved
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Your site visit request for {plot.locationName} has been received. Our expedition team will contact you shortly to confirm arrangements.
              </p>
              <div style={{
                background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '4px',
                display: 'inline-block', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Reference</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#C9A84C' }}>{bookingRef}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  style={{ ...inputStyle, borderColor: formErrors.name ? '#EF4444' : 'rgba(255,255,255,0.1)' }} 
                  onFocus={e => !formErrors.name && (e.target.style.borderColor = 'rgba(201,168,76,0.45)')}
                  onBlur={e => !formErrors.name && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <div style={errorStyle}>{formErrors.name}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    style={{ ...inputStyle, borderColor: formErrors.email ? '#EF4444' : 'rgba(255,255,255,0.1)' }} 
                    onFocus={e => !formErrors.email && (e.target.style.borderColor = 'rgba(201,168,76,0.45)')}
                    onBlur={e => !formErrors.email && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <div style={errorStyle}>{formErrors.email}</div>
                </div>
                <div>
                  <label style={labelStyle}>Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    style={inputStyle} 
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.45)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <div style={errorStyle}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Preferred Date</label>
                  {/* Defaulting to a simple HTML date input styled to match */}
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    style={{ 
                      ...inputStyle, 
                      colorScheme: 'dark', // Helps render calendar icon well in dark mode on some browsers
                      borderColor: formErrors.date ? '#EF4444' : 'rgba(255,255,255,0.1)' 
                    }} 
                    onFocus={e => !formErrors.date && (e.target.style.borderColor = 'rgba(201,168,76,0.45)')}
                    onBlur={e => !formErrors.date && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <div style={errorStyle}>{formErrors.date}</div>
                </div>
                <div>
                  <label style={labelStyle}>Number of Visitors</label>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.visitors} 
                    onChange={e => setFormData({...formData, visitors: parseInt(e.target.value) || ''})} 
                    style={{ ...inputStyle, borderColor: formErrors.visitors ? '#EF4444' : 'rgba(255,255,255,0.1)' }} 
                    onFocus={e => !formErrors.visitors && (e.target.style.borderColor = 'rgba(201,168,76,0.45)')}
                    onBlur={e => !formErrors.visitors && (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <div style={errorStyle}>{formErrors.visitors}</div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Notes / Requirements (Optional)</label>
                <textarea 
                  rows="4"
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})} 
                  style={{ ...inputStyle, resize: 'vertical' }} 
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.45)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={bookingStatus === 'submitting'}
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
                  border: 'none', borderRadius: '2px', color: '#0A0A0D',
                  padding: '1rem', fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: bookingStatus === 'submitting' ? 'wait' : 'pointer',
                  transition: 'opacity 0.2s', marginTop: '1rem',
                  opacity: bookingStatus === 'submitting' ? 0.7 : 1
                }}
                onMouseEnter={e => { if(bookingStatus !== 'submitting') e.currentTarget.style.opacity = 0.9 }}
                onMouseLeave={e => { if(bookingStatus !== 'submitting') e.currentTarget.style.opacity = 1 }}
              >
                {bookingStatus === 'submitting' ? 'Submitting...' : 'Confirm Request'}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
