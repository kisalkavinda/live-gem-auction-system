import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const ERAS = [
  {
    period: '3000 BC',
    era: 'Ancient Sri Lanka',
    headline: 'The First Gem Traders',
    body: 'Ceylon sapphires and rubies traveled ancient trade routes to Egypt, Persia, and Rome. Kings and pharaohs prized these stones as symbols of divine power and cosmic protection.',
    side: 'left',
  },
  {
    period: '500 AD',
    era: 'The Silk Road',
    headline: 'Gems as Currency',
    body: 'As trade routes expanded across continents, gemstones became a universal currency. A single sapphire could buy passage, armies, or kingdoms — their value transcended language and border.',
    side: 'right',
  },
  {
    period: '1800s',
    era: 'Colonial Era',
    headline: 'Formalised Mining',
    body: 'British colonial administration brought systematic mining to Ceylon. The gem trade was codified, export routes established, and the earliest quality grading standards attempted.',
    side: 'left',
  },
  {
    period: '1931',
    era: 'GIA Founded',
    headline: 'The Science of Rarity',
    body: 'The Gemological Institute of America established the 4C grading system — cut, colour, clarity, carat. For the first time, rarity had a language that anyone could trust.',
    side: 'right',
  },
  {
    period: '2000s',
    era: 'Digital Access',
    headline: 'A Global Market Opens',
    body: 'Online platforms democratised gemstone access. Buyers in New York, Tokyo, and Dubai could now bid on stones unearthed in Sri Lanka within days of extraction.',
    side: 'left',
  },
  {
    period: '2024',
    era: 'GemHaven',
    headline: 'Live. Certified. Transparent.',
    body: 'Real-time auctions with full geological provenance, GIA certification, and conflict-free sourcing — the entire gem trade legacy, distilled into one platform.',
    side: 'right',
    isLast: true,
  },
]

export default function GemHistory() {
  const sectionRef = useRef(null)
  const nodesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      nodesRef.current.forEach((node) => {
        if (!node) return
        gsap.fromTo(
          node,
          { opacity: 0, y: 48 },
          {
            opacity: 1, y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: '#0D0A06', padding: '120px 0 140px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Top warm glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 700, height: 320,
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '88px', padding: '0 2rem' }}>
        <div style={{
          fontSize: '0.58rem', letterSpacing: '0.38em', textTransform: 'uppercase',
          color: '#C9A84C', marginBottom: '1.25rem',
        }}>
          Est. Ancient Trade Routes
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
          fontWeight: 400, color: '#E8E0D0',
          letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0,
        }}>
          The Legacy Behind<br />Every Stone
        </h2>
        <div style={{
          width: 56, height: 1,
          background: 'linear-gradient(to right, transparent, #C9A84C, transparent)',
          margin: '2rem auto 0',
        }} />
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', maxWidth: 920, margin: '0 auto', padding: '0 2rem' }}>
        {/* Centre line */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.28) 6%, rgba(201,168,76,0.28) 94%, transparent)',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }} />

        {ERAS.map((era, i) => (
          <div
            key={i}
            ref={el => { nodesRef.current[i] = el }}
            style={{
              opacity: 0,
              display: 'flex',
              justifyContent: era.side === 'left' ? 'flex-start' : 'flex-end',
              position: 'relative',
              marginBottom: i < ERAS.length - 1 ? '80px' : 0,
            }}
          >
            {/* Node dot */}
            <div aria-hidden="true" style={{
              position: 'absolute', left: '50%', top: '1.4rem',
              transform: 'translate(-50%, -50%)',
              width: 10, height: 10, borderRadius: '50%',
              background: era.isLast ? '#C9A84C' : 'transparent',
              border: `1px solid rgba(201,168,76,${era.isLast ? 0.9 : 0.5})`,
              boxShadow: era.isLast ? '0 0 14px rgba(201,168,76,0.55)' : 'none',
              zIndex: 2,
            }} />

            {/* Connector tick */}
            <div aria-hidden="true" style={{
              position: 'absolute', left: '50%', top: '1.4rem',
              transform: 'translate(-50%, -50%)',
              width: era.side === 'left' ? '6%' : '6%',
              height: 1,
              background: 'rgba(201,168,76,0.22)',
              [era.side === 'left' ? 'marginLeft' : 'marginRight']: '5px',
              [era.side === 'left' ? 'left' : 'right']: era.side === 'left' ? '50%' : 'auto',
            }} />

            {/* Card */}
            <div style={{
              width: '43%',
              padding: '1.75rem 2rem',
              background: 'rgba(201,168,76,0.035)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: '2px',
              [era.side === 'left' ? 'marginRight' : 'marginLeft']: '7%',
              transition: 'border-color 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)' }}
            >
              <div style={{
                fontSize: '0.52rem', letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.58)', marginBottom: '0.5rem',
              }}>
                {era.period} — {era.era}
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.15rem, 2vw, 1.65rem)',
                fontWeight: 500, color: '#E8E0D0',
                letterSpacing: '-0.01em', lineHeight: 1.2, margin: '0 0 0.75rem',
              }}>
                {era.headline}
              </h3>
              <p style={{
                fontSize: '0.84rem', lineHeight: 1.72,
                color: 'rgba(232,224,208,0.5)',
                fontWeight: 300, margin: 0,
              }}>
                {era.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom warm glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 500, height: 200,
        background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @media (max-width: 680px) {
          .gh-timeline-card { width: 82% !important; margin-left: 0 !important; margin-right: 0 !important; }
          .gh-timeline-row  { justify-content: center !important; }
        }
      `}</style>
    </section>
  )
}
