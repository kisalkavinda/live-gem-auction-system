import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const features = [
  {
    icon: '◈',
    title: 'GIA Certified',
    desc: 'Every stone carries full GIA documentation — grade, origin, weight, treatment history. Zero ambiguity.',
    accent: '#B91C1C',
  },
  {
    icon: '⬡',
    title: 'Live Bidding',
    desc: 'Real-time auction engine. Sub-100ms bid propagation. Every participant sees the same price simultaneously.',
    accent: '#1D4ED8',
  },
  {
    icon: '◇',
    title: 'Escrow Protected',
    desc: 'Funds held in escrow until gem delivery confirmed. Fully insured transit on every transaction.',
    accent: '#15803D',
  },
]

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    function onMove(e) {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to(card, {
        rotateY: x * 18,
        rotateX: -y * 18,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 800,
      })

      gsap.to(glowRef.current, {
        opacity: 0.6,
        x: x * 40,
        y: y * 40,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    function onLeave() {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.6)',
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
      { opacity: 0, y: 60, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.12,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
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
        padding: '2.5rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '4px',
        cursor: 'default',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      {/* Glow */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: '-50%',
          background: `radial-gradient(circle at center, ${feature.accent}30, transparent 60%)`,
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* Top border accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${feature.accent}80, transparent)`,
      }} />

      <div style={{
        fontSize: '2rem',
        color: feature.accent,
        marginBottom: '1.5rem',
        display: 'block',
      }}>
        {feature.icon}
      </div>

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.4rem',
        fontWeight: 400,
        color: '#fff',
        marginBottom: '0.75rem',
        letterSpacing: '0.02em',
      }}>
        {feature.title}
      </h3>

      <p style={{
        fontSize: '0.85rem',
        color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.8,
        fontWeight: 300,
      }}>
        {feature.desc}
      </p>
    </div>
  )
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
        background: '#050508',
        padding: '10rem 6vw',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient gem glow background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '80vw',
        background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={headingRef} style={{ opacity: 0, marginBottom: '5rem' }}>
          <span style={{
            display: 'block',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '0.75rem',
          }}>
            Why GemHaven
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Built for serious collectors
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
