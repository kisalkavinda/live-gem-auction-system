import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { fetchArticles } from '../data/mockArticles'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Constants & Helpers ────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Gem History', 'Buying Guide', 'Certification & Grading', 'Mining & Origin']

// ─── Skeleton card ───────────────────────────────────────────────────────────
function SkeletonCard({ spanTwo = false }) {
  return (
    <div style={{
      gridColumn: spanTwo ? '1 / -1' : 'auto',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '4px',
      overflow: 'hidden',
    }}>
      <div style={{
        height: spanTwo ? 320 : 180,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)',
        animation: 'shimmer 1.6s infinite',
      }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {[60, 80, 45].map((w, i) => (
          <div key={i} style={{
            height: 10, width: `${w}%`, borderRadius: 2, background: 'rgba(255,255,255,0.05)',
            animation: 'shimmer 1.6s infinite', animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ─── Article card ────────────────────────────────────────────────────────────────
function ArticleCard({ article, index, spanTwo = false }) {
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
      if (spanTwo) return; // Disable heavy 3D on featured full-width cards
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, translateZ: 12, duration: 0.25, ease: 'power2.out', transformPerspective: 800 })
    }
    function onLeave() {
      if (spanTwo) return;
      gsap.to(card, { rotateY: 0, rotateX: 0, translateZ: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    }
    
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { 
      card.removeEventListener('mousemove', onMove); 
      card.removeEventListener('mouseleave', onLeave) 
    }
  }, [index, spanTwo])

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/knowledge-hub/${article.slug}`)}
      style={{
        gridColumn: spanTwo ? '1 / -1' : 'auto',
        opacity: 0,
        position: 'relative',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        transition: 'border-color 0.3s, transform 0.3s',
        display: spanTwo ? 'flex' : 'block',
        flexDirection: spanTwo ? 'row' : 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `rgba(201,168,76,0.6)`
        if (spanTwo) e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        if (spanTwo) e.currentTarget.style.transform = 'none'
      }}
    >
      {/* Visual */}
      <div style={{
        height: spanTwo ? 'auto' : 180,
        flex: spanTwo ? '1 1 50%' : 'none',
        background: `rgba(201,168,76,0.05)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        borderBottom: spanTwo ? 'none' : `1px solid rgba(255,255,255,0.1)`,
        borderRight: spanTwo ? `1px solid rgba(255,255,255,0.1)` : 'none',
      }}>
        <img
          src={article.coverImage}
          alt={article.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0, left: 0,
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '1rem', left: '1rem',
          padding: '0.3rem 0.6rem',
          background: `rgba(0,0,0,0.7)`,
          border: `1px solid rgba(201,168,76,0.5)`,
          borderRadius: '2px',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C' }}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ 
        padding: spanTwo ? '3rem' : '1.25rem', 
        flex: spanTwo ? '1 1 50%' : 'none',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: spanTwo ? '2rem' : '1.25rem', 
          fontWeight: 400, color: '#fff',
          marginBottom: '0.75rem', lineHeight: 1.25,
        }}>
          {article.title}
        </h3>
        
        <p style={{
          fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)',
          marginBottom: '1.25rem', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: spanTwo ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {article.excerpt}
        </p>

        <div style={{
          display: 'flex', gap: '0.75rem', alignItems: 'center',
          fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.05em', marginTop: spanTwo ? 'auto' : 0
        }}>
          <span>{article.readTime}</span>
          <span>·</span>
          <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}


// ─── Main KnowledgeHubPage ───────────────────────────────────────────────────────────
export default function KnowledgeHubPage() {
  const headingRef = useRef(null)
  const gridRef = useRef(null)

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('All')

  const load = useCallback(async () => {
    setLoading(true)
    const filters = {
      category: categoryFilter !== 'All' ? categoryFilter : undefined,
    }
    const data = await fetchArticles(filters)
    setArticles(data)
    setLoading(false)
  }, [categoryFilter])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!headingRef.current) return
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
  }, [])

  const featuredArticle = categoryFilter === 'All' ? articles.find(a => a.featured) : null
  const standardArticles = featuredArticle ? articles.filter(a => a.id !== featuredArticle.id) : articles

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
      <Navbar visible={true} />

      {/* Page header */}
      <section style={{ background: '#050508', padding: '10rem 6vw 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40vw', height: '40vw',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div ref={headingRef} style={{ maxWidth: '1200px', margin: '0 auto', opacity: 0 }}>
          <span style={{
            display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem',
          }}>
            ◆ Knowledge Hub
          </span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 300, color: '#fff', letterSpacing: '-0.02em',
            marginBottom: '0.75rem', lineHeight: 1.1,
          }}>
            Understanding Gems
          </h1>
          <p style={{
            fontSize: 'clamp(0.78rem, 1.2vw, 0.9rem)',
            color: 'rgba(255,255,255,0.38)', maxWidth: 480,
            lineHeight: 1.72, fontWeight: 300,
          }}>
            Educating buyers and building trust. Explore our comprehensive guides on gemology, history, and market investments.
          </p>
        </div>
      </section>

      {/* Category filter bar */}
      <section style={{ background: '#07070A', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 6vw' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', padding: '1.25rem 0', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {CATEGORIES.map(cat => {
              const active = categoryFilter === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    background: 'transparent', border: 'none', padding: 0,
                    fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: active ? '#C9A84C' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer', whiteSpace: 'nowrap', position: 'relative',
                    transition: 'color 0.2s', fontWeight: active ? 600 : 400
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
                >
                  {cat}
                  {active && (
                    <div style={{
                      position: 'absolute', bottom: '-1.3rem', left: 0, right: 0,
                      height: '2px', background: '#C9A84C'
                    }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Catalog grid */}
      <section style={{ background: '#07070A', padding: '4rem 6vw 8rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {loading ? (
              <>
                {categoryFilter === 'All' && <SkeletonCard spanTwo={true} />}
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </>
            ) : articles.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.18 }}>◆</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>
                  No articles found for this category
                </p>
              </div>
            ) : (
              <>
                {featuredArticle && (
                  <ArticleCard key={featuredArticle.id} article={featuredArticle} index={0} spanTwo={true} />
                )}
                {standardArticles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={featuredArticle ? i + 1 : i} />
                ))}
              </>
            )}
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
