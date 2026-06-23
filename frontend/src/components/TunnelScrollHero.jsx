import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const TOTAL_FRAMES = 120
const INITIAL_BATCH = 20
const CURTAIN_END = 0.20

const STATS = [
  { num: '1,240+', label: 'Gems Auctioned' },
  { num: '$4.2M',  label: 'Total Volume' },
  { num: '380+',   label: 'Verified Buyers' },
  { num: '100%',   label: 'GIA Certified' },
]

export default function TunnelScrollHero() {
  const containerRef  = useRef(null)
  const canvasRef     = useRef(null)
  const particleRef   = useRef(null)
  const imagesRef     = useRef(new Array(TOTAL_FRAMES).fill(null))
  const currentFrameRef = useRef(-1)
  const shouldDrawRef   = useRef(false)

  const eyebrowRef    = useRef(null)
  const line1Ref      = useRef(null)
  const line2Ref      = useRef(null)
  const subtitleRef   = useRef(null)
  const statsRef      = useRef(null)
  const ctaRef        = useRef(null)
  const scrollCueRef  = useRef(null)

  const tunnelWrapRef  = useRef(null)
  const overlayRef     = useRef(null)
  const bridgeTextRef  = useRef(null)
  const scrollHintRef  = useRef(null)

  const [loadedCount, setLoadedCount]     = useState(0)
  const [loadedInitial, setLoadedInitial] = useState(false)

  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current

  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width: cw, height: ch } = canvas
    const isReady = (img) => img && img.complete && img.naturalWidth
    let safeIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, index))
    let img = imagesRef.current[safeIdx]
    if (!isReady(img)) {
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

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width  = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width  = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current)
  }, [drawFrame])

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
        img.onload = () => { img.decode?.().catch(() => {}).finally(finish) ?? finish() }
      })
    }
    Promise.all(Array.from({ length: INITIAL_BATCH }, (_, i) => loadOne(i)))
      .then(() => { for (let i = INITIAL_BATCH; i < TOTAL_FRAMES; i++) loadOne(i) })
  }, [])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  useEffect(() => {
    if (loadedInitial) { currentFrameRef.current = 0; drawFrame(0) }
  }, [loadedInitial, drawFrame])

  useEffect(() => {
    const canvas = particleRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00018,
      a: Math.random() * 0.22 + 0.04,
    }))
    let raf
    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x = (p.x + p.vx + 1) % 1
        p.y = (p.y + p.vy + 1) % 1
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${p.a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  useEffect(() => {
    if (!loadedInitial || prefersReducedMotion) return
    const onTick = () => {
      if (!shouldDrawRef.current) return
      const container = containerRef.current
      if (!container) return
      const { top } = container.getBoundingClientRect()
      const maxScroll = container.offsetHeight - window.innerHeight
      const totalProgress = Math.max(0, Math.min(1, -top / maxScroll))
      let frameIndex = 0
      if (totalProgress > CURTAIN_END) {
        const tp = (totalProgress - CURTAIN_END) / (1 - CURTAIN_END)
        frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(tp * TOTAL_FRAMES))
      }
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex
        drawFrame(frameIndex)
      }
    }
    gsap.ticker.add(onTick)
    return () => gsap.ticker.remove(onTick)
  }, [loadedInitial, prefersReducedMotion, drawFrame])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { shouldDrawRef.current = entry.isIntersecting },
      { rootMargin: '200px 0px 200px 0px' }
    )
    const el = containerRef.current
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Entrance — time-based reveal on mount
  useEffect(() => {
    if (prefersReducedMotion) {
      const els = [eyebrowRef, line1Ref, line2Ref, subtitleRef, ctaRef, scrollCueRef]
      els.forEach(r => { if (r.current) gsap.set(r.current, { opacity: 1, y: 0 }) })
      if (statsRef.current)
        gsap.set(statsRef.current.querySelectorAll('.stat-item'), { opacity: 1, y: 0 })
      return
    }
    const tl = gsap.timeline({ delay: 0.4 })
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' })
    tl.fromTo(line1Ref.current,
      { opacity: 0, y: 55, rotateX: -18 },
      { opacity: 1, y: 0, rotateX: 0, duration: 1.0, ease: 'power3.out' }, '-=0.25')
    tl.fromTo(line2Ref.current,
      { opacity: 0, y: 55, rotateX: -18 },
      { opacity: 1, y: 0, rotateX: 0, duration: 1.0, ease: 'power3.out' }, '-=0.68')
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    tl.fromTo(
      statsRef.current?.querySelectorAll('.stat-item') ?? [],
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    tl.fromTo(ctaRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    tl.fromTo(scrollCueRef.current,
      { opacity: 0 },
      { opacity: 0.6, duration: 0.5 }, '-=0.1')
  }, [prefersReducedMotion])

  // ScrollTrigger — curtain split → tunnel scrub
  useEffect(() => {
    const pin = containerRef.current
    if (!pin) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })

      // CURTAIN: title lines fly apart like stage curtains
      tl.to(line1Ref.current, {
        x: () => -window.innerWidth * 1.15,
        opacity: 0,
        ease: 'power2.inOut',
        duration: CURTAIN_END,
      }, 0)
      tl.to(line2Ref.current, {
        x: () => window.innerWidth * 1.15,
        opacity: 0,
        ease: 'power2.inOut',
        duration: CURTAIN_END,
      }, 0)

      // Remaining hero content fades upward
      tl.to(eyebrowRef.current,
        { opacity: 0, y: -22, duration: CURTAIN_END * 0.65 }, 0)
      tl.to(subtitleRef.current,
        { opacity: 0, y: -12, duration: CURTAIN_END * 0.60 }, 0.02)
      tl.to(statsRef.current?.querySelectorAll('.stat-item') ?? [],
        { opacity: 0, y: -10, stagger: 0.01, duration: CURTAIN_END * 0.55 }, 0.03)
      tl.to(ctaRef.current,
        { opacity: 0, y: -10, duration: CURTAIN_END * 0.50 }, 0.04)
      tl.to(scrollCueRef.current,
        { opacity: 0, duration: CURTAIN_END * 0.4 }, 0)
      tl.to(particleRef.current,
        { opacity: 0, duration: CURTAIN_END }, 0)

      // Tunnel canvas fades in behind the splitting text
      tl.to(tunnelWrapRef.current, {
        opacity: 1,
        ease: 'power1.in',
        duration: CURTAIN_END,
      }, CURTAIN_END * 0.08)

      // TUNNEL: bridge text mid-journey
      tl.fromTo(bridgeTextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.30)
      tl.to(bridgeTextRef.current, { opacity: 0, duration: 0.08 }, 0.64)

      // Exit fade to black
      tl.to(overlayRef.current, { opacity: 0.9, duration: 0.15 }, 0.85)

      ScrollTrigger.create({
        trigger: pin,
        start: 'top+=5% top',
        onEnter:     () => scrollHintRef.current && gsap.to(scrollHintRef.current, { opacity: 0, duration: 0.4 }),
        onLeaveBack: () => scrollHintRef.current && gsap.to(scrollHintRef.current, { opacity: 0.5, duration: 0.4 }),
      })
    }, pin)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '700vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* ── ATMOSPHERIC BACKGROUND ── */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 90% 65% at 50% -8%, rgba(38,14,108,0.72) 0%, transparent 62%),
            radial-gradient(ellipse 50% 40% at 6% 50%,  rgba(48,16,112,0.30) 0%, transparent 58%),
            radial-gradient(ellipse 50% 40% at 94% 50%, rgba(48,16,112,0.26) 0%, transparent 58%),
            radial-gradient(ellipse 60% 45% at 50% 110%,rgba(8,4,26,0.96)   0%, transparent 65%),
            radial-gradient(ellipse 35% 28% at 72% 18%, rgba(22,8,68,0.48)  0%, transparent 52%),
            linear-gradient(175deg, #050112 0%, #07031B 18%, #060315 48%, #050210 80%, #040110 100%)
          `,
        }} />

        {/* Aurora bloom — top center */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-18%', left: '50%',
          transform: 'translateX(-50%)',
          width: '90%', height: '72%',
          background: 'radial-gradient(ellipse, rgba(58,22,160,0.22) 0%, rgba(28,10,88,0.10) 40%, transparent 70%)',
          filter: 'blur(88px)',
          animation: 'auroraBreath 9s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Warm gold center bloom */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 620, height: 420,
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.065) 0%, transparent 70%)',
          filter: 'blur(65px)',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Particle canvas */}
        <canvas ref={particleRef} aria-hidden="true" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* ── TUNNEL CANVAS (hidden until curtain opens) ── */}
        <div ref={tunnelWrapRef} style={{ position: 'absolute', inset: 0, opacity: 0, zIndex: 3 }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block' }} aria-hidden="true" />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(4,1,16,0.95) 0%, rgba(4,1,16,0.28) 38%, transparent 68%)',
          }} />
        </div>

        {/* Exit overlay */}
        <div ref={overlayRef} style={{
          position: 'absolute', inset: 0,
          background: '#040110', opacity: 0,
          pointerEvents: 'none', zIndex: 8,
        }} />

        {/* Bridge text */}
        <div ref={bridgeTextRef} aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, pointerEvents: 'none', zIndex: 7,
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.7rem)',
            fontWeight: 300, lineHeight: 1.45,
            color: 'rgba(255,255,255,0.80)',
            letterSpacing: '0.05em', textAlign: 'center',
            textShadow: '0 2px 32px rgba(0,0,0,0.85)',
            margin: 0, maxWidth: '600px', padding: '0 2rem',
          }}>
            Every gem begins in darkness.
          </p>
        </div>

        {/* ── HERO TEXT LAYER ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 2rem 5rem',
        }}>

          {/* Eyebrow */}
          <div ref={eyebrowRef} style={{ opacity: 0, marginBottom: '2.8rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.85rem',
              fontSize: '0.58rem', letterSpacing: '0.36em',
              textTransform: 'uppercase', color: '#C9A84C',
            }}>
              <span style={{
                width: 36, height: 1, display: 'inline-block',
                background: 'linear-gradient(to right, transparent, #C9A84C)',
              }} />
              Live Gem Auctions
              <span style={{
                width: 36, height: 1, display: 'inline-block',
                background: 'linear-gradient(to left, transparent, #C9A84C)',
              }} />
            </span>
          </div>

          {/* Title — two lines that split like stage curtains on scroll */}
          <div style={{
            textAlign: 'center',
            perspective: '900px',
            marginBottom: '2.4rem',
          }}>
            <div ref={line1Ref} style={{
              opacity: 0,
              display: 'block',
              willChange: 'transform, opacity',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 8.5vw, 7.2rem)',
              fontWeight: 300,
              lineHeight: 1.02,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              textShadow: '0 0 120px rgba(201,168,76,0.10)',
            }}>Where Rare Gems</div>

            <div ref={line2Ref} style={{
              opacity: 0,
              display: 'block',
              willChange: 'transform, opacity',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 8.5vw, 7.2rem)',
              fontWeight: 300,
              lineHeight: 1.02,
              color: '#C9A84C',
              letterSpacing: '-0.03em',
              fontStyle: 'italic',
            }}>Find Their Value</div>
          </div>

          {/* Subtitle */}
          <p ref={subtitleRef} style={{
            opacity: 0,
            margin: '0 0 2.8rem',
            fontSize: 'clamp(0.8rem, 1.15vw, 0.93rem)',
            color: 'rgba(255,255,255,0.35)',
            maxWidth: 360,
            lineHeight: 1.88,
            fontWeight: 300,
            textAlign: 'center',
            letterSpacing: '0.01em',
          }}>
            Real-time auctions on conflict-free certified stones.
            Full geological data. No reserve surprises.
          </p>

          {/* Stats */}
          <div ref={statsRef} style={{
            display: 'flex', gap: '2.8rem', flexWrap: 'wrap',
            justifyContent: 'center', marginBottom: '2.8rem',
          }}>
            {STATS.map(({ num, label }) => (
              <div key={label} className="stat-item" style={{ opacity: 0, textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
                  fontFamily: "'Cormorant Garamond', serif",
                  color: '#fff', fontWeight: 600, letterSpacing: '-0.01em',
                }}>{num}</div>
                <div style={{
                  fontSize: '0.52rem', letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.26)', marginTop: '0.22rem',
                }}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div ref={ctaRef} style={{
            opacity: 0,
            display: 'flex', gap: '0.8rem',
            alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <button
              style={{
                padding: '0.82rem 2.2rem',
                background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 100%)',
                color: '#0A080F', border: 'none', borderRadius: '2px',
                fontSize: '0.63rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                fontWeight: 700, cursor: 'pointer',
                transition: 'opacity 0.25s, transform 0.25s',
                boxShadow: '0 4px 28px rgba(201,168,76,0.22)',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.84'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Browse Live Auctions
            </button>
            <button
              style={{
                padding: '0.82rem 1.8rem',
                background: 'transparent',
                color: 'rgba(255,255,255,0.48)',
                border: '1px solid rgba(255,255,255,0.14)', borderRadius: '2px',
                fontSize: '0.63rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'border-color 0.25s, color 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.55)'; e.currentTarget.style.color = '#C9A84C' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.48)' }}
            >
              How It Works
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div ref={scrollCueRef} aria-hidden="true" style={{
          position: 'absolute', bottom: '1.75rem', left: '50%',
          transform: 'translateX(-50%)', opacity: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem',
          pointerEvents: 'none', zIndex: 5,
        }}>
          <span style={{
            fontSize: '0.46rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
          }}>Enter the mine</span>
          <div style={{
            width: 1, height: 36,
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.5), transparent)',
            animation: 'scrollPulse 1.8s ease-in-out infinite',
          }} />
        </div>

        {/* Scroll hint (tunnel phase) */}
        <div ref={scrollHintRef} aria-hidden="true" style={{
          position: 'absolute', bottom: '2rem', right: '2.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          opacity: 0, pointerEvents: 'none', zIndex: 6,
        }}>
          <span style={{
            fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.50)',
          }}>Scroll</span>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.45), transparent)',
            animation: 'scrollPulse 1.5s ease-in-out infinite',
          }} />
        </div>

        {/* Loading bar — shown until first batch ready */}
        {!loadedInitial && (
          <div
            style={{
              position: 'absolute', bottom: '2.5rem', left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
              zIndex: 10, pointerEvents: 'none',
            }}
            role="status"
            aria-label="Loading tunnel sequence"
          >
            <div style={{
              width: 140, height: 1,
              background: 'rgba(201,168,76,0.12)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                width: `${(loadedCount / INITIAL_BATCH) * 100}%`,
                background: 'linear-gradient(to right, #C9A84C, #E8D5A3)',
                transition: 'width 0.15s ease',
              }} />
            </div>
            <span style={{
              color: 'rgba(201,168,76,0.4)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300, fontSize: '0.65rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>Entering the mine</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes auroraBreath {
          0%, 100% { opacity: 0.80; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1.00; transform: translateX(-50%) scale(1.08) scaleY(1.12); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 0.12; }
        }
      `}</style>
    </div>
  )
}
