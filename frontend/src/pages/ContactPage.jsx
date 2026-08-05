import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ContactPage.css'

export default function ContactPage() {
  const headerRef = useRef(null)
  const cardsRef = useRef([])
  
  useEffect(() => {
    window.scrollTo(0, 0)
    
    const tl = gsap.timeline()
    
    // Animate Header
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    
    // Stagger Cards
    tl.fromTo(
      cardsRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' },
      "-=0.6" // overlap with header animation
    )
  }, [])
  
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar visible={true} />
      
      <main style={{ flex: 1, paddingTop: '150px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 'min(1000px, 90vw)' }}>
          
          <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '1rem', opacity: 0 }}>
            <span style={{ color: 'var(--gold)', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600 }}>Get In Touch</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4.5rem', color: 'var(--gold-light)', fontWeight: 300, marginTop: '1rem' }}>Contact Us</h1>
            <p style={{ color: 'rgba(232,224,208,0.7)', marginTop: '1.5rem', maxWidth: '650px', margin: '1.5rem auto 0', lineHeight: 1.8, fontSize: '1.1rem' }}>
              Whether you are looking for a specific gemstone, need assistance with an auction, or have a general inquiry, our team of experts is here to assist you.
            </p>
          </div>
          
          <div className="contact-container">
            
            {/* Contact Info Card */}
            <div 
              ref={el => cardsRef.current[0] = el}
              className="contact-card" 
              style={{ opacity: 0 }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', color: 'var(--gold)', marginBottom: '3rem', fontWeight: 300 }}>Direct Contact</h3>
              
              <div className="contact-info-block">
                <h4>LOCATION</h4>
                <p>
                  142 Gem Street<br/>
                  Colombo 03<br/>
                  Sri Lanka
                </p>
              </div>
              
              <div className="contact-info-block">
                <h4>EMAIL</h4>
                <p>
                  inquiries@thennakoongems.com<br/>
                  support@thennakoongems.com
                </p>
              </div>
              
              <div className="contact-info-block" style={{ marginBottom: 0 }}>
                <h4>PHONE</h4>
                <p>
                  +94 11 234 5678<br/>
                  +94 77 123 4567
                </p>
              </div>
            </div>

            {/* Contact Form Card */}
            <div 
              ref={el => cardsRef.current[1] = el}
              className="contact-card" 
              style={{ opacity: 0 }}
            >
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.4rem', color: 'var(--gold-light)', marginBottom: '3rem', fontWeight: 300 }}>Send a Message</h3>
              
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(232,224,208,0.7)', fontSize: '0.75rem', marginBottom: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</label>
                  <input type="text" className="contact-input" placeholder="John Doe" />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: 'rgba(232,224,208,0.7)', fontSize: '0.75rem', marginBottom: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</label>
                  <input type="email" className="contact-input" placeholder="john@example.com" />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: 'rgba(232,224,208,0.7)', fontSize: '0.75rem', marginBottom: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Message</label>
                  <textarea rows="4" className="contact-input" style={{ resize: 'vertical' }} placeholder="How can we help you?"></textarea>
                </div>
                
                <button type="submit" className="contact-btn">
                  Send Message
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
