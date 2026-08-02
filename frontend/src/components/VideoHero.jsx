import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useVideoScrub } from '../hooks/useVideoScrub'

export default function VideoHero({ videoRef }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const eyebrowRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)
  const overlayRef = useRef(null)
  const scrollHintRef = useRef(null)

  useVideoScrub(canvasRef, videoRef, containerRef)

  useEffect(() => {
    const pin = containerRef.current
    if (!pin) return

    const ctx = gsap.context(() => {
      const layers = [eyebrowRef, titleRef, subtitleRef, statsRef, ctaRef]

      // Master timeline pinned to scroll container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // 0–8%: eyebrow rises in
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.08 },
        0
      )

      // 5–20%: title words stagger in
      tl.fromTo(
        titleRef.current?.querySelectorAll('.word') ?? [],
        { opacity: 0, y: 60, rotateX: -30 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.03, duration: 0.15 },
        0.05
      )

      // 20–35%: subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.1 },
        0.2
      )

      // 35–55%: stats count-in handled by CSS, just fade
      tl.fromTo(
        statsRef.current?.querySelectorAll('.stat-item') ?? [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.02, duration: 0.1 },
        0.35
      )

      // 55–70%: CTAs
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1 },
        0.55
      )

      // 80–100%: everything fades out as video exits
      tl.to(
        layers.map(r => r.current).filter(Boolean),
        { opacity: 0, y: -40, stagger: 0.01, duration: 0.1 },
        0.8
      )

      // overlay darkens toward end
      tl.to(
        overlayRef.current,
        { opacity: 0.9, duration: 0.15 },
        0.85
      )

      // scroll hint fades out early
      ScrollTrigger.create({
        trigger: pin,
        start: 'top+=5% top',
        onEnter: () => scrollHintRef.current && gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.4 }),
        onLeaveBack: () => scrollHintRef.current && gsap.to(scrollHintRef.current, { opacity: 1, duration: 0.4 }),
      })
    }, pin)

    return () => ctx.revert()
  }, [])

  const titleWords = ['Bid on', 'Exceptional', 'Gemstones']

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', height: '400vh' }}
    >
      {/* Sticky viewport */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            willChange: 'transform',
          }}
        />

        {/* Dark gradient overlay at bottom */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.3) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Fade overlay for exit */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#050508',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Text content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 6vw 8vh',
        }}>

          {/* Eyebrow */}
          <div ref={eyebrowRef} style={{ opacity: 0, marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C9A84C',
            }}>
              <span style={{ width: 24, height: 1, background: '#C9A84C', display: 'inline-block' }} />
              Certified · Live · Rare
              <span style={{ width: 24, height: 1, background: '#C9A84C', display: 'inline-block' }} />
            </span>
          </div>

          {/* Title */}
          <div
            ref={titleRef}
            style={{
              perspective: '600px',
              marginBottom: '1.5rem',
            }}
          >
            {titleWords.map((word, i) => (
              <div
                key={i}
                className="word"
                style={{
                  display: 'block',
                  opacity: 0,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  fontWeight: 300,
                  lineHeight: 1.05,
                  color: i === 1 ? '#C9A84C' : '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                {word}
              </div>
            ))}
          </div>

          {/* Subtitle */}
          <p ref={subtitleRef} style={{
            opacity: 0,
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '480px',
            lineHeight: 1.7,
            marginBottom: '2rem',
            fontWeight: 300,
          }}>
            Real-time auctions on conflict-free certified stones.
            Full geological data. No reserve surprises.
          </p>

          {/* Stats */}
          <div ref={statsRef} style={{
            display: 'flex',
            gap: '3rem',
            marginBottom: '2.5rem',
          }}>
            {[
              { num: '1,240+', label: 'Gems Auctioned' },
              { num: '$4.2M', label: 'Total Volume' },
              { num: '380+', label: 'Verified Buyers' },
              { num: '100%', label: 'GIA Certified' },
            ].map(({ num, label }) => (
              <div key={label} className="stat-item" style={{ opacity: 0 }}>
                <div style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                  fontFamily: "'Cormorant Garamond', serif",
                  color: '#fff',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                }}>{num}</div>
                <div style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginTop: '0.2rem',
                }}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div ref={ctaRef} style={{
            opacity: 0,
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}>
            <button style={{
              padding: '0.9rem 2.5rem',
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
              color: '#0A0A0D',
              border: 'none',
              borderRadius: '2px',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'opacity 0.3s, transform 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Browse Live Auctions
            </button>
            <button style={{
              padding: '0.9rem 2rem',
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '2px',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            >
              How It Works
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div ref={scrollHintRef} style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.5,
        }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Scroll</span>
          <div style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
            animation: 'scrollPulse 1.5s ease-in-out infinite',
          }} />
        </div>

      </div>
    </div>
  )
}
