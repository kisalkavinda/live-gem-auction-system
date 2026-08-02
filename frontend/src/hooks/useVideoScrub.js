import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

export function useVideoScrub(canvasRef, videoRef, containerRef) {
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const container = containerRef.current
    if (!canvas || !video || !container) return

    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      drawFrame()
    }

    function drawFrame() {
      if (video.readyState < 2) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const vw = video.videoWidth
      const vh = video.videoHeight
      const cw = window.innerWidth
      const ch = window.innerHeight

      // cover fill
      const scale = Math.max(cw / vw, ch / vh)
      const w = vw * scale
      const h = vh * scale
      const x = (cw - w) / 2
      const y = (ch - h) / 2

      ctx.drawImage(video, x, y, w, h)
    }

    const scrubObj = { t: 0 }

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (!video.duration) return
        const target = self.progress * video.duration

        // smooth lerp toward target
        gsap.to(scrubObj, {
          t: target,
          duration: 0.15,
          ease: 'none',
          overwrite: true,
          onUpdate: () => {
            video.currentTime = Math.min(scrubObj.t, video.duration - 0.01)
          },
        })
      },
    })

    // draw every animation frame
    function loop() {
      drawFrame()
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)

    video.addEventListener('loadedmetadata', resize)
    window.addEventListener('resize', resize)
    resize()

    return () => {
      trigger.kill()
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      video.removeEventListener('loadedmetadata', resize)
    }
  }, [canvasRef, videoRef, containerRef])
}
