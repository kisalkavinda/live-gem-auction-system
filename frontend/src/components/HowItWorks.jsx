import React, { useRef, useEffect } from 'react'
import { gsap } from '../utils/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Register & Verify',
    desc: 'Create your account. Our team verifies identity before you bid, ensuring complete transparency and security for every transaction.',
    detail: 'KYC · AML Compliant · Encrypted Storage',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Browse Certified Gems',
    desc: 'Every stone in our collection comes with rigorous GIA certification, precise geological origin tracing, and high-definition 4K imaging.',
    detail: 'GIA · AGL · Gübelin Certified',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h1.5M20.25 6A2.25 2.25 0 0018 3.75h-1.5m-15 15A2.25 2.25 0 006 20.25h1.5m11.25 0a2.25 2.25 0 002.25-2.25v-1.5m-15-12a2.25 2.25 0 00-2.25 2.25v15c0 1.242 1.008 2.25 2.25 2.25h15A2.25 2.25 0 0022.5 19.5v-15a2.25 2.25 0 00-2.25-2.25h-15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v.01M12 8.25v.01M12 15.75v.01" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Bid in Real Time',
    desc: 'Participate in live auctions with instant updates. Win your bid, pay securely via escrow, and receive your gem fully insured.',
    detail: 'Escrow · Insured Transit · Digital Certificate',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.041-2.168m-15.75-1.5v-1.5a1.575 1.575 0 013.15 0v1.5" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(
        '.hw-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(
        '.snap-card',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.4, ease: 'power3.out' },
        "-=0.4"
      )
      .fromTo(
        '.process-arrow',
        { opacity: 0, scale: 0 },
        { opacity: 0.5, scale: 1, duration: 0.4, stagger: 0.4, ease: 'back.out(1.7)' },
        "<0.2"
      );
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: '#070503', padding: '10vh 0', position: 'relative' }}>
      
      <div className="hw-content" style={{ width: '100%', padding: '0 6vw' }}>
        
        {/* Header */}
        <div className="hw-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            marginBottom: '1rem',
            fontWeight: '600',
          }}>
            Process
          </span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 300,
            color: '#E8E0D0',
            letterSpacing: '-0.02em',
          }}>
            How It Works
          </h2>
          <p style={{ color: 'rgba(232,224,208,0.6)', maxWidth: '600px', margin: '1rem auto 0', lineHeight: 1.6 }}>
            Experience a seamless, secure, and transparent auction process designed for elite gemstone collectors globally.
          </p>
        </div>

        <div className="horizontal-snap-container">
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <div
                className="snap-card"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  padding: '2rem',
                  borderRadius: '16px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Floating Step number badge */}
                <div style={{
                  position: 'absolute',
                  top: '-1rem',
                  left: '1.5rem',
                  background: '#070503',
                  border: '1px solid rgba(201,168,76,0.4)',
                  padding: '0.25rem 0.8rem',
                  borderRadius: '50px',
                  color: '#C9A84C',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                }}>
                  STEP {step.num}
                </div>

                <div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    color: '#C9A84C',
                    background: 'rgba(201,168,76,0.1)',
                    borderRadius: '10px',
                    padding: '8px',
                    marginBottom: '1.2rem',
                    marginTop: '0.5rem'
                  }}>
                    {step.icon}
                  </div>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    color: '#E8E0D0',
                    marginBottom: '0.75rem',
                  }}>
                    {step.title}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(232,224,208,0.7)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem',
                    fontWeight: 300,
                  }}>
                    {step.desc}
                  </p>
                </div>

                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(201,168,76,0.6)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}>
                  {step.detail}
                </div>
              </div>
              
              {/* Arrow between cards */}
              {i < steps.length - 1 && (
                <div className="process-arrow" style={{ color: '#C9A84C' }}>
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '32px', height: '32px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .horizontal-snap-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-top: 1.5rem;
          padding-bottom: 2rem;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        
        .horizontal-snap-container::-webkit-scrollbar {
          display: none;
        }
        
        .snap-card {
          min-width: 80vw;
          scroll-snap-align: start;
          flex-shrink: 0;
          transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }
        
        .snap-card:hover {
          border-color: rgba(201,168,76,0.5) !important;
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
        }

        .process-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0 0.5rem;
        }

        @media (min-width: 768px) {
          .snap-card {
            min-width: 340px;
          }
        }

        @media (min-width: 1024px) {
          .horizontal-snap-container {
            overflow-x: visible;
            justify-content: space-between;
            gap: 1rem;
          }
          .snap-card {
            min-width: 0;
            flex: 1 1 0;
          }
          .process-arrow {
            padding: 0;
          }
        }
      `}</style>
    </section>
  )
}
