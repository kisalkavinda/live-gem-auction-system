import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'

export default function CTABand() {
  const sectionRef = useRef(null)
  const btnRef = useRef(null)
  const titleRef = useRef(null)
  const magnetRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      }
    )
    gsap.fromTo(
      btnRef.current,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)', delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      }
    )
  }, [])

  // Magnetic button effect
  function onMouseMove(e) {
    const btn = magnetRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.3
    const dy = (e.clientY - cy) * 0.3
    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' })
  }

  function onMouseLeave() {
    gsap.to(magnetRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#050508',
        padding: '10rem 6vw',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Particle dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            borderRadius: '50%',
            background: `rgba(201,168,76,${Math.random() * 0.3 + 0.1})`,
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            animation: `particleDrift ${Math.random() * 6 + 4}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 4}s`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <span style={{
          display: 'block',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '1.5rem',
          opacity: 0.7,
        }}>
          ◆ Live Right Now
        </span>

        <h2
          ref={titleRef}
          style={{
            opacity: 0,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 300,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            maxWidth: '700px',
            margin: '0 auto 3rem',
          }}
        >
          Your next rare stone<br />
          <span style={{ color: '#C9A84C' }}>is live right now.</span>
        </h2>

        <div
          ref={btnRef}
          style={{ opacity: 0, display: 'inline-block' }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <button
            ref={magnetRef}
            style={{
              padding: '1.1rem 3.5rem',
              background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)',
              color: '#0A0A0D',
              border: 'none',
              borderRadius: '2px',
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 60px rgba(201,168,76,0.2)',
              willChange: 'transform',
              transition: 'box-shadow 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 80px rgba(201,168,76,0.4)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 60px rgba(201,168,76,0.2)'}
          >
            Start Bidding
          </button>
        </div>

        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.05em',
        }}>
          Free to register · No listing fees · GIA certified stones only
        </p>
      </div>
    </section>
  )
}
