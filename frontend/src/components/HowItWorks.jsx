import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const steps = [
  {
    num: '01',
    title: 'Register & Verify',
    desc: 'Create your account. Our team verifies identity before you bid — protecting every transaction on the platform.',
    accent: '#C9A84C',
    detail: 'KYC · AML Compliant · Encrypted Storage',
  },
  {
    num: '02',
    title: 'Browse Certified Gems',
    desc: 'Every stone comes with GIA certification, geological origin, carat weight, and 4K imaging.',
    accent: '#1D4ED8',
    detail: 'GIA · AGL · Gübelin Certified',
  },
  {
    num: '03',
    title: 'Bid in Real Time',
    desc: 'Live auctions with instant updates. Win, pay via escrow, and receive your gem fully insured.',
    accent: '#15803D',
    detail: 'Escrow · Insured Transit · Digital Certificate',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    // Horizontal scroll pin
    const totalWidth = track.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      )

      // Horizontal pin
      const scrollTween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth + window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Step cards stagger in as they come into view
      track.querySelectorAll('.step-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'left center',
              toggleActions: 'play none none reverse',
              containerAnimation: scrollTween,
            },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      style={{
        background: '#050508',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ padding: '8rem 6vw 4rem', position: 'relative', zIndex: 1 }}>
        <div ref={headingRef} style={{ opacity: 0, marginBottom: '4rem' }}>
          <span style={{
            display: 'block',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '0.75rem',
          }}>
            Process
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 300,
            color: '#fff',
            letterSpacing: '-0.02em',
          }}>
            How It Works
          </h2>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '3rem',
            paddingBottom: '4rem',
            width: 'max-content',
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="step-card"
              style={{
                width: 'min(500px, 75vw)',
                padding: '3rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '4px',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {/* Top line accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${step.accent}, transparent)`,
              }} />

              {/* Connecting line to next */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: '-3rem',
                  top: '50%',
                  width: '3rem',
                  height: '1px',
                  background: `linear-gradient(90deg, ${step.accent}40, transparent)`,
                }} />
              )}

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '5rem',
                color: 'rgba(255,255,255,0.04)',
                fontWeight: 700,
                lineHeight: 1,
                position: 'absolute',
                top: '1rem',
                right: '1.5rem',
                userSelect: 'none',
              }}>
                {step.num}
              </div>

              <div style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: step.accent,
                marginBottom: '1.5rem',
              }}>
                Step {step.num}
              </div>

              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.8rem',
                fontWeight: 400,
                color: '#fff',
                marginBottom: '1rem',
                letterSpacing: '-0.01em',
              }}>
                {step.title}
              </h3>

              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.8,
                marginBottom: '2rem',
                fontWeight: 300,
              }}>
                {step.desc}
              </p>

              <div style={{
                padding: '0.5rem 0',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
              }}>
                {step.detail}
              </div>
            </div>
          ))}

          {/* Extra spacing at end */}
          <div style={{ width: '10vw', flexShrink: 0 }} />
        </div>
      </div>
    </section>
  )
}
