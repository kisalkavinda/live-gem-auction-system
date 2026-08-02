import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const steps = [
  {
    num: '01',
    title: 'Register & Verify',
    desc: 'Create your account. Our team verifies identity before you bid  protecting every transaction on the platform.',
    accent: '#C9A84C', // Gold instead of Ruby Red
    detail: 'KYC · AML Compliant · Encrypted Storage',
  },
  {
    num: '02',
    title: 'Browse Certified Gems',
    desc: 'Every stone comes with GIA certification, geological origin, carat weight, and 4K imaging.',
    accent: '#D4B86A', // Lighter Gold instead of Sapphire Blue
    detail: 'GIA · AGL · Gübelin Certified',
  },
  {
    num: '03',
    title: 'Bid in Real Time',
    desc: 'Live auctions with instant updates. Win, pay via escrow, and receive your gem fully insured.',
    accent: '#E8E0D0', // Champagne instead of Emerald Green
    detail: 'Escrow · Insured Transit · Digital Certificate',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const headingRef = useRef(null)
  const conduitsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth
      
      // Calculate a longer scroll distance to make the scrolling feel much slower and more controlled
      const scrollDistance = totalWidth * 2.5 + window.innerWidth;

      // 1. Heading entrance
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      )

      // 2. Horizontal Scroll Pinning (Scrubber)
      const scrollTween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          scrub: 1.5, // Added more inertia for smoother feeling
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 3. Step Card Fade-in Elevation
      track.querySelectorAll('.step-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'left 85%',
              toggleActions: 'play none none reverse',
              containerAnimation: scrollTween,
            },
          }
        )
      })

      // 4. Parallax scroll effect for large background step numbers
      track.querySelectorAll('.step-number').forEach((num) => {
        gsap.fromTo(
          num,
          { x: 60, opacity: 0 },
          {
            x: -60,
            opacity: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: num,
              start: 'left right',
              end: 'right left',
              scrub: true,
              containerAnimation: scrollTween,
            }
          }
        )
      })

      // 5. Conduit light flow zipping along the horizontal path
      conduitsRef.current.forEach((conduit) => {
        if (!conduit) return
        gsap.fromTo(
          conduit,
          { strokeDashoffset: 160 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: conduit,
              start: 'left 90%',
              end: 'right 30%',
              scrub: 1, // Smoothed conduit animation
              containerAnimation: scrollTween,
            }
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
        background: '#070503', 
        overflow: 'hidden',
        position: 'relative',
        padding: '10rem 0 6rem 0',
      }}
    >
      <div style={{ padding: '0 6vw', position: 'relative', zIndex: 1 }}>
        
        {/* Section Heading */}
        <div ref={headingRef} style={{ opacity: 0, marginBottom: '5rem' }}>
          <span style={{
            display: 'block',
            fontSize: '0.62rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '0.9rem',
            fontWeight: '600',
          }}>
            Process
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 300,
            color: '#E8E0D0',
            letterSpacing: '-0.02em',
          }}>
            How It Works
          </h2>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: '4.5rem',
            paddingBottom: '6rem',
            width: 'max-content',
            alignItems: 'center',
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4.5rem',
              }}
            >
              {/* Step Card body */}
              <div
                className="step-card"
                style={{
                  width: 'min(460px, 72vw)',
                  padding: '3.5rem 3rem',
                  background: 'rgba(255,255,255,0.035)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '6px',
                  position: 'relative',
                  flexShrink: 0,
                  boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
                  '--accent': step.accent,
                  '--accent-glow': `${step.accent}20`,
                }}
              >
                {/* Colored Top edge light trace line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${step.accent}, transparent 80%)`,
                  borderRadius: '6px 6px 0 0',
                }} />

                {/* Parallax horizontal slide background number */}
                <div 
                  className="step-number"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '6.5rem',
                    color: step.accent,
                    opacity: 0.05,
                    fontWeight: 700,
                    lineHeight: 1,
                    position: 'absolute',
                    top: '0.8rem',
                    right: '1.8rem',
                    userSelect: 'none',
                    willChange: 'transform',
                  }}
                >
                  {step.num}
                </div>

                <div style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: step.accent,
                  marginBottom: '1.8rem',
                  fontWeight: '600',
                }}>
                  Step {step.num}
                </div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.9rem',
                  fontWeight: 400,
                  color: '#fff',
                  marginBottom: '1.1rem',
                  letterSpacing: '-0.01em',
                }}>
                  {step.title}
                </h3>

                <p 
                  className="step-desc"
                  style={{
                    fontSize: '0.88rem',
                    color: 'rgba(232,224,208,0.65)',
                    lineHeight: 1.85,
                    marginBottom: '2.2rem',
                    fontWeight: 300,
                  }}
                >
                  {step.desc}
                </p>

                <div 
                  className="step-detail"
                  style={{
                    paddingTop: '0.9rem',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(232,224,208,0.32)',
                    textTransform: 'uppercase',
                    fontWeight: '500',
                  }}
                >
                  {step.detail}
                </div>
              </div>

              {/* Glowing SVG Conduit Connector (scrolling power-flow line) */}
              {i < steps.length - 1 && (
                <div style={{ width: '4.5rem', height: '14px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Shadow rail */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Light conduit tube */}
                    <line 
                      ref={el => { conduitsRef.current[i] = el }}
                      x1="0" y1="10" x2="100" y2="10" 
                      stroke={step.accent} 
                      strokeWidth="2.5" 
                      strokeDasharray="40 120" 
                      strokeLinecap="round"
                      style={{ willChange: 'stroke-dashoffset' }}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* Extra spacing at the end */}
          <div style={{ width: '12vw', flexShrink: 0 }} />
        </div>
      </div>

      {/* Embedded Responsive Styles */}
      <style>{`
        .gh-timeline-container {
          position: relative;
          max-width: 920px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .step-card {
          transform: translateY(0) scale(1);
          transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      background-color 0.5s ease, 
                      border-color 0.5s ease, 
                      box-shadow 0.5s ease !important;
        }
        
        .step-card:hover {
          transform: translateY(-8px) scale(1.02);
          background-color: rgba(255, 255, 255, 0.055) !important;
          border-color: var(--accent) !important;
          box-shadow: 0 35px 70px -15px var(--accent-glow) !important;
        }

        .step-desc {
          transition: color 0.4s ease;
        }
        .step-card:hover .step-desc {
          color: rgba(255, 255, 255, 0.88) !important;
        }

        .step-detail {
          transition: color 0.4s ease, border-color 0.4s ease;
        }
        .step-card:hover .step-detail {
          color: rgba(255, 255, 255, 0.55) !important;
          border-top-color: rgba(255, 255, 255, 0.12) !important;
        }
      `}</style>
    </section>
  )
}
