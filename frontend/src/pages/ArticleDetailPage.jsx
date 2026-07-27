import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { fetchArticleBySlug, fetchArticles } from '../data/mockArticles'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Related Article Card Component ─────────────────────────────────────────
function RelatedArticleCard({ article, index }) {
  const cardRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        delay: (index % 3) * 0.1,
      }
    )
  }, [index])

  return (
    <div
      ref={cardRef}
      onClick={() => {
        window.scrollTo(0, 0);
        navigate(`/knowledge-hub/${article.slug}`);
      }}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ height: 170, background: '#09080d', position: 'relative', overflow: 'hidden' }}>
        <img
          src={article.coverImage}
          alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) contrast(1.1)' }}
        />
        <div style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          padding: '0.25rem 0.6rem', background: 'rgba(8,7,12,0.8)',
          border: '1px solid rgba(201,168,76,0.5)', borderRadius: '4px', backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', fontWeight: 600 }}>
            {article.category}
          </span>
        </div>
      </div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h4 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', 
          fontWeight: 400, color: '#fff', marginBottom: '0.5rem', lineHeight: 1.25,
        }}>
          {article.title}
        </h4>
        <p style={{
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 300
        }}>
          {article.excerpt}
        </p>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: 'auto', paddingTop: '0.8rem',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <span style={{ color: '#C9A84C' }}>{article.author}</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Article Detail Page Component ─────────────────────────────────────
export default function ArticleDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [lightboxImage, setLightboxImage] = useState(null)

  // Audio player simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)

  const contentRef = useRef(null)

  // Load article details
  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchArticleBySlug(slug)
      if (data) {
        setArticle(data)
        const allArticles = await fetchArticles()
        let rel = allArticles.filter(a => a.id !== data.id && a.category === data.category)
        if (rel.length < 3) {
          rel = [...rel, ...allArticles.filter(a => a.id !== data.id && a.category !== data.category)]
        }
        setRelated(rel.slice(0, 3))
      }
      setLoading(false)
    }
    load()
  }, [slug])

  // Scroll Progress listener
  useEffect(() => {
    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100
        setScrollProgress(currentProgress)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Audio simulation timer
  useEffect(() => {
    let timer;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 400);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio])

  // GSAP Fade In
  useEffect(() => {
    if (!loading && article && contentRef.current) {
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [loading, article])

  if (loading) {
    return (
      <div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#C9A84C', letterSpacing: '0.2em', fontSize: '0.8rem', textTransform: 'uppercase' }}>
          Loading Field Documentation...
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
        <Navbar visible={true} />
        <div style={{ padding: '12rem 6vw', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', marginBottom: '1rem' }}>Article Not Found</h1>
          <button onClick={() => navigate('/knowledge-hub')} style={{ background: 'transparent', color: '#C9A84C', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ← Return to Knowledge Hub
          </button>
        </div>
      </div>
    )
  }

  // Extract headings for Table of Contents
  const headings = article.content.filter(b => b.type === 'heading')

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff', overflowX: 'hidden' }}>
      {/* Top Scroll Reading Progress Bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '3px',
        width: `${scrollProgress}%`, background: 'linear-gradient(90deg, #C9A84C 0%, #FBE5AB 100%)',
        zIndex: 1001, transition: 'width 0.1s linear', boxShadow: '0 0 10px #C9A84C'
      }} />

      <Navbar visible={true} />

      <main style={{ padding: '9rem 6vw 8rem' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ maxWidth: '1000px', margin: '0 auto 2.5rem' }}>
          <button
            onClick={() => navigate('/knowledge-hub')}
            style={{
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
              fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              transition: 'color 0.2s', padding: 0
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <span>←</span> Back to Knowledge Hub & Field Archives
          </button>
        </div>

        {/* Article Header Container */}
        <header style={{ maxWidth: '900px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', padding: '0.35rem 0.8rem',
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '100px', fontSize: '0.62rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1.5rem', fontWeight: 600
          }}>
            {article.category}
          </div>
          
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 300, color: '#fff', letterSpacing: '-0.02em',
            marginBottom: '1.5rem', lineHeight: 1.12,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #E8D5A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {article.title}
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontWeight: 300, maxWidth: '720px', margin: '0 auto 2rem' }}>
            {article.excerpt}
          </p>
          
          {/* Author & Meta Bar */}
          <div style={{
            display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)',
            borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '1rem 0', flexWrap: 'wrap'
          }}>
            <div>
              <span style={{ color: '#C9A84C', fontWeight: 600 }}>{article.author}</span>
              {article.authorRole && <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '0.4rem' }}>({article.authorRole})</span>}
            </div>
            <span>•</span>
            <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          {/* Interactive Audio Narration Widget */}
          <div style={{
            marginTop: '1.8rem', display: 'inline-flex', alignItems: 'center', gap: '1rem',
            padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,168,76,0.3)', borderRadius: '100px',
            backdropFilter: 'blur(10px)'
          }}>
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              style={{
                width: '32px', height: '32px', borderRadius: '50%', background: '#C9A84C',
                border: 'none', color: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold'
              }}
            >
              {isPlayingAudio ? '❚❚' : '▶'}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', textAlign: 'left' }}>
              <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 500 }}>
                {isPlayingAudio ? 'Playing Field Audio Briefing...' : 'Listen to Audio Summary (AI Voice)'}
              </span>
              {isPlayingAudio && (
                <div style={{ width: '140px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${audioProgress}%`, height: '100%', background: '#C9A84C' }} />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div 
          onClick={() => setLightboxImage(article.coverImage)}
          style={{
            maxWidth: '1000px', margin: '0 auto 4rem',
            aspectRatio: '16/9', background: '#09080d',
            borderRadius: '12px', overflow: 'hidden',
            border: '1px solid rgba(201,168,76,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            cursor: 'zoom-in', position: 'relative'
          }}
        >
          <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', bottom: '1rem', right: '1rem',
            padding: '0.4rem 0.8rem', background: 'rgba(5,5,8,0.8)',
            borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.68rem', color: '#fff', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}>
            <span>🔍 Click to expand high-res photo</span>
          </div>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3rem'
        }}>
          {/* Article Main Body */}
          <article ref={contentRef} style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Key Takeaways Highlight Box */}
            {article.keyTakeaways && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(15,14,20,0.8) 100%)',
                borderLeft: '4px solid #C9A84C',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '8px', padding: '1.8rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#C9A84C', marginBottom: '0.8rem', margin: 0 }}>
                  💡 Key Field Takeaways
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {article.keyTakeaways.map((point, kIdx) => (
                    <li key={kIdx} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontWeight: 300 }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Block Renderer */}
            {article.content.map((block, idx) => {
              switch (block.type) {
                case 'paragraph':
                  return (
                    <p key={idx} style={{
                      fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.85, fontWeight: 300, margin: 0
                    }}>
                      {block.value}
                    </p>
                  )
                case 'heading':
                  return (
                    <h2 key={idx} id={`section-${idx}`} style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2.1rem', fontWeight: 300, color: '#fff',
                      margin: '1.8rem 0 0 0', letterSpacing: '-0.01em',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      paddingBottom: '0.5rem'
                    }}>
                      {block.value}
                    </h2>
                  )
                case 'quote':
                  return (
                    <blockquote key={idx} style={{
                      margin: '1.8rem 0', padding: '1.4rem 1.8rem',
                      borderLeft: '3px solid #C9A84C',
                      background: 'rgba(201,168,76,0.04)',
                      borderRadius: '0 8px 8px 0'
                    }}>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                        fontSize: '1.5rem', color: '#E8D5A3', lineHeight: 1.4, margin: 0
                      }}>
                        "{block.value}"
                      </p>
                    </blockquote>
                  )
                case 'image':
                  return (
                    <figure key={idx} style={{ margin: '2rem 0' }}>
                      <div 
                        onClick={() => setLightboxImage(block.url)}
                        style={{
                          aspectRatio: '16/10', borderRadius: '8px', overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.1)', cursor: 'zoom-in', position: 'relative'
                        }}
                      >
                        <img src={block.url} alt={block.caption || 'Field Photo'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      {block.caption && (
                        <figcaption style={{
                          fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)',
                          textAlign: 'center', marginTop: '0.6rem', fontStyle: 'italic'
                        }}>
                          📷 {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  )
                default:
                  return null
              }
            })}

            {/* Live Auction Cross-Sell Banner */}
            <div style={{
              marginTop: '3rem', padding: '2rem',
              background: 'linear-gradient(135deg, rgba(8,7,12,0.9) 0%, rgba(201,168,76,0.12) 100%)',
              border: '1px solid rgba(201,168,76,0.4)', borderRadius: '10px',
              display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', fontWeight: 600 }}>
                AUTHENTIC CEYLON GEMSTONES
              </span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                Ready to Acquire Certified Sri Lankan Sapphires & Rough?
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
                Explore live bidding rooms for natural unheated Ceylon Sapphires, Rubies, and mining land rights directly from Ratnapura and Pelmadulla.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/auctions')}
                  style={{
                    padding: '0.7rem 1.4rem', background: '#C9A84C', color: '#050508',
                    border: 'none', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  View Live Auctions →
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  style={{
                    padding: '0.7rem 1.4rem', background: 'transparent', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', fontSize: '0.75rem', cursor: 'pointer'
                  }}
                >
                  Browse Direct Marketplace
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar (Table of Contents & Quick Actions) */}
          <aside style={{ gridColumn: 'span 4' }}>
            <div style={{ position: 'sticky', top: '7rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div style={{
                  padding: '1.5rem', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px'
                }}>
                  <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
                    Article Outline
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {headings.map((h, hIdx) => (
                      <li key={hIdx}>
                        <a
                          href={`#section-${article.content.findIndex(b => b === h)}`}
                          style={{
                            fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                            transition: 'color 0.2s', display: 'block', lineHeight: 1.4
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                        >
                          {h.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Author Card */}
              <div style={{
                padding: '1.5rem', background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px'
              }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                  Written By
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#fff', marginBottom: '0.2rem' }}>
                  {article.author}
                </div>
                {article.authorRole && (
                  <div style={{ fontSize: '0.75rem', color: '#C9A84C', marginBottom: '1rem' }}>
                    {article.authorRole}
                  </div>
                )}
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5, fontWeight: 300 }}>
                  Specializing in Sri Lankan alluvial geology, artisanal mining heritage, and GRS/GIA colored gemstone grading.
                </p>
              </div>

              {/* Share & Copy Link */}
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Article link copied to clipboard!");
                  }}
                  style={{
                    flex: 1, padding: '0.7rem', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                    color: '#fff', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  🔗 Copy Link
                </button>
                <button
                  onClick={() => window.print()}
                  style={{
                    flex: 1, padding: '0.7rem', background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px',
                    color: '#C9A84C', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  📄 Save as PDF
                </button>
              </div>

            </div>
          </aside>
        </div>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <section style={{ maxWidth: '1000px', margin: '7rem auto 0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '4rem' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.5rem' }}>
              Further Research
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, color: '#fff', marginBottom: '2.5rem' }}>
              Related Field Documentation
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {related.map((relArt, idx) => (
                <RelatedArticleCard key={relArt.id} article={relArt} index={idx} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
        }} onClick={() => setLightboxImage(null)}>
          <img
            src={lightboxImage}
            alt="Enlarged view"
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.4)', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}
          />
          <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <Footer />
    </div>
  )
}
