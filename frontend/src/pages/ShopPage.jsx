import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { fetchGems } from '../services/gemService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Gem type filter options ────────────────────────────────────────────────
const GEM_TYPES = [
  'All',
  'Ruby',
  'Sapphire',
  'Emerald',
  'Alexandrite',
  'Tourmaline',
  'Garnet',
  'Spinel',
  'Topaz',
]

const CLARITY_GRADES = [
  'All',
  'IF',
  'VVS1',
  'VVS2',
  'VS1',
  'VS2',
  'SI1',
  'SI2',
]

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
]

const LKR = (n) => 'LKR ' + Number(n || 0).toLocaleString('en-LK')

// ─── Skeleton Card ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 180,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.6s infinite',
        }}
      />

      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        {[60, 80, 45].map((w, i) => (
          <div
            key={i}
            style={{
              height: 10,
              width: `${w}%`,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.05)',
              animation: 'shimmer 1.6s infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Gem Card ───────────────────────────────────────────────────────────────
function GemCard({ gem, index }) {
  const cardRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: (index % 6) * 0.08,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    function onMove(e) {
      const rect = card.getBoundingClientRect()

      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to(card, {
        rotateY: x * 12,
        rotateX: -y * 12,
        translateZ: 16,
        duration: 0.25,
        ease: 'power2.out',
        transformPerspective: 700,
      })
    }

    function onLeave() {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        translateZ: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)

    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [index])

  const openDetails = () => {
    navigate(`/shop/${gem.id}`)
  }

  return (
    <div
      ref={cardRef}
      onClick={openDetails}
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
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${gem.color}60`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor =
          'rgba(255,255,255,0.07)'
      }}
    >
      {/* ───────── Gem Visual ───────── */}
      <div
        style={{
          height: 180,
          background: `radial-gradient(ellipse at 38% 38%, ${gem.color}35, rgba(5,5,8,0.92))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: `1px solid ${gem.color}20`,
        }}
      >
        {/* Gem Image */}
        {gem.imageUrl ? (
          <img
            src={gem.imageUrl}
            alt={gem.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 76,
              height: 76,
              background: `linear-gradient(135deg, ${gem.color}CC, ${gem.color}44)`,
              clipPath:
                'polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)',
              boxShadow: `0 0 36px ${gem.color}55, inset 0 0 18px rgba(255,255,255,0.1)`,
              animation: 'gemFloat 3s ease-in-out infinite',
              animationDelay: `${index * 0.4}s`,
            }}
          />
        )}

        {/* Type Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            padding: '0.25rem 0.55rem',
            background: `${gem.color}18`,
            border: `1px solid ${gem.color}40`,
            borderRadius: '2px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: gem.color,
            }}
          >
            {gem.type}
          </span>
        </div>

        {/* Certification Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            padding: '0.25rem 0.45rem',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '2px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.1em',
              color: '#C9A84C',
            }}
          >
            {gem.certAuthority}
          </span>
        </div>
      </div>

      {/* ───────── Gem Information ───────── */}
      <div style={{ padding: '1.25rem' }}>
        {/* Colour */}
        <div
          style={{
            fontSize: '0.58rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: gem.color,
            marginBottom: '0.35rem',
          }}
        >
          {gem.colorName}
        </div>

        {/* Name */}
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.15rem',
            fontWeight: 400,
            color: '#fff',
            marginBottom: '0.4rem',
            lineHeight: 1.25,
          }}
        >
          {gem.name}
        </h3>

        {/* Basic Specifications */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '0.85rem',
            letterSpacing: '0.05em',
            flexWrap: 'wrap',
          }}
        >
          <span>{gem.caratWeight} ct</span>
          <span>·</span>
          <span>{gem.cut} Cut</span>
          <span>·</span>
          <span>{gem.clarity}</span>
        </div>

        {/* Price */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.15rem',
              }}
            >
              Price
            </div>

            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.3rem',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              {LKR(gem.price)}
            </div>
          </div>

          <div
            style={{
              fontSize: '0.58rem',
              color: 'rgba(255,255,255,0.22)',
              letterSpacing: '0.06em',
            }}
          >
            #{gem.certNumber?.split('-').pop() || gem.id}
          </div>
        </div>

        {/* ───────── ONLY VIEW DETAILS BUTTON ───────── */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/shop/${gem.id}`)
          }}
          style={{
            width: '100%',
            padding: '0.65rem',
            background: `linear-gradient(135deg, ${gem.color}CC, ${gem.color}77)`,
            border: `1px solid ${gem.color}55`,
            borderRadius: '2px',
            color: '#fff',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'opacity 0.25s, transform 0.25s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.75'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          View Details
        </button>
      </div>
    </div>
  )
}

// ─── Filter Label ───────────────────────────────────────────────────────────
function FilterLabel({ children }) {
  return (
    <div
      style={{
        fontSize: '0.58rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.28)',
        marginBottom: '0.55rem',
      }}
    >
      {children}
    </div>
  )
}

// ─── Filter Chip ────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.3rem 0.75rem',
        background: active
          ? 'rgba(201,168,76,0.15)'
          : 'transparent',
        border: `1px solid ${
          active ? '#C9A84C' : 'rgba(255,255,255,0.1)'
        }`,
        borderRadius: '2px',
        cursor: 'pointer',
        fontSize: '0.62rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: active
          ? '#C9A84C'
          : 'rgba(255,255,255,0.45)',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor =
            'rgba(201,168,76,0.4)'
          e.currentTarget.style.color =
            'rgba(255,255,255,0.7)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor =
            'rgba(255,255,255,0.1)'
          e.currentTarget.style.color =
            'rgba(255,255,255,0.45)'
        }
      }}
    >
      {label}
    </button>
  )
}

// ─── Price Input ────────────────────────────────────────────────────────────
function PriceInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      min="0"
      style={{
        width: '100%',
        padding: '0.45rem 0.65rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '2px',
        color: '#fff',
        fontSize: '0.7rem',
        outline: 'none',
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => {
        e.target.style.borderColor =
          'rgba(201,168,76,0.45)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor =
          'rgba(255,255,255,0.1)'
      }}
    />
  )
}

// ─── Main Shop Page ────────────────────────────────────────────────────────
export default function ShopPage() {
  const headingRef = useRef(null)
  const gridRef = useRef(null)

  const [gems, setGems] = useState([])
  const [loading, setLoading] = useState(true)

  const [typeFilter, setTypeFilter] = useState('All')
  const [clarityFilter, setClarityFilter] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('default')
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ─── Load Gems ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)

    const filters = {
      type:
        typeFilter !== 'All'
          ? typeFilter
          : undefined,

      clarity:
        clarityFilter !== 'All'
          ? clarityFilter
          : undefined,

      minPrice:
        minPrice !== ''
          ? Number(minPrice)
          : undefined,

      maxPrice:
        maxPrice !== ''
          ? Number(maxPrice)
          : undefined,

      sort:
        sort !== 'default'
          ? sort
          : undefined,
    }

    const data = await fetchGems(filters)

    setGems(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [
    typeFilter,
    clarityFilter,
    minPrice,
    maxPrice,
    sort,
  ])

  useEffect(() => {
    load()
  }, [load])

  // ─── Heading Animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (!headingRef.current) return

    gsap.fromTo(
      headingRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      }
    )
  }, [])

  // ─── Reset Filters ─────────────────────────────────────────────────────
  const resetFilters = () => {
    setTypeFilter('All')
    setClarityFilter('All')
    setMinPrice('')
    setMaxPrice('')
    setSort('default')
  }

  const hasActiveFilters =
    typeFilter !== 'All' ||
    clarityFilter !== 'All' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sort !== 'default'

  return (
    <div
      style={{
        background: '#050508',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <Navbar visible={true} />

      {/* ═══════════════════════════════════════════════════════════════════
          PAGE HEADER
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: '#050508',
          padding: '10rem 6vw 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50vw',
            height: '50vw',
            background:
              'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div
          ref={headingRef}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            opacity: 0,
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              marginBottom: '0.75rem',
            }}
          >
            ◆ Certified Collection
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 300,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
              lineHeight: 1.1,
            }}
          >
            The Gem Catalogue
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.78rem, 1.2vw, 0.9rem)',
              color: 'rgba(255,255,255,0.38)',
              maxWidth: 480,
              lineHeight: 1.72,
              fontWeight: 300,
            }}
          >
            Every stone is GIA, GRS, or SSEF certified. Full
            geological provenance, no reserve surprises,
            conflict-free.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FILTERS BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: '#07070A',
          borderTop:
            '1px solid rgba(255,255,255,0.05)',
          borderBottom:
            '1px solid rgba(255,255,255,0.05)',
          padding: '0 6vw',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Filter Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                Filters
              </span>

              {hasActiveFilters && (
                <span
                  style={{
                    padding: '0.15rem 0.4rem',
                    background:
                      'rgba(201,168,76,0.18)',
                    border:
                      '1px solid rgba(201,168,76,0.35)',
                    borderRadius: '2px',
                    fontSize: '0.52rem',
                    letterSpacing: '0.1em',
                    color: '#C9A84C',
                  }}
                >
                  ACTIVE
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  style={{
                    padding: '0.3rem 0.7rem',
                    background: 'transparent',
                    border:
                      '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    color:
                      'rgba(255,255,255,0.35)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.3)'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color =
                      'rgba(255,255,255,0.35)'
                  }}
                >
                  Clear All
                </button>
              )}

              <button
                onClick={() =>
                  setFiltersOpen((v) => !v)
                }
                style={{
                  padding: '0.3rem 0.75rem',
                  background: 'transparent',
                  border:
                    '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '2px',
                  color: '#C9A84C',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'rgba(201,168,76,0.08)'
                  e.currentTarget.style.borderColor =
                    '#C9A84C'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'transparent'
                  e.currentTarget.style.borderColor =
                    'rgba(201,168,76,0.3)'
                }}
              >
                {filtersOpen ? 'Hide' : 'Expand'} ▾
              </button>
            </div>
          </div>

          {/* Gem Type Chips */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              paddingBottom: '0.9rem',
            }}
          >
            {GEM_TYPES.map((type) => (
              <FilterChip
                key={type}
                label={type}
                active={typeFilter === type}
                onClick={() =>
                  setTypeFilter(type)
                }
              />
            ))}
          </div>

          {/* Expanded Filters */}
          {filtersOpen && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.25rem',
                paddingBottom: '1.25rem',
                borderTop:
                  '1px solid rgba(255,255,255,0.05)',
                paddingTop: '1.1rem',
              }}
            >
              {/* Clarity */}
              <div>
                <FilterLabel>
                  Clarity
                </FilterLabel>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.4rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {CLARITY_GRADES.map((grade) => (
                    <FilterChip
                      key={grade}
                      label={grade}
                      active={
                        clarityFilter === grade
                      }
                      onClick={() =>
                        setClarityFilter(grade)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <FilterLabel>
                  Price Range (LKR)
                </FilterLabel>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                  }}
                >
                  <PriceInput
                    value={minPrice}
                    onChange={setMinPrice}
                    placeholder="Min"
                  />

                  <PriceInput
                    value={maxPrice}
                    onChange={setMaxPrice}
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <FilterLabel>
                  Sort By
                </FilterLabel>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.4rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <FilterChip
                      key={option.value}
                      label={option.label}
                      active={
                        sort === option.value
                      }
                      onClick={() =>
                        setSort(option.value)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CATALOGUE GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: '#07070A',
          padding: '4rem 6vw 8rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Result Count */}
          {!loading && (
            <div
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:
                  'rgba(255,255,255,0.25)',
                marginBottom: '2rem',
              }}
            >
              {gems.length}{' '}
              {gems.length === 1
                ? 'stone'
                : 'stones'}{' '}
              found
            </div>
          )}

          {/* Grid */}
          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Loading */}
            {loading ? (
              Array.from({ length: 8 }).map(
                (_, i) => (
                  <SkeletonCard key={i} />
                )
              )
            ) : gems.length === 0 ? (
              /* No Results */
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '6rem 0',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    opacity: 0.18,
                  }}
                >
                  ◆
                </div>

                <p
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', serif",
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    color:
                      'rgba(255,255,255,0.3)',
                  }}
                >
                  No stones match your filters
                </p>

                <button
                  onClick={resetFilters}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.6rem 1.5rem',
                    background: 'transparent',
                    border:
                      '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '2px',
                    color: '#C9A84C',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(201,168,76,0.08)'
                    e.currentTarget.style.borderColor =
                      '#C9A84C'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'transparent'
                    e.currentTarget.style.borderColor =
                      'rgba(201,168,76,0.3)'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Gems */
              gems.map((gem, index) => (
                <GemCard
                  key={gem.id}
                  gem={gem}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* ───────── Animations ───────── */}
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }

        @keyframes gemFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }

          50% {
            transform: translateY(-8px) rotate(4deg);
          }
        }

        @media (max-width: 760px) {
          section {
            padding-left: 5vw !important;
            padding-right: 5vw !important;
          }
        }
      `}</style>
    </div>
  )
}