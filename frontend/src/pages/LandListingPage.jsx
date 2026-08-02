import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { fetchLandPlots } from '../services/landService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Constants & Helpers ────────────────────────────────────────────────────
const REGIONS = ['All', 'Ratnapura', 'Pelmadulla', 'Elahera', 'Opanayake', 'Nivithigala', 'Kuruwita']
const STATUSES = ['All', 'Available', 'Reserved', 'Under Survey']
const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'size-asc', label: 'Size: Smallest First' },
  { value: 'size-desc', label: 'Size: Largest First' },
]

// ─── Skeleton card ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '4px',
      overflow: 'hidden',
    }}>
      <div style={{
        height: 180,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)',
        animation: 'shimmer 1.6s infinite',
      }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {[60, 80, 45].map((w, i) => (
          <div key={i} style={{
            height: 10,
            width: `${w}%`,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.05)',
            animation: 'shimmer 1.6s infinite',
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ─── Land Plot card ────────────────────────────────────────────────────────────────
function LandPlotCard({ plot, index }) {
  const cardRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        delay: (index % 6) * 0.08,
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
      }
    )

    function onMove(e) {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, { rotateY: x * 12, rotateX: -y * 12, translateZ: 16, duration: 0.25, ease: 'power2.out', transformPerspective: 700 })
    }
    function onLeave() {
      gsap.to(card, { rotateY: 0, rotateX: 0, translateZ: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
  }, [index])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return '#10B981'; // green
      case 'Reserved': return '#C9A84C'; // gold
      case 'Under Survey': return '#3B82F6'; // blue
      default: return '#fff';
    }
  }
  const statusColor = getStatusColor(plot.status);

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/land/${plot.id}`)}
      style={{
        opacity: 0,
        position: 'relative',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.3s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(201,168,76,0.6)`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Land visual */}
      <div style={{
        height: 180,
        background: `rgba(201,168,76,0.1)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        borderBottom: `1px solid rgba(201,168,76,0.2)`,
      }}>
        {plot.images && plot.images.length > 0 ? (
          <img
            src={plot.images[0]}
            alt={plot.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0, left: 0,
              filter: 'brightness(0.7) contrast(1.1)'
            }}
          />
        ) : (
          <div style={{
             width: '100%', height: '100%',
             background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(5,5,8,1) 100%)',
             display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
             <span style={{color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem'}}>No Image</span>
          </div>
        )}

        {/* Yield Potential badge */}
        <div style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          padding: '0.25rem 0.55rem',
          background: `rgba(0,0,0,0.6)`,
          border: `1px solid rgba(201,168,76,0.4)`,
          borderRadius: '2px',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C' }}>
            {plot.yieldPotential}
          </span>
        </div>

        {/* Status badge */}
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          padding: '0.25rem 0.45rem',
          background: 'rgba(0,0,0,0.6)',
          border: `1px solid ${statusColor}40`,
          borderRadius: '2px',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          <div style={{
             width: '6px', height: '6px', borderRadius: '50%', background: statusColor,
             boxShadow: `0 0 8px ${statusColor}`
          }} />
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: statusColor, textTransform: 'uppercase' }}>
            {plot.status}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.35rem' }}>
          {plot.region}
        </div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.15rem', fontWeight: 400, color: '#fff',
          marginBottom: '0.4rem', lineHeight: 1.25,
        }}>
          {plot.name}
        </h3>
        
        {/* Specs */}
        <div style={{
          display: 'flex', gap: '0.75rem',
          fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)',
          marginBottom: '0.85rem', letterSpacing: '0.05em',
        }}>
          <span>{plot.sizeAcres} Acres ({plot.sizePerch} Perches)</span>
          <span>·</span>
          <span>Surveyed: {plot.surveyDate ? plot.surveyDate.split('-')[0] : 'N/A'}</span>
        </div>

        <button
          onClick={e => { e.stopPropagation(); navigate(`/land/${plot.id}`) }}
          style={{
            width: '100%', padding: '0.65rem',
            background: `transparent`,
            border: `1px solid rgba(201,168,76,0.3)`,
            borderRadius: '2px', color: '#C9A84C',
            fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer', fontWeight: 600, transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.8)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
        >
          View Site
        </button>
      </div>
    </div>
  )
}

// ─── Filter label helper ──────────────────────────────────────────────────────
function FilterLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.28)', marginBottom: '0.55rem',
    }}>
      {children}
    </div>
  )
}

// ─── Pill chip ────────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.3rem 0.75rem',
        background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
        border: `1px solid ${active ? '#C9A84C' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '2px', cursor: 'pointer',
        fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        color: active ? '#C9A84C' : 'rgba(255,255,255,0.45)',
        transition: 'all 0.2s', whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
    >
      {label}
    </button>
  )
}

// ─── Input ──────────────────────────────────────────────────────────────
function NumberInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '0.45rem 0.65rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '2px', color: '#fff',
        fontSize: '0.7rem', outline: 'none',
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'border-color 0.2s',
      }}
      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.45)'}
      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
    />
  )
}

// ─── Main LandListingPage ───────────────────────────────────────────────────────────
export default function LandListingPage() {
  const headingRef = useRef(null)
  const gridRef = useRef(null)

  const [plots, setPlots] = useState([])
  const [loading, setLoading] = useState(true)

  const [regionFilter, setRegionFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [minAcres, setMinAcres] = useState('')
  const [maxAcres, setMaxAcres] = useState('')
  const [sort, setSort] = useState('default')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const filters = {
      region: regionFilter !== 'All' ? regionFilter : undefined,
      status: statusFilter !== 'All' ? statusFilter : undefined,
      minAcres: minAcres !== '' ? Number(minAcres) : undefined,
      maxAcres: maxAcres !== '' ? Number(maxAcres) : undefined,
      sort: sort !== 'default' ? sort : undefined,
    }
    const data = await fetchLandPlots(filters)
    setPlots(data)
    setLoading(false)
  }, [regionFilter, statusFilter, minAcres, maxAcres, sort])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!headingRef.current) return
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  const resetFilters = () => {
    setRegionFilter('All')
    setStatusFilter('All')
    setMinAcres('')
    setMaxAcres('')
    setSort('default')
  }

  const hasActiveFilters = regionFilter !== 'All' || statusFilter !== 'All' || minAcres !== '' || maxAcres !== '' || sort !== 'default'

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
      <Navbar visible={true} />

      {/* Page header */}
      <section style={{ background: '#050508', padding: '10rem 6vw 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50vw', height: '50vw',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div ref={headingRef} style={{ maxWidth: '1200px', margin: '0 auto', opacity: 0 }}>
          <span style={{
            display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem',
          }}>
            ◆ Mining & Exploration
          </span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 300, color: '#fff', letterSpacing: '-0.02em',
            marginBottom: '0.75rem', lineHeight: 1.1,
          }}>
            Land Reservations
          </h1>
          <p style={{
            fontSize: 'clamp(0.78rem, 1.2vw, 0.9rem)',
            color: 'rgba(255,255,255,0.38)', maxWidth: 480,
            lineHeight: 1.72, fontWeight: 300,
          }}>
            Exclusive access to prime gem-bearing terrain. View geological surveys, assess yield potential, and reserve sites for mining operations.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <section style={{ background: '#07070A', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 6vw' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                Filters
              </span>
              {hasActiveFilters && (
                <span style={{
                  padding: '0.15rem 0.4rem',
                  background: 'rgba(201,168,76,0.18)',
                  border: '1px solid rgba(201,168,76,0.35)',
                  borderRadius: '2px',
                  fontSize: '0.52rem', letterSpacing: '0.1em', color: '#C9A84C',
                }}>
                  ACTIVE
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  style={{
                    padding: '0.3rem 0.7rem', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2px',
                    color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem',
                    letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setFiltersOpen(v => !v)}
                style={{
                  padding: '0.3rem 0.75rem', background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.3)', borderRadius: '2px',
                  color: '#C9A84C', fontSize: '0.6rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = '#C9A84C' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
              >
                {filtersOpen ? 'Hide' : 'Expand'} ▾
              </button>
            </div>
          </div>

          {/* Region chips — always visible */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingBottom: '0.9rem' }}>
            {REGIONS.map(r => (
              <FilterChip key={r} label={r} active={regionFilter === r} onClick={() => setRegionFilter(r)} />
            ))}
          </div>

          {/* Expanded filters */}
          {filtersOpen && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.25rem', paddingBottom: '1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.1rem',
            }}>
              {/* Status */}
              <div>
                <FilterLabel>Status</FilterLabel>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {STATUSES.map(s => (
                    <FilterChip key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
                  ))}
                </div>
              </div>

              {/* Size Range */}
              <div>
                <FilterLabel>Size Range (Acres)</FilterLabel>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <NumberInput value={minAcres} onChange={setMinAcres} placeholder="Min" />
                  <NumberInput value={maxAcres} onChange={setMaxAcres} placeholder="Max" />
                </div>
              </div>

              {/* Sort */}
              <div>
                <FilterLabel>Sort By</FilterLabel>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {SORT_OPTIONS.map(o => (
                    <FilterChip key={o.value} label={o.label} active={sort === o.value} onClick={() => setSort(o.value)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Catalog grid */}
      <section style={{ background: '#07070A', padding: '4rem 6vw 8rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Result count */}
          {!loading && (
            <div style={{
              fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)', marginBottom: '2rem',
            }}>
              {plots.length} {plots.length === 1 ? 'plot' : 'plots'} found
            </div>
          )}

          {/* Grid */}
          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : plots.length === 0
                ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 0' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.18 }}>◆</div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>
                      No plots match your filters
                    </p>
                    <button
                      onClick={resetFilters}
                      style={{
                        marginTop: '1.5rem', padding: '0.6rem 1.5rem',
                        background: 'transparent', border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: '2px', color: '#C9A84C',
                        fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                        cursor: 'pointer', transition: 'all 0.25s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = '#C9A84C' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
                    >
                      Reset Filters
                    </button>
                  </div>
                )
                : plots.map((plot, i) => <LandPlotCard key={plot.id} plot={plot} index={i} />)
            }
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
