import { useState, useCallback } from 'react'
import { useLenis } from './hooks/useLenis'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import GemHero from './components/GemHero'
import TunnelScrollHero from './components/TunnelScrollHero'
import GemHistory from './components/GemHistory'
import FeaturesSection from './components/FeaturesSection'
import AuctionsSection from './components/AuctionsSection'
import HowItWorks from './components/HowItWorks'
import CTABand from './components/CTABand'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)

  useLenis()

  const handlePreloaderDone = useCallback(() => {
    setReady(true)
  }, [])

  return (
    <>
      <Preloader onComplete={handlePreloaderDone} />

      <div style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.5s' }}>
        <Navbar visible={ready} />
        <GemHero />
        <TunnelScrollHero />
        <GemHistory />
        <FeaturesSection />
        <AuctionsSection />
        <HowItWorks />
        <CTABand />
        <Footer />
      </div>
    </>
  )
}
