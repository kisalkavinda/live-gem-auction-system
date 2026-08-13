import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const features = [
  {
    title: 'GIA Certified',
    desc: 'Every stone carries full GIA documentation — grade, origin, weight, treatment history. Zero ambiguity.',
    accent: '#ef4444', // Premium Ruby Red
    icon: (accent) => (
      <svg viewBox="0 0 100 100" width="44" height="44" style={{ fill: 'none', stroke: accent, strokeWidth: 1.5, overflow: 'visible' }}>
        <polygon points="50,12 85,32 85,68 50,88 15,68 15,32" />
        <line x1="15" y1="32" x2="85" y2="32" />
        <line x1="15" y1="32" x2="50" y2="88" />
        <line x1="85" y1="32" x2="50" y2="88" />
        <line x1="50" y1="12" x2="50" y2="88" />
        <line x1="50" y1="12" x2="15" y2="32" />
        <line x1="50" y1="12" x2="85" y2="32" />
        <circle cx="50" cy="50" r="3" fill={accent} opacity="0.7" />
      </svg>
    )
  },
  {
    title: 'Live Bidding',
    desc: 'Real-time auction engine. Sub-100ms bid propagation. Every participant sees the same price simultaneously.',
    accent: '#3b82f6', // Sapphire Blue
    icon: (accent) => (
      <svg viewBox="0 0 100 100" width="44" height="44" style={{ fill: 'none', stroke: accent, strokeWidth: 1.5, overflow: 'visible' }}>
        <path d="M32,45 L50,27 L70,47 L52,65 Z" />
        <line x1="42.5" y1="54.5" x2="20" y2="77" strokeWidth="2.5" />
        <line x1="15" y1="84" x2="45" y2="84" strokeWidth="2" />
        {/* Radar pulses */}
        <path d="M65,30 A 28 28 0 0 1 88,58" strokeDasharray="3 3" />
        <path d="M72,20 A 40 40 0 0 1 97,58" />
      </svg>
    )
  },
  {
    title: 'Escrow Protected',
    desc: 'Funds held in escrow until gem delivery confirmed. Fully insured transit on every transaction.',
    accent: '#10b981', // Emerald Green
    icon: (accent) => (
      <svg viewBox="0 0 100 100" width="44" height="44" style={{ fill: 'none', stroke: accent, strokeWidth: 1.5, overflow: 'visible' }}>
        <path d="M30,22 L50,12 L70,22 C70,48 50,78 50,78 C50,78 30,48 30,22 Z" />
        <path d="M42,42 L48,48 L58,36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="86" r="3.5" fill={accent} />
        <circle cx="50" cy="86" r="8" stroke={accent} strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    )
  },
]

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    function onMove(e) {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      
      setCoords({ x, y })
      setHovered(true)

      gsap.to(card, {
        rotateY: x * 15,
        rotateX: -y * 15,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      })

      gsap.to(glowRef.current, {
        opacity: 0.75,
        x: x * 35,
        y: y * 35,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    function onLeave() {
      setHovered(false)
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.65,
        ease: 'power3.out',
      })
      gsap.to(glowRef.current, {
        opacity: 0,
        x: 0,
        y: 0,
        duration: 0.4,
      })
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.fromTo(
      card,
      { opacity: 0, y: 60, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.15,
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [index])

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        padding: '3.5rem 2.5rem',
        background: hovered 
          ? 'linear-gradient(160deg, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.9) 100%)' 
          : 'linear-gradient(160deg, rgba(20,20,20,0.5) 0%, rgba(5,5,5,0.7) 100%)',
        backdropFilter: 'blur(24px)',
        border: hovered ? `1px solid ${feature.accent}40` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        cursor: 'default',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxShadow: hovered 
          ? `0 30px 60px -20px ${feature.accent}50, inset 0 1px 0 rgba(255,255,255,0.15)` 
          : '0 15px 35px -15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* 1. Dynamic Refractive Facet Overlay (moves with mouse, mimics reflection) */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${110 + coords.x * 60}deg, transparent 38%, ${feature.accent}20 50%, transparent 62%)`,
          opacity: hovered ? 1 : 0,
          mixBlendMode: 'color-dodge',
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
          zIndex: 1,
        }}
      />

      {/* 2. Interactive Outer Radial Glow */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: '-60%',
          background: `radial-gradient(circle at center, ${feature.accent}35, transparent 65%)`,
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          zIndex: 0,
        }}
      />

      {/* 3. Perimeter Gradient Light Trace */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '24px',
          padding: '1px',
          background: hovered 
            ? `conic-gradient(from ${timeToAngle(coords.x, coords.y)}deg, transparent, ${feature.accent}dd, transparent 30%, transparent)` 
            : 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent, rgba(255,255,255,0.02))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'background 0.4s ease',
        }}
      />

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 3, transform: 'translateZ(30px)' }}>
        
        {/* Dynamic SVG Icon */}
        <div style={{
          marginBottom: '2rem',
          display: 'inline-block',
          transform: hovered ? 'scale(1.08) translateZ(10px)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}>
          {feature.icon(feature.accent)}
        </div>

        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.75rem',
          fontWeight: 500,
          color: hovered ? '#fff' : '#E8E0D0',
          marginBottom: '1rem',
          letterSpacing: '0.02em',
          transition: 'color 0.3s ease',
        }}>
          {feature.title}
        </h3>

        <p style={{
          fontSize: '0.95rem',
          color: hovered ? 'rgba(232,224,208,0.85)' : 'rgba(232,224,208,0.55)',
          lineHeight: 1.7,
          fontWeight: 300,
          transition: 'color 0.3s ease',
        }}>
          {feature.desc}
        </p>
      </div>
    </div>
  )
}

// Helper to determine gradient angle based on mouse coordinates
function timeToAngle(x, y) {
  const angleRad = Math.atan2(y, x)
  const angleDeg = (angleRad * 180) / Math.PI + 180
  return angleDeg
}

export default function FeaturesSection() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#070503', // Match main cavern theme
        padding: '11rem 6vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient warm background illumination */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        height: '90vw',
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.02) 0%, transparent 68%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Section title */}
        <div ref={headingRef} style={{ opacity: 0, marginBottom: '5.5rem' }}>
          <span style={{
            display: 'block',
            fontSize: '0.62rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '0.9rem',
            fontWeight: '600',
          }}>
            Why THENNAKOON GEMS
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 300,
            color: '#E8E0D0',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Built for serious collectors
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="gh-features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .gh-features-grid {
            grid-template-columns: 1fr !important;
            gap: 1.8rem !important;
          }
        }
      `}</style>
    </section>
  )
}
