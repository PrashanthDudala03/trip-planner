import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import '../App.css';

function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <FaPlane style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'float 3s ease-in-out infinite' }} />
          
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Trip Planner
          </h1>
          
          <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', opacity: 0.95 }}>
            Plan Your Perfect Adventure
          </h2>
          
          <p style={{ fontSize: '1.3rem', marginBottom: '1rem', opacity: 0.9, fontStyle: 'italic', lineHeight: '1.8' }}>
            "The world is a book, and those who do not travel read only one page."
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem', opacity: 0.85 }}>
            — Saint Augustine
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn" style={{
              background: 'white',
              color: '#667eea',
              padding: '1rem 2.5rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              borderRadius: '50px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              transition: 'all 0.3s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
            }}>
              <FaUserPlus /> Get Started
            </Link>

            <Link to="/login" className="btn" style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '1rem 2.5rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              borderRadius: '50px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '2px solid white',
              transition: 'all 0.3s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#667eea';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = 'white';
            }}>
              <FaSignInAlt /> Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#2d3748' }}>
            Why Choose Trip Planner?
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '✈️', title: 'Plan Trips', desc: 'Organize your travels with ease' },
              { icon: '📅', title: 'Create Itineraries', desc: 'Schedule activities and events' },
              { icon: '💰', title: 'Track Expenses', desc: 'Monitor your travel budget' },
              { icon: '✅', title: 'Checklists', desc: 'Never forget important items' }
            ].map((feature, i) => (
              <div key={i} style={{
                padding: '2rem',
                textAlign: 'center',
                borderRadius: '15px',
                background: '#f7fafc',
                transition: 'all 0.3s'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#2d3748' }}>{feature.title}</h3>
                <p style={{ color: '#718096' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#2d3748',
        color: 'white',
        padding: '3rem 2rem 2rem',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* About */}
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaPlane /> Trip Planner
              </h3>
              <p style={{ color: '#cbd5e0', lineHeight: '1.6' }}>
                Your ultimate companion for planning unforgettable journeys. Organize, track, and make every trip memorable.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Contact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#cbd5e0' }}>
                <a href="tel:+917893632527" style={{ color: '#cbd5e0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaPhone /> +91 7893632527
                </a>
                <a href="mailto:prashanthgoud8100@gmail.com" style={{ color: '#cbd5e0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaEnvelope /> prashanthgoud8100@gmail.com
                </a>
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Connect</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="https://github.com/PrashanthDudala03" target="_blank" rel="noopener noreferrer" style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: '#4a5568',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.3rem',
                  transition: 'all 0.3s'
                }} onMouseEnter={(e) => e.currentTarget.style.background = '#667eea'} onMouseLeave={(e) => e.currentTarget.style.background = '#4a5568'}>
                  <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/prashanth-dudala" target="_blank" rel="noopener noreferrer" style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: '#4a5568',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.3rem',
                  transition: 'all 0.3s'
                }} onMouseEnter={(e) => e.currentTarget.style.background = '#0077b5'} onMouseLeave={(e) => e.currentTarget.style.background = '#4a5568'}>
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: '1px solid #4a5568',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#cbd5e0'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              © {new Date().getFullYear()} Trip Planner. All rights reserved.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Developed with ❤️ by <strong style={{ color: 'white' }}>Prashanth Dudala</strong>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

export default Home;
