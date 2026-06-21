import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'

function octPointsArray(cx, cy, r) {
  return Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI / 4) + Math.PI / 8
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
}

function pt(p) { return `${p.x.toFixed(2)},${p.y.toFixed(2)}` }
function octPts(cx, cy, r) { return octPointsArray(cx, cy, r).map(pt).join(' ') }

function GemShape({ size = 240 }) {
  const cx = size / 2
  const cy = size / 2
  const outerR = size * 0.46
  const innerR = size * 0.27
  const outer = octPointsArray(cx, cy, outerR)
  const inner = octPointsArray(cx, cy, innerR)

  return (
    <div style={{ position: 'relative', width: size, height: size, animation: 'gemFloat 4s ease-in-out infinite' }}>
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: -50,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.28) 0%, rgba(201,168,76,0.06) 50%, transparent 70%)',
        filter: 'blur(22px)',
        animation: 'gemGlow 3s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }} />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 6px 28px rgba(201,168,76,0.42))' }}
      >
        <defs>
          <linearGradient id="gMain" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#FFF8E7" stopOpacity="0.95" />
            <stop offset="28%"  stopColor="#E8D5A3" />
            <stop offset="54%"  stopColor="#C9A84C" />
            <stop offset="76%"  stopColor="#7A5210" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gTable" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFFCF5" stopOpacity="0.98" />
            <stop offset="45%"  stopColor="#F0E3BC" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="gFLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFFCF5" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#E8D5A3" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="gFDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#7A5210" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#3D2800" stopOpacity="0.92" />
          </linearGradient>
          <radialGradient id="gTableGlow" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#FFFCF5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main gem body */}
        <polygon points={octPts(cx, cy, outerR)} fill="url(#gMain)" />

        {/* Kite facets */}
        {outer.map((op, i) => {
          const nop = outer[(i + 1) % 8]
          const ip  = inner[i]
          const nip = inner[(i + 1) % 8]
          return (
            <polygon
              key={i}
              points={`${pt(op)} ${pt(nop)} ${pt(nip)} ${pt(ip)}`}
              fill={i % 2 === 0 ? 'url(#gFLight)' : 'url(#gFDark)'}
              opacity={i % 2 === 0 ? 0.52 : 0.68}
            />
          )
        })}

        {/* Table */}
        <polygon points={octPts(cx, cy, innerR)} fill="url(#gTable)" />
        <polygon points={octPts(cx, cy, innerR)} fill="url(#gTableGlow)" />

        {/* Edge lines outer→inner */}
        {outer.map((op, i) => (
          <line key={i} x1={op.x.toFixed(2)} y1={op.y.toFixed(2)} x2={inner[i].x.toFixed(2)} y2={inner[i].y.toFixed(2)}
            stroke="rgba(255,252,245,0.22)" strokeWidth="0.7" />
        ))}

        {/* Star lines centre→inner */}
        {inner.map((ip, i) => (
          <line key={i} x1={cx.toFixed(2)} y1={cy.toFixed(2)} x2={ip.x.toFixed(2)} y2={ip.y.toFixed(2)}
            stroke="rgba(255,252,245,0.10)" strokeWidth="0.5" />
        ))}

        {/* Highlight */}
        <ellipse cx={cx - outerR * 0.18} cy={cy - outerR * 0.18} rx={outerR * 0.07} ry={outerR * 0.048} fill="rgba(255,255,255,0.62)" />
        <circle cx={cx} cy={cy} r={2.2} fill="rgba(255,255,255,0.52)" />
      </svg>
    </div>
  )
}

const STATS = [
  { num: '1,240+', label: 'Gems Auctioned' },
  { num: '$4.2M',  label: 'Total Volume' },
  { num: '380+',   label: 'Verified Buyers' },
  { num: '100%',   label: 'GIA Certified' },
]

export default function GemHero() {
  const particleRef  = useRef(null)
  const eyebrowRef   = useRef(null)
  const gemRef       = useRef(null)
  const titleRef     = useRef(null)
  const subtitleRef  = useRef(null)
  const statsRef     = useRef(null)
  const ctaRef       = useRef(null)
  const scrollCueRef = useRef(null)

  useEffect(() => {
    const canvas = particleRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      a: Math.random() * 0.32 + 0.07,
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
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    tl.fromTo(gemRef.current,
      { opacity: 0, scale: 0.82, y: 22 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.22')
    tl.fromTo(
      titleRef.current?.querySelectorAll('.gh-word') ?? [],
      { opacity: 0, y: 38, rotateX: -22 },
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }, '-=0.42')
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.32')
    tl.fromTo(
      statsRef.current?.querySelectorAll('.gh-stat') ?? [],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.25')
    tl.fromTo(ctaRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    tl.fromTo(scrollCueRef.current,
      { opacity: 0 },
      { opacity: 0.55, duration: 0.5 }, '-=0.1')
  }, [])

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      background: '#050508',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      /* navbar is 18px top + ~52px height = 70px; add clearance */
      paddingTop: '80px',
      paddingBottom: '72px',
      boxSizing: 'border-box',
    }}>
      <canvas ref={particleRef} aria-hidden="true" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
      }} />

      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '45%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 640, height: 640,
        background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.03) 48%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* All content in one centred column — sized to fit inside padded 100vh */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '0 2rem', maxWidth: 820, width: '100%',
        gap: '1.1rem',
      }}>
        {/* Eyebrow */}
        <div ref={eyebrowRef} style={{ opacity: 0 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.65rem',
            fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C',
          }}>
            <span style={{ width: 20, height: 1, background: '#C9A84C', display: 'inline-block' }} />
            Live Gem Auctions
            <span style={{ width: 20, height: 1, background: '#C9A84C', display: 'inline-block' }} />
          </span>
        </div>

        {/* Gem */}
        <div ref={gemRef} style={{ opacity: 0 }}>
          <GemShape size={178} />
        </div>

        {/* Title */}
        <div ref={titleRef} style={{ perspective: '600px', lineHeight: 1 }}>
          {['Where Rare Gems', 'Find Their Value'].map((line, i) => (
            <div key={i} className="gh-word" style={{
              display: 'block', opacity: 0,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5.2vw, 4.2rem)',
              fontWeight: 300, lineHeight: 1.1,
              color: i === 0 ? '#fff' : '#C9A84C',
              letterSpacing: '-0.02em',
            }}>{line}</div>
          ))}
        </div>

        {/* Subtitle */}
        <p ref={subtitleRef} style={{
          opacity: 0, margin: 0,
          fontSize: 'clamp(0.78rem, 1.2vw, 0.92rem)',
          color: 'rgba(255,255,255,0.42)',
          maxWidth: 400, lineHeight: 1.72, fontWeight: 300,
        }}>
          Real-time auctions on conflict-free certified stones.
          Full geological data. No reserve surprises.
        </p>

        {/* Stats */}
        <div ref={statsRef} style={{
          display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {STATS.map(({ num, label }) => (
            <div key={label} className="gh-stat" style={{ opacity: 0 }}>
              <div style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
                fontFamily: "'Cormorant Garamond', serif",
                color: '#fff', fontWeight: 600, letterSpacing: '-0.01em',
              }}>{num}</div>
              <div style={{
                fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)', marginTop: '0.15rem',
              }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div ref={ctaRef} style={{ opacity: 0, display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
              color: '#0A0A0D', border: 'none', borderRadius: '2px',
              fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.25s, transform 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.84'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Browse Live Auctions
          </button>
          <button
            style={{
              padding: '0.75rem 1.625rem',
              background: 'transparent', color: 'rgba(255,255,255,0.56)',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: '2px',
              fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'border-color 0.25s, color 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#C9A84C' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.56)' }}
          >
            How It Works
          </button>
        </div>
      </div>

      {/* Scroll cue — absolutely pinned to section bottom, never in content flow */}
      <div ref={scrollCueRef} aria-hidden="true" style={{
        position: 'absolute', bottom: '1.75rem', left: '50%',
        transform: 'translateX(-50%)', opacity: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
        pointerEvents: 'none',
      }}>
        <span style={{ fontSize: '0.48rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
          Enter the mine
        </span>
        <div style={{
          width: 1, height: 34,
          background: 'linear-gradient(to bottom, rgba(201,168,76,0.5), transparent)',
          animation: 'scrollPulse 1.6s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes gemFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes gemGlow {
          from { opacity: 0.65; transform: scale(0.97); }
          to   { opacity: 1;    transform: scale(1.06); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.58; }
          50%      { opacity: 0.14; }
        }
      `}</style>
    </section>
  )
}
