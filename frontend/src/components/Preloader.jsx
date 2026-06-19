import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null)
  const barRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
    )

    function updateProgress(val) {
      gsap.to(barRef.current, {
        scaleX: val,
        duration: 0.3,
        ease: 'power2.out',
        transformOrigin: 'left center',
        overwrite: true,
      })
    }

    function finish() {
      const el = rootRef.current
      if (!el) { onComplete(); return }
      gsap.to(el, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 0.3,
        onComplete,
      })
    }

    updateProgress(0.1)
    const t1 = setTimeout(() => updateProgress(0.6), 300)
    const t2 = setTimeout(() => updateProgress(1), 700)
    const t3 = setTimeout(finish, 900)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#050508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <div ref={logoRef} style={{ opacity: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem', color: '#C9A84C' }}>◆</span>
          <span style={{
            fontSize: '1.5rem',
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: '0.3em',
            color: '#fff',
            fontWeight: 300,
          }}>
            GEMHAVEN
          </span>
        </div>
      </div>

      <div style={{
        width: '200px',
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '1px',
        overflow: 'hidden',
      }}>
        <div
          ref={barRef}
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #C9A84C, #E8D5A3)',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
          }}
        />
      </div>
    </div>
  )
}
