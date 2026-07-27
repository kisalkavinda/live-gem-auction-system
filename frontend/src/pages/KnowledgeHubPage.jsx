import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { fetchArticles, HERITAGE_GALLERY, GLOSSARY_TERMS } from '../data/mockArticles'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Constants ─────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Mining & Origin', 'Buying Guide', 'Certification & Grading']
const QUICK_TAGS = ['River Mining', 'Nambuwa', 'Padparadscha', 'GRS', 'Patal System', 'Unheated Sapphire']

// ─── Skeleton Card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '8px',
      overflow: 'hidden',
      height: 380,
    }}>
      <div style={{
        height: 190,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
        animation: 'shimmer 1.6s infinite',
      }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ height: 12, width: '40%', borderRadius: 3, background: 'rgba(201,168,76,0.2)' }} />
        <div style={{ height: 20, width: '90%', borderRadius: 3, background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ height: 14, width: '75%', borderRadius: 3, background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  )
}

// ─── Article Card Component ────────────────────────────────────────────────
function ArticleCard({ article, index, isBookmarked, onToggleBookmark }) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)
  const imgRef = useRef(null)
  const navigate = useNavigate()
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.fromTo(card,
      { opacity: 0, y: 35 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        delay: (index % 6) * 0.08,
      }
    )

    function onMove(e) {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      
      setCoords({ x, y })
      setHovered(true)

      gsap.to(card, { 
        rotateY: x * 8, 
        rotateX: -y * 8, 
        translateZ: 10, 
        duration: 0.25, 
        ease: 'power2.out', 
        transformPerspective: 800 
      })

      if (imgRef.current) {
        gsap.to(imgRef.current, {
          scale: 1.08,
          x: x * 12,
          y: y * 12,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.5,
          x: x * 25,
          y: y * 25,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    function onLeave() {
      setHovered(false)
      gsap.to(card, { 
        rotateY: 0, 
        rotateX: 0, 
        translateZ: 0, 
        duration: 0.5, 
        ease: 'power3.out' 
      })
      if (imgRef.current) {
        gsap.to(imgRef.current, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'power3.out' })
      }
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 0, x: 0, y: 0, duration: 0.4 })
      }
    }
    
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { 
      card.removeEventListener('mousemove', onMove); 
      card.removeEventListener('mouseleave', onLeave) 
    }
  }, [index])

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        background: hovered ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.01)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered ? '0 25px 50px -20px rgba(201,168,76,0.22)' : '0 10px 30px rgba(0,0,0,0.4)',
      }}
      onClick={() => navigate(`/knowledge-hub/${article.slug}`)}
    >
      {/* Facet Light Shimmer */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${120 + coords.x * 50}deg, transparent 40%, rgba(201,168,76,0.15) 50%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
          zIndex: 2,
        }}
      />

      {/* Radial Glow */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: '-50%',
          background: `radial-gradient(circle at center, rgba(201,168,76,0.18), transparent 65%)`,
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          zIndex: 1,
        }}
      />

      {/* Card Cover Image */}
      <div style={{
        height: 210,
        position: 'relative',
        overflow: 'hidden',
        background: '#09080d',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <img
          ref={imgRef}
          src={article.coverImage}
          alt={article.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: hovered ? 'brightness(0.98) contrast(1.05)' : 'brightness(0.8) contrast(1.1)',
            transition: 'filter 0.4s ease',
          }}
        />

        {/* Category Pill */}
        <div style={{
          position: 'absolute', top: '1rem', left: '1rem',
          padding: '0.35rem 0.75rem',
          background: 'rgba(8,7,12,0.8)',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '100px',
          backdropFilter: 'blur(10px)',
          zIndex: 4,
        }}>
          <span style={{ 
            fontSize: '0.58rem', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase', 
            color: '#C9A84C', 
            fontWeight: 600 
          }}>
            {article.category}
          </span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          style={{
            position: 'absolute', top: '0.85rem', right: '0.85rem',
            width: '34px', height: '34px',
            borderRadius: '50%',
            background: isBookmarked ? 'rgba(201,168,76,0.9)' : 'rgba(8,7,12,0.7)',
            border: `1px solid ${isBookmarked ? '#C9A84C' : 'rgba(255,255,255,0.2)'}`,
            color: isBookmarked ? '#050508' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            zIndex: 5,
          }}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Article'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 3 }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.35rem',
          fontWeight: 400,
          color: hovered ? '#FBE5AB' : '#fff',
          marginBottom: '0.6rem',
          lineHeight: 1.25,
          transition: 'color 0.3s ease'
        }}>
          {article.title}
        </h3>

        <p style={{
          fontSize: '0.82rem',
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.6,
          marginBottom: '1.2rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontWeight: 300,
        }}>
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.2rem' }}>
            {article.tags.map((tag, tIdx) => (
              <span key={tIdx} style={{
                fontSize: '0.55rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.05em'
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Meta */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.8rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <span style={{ color: '#C9A84C', fontWeight: 500 }}>{article.author}</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Knowledge Hub Page Component ─────────────────────────────────────
export default function KnowledgeHubPage() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('gem_hub_bookmarks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Modals & Drawers State
  const [activeGalleryModal, setActiveGalleryModal] = useState(null)
  const [showGlossaryModal, setShowGlossaryModal] = useState(false)
  const [glossarySearch, setGlossarySearch] = useState('')
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})

  const heroRef = useRef(null)

  // Persist Bookmarks
  const toggleBookmark = useCallback((articleId) => {
    setBookmarks(prev => {
      const updated = prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
      localStorage.setItem('gem_hub_bookmarks', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Load articles
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchArticles({ category: activeCategory, search: searchQuery })
      setArticles(data)
      setLoading(false)
    }
    loadData()
  }, [activeCategory, searchQuery])

  // GSAP Entrance
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      )
    }
  }, [])

  // Filtered Articles based on Tag and Bookmarks
  const displayedArticles = articles.filter(art => {
    if (showBookmarksOnly && !bookmarks.includes(art.id)) return false
    if (selectedTag && (!art.tags || !art.tags.includes(selectedTag))) return false
    return true
  })

  const featuredArticle = articles.find(a => a.featured) || articles[0]

  // Glossary Filtered
  const filteredGlossary = GLOSSARY_TERMS.filter(g => 
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.category.toLowerCase().includes(glossarySearch.toLowerCase())
  )

  // Quiz Options
  const QUIZ_QUESTIONS = [
    {
      question: "What is your primary gemstone interest?",
      options: [
        { label: "High-value Investment Rough", category: "Mining & Origin" },
        { label: "Crown Jewel Blue & Padparadscha Sapphires", category: "Buying Guide" },
        { label: "Independent Certification & Lab Security", category: "Certification & Grading" }
      ]
    },
    {
      question: "Which aspect of gemstone creation fascinates you most?",
      options: [
        { label: "Traditional River Washing ('Dulliya') & Bamboo Sieves", tag: "River Mining" },
        { label: "Natural Unheated Silk Inclusions & GRS Reports", tag: "GRS" },
        { label: "Ethical Mine Pit Partnerships ('Patal Karu')", tag: "Patal System" }
      ]
    }
  ]

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
      <Navbar visible={true} />

      {/* Hero Header */}
      <section ref={heroRef} style={{
        padding: '10rem 6vw 4rem',
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, rgba(5,5,8,1) 75%)',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Decorative Ambient Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(201,168,76,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.2, pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.4rem 1rem', background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)', borderRadius: '100px',
            fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#C9A84C', marginBottom: '1.8rem'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', boxShadow: '0 0 10px #C9A84C' }} />
            <span>Sri Lankan Gemology & Field Heritage</span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '1.2rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #E8D5A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Knowledge Hub & Field Archives
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            fontWeight: 300,
            marginBottom: '2.5rem',
            maxWidth: '680px',
            margin: '0 auto 2.5rem'
          }}>
            Explore authentic photos and deep research into traditional Ceylon gem mining, river gravel sifting (<em>Dulliya</em>), bamboo <em>Nambuwa</em> sorting, gemstone valuation, and GRS/GIA grading certification.
          </p>

          {/* Search & Quick Controls */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '1rem',
            alignItems: 'center', justifyContent: 'center',
            maxWidth: '640px', margin: '0 auto'
          }}>
            <div style={{
              width: '100%', position: 'relative', display: 'flex', alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search articles, mining tools (Nambuwa, Dulliya), sapphires, GRS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.4rem 1.1rem 3.2rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '100px',
                  color: '#fff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.3)'}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"
                style={{ position: 'absolute', left: '1.2rem', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: '1.2rem', background: 'transparent',
                    border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Action Badges */}
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => setShowGlossaryModal(true)}
                style={{
                  padding: '0.5rem 1rem', background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.4)', borderRadius: '100px',
                  color: '#C9A84C', fontSize: '0.75rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
              >
                📖 Ceylon Gemology Glossary
              </button>

              <button
                onClick={() => setShowQuizModal(true)}
                style={{
                  padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px',
                  color: '#fff', fontSize: '0.75rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                ✨ Gem Buying Assistant Quiz
              </button>
            </div>
          </div>
        </div>
      </section>

      <main style={{ padding: '4rem 6vw 8rem' }}>
        
        {/* ─── AUTHENTIC HERITAGE GALLERY SHOWCASE SECTION ─── */}
        <section style={{ marginBottom: '6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem' }}>
                Field Photographs & Mining Traditions
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, color: '#fff' }}>
                Authentic Ceylon Mining Heritage
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', margin: 0, lineHeight: 1.6 }}>
              Rare documentation of traditional Sri Lankan gem prospectors operating in river beds, pit shafts, and gravel sifting sites.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {HERITAGE_GALLERY.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveGalleryModal(item)}
                style={{
                  position: 'relative',
                  height: '340px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  transition: 'transform 0.4s ease, border-color 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'brightness(0.78) contrast(1.1)',
                    transition: 'scale 0.5s ease',
                  }}
                />
                
                {/* Dark Gradient Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(5,5,8,0.1) 0%, rgba(5,5,8,0.95) 90%)'
                }} />

                {/* Badge */}
                <div style={{
                  position: 'absolute', top: '1rem', left: '1rem',
                  padding: '0.3rem 0.6rem', background: 'rgba(201,168,76,0.2)',
                  border: '1px solid rgba(201,168,76,0.5)', borderRadius: '4px',
                  fontSize: '0.58rem', textTransform: 'uppercase', color: '#E8D5A3',
                  letterSpacing: '0.1em', backdropFilter: 'blur(8px)'
                }}>
                  {item.era}
                </div>

                {/* Info Text */}
                <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', right: '1.2rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.3rem' }}>
                    📍 {item.location}
                  </span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.35rem', fontWeight: 400, color: '#fff', marginBottom: '0.4rem', lineHeight: 1.2 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.8rem', color: '#C9A84C', fontSize: '0.7rem', fontWeight: 500 }}>
                    <span>Inspect Photo Archive</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FEATURED SPOTLIGHT ARTICLE ─── */}
        {featuredArticle && !searchQuery && activeCategory === 'All' && !showBookmarksOnly && (
          <section style={{ marginBottom: '6rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(15,14,20,0.9) 100%)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              position: 'relative'
            }}>
              <div style={{ padding: '3rem 3vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.6rem', background: '#C9A84C', color: '#050508', fontSize: '0.58rem', fontWeight: 700, borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    FEATURED STORY
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                    {featuredArticle.readTime}
                  </span>
                </div>

                <h2 
                  onClick={() => navigate(`/knowledge-hub/${featuredArticle.slug}`)}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                    fontWeight: 300,
                    color: '#fff',
                    marginBottom: '1rem',
                    lineHeight: 1.15,
                    cursor: 'pointer',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E8D5A3'}
                  onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                >
                  {featuredArticle.title}
                </h2>

                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
                  {featuredArticle.excerpt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate(`/knowledge-hub/${featuredArticle.slug}`)}
                    style={{
                      padding: '0.85rem 1.8rem', background: '#C9A84C', color: '#050508',
                      border: 'none', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                      transition: 'transform 0.2s, background 0.2s', boxShadow: '0 6px 20px rgba(201,168,76,0.3)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Read Full Story →
                  </button>

                  <button
                    onClick={() => toggleBookmark(featuredArticle.id)}
                    style={{
                      background: 'transparent', border: 'none', color: bookmarks.includes(featuredArticle.id) ? '#C9A84C' : 'rgba(255,255,255,0.6)',
                      fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarks.includes(featuredArticle.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{bookmarks.includes(featuredArticle.id) ? 'Bookmarked' : 'Save for Later'}</span>
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative', minHeight: '320px', overflow: 'hidden' }}>
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) contrast(1.05)' }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ─── CATEGORY & FILTER CONTROLS ─── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setShowBookmarksOnly(false);
                }}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: activeCategory === cat && !showBookmarksOnly ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${activeCategory === cat && !showBookmarksOnly ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '100px',
                  color: activeCategory === cat && !showBookmarksOnly ? '#C9A84C' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontWeight: activeCategory === cat ? 500 : 400,
                }}
              >
                {cat}
              </button>
            ))}

            {/* Saved Bookmarks Tab */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              style={{
                padding: '0.6rem 1.2rem',
                background: showBookmarksOnly ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${showBookmarksOnly ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '100px',
                color: showBookmarksOnly ? '#C9A84C' : 'rgba(255,255,255,0.6)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <span>🔖 Bookmarks</span>
              <span style={{
                background: 'rgba(201,168,76,0.3)', padding: '0.1rem 0.4rem',
                borderRadius: '100px', fontSize: '0.65rem', color: '#fff'
              }}>
                {bookmarks.length}
              </span>
            </button>
          </div>

          {/* Quick Tag Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginRight: '0.3rem' }}>Tags:</span>
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                style={{
                  fontSize: '0.65rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '4px',
                  background: selectedTag === tag ? '#C9A84C' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedTag === tag ? '#C9A84C' : 'rgba(255,255,255,0.08)'}`,
                  color: selectedTag === tag ? '#050508' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                #{tag}
              </button>
            ))}

            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                style={{ fontSize: '0.65rem', color: '#C9A84C', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear Tag
              </button>
            )}
          </div>
        </div>

        {/* ─── ARTICLES GRID ─── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.8rem' }}>
            {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
          </div>
        ) : displayedArticles.length === 0 ? (
          <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
              No Articles Found
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              We couldn't find any articles matching your selected search query or category filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setSelectedTag(null);
                setShowBookmarksOnly(false);
              }}
              style={{
                padding: '0.6rem 1.4rem', background: '#C9A84C', color: '#050508',
                border: 'none', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.8rem' }}>
            {displayedArticles.map((art, idx) => (
              <ArticleCard
                key={art.id}
                article={art}
                index={idx}
                isBookmarked={bookmarks.includes(art.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {/* ─── HERITAGE PHOTO LIGHTBOX MODAL ─── */}
      {activeGalleryModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }} onClick={() => setActiveGalleryModal(null)}>
          <div 
            style={{
              maxWidth: '900px', width: '100%', background: '#0e0d14',
              border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px',
              overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveGalleryModal(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>

            <div style={{ height: '100%', minHeight: '360px', position: 'relative', background: '#000' }}>
              <img
                src={activeGalleryModal.image}
                alt={activeGalleryModal.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                📍 {activeGalleryModal.location}
              </span>
              
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, color: '#fff', marginBottom: '1rem', lineHeight: 1.15 }}>
                {activeGalleryModal.title}
              </h2>

              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '1.5rem', fontWeight: 300 }}>
                {activeGalleryModal.description}
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.2rem' }}>Technique:</div>
                <div style={{ fontSize: '0.85rem', color: '#E8D5A3', fontWeight: 500 }}>{activeGalleryModal.technique}</div>
              </div>

              <button
                onClick={() => {
                  const slug = activeGalleryModal.relatedSlug;
                  setActiveGalleryModal(null);
                  navigate(`/knowledge-hub/${slug}`);
                }}
                style={{
                  padding: '0.85rem 1.5rem', background: '#C9A84C', color: '#050508',
                  border: 'none', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase'
                }}
              >
                Read Dedicated Heritage Article →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CEYLON GEMOLOGY GLOSSARY MODAL ─── */}
      {showGlossaryModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }} onClick={() => setShowGlossaryModal(false)}>
          <div
            style={{
              maxWidth: '750px', width: '100%', maxHeight: '85vh', background: '#0e0d14',
              border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '1.8rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#fff', margin: 0 }}>
                  Ceylon Gemology Glossary & Encyclopedia
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '0.3rem 0 0' }}>
                  Definitions of traditional Sinhalese mining terms, tools, and gemological standards.
                </p>
              </div>
              <button onClick={() => setShowGlossaryModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Glossary Search */}
            <div style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <input
                type="text"
                placeholder="Filter terms (e.g. Illam, Nambuwa, Padparadscha)..."
                value={glossarySearch}
                onChange={e => setGlossarySearch(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px', color: '#fff', outline: 'none'
                }}
              />
            </div>

            <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredGlossary.map((g, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#C9A84C', margin: 0 }}>
                      {g.term} <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', fontWeight: 400 }}>[{g.pronunciation}]</span>
                    </h3>
                    <span style={{ fontSize: '0.62rem', padding: '0.2rem 0.5rem', background: 'rgba(201,168,76,0.1)', color: '#E8D5A3', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {g.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6, fontWeight: 300 }}>
                    {g.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── GEM BUYER ASSISTANT QUIZ MODAL ─── */}
      {showQuizModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }} onClick={() => setShowQuizModal(false)}>
          <div
            style={{
              maxWidth: '550px', width: '100%', background: '#0e0d14',
              border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px',
              padding: '2.5rem', boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowQuizModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            {quizStep < QUIZ_QUESTIONS.length ? (
              <div>
                <span style={{ fontSize: '0.65rem', color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Question {quizStep + 1} of {QUIZ_QUESTIONS.length}
                </span>

                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem' }}>
                  {QUIZ_QUESTIONS[quizStep].question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {QUIZ_QUESTIONS[quizStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        if (opt.category) setActiveCategory(opt.category);
                        if (opt.tag) setSelectedTag(opt.tag);
                        if (quizStep + 1 < QUIZ_QUESTIONS.length) {
                          setQuizStep(quizStep + 1);
                        } else {
                          setShowQuizModal(false);
                          setQuizStep(0);
                        }
                      }}
                      style={{
                        padding: '1rem 1.2rem', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                        color: '#fff', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
