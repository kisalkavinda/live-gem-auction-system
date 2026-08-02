import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from '../utils/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisInstance = lenis

    // Sync Lenis with GSAP ticker — single rAF loop
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Keep ScrollTrigger in sync
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      lenisInstance = null
    }
  }, [])
}
