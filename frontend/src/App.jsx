import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useLenis } from './hooks/useLenis'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import TunnelScrollHero from './components/TunnelScrollHero'
import GemHistory from './components/GemHistory'
import FeaturesSection from './components/FeaturesSection'
import AuctionsSection from './components/AuctionsSection'
import HowItWorks from './components/HowItWorks'
import CTABand from './components/CTABand'
import Footer from './components/Footer'
import ShopPage from './pages/ShopPage'
import GemDetailPage from './pages/GemDetailPage'

// Landing page keeps its own Preloader + Lenis scroll setup
function LandingPage() {
  const [ready, setReady] = useState(false)
  useLenis()

  const handlePreloaderDone = useCallback(() => {
    setReady(true)
  }, [])

  return (
    <>
      {!ready && <Preloader onComplete={handlePreloaderDone} />}
      <div style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.5s' }}>
        <Navbar visible={ready} />
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<GemDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

