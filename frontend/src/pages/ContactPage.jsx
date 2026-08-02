import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ContactPage() {
  const containerRef = useRef(null)
  
  useEffect(() => {
    window.scrollTo(0, 0)
    
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
  }, [])
  
  return (
    <div style={{ background: '#0A0A0D', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar visible={true} />
      
      <main style={{ flex: 1, paddingTop: '150px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <div ref={containerRef} style={{ width: 'min(900px, 90vw)' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: '#C9A84C', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600 }}>Get In Touch</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '4rem', color: '#E8E0D0', fontWeight: 300, marginTop: '1rem' }}>Contact Us</h1>
            <p style={{ color: 'rgba(232,224,208,0.6)', marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: 1.7 }}>
              Whether you are looking for a specific gemstone, need assistance with an auction, or have a general inquiry, our team of experts is here to assist you.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            
            {/* Contact Info */}
            <div style={{ padding: '3.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: '#C9A84C', marginBottom: '2.5rem', fontWeight: 300 }}>Direct Contact</h3>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ color: '#E8E0D0', fontSize: '0.85rem', marginBottom: '0.8rem', letterSpacing: '0.15em', fontWeight: 600 }}>LOCATION</h4>
                <p style={{ color: 'rgba(232,224,208,0.5)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  142 Gem Street<br/>
                  Colombo 03<br/>
                  Sri Lanka
                </p>
              </div>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ color: '#E8E0D0', fontSize: '0.85rem', marginBottom: '0.8rem', letterSpacing: '0.15em', fontWeight: 600 }}>EMAIL</h4>
                <p style={{ color: 'rgba(232,224,208,0.5)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  inquiries@thennakoongems.com<br/>
                  support@thennakoongems.com
                </p>
              </div>
              
              <div>
                <h4 style={{ color: '#E8E0D0', fontSize: '0.85rem', marginBottom: '0.8rem', letterSpacing: '0.15em', fontWeight: 600 }}>PHONE</h4>
                <p style={{ color: 'rgba(232,224,208,0.5)', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  +94 11 234 5678<br/>
                  +94 77 123 4567
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ padding: '3.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: '#E8E0D0', marginBottom: '2.5rem', fontWeight: 300 }}>Send a Message</h3>
              
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(232,224,208,0.6)', fontSize: '0.75rem', marginBottom: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</label>
                  <input type="text" style={{ width: '100%', padding: '1rem 1.2rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '4px', outline: 'none', transition: 'border-color 0.3s' }} placeholder="John Doe" />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: 'rgba(232,224,208,0.6)', fontSize: '0.75rem', marginBottom: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</label>
                  <input type="email" style={{ width: '100%', padding: '1rem 1.2rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '4px', outline: 'none', transition: 'border-color 0.3s' }} placeholder="john@example.com" />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: 'rgba(232,224,208,0.6)', fontSize: '0.75rem', marginBottom: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Message</label>
                  <textarea rows="4" style={{ width: '100%', padding: '1rem 1.2rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '4px', outline: 'none', resize: 'vertical', transition: 'border-color 0.3s' }} placeholder="How can we help you?"></textarea>
                </div>
                
                <button type="submit" style={{ padding: '1.1rem', background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', color: '#0A0A0D', border: 'none', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', marginTop: '1rem', transition: 'transform 0.2s', textTransform: 'uppercase' }}>
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
