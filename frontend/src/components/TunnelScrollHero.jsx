import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const TOTAL_FRAMES = 120
const INITIAL_BATCH = 20

export default function TunnelScrollHero() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null))
  const currentFrameRef = useRef(-1)
  const shouldDrawRef = useRef(false)

  const eyebrowRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)
  const overlayRef = useRef(null)
  const scrollHintRef = useRef(null)

  const [loadedCount, setLoadedCount] = useState(0)
  const [loadedInitial, setLoadedInitial] = useState(false)

  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current

  // Draw frame onto canvas — object-fit: cover scaling.
  // Falls back to nearest ready frame so fast scroll never shows blank/stale.
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width: cw, height: ch } = canvas

    const isReady = (img) => img && img.complete && img.naturalWidth

    let safeIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, index))
    let img = imagesRef.current[safeIdx]

    if (!isReady(img)) {
      // walk backward to nearest loaded frame
      for (let i = safeIdx - 1; i >= 0; i--) {
        if (isReady(imagesRef.current[i])) { img = imagesRef.current[i]; break }
      }
      if (!isReady(img)) return
    }

    const { naturalWidth: iw, naturalHeight: ih } = img
    const scale = Math.max(cw / iw, ch / ih)
    const dx = (cw - iw * scale) / 2
    const dy = (ch - ih * scale) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, iw * scale, ih * scale)
  }, [])

  // Resize canvas intrinsic size to match viewport (DPR-corrected for sharp output on HiDPI)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current)
  }, [drawFrame])

  // Progressive frame loading — initial batch first, rest in background
  useEffect(() => {
    const images = imagesRef.current
    let count = 0

    const loadOne = (i) => {
      const img = new Image()
      img.src = `/tunnel-frames/frame_${String(i + 1).padStart(4, '0')}.jpg`
      return new Promise((resolve) => {
        const finish = () => {
          images[i] = img
          count++
          setLoadedCount(count)
          if (count === INITIAL_BATCH) setLoadedInitial(true)
          resolve()
        }
        img.onerror = finish
        img.onload = () => {
          // decode() forces GPU-ready decode off the scroll path — eliminates hitch on first drawImage
          img.decode?.().catch(() => {}).finally(finish) ?? finish()
        }
      })
    }

    Promise.all(
      Array.from({ length: INITIAL_BATCH }, (_, i) => loadOne(i))
    ).then(() => {
      for (let i = INITIAL_BATCH; i < TOTAL_FRAMES; i++) loadOne(i)
    })
  }, [])

  // Canvas size tracks viewport
  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  // Show first frame as soon as initial batch is ready
  useEffect(() => {
    if (loadedInitial) {
      currentFrameRef.current = 0
      drawFrame(0)
    }
  }, [loadedInitial, drawFrame])

  // Canvas scrub via GSAP ticker — syncs with Lenis rAF loop automatically.
  // Reads getBoundingClientRect() which correctly reflects Lenis's smooth scroll
  // position regardless of how Lenis applies easing internally.
  useEffect(() => {
    if (!loadedInitial || prefersReducedMotion) return

    const onTick = () => {
      if (!shouldDrawRef.current) return
      const container = containerRef.current
      if (!container) return

      const { top } = container.getBoundingClientRect()
      const maxScroll = container.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, -top / maxScroll))
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES))

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        drawFrame(frameIndex)
      }
    }

    gsap.ticker.add(onTick)
    return () => gsap.ticker.remove(onTick)
  }, [loadedInitial, prefersReducedMotion, drawFrame])

  // IntersectionObserver gates drawing — detach work when section is off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { shouldDrawRef.current = entry.isIntersecting },
      { rootMargin: '200px 0px 200px 0px' }
    )
    const el = containerRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // GSAP ScrollTrigger text animations — mirrors VideoHero choreography
  useEffect(() => {
    const pin = containerRef.current
    if (!pin) return

    const ctx = gsap.context(() => {
      const layers = [eyebrowRef, titleRef, subtitleRef, statsRef, ctaRef]

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08 }, 0)
      tl.fromTo(
        titleRef.current?.querySelectorAll('.word') ?? [],
        { opacity: 0, y: 60, rotateX: -30 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.03, duration: 0.15 },
        0.05
      )
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.1 }, 0.2)
      tl.fromTo(
        statsRef.current?.querySelectorAll('.stat-item') ?? [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.02, duration: 0.1 },
        0.35
      )
      tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 }, 0.55)
      tl.to(
        layers.map(r => r.current).filter(Boolean),
        { opacity: 0, y: -40, stagger: 0.01, duration: 0.1 },
        0.8
      )
      tl.to(overlayRef.current, { opacity: 0.9, duration: 0.15 }, 0.85)

      ScrollTrigger.create({
        trigger: pin,
        start: 'top+=5% top',
        onEnter: () => scrollHintRef.current && gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.4 }),
        onLeaveBack: () => scrollHintRef.current && gsap.to(scrollHintRef.current, { opacity: 0.5, duration: 0.4 }),
      })
    }, pin)

    return () => ctx.revert()
  }, [])

  const titleWords = ['Bid on', 'Exceptional', 'Gemstones']

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', height: '600vh' }}
      aria-label="Mine tunnel journey hero section"
    >
      {/* Sticky viewport — canvas + overlays stay pinned while container scrolls */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Frame canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            background: '#050508',
          }}
          aria-hidden="true"
        />

        {/* Bottom-up vignette so text is always legible */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.3) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Exit fade — GSAP drives opacity to 0.9 toward end of scroll */}
        <div
          ref={overlayRef}
          style={{ position: 'absolute', inset: 0, background: '#050508', opacity: 0, pointerEvents: 'none' }}
        />

        {/* Loading indicator — shown until first batch of frames is ready */}
        {!loadedInitial && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#050508',
              zIndex: 5,
              gap: '1.25rem',
            }}
            role="status"
            aria-label="Loading tunnel sequence"
          >
            <div style={{
              width: 180,
              height: 1,
              background: 'rgba(201,168,76,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                width: `${(loadedCount / INITIAL_BATCH) * 100}%`,
                background: 'linear-gradient(to right, #C9A84C, #E8D5A3)',
                transition: 'width 0.15s ease',
              }} />
            </div>
            <span style={{
              color: 'rgba(201,168,76,0.5)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Entering the mine
            </span>
          </div>
        )}

        {/* Hero text content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 6vw 8vh',
        }}>
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

          <div ref={titleRef} style={{ perspective: '600px', marginBottom: '1.5rem' }}>
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

          <div ref={statsRef} style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
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

          <div ref={ctaRef} style={{ opacity: 0, display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
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
            <button
              style={{
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

        {/* Scroll hint — fades out after 5% scroll via ScrollTrigger */}
        <div
          ref={scrollHintRef}
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <span style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#fff',
          }}>Scroll</span>
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
