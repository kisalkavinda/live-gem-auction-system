import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const ERAS = [
  {
    period: '3000 BC',
    era: 'Ancient Sri Lanka',
    headline: 'The First Gem Traders',
    body: 'Ceylon sapphires and rubies traveled ancient trade routes to Egypt, Persia, and Rome. Kings and pharaohs prized these stones as symbols of divine power and cosmic protection.',
    side: 'left',
    gemColor: '#3b82f6', // Sapphire Blue
    glowColor: 'rgba(59, 130, 246, 0.45)',
    bgGlow: 'rgba(59, 130, 246, 0.14)',
    gemName: 'Blue Sapphire'
  },
  {
    period: '500 AD',
    era: 'The Silk Road',
    headline: 'Gems as Currency',
    body: 'As trade routes expanded across continents, gemstones became a universal currency. A single sapphire could buy passage, armies, or kingdoms  their value transcended language and border.',
    side: 'right',
    gemColor: '#ef4444', // Ruby Red
    glowColor: 'rgba(239, 68, 68, 0.45)',
    bgGlow: 'rgba(239, 68, 68, 0.14)',
    gemName: 'Ruby'
  },
  {
    period: '1800s',
    era: 'Colonial Era',
    headline: 'Formalised Mining',
    body: 'British colonial administration brought systematic mining to Ceylon. The gem trade was codified, export routes established, and the earliest quality grading standards attempted.',
    side: 'left',
    gemColor: '#f59e0b', // Golden Topaz / Yellow Sapphire
    glowColor: 'rgba(245, 158, 11, 0.45)',
    bgGlow: 'rgba(245, 158, 11, 0.12)',
    gemName: 'Yellow Sapphire'
  },
  {
    period: '1931',
    era: 'GIA Founded',
    headline: 'The Science of Rarity',
    body: 'The Gemological Institute of America established the 4C grading system cut, colour, clarity, carat. For the first time, rarity had a language that anyone could trust.',
    side: 'right',
    gemColor: '#e2e8f0', // White Sapphire / Diamond
    glowColor: 'rgba(226, 232, 240, 0.35)',
    bgGlow: 'rgba(226, 232, 240, 0.10)',
    gemName: 'White Sapphire'
  },
  {
    period: '2000s',
    era: 'Digital Access',
    headline: 'A Global Market Opens',
    body: 'Online platforms democratised gemstone access. Buyers in New York, Tokyo, and Dubai could now bid on stones unearthed in Sri Lanka within days of extraction.',
    side: 'left',
    gemColor: '#10b981', // Emerald Green
    glowColor: 'rgba(16, 185, 129, 0.45)',
    bgGlow: 'rgba(16, 185, 129, 0.14)',
    gemName: 'Emerald Tourmaline'
  },
  {
    period: '2024',
    era: 'THENNAKOON GEMS',
    headline: 'Live. Certified. Transparent.',
    body: 'Real-time auctions with full geological provenance, GIA certification, and conflict-free sourcing  the entire gem trade legacy, distilled into one platform.',
    side: 'right',
    gemColor: '#a855f7', // Star Amethyst / Purple Sapphire
    glowColor: 'rgba(168, 85, 247, 0.45)',
    bgGlow: 'rgba(168, 85, 247, 0.14)',
    gemName: 'Star Sapphire',
    isLast: true,
  },
]

function GemNode({ color, glowColor }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div 
      className="gh-timeline-node-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 0,
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translate(-50%, -50%) scale(1.3)' : 'translate(-50%, -50%) scale(1)'
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        width="32" 
        height="32" 
        style={{ 
          filter: `drop-shadow(0 0 8px ${glowColor})`,
          transition: 'filter 0.3s'
        }}
      >
        {/* Faceted Gemstone Shape (Hexagonal Brilliant-Cut Silhouette) */}
        <polygon points="50,5 85,25 85,75 50,95 15,75 15,25" fill={color} />
        {/* Highlight facets */}
        <polygon points="50,5 85,25 50,50" fill="#ffffff" opacity={hovered ? 0.35 : 0.22} style={{ transition: 'opacity 0.3s' }} />
        <polygon points="15,25 50,5 50,50" fill="#ffffff" opacity={hovered ? 0.25 : 0.12} style={{ transition: 'opacity 0.3s' }} />
        {/* Bottom / Depth facets */}
        <polygon points="50,95 85,75 50,50" fill="#000000" opacity="0.18" />
        <polygon points="15,75 50,95 50,50" fill="#000000" opacity="0.25" />
        {/* Table facet (center reflection) */}
        <polygon points="50,22 68,34 68,66 50,78 32,66 32,34" fill={color} opacity="0.95" style={{ filter: 'brightness(1.35)' }} />
      </svg>
    </div>
  )
}

function TimelineCard({ era }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div 
      className="gh-timeline-card-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 0,
        padding: '2rem',
        background: hovered ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.012)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${hovered ? era.gemColor : 'rgba(201,168,76,0.08)'}`,
        borderRadius: '8px',
        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
        boxShadow: hovered ? `0 12px 35px -12px ${era.glowColor}` : 'none',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        fontSize: '0.62rem', 
        letterSpacing: '0.28em', 
        textTransform: 'uppercase',
        color: era.gemColor, 
        marginBottom: '0.75rem',
        fontWeight: '600'
      }}>
        <span>{era.period}</span>
        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: era.gemColor }} />
        <span>{era.gemName}</span>
      </div>
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(1.25rem, 2vw, 1.8rem)',
        fontWeight: 500, 
        color: '#E8E0D0',
        letterSpacing: '-0.01em', 
        lineHeight: 1.2, 
        margin: '0 0 0.85rem',
      }}>
        {era.headline}
      </h3>
      <p style={{
        fontSize: '0.86rem', 
        lineHeight: 1.75,
        color: hovered ? 'rgba(232,224,208,0.78)' : 'rgba(232,224,208,0.48)',
        fontWeight: 300, 
        margin: 0,
        transition: 'color 0.3s'
      }}>
        {era.body}
      </p>
    </div>
  )
}

export default function GemHistory() {
  const sectionRef = useRef(null)
  const progressLineRef = useRef(null)
  const timelineContainerRef = useRef(null)
  const rowsRef = useRef([])
  const canvasRef = useRef(null)

  // Floating Gem Dust canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let particles = []
    const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#e2e8f0', '#10b981', '#a855f7']
    const mouse = { x: null, y: null, active: false }

    const resizeCanvas = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles
    const initParticles = () => {
      particles = []
      const density = Math.min(130, Math.floor((canvas.width * canvas.height) / 15000))
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.8 + 0.6,
          vx: Math.random() * 0.4 - 0.2,
          vy: -(Math.random() * 0.5 + 0.15), // Upward drift
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random(),
          pulseSpeed: Math.random() * 0.02 + 0.005,
          wobbleSpeed: Math.random() * 0.01 + 0.003,
          wobbleOffset: Math.random() * 100,
        })
      }
    }
    initParticles()

    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY
      particles.forEach(p => {
        // Move particles vertically with scroll for parallax depth
        p.y += diff * 0.22
      })
      lastScrollY = currentScrollY
    }
    window.addEventListener('scroll', handleScroll)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    const handleMouseLeave = () => {
      mouse.active = false
    }
    const parentSection = sectionRef.current
    if (parentSection) {
      parentSection.addEventListener('mousemove', handleMouseMove)
      parentSection.addEventListener('mouseleave', handleMouseLeave)
    }

    // Animation Loop
    let time = 0
    const animate = () => {
      time++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        // Upward movement
        p.y += p.vy
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.15

        // Shimmer opacity pulse
        p.alpha = Math.max(0.1, Math.min(1, p.alpha + Math.sin(time * p.pulseSpeed) * 0.03))

        // Mouse interaction (gentle repulsion)
        if (mouse.active && mouse.x !== null) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            const force = (150 - dist) / 150
            const angle = Math.atan2(dy, dx)
            p.x += Math.cos(angle) * force * 1.5
            p.y += Math.sin(angle) * force * 1.5
          }
        }

        // Boundary wrapping
        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        } else if (p.y > canvas.height + 10) {
          p.y = -10
        }
        if (p.x < -10) {
          p.x = canvas.width + 10
        } else if (p.x > canvas.width + 10) {
          p.x = -10
        }

        // Render particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowBlur = 6
        ctx.shadowColor = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0 // Reset shadow properties
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('scroll', handleScroll)
      if (parentSection) {
        parentSection.removeEventListener('mousemove', handleMouseMove)
        parentSection.removeEventListener('mouseleave', handleMouseLeave)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. ScrollTrigger to scale down/draw the timeline line
      if (progressLineRef.current && timelineContainerRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineContainerRef.current,
              start: 'top 35%',
              end: 'bottom 65%',
              scrub: true,
            }
          }
        )
      }

      // 2. Scroll-triggered staggered timelines for each row
      rowsRef.current.forEach((row, idx) => {
        if (!row) return

        const node = row.querySelector('.gh-timeline-node-container')
        const connector = row.querySelector('.gh-timeline-connector')
        const card = row.querySelector('.gh-timeline-card-container')
        const cardElements = card ? Array.from(card.children) : []

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        })

        // Pop the gemstone node
        if (node) {
          tl.fromTo(
            node,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.6)' }
          )
        }

        // Draw connector line (desktop only)
        if (connector) {
          tl.fromTo(
            connector,
            { width: 0, opacity: 0 },
            { width: '6%', opacity: 1, duration: 0.3, ease: 'power2.out' },
            '-=0.3'
          )
        }

        // Slide in the card
        if (card) {
          const slideX = ERAS[idx].side === 'left' ? 32 : -32
          tl.fromTo(
            card,
            { opacity: 0, x: slideX },
            { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out' },
            '-=0.45'
          )
        }

        // Stagger the text/elements inside the card
        if (cardElements.length > 0) {
          tl.fromTo(
            cardElements,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.12, ease: 'power2.out' },
            '-=0.55'
          )
        }

        // 3. ScrollTrigger to morph background ambient glows based on row active state
        const fadeIn = () => gsap.to(
          `.gh-timeline-ambient-glow-${idx}`,
          { opacity: 1, duration: 1.0, ease: 'power2.out', overwrite: 'auto' }
        )
        const fadeOut = () => gsap.to(
          `.gh-timeline-ambient-glow-${idx}`,
          { opacity: 0, duration: 1.0, ease: 'power2.out', overwrite: 'auto' }
        )

        ScrollTrigger.create({
          trigger: row,
          start: 'top 70%',
          end: 'bottom 20%',
          onEnter: fadeIn,
          onLeave: fadeOut,
          onEnterBack: fadeIn,
          onLeaveBack: fadeOut,
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: 'var(--bg)', padding: '120px 0 140px', position: 'relative', overflow: 'hidden' }}
    >
      {/* HTML5 Canvas Particle System - Floating Gem Dust */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Dynamic Ambient Background Glow Overlays */}
      <div 
        className="gh-timeline-glow-wrapper" 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          pointerEvents: 'none', 
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        {ERAS.map((era, idx) => (
          <div
            key={idx}
            className={`gh-timeline-ambient-glow-${idx}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              background: `radial-gradient(circle at ${era.side === 'left' ? '25%' : '75%'} 40vh, ${era.bgGlow} 0%, transparent 68%)`,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      {/* Top ambient warm glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 700, height: 320,
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '88px', padding: '0 2rem' }}>
        <div style={{
          fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1.25rem',
        }}>
          Est. Ancient Trade Routes
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
          fontWeight: 400, color: 'var(--gold-light)',
          letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0,
        }}>
          The Legacy Behind<br />Every Stone
        </h2>
        <div style={{
          width: 56, height: 1,
          background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
          margin: '2rem auto 0',
        }} />
      </div>

      {/* Timeline Container */}
      <div ref={timelineContainerRef} className="gh-timeline-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Background Grey Center Line */}
        <div className="gh-timeline-line-bg" aria-hidden="true" />

        {/* Dynamic Glowing Center Line (Controlled by GSAP) */}
        <div className="gh-timeline-line-progress-wrap" aria-hidden="true">
          <div ref={progressLineRef} className="gh-timeline-line-progress" />
        </div>

        {ERAS.map((era, i) => (
          <div
            key={i}
            ref={el => { rowsRef.current[i] = el }}
            className={`gh-timeline-row ${era.side === 'left' ? 'gh-timeline-row-left' : 'gh-timeline-row-right'}`}
            style={{
              marginBottom: i < ERAS.length - 1 ? '80px' : 0,
            }}
          >
            {/* Custom Gemstone Node */}
            <GemNode color={era.gemColor} glowColor={era.glowColor} />

            {/* Glowing connecting line from node to card (desktop only) */}
            <div 
              className="gh-timeline-connector"
              aria-hidden="true" 
              style={{
                position: 'absolute', 
                left: '50%', 
                top: '1.4rem',
                transform: 'translate(-50%, -50%)',
                width: '6%',
                height: 1,
                opacity: 0,
                background: `linear-gradient(to ${era.side === 'left' ? 'left' : 'right'}, ${era.gemColor}, transparent)`,
                [era.side === 'left' ? 'marginLeft' : 'marginRight']: '8px',
                [era.side === 'left' ? 'left' : 'right']: era.side === 'left' ? '50%' : 'auto',
              }} 
            />

            {/* Glassmorphic timeline card */}
            <TimelineCard era={era} />
          </div>
        ))}
      </div>

      {/* Bottom ambient warm glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 500, height: 200,
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Embedded Responsive Styles */}
      <style>{`
        .gh-timeline-container {
          position: relative;
          max-width: 920px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .gh-timeline-line-bg {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.15) 10%, rgba(201,168,76,0.15) 90%, transparent);
          transform: translateX(-50%);
          pointer-events: none;
        }
        .gh-timeline-line-progress-wrap {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 1;
        }
        .gh-timeline-line-progress {
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #3b82f6, #ef4444, #f59e0b, #e2e8f0, #10b981, #a855f7);
          transform-origin: top;
          box-shadow: 0 0 10px rgba(201,168,76,0.3);
        }
        .gh-timeline-row {
          display: flex;
          position: relative;
          width: 100%;
        }
        .gh-timeline-row-left {
          justify-content: flex-start;
        }
        .gh-timeline-row-right {
          justify-content: flex-end;
        }
        .gh-timeline-card-container {
          width: 43%;
          transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .gh-timeline-row-left .gh-timeline-card-container {
          margin-right: 7%;
        }
        .gh-timeline-row-right .gh-timeline-card-container {
          margin-left: 7%;
        }
        .gh-timeline-node-container {
          position: absolute;
          left: 50%;
          top: 1.4rem;
          transform: translate(-50%, -50%);
          z-index: 10;
        }

        @media (max-width: 768px) {
          .gh-timeline-line-bg {
            left: 20px !important;
            transform: none;
          }
          .gh-timeline-line-progress-wrap {
            left: 20px !important;
            transform: none;
          }
          .gh-timeline-row {
            justify-content: flex-end !important;
            padding-left: 45px;
            box-sizing: border-box;
          }
          .gh-timeline-card-container {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .gh-timeline-node-container {
            left: 20px !important;
            transform: translate(-50%, -50%) !important;
          }
          .gh-timeline-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
