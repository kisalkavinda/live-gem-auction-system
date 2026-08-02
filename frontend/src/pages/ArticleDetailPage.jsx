import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import { fetchArticleBySlug, fetchArticles } from '../data/mockArticles'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ─── Article card (reused for Related Articles) ───────────────────────────
function RelatedArticleCard({ article, index }) {
  const cardRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    gsap.fromTo(card,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        delay: (index % 3) * 0.1,
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
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
        opacity: 0,
        position: 'relative',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(201,168,76,0.6)`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div style={{ height: 160, background: `rgba(201,168,76,0.05)`, position: 'relative' }}>
        <img
          src={article.coverImage}
          alt={article.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) contrast(1.1)' }}
        />
        <div style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          padding: '0.25rem 0.5rem', background: `rgba(0,0,0,0.7)`,
          border: `1px solid rgba(201,168,76,0.5)`, borderRadius: '2px', backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C' }}>
            {article.category}
          </span>
        </div>
      </div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '1.15rem', 
          fontWeight: 400, color: '#fff', marginBottom: '0.5rem', lineHeight: 1.25,
        }}>
          {article.title}
        </h3>
        <p style={{
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {article.excerpt}
        </p>
        <div style={{
          display: 'flex', gap: '0.75rem', alignItems: 'center',
          fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.05em', marginTop: 'auto'
        }}>
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  )
}


export default function ArticleDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const contentRef = useRef(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await fetchArticleBySlug(slug)
      if (data) {
        setArticle(data)
        const allArticles = await fetchArticles()
        // Get 3 articles from the same category (or random) excluding current
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
        <div style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', fontSize: '0.8rem', textTransform: 'uppercase' }}>
          Loading Article...
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
            ← Back to Knowledge Hub
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#050508', minHeight: '100vh', color: '#fff' }}>
      <Navbar visible={true} />

      <main style={{ padding: '10rem 6vw 6rem' }}>
        <div ref={contentRef} style={{ maxWidth: '720px', margin: '0 auto', opacity: 1 }}>
          
          {/* Top Back Link */}
          <div style={{ marginBottom: '3rem' }}>
            <button
              onClick={() => navigate('/knowledge-hub')}
              style={{
                background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
                fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'color 0.2s', padding: 0
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              <span>←</span> Back to Knowledge Hub
            </button>
          </div>

          {/* Header */}
          <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', padding: '0.3rem 0.75rem',
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '2px', fontSize: '0.6rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1.5rem'
            }}>
              {article.category}
            </div>
            
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 300, color: '#fff', letterSpacing: '-0.02em',
              marginBottom: '1.5rem', lineHeight: 1.1,
            }}>
              {article.title}
            </h1>
            
            <div style={{
              display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.1em', textTransform: 'uppercase'
            }}>
              <span>By {article.author}</span>
              <span>·</span>
              <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          {/* Cover Image */}
          <div style={{
            width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.02)',
            borderRadius: '4px', overflow: 'hidden', marginBottom: '4rem',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Article Body */}
          <article style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '6rem' }}>
            {article.content.map((block, idx) => {
              switch (block.type) {
                case 'paragraph':
                  return (
                    <p key={idx} style={{
                      fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.8, fontWeight: 300, margin: 0
                    }}>
                      {block.value}
                    </p>
                  )
                case 'heading':
                  return (
                    <h2 key={idx} style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2rem', fontWeight: 300, color: '#fff',
                      margin: '1.5rem 0 0 0', letterSpacing: '-0.01em'
                    }}>
                      {block.value}
                    </h2>
                  )
                case 'quote':
                  return (
                    <blockquote key={idx} style={{
                      margin: '1.5rem 0', padding: '1rem 0 1rem 2rem',
                      borderLeft: '2px solid #C9A84C', background: 'linear-gradient(90deg, rgba(201,168,76,0.05) 0%, transparent 100%)'
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
                      <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <img src={block.url} alt={block.caption || 'Article image'} style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                      {block.caption && (
                        <figcaption style={{
                          marginTop: '0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
                          textAlign: 'center', fontStyle: 'italic'
                        }}>
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  )
                default:
                  return null
              }
            })}
          </article>

          {/* Bottom Back Link */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/knowledge-hub')}
              style={{
                background: 'transparent', border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '2px', color: '#C9A84C', padding: '0.75rem 2rem',
                fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.8)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)' }}
            >
              Back to Knowledge Hub
            </button>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      {related.length > 0 && (
        <section style={{ background: '#07070A', padding: '6rem 6vw', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem',
              fontWeight: 300, color: '#fff', marginBottom: '2.5rem', textAlign: 'center'
            }}>
              Related Articles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {related.map((relArticle, i) => (
                <RelatedArticleCard key={relArticle.id} article={relArticle} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
