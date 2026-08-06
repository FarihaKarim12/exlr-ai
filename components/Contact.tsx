'use client'

import { useState } from 'react'
import { Clock3, Mail, MapPin } from 'lucide-react'
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_2f9mvom'
const TEMPLATE_ID = 'template_7ufklzv'
const PUBLIC_KEY = 'xP84vIokiIqmMCyFb'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: form.name,
        email: form.email,
        title: form.subject || 'No subject',
        message: form.message,
      }, PUBLIC_KEY)
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(10, 14, 26, 0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 11,
    padding: '12px 16px',
    fontSize: 13,
    color: '#f8fafc',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.25s ease',
    backdropFilter: 'blur(8px)',
  } as React.CSSProperties

  return (
    <section id="contact" style={{
      padding: '90px 24px',
      background: 'transparent',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(15,20,34,0.3)',
        backdropFilter: 'blur(2px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'start',
        }} className="contact-grid">

          {/* Left */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#6366f1',
              letterSpacing: '.12em', textTransform: 'uppercase',
              marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 20, height: 1, background: '#6366f1', display: 'inline-block' }} />
              Get in touch
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700, letterSpacing: '-1.5px',
              lineHeight: 1.1, marginBottom: 18,
            }}>
              Have a{' '}
              <span style={{ color: '#818cf8', textShadow: '0 0 40px rgba(99,102,241,0.5)' }}>question</span>
              <br />or suggestion?
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.75, marginBottom: 36, fontWeight: 400 }}>
              Drop a message and we'll get back to you as soon as possible.
              We read every message personally.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Email', value: 'exlrai.official@gmail.com', color: '#6366f1' },
                { label: 'Location', value: 'Karachi, Pakistan', color: '#22d3ee' },
                { label: 'Response time', value: 'Within 24 hours', color: '#4ade80' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: 'rgba(15,20,34,0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 13, padding: '14px 18px',
                  transition: 'all 0.25s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${item.color}30`
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  
                  <div>
                    <div style={{ fontSize: 13, color: '#64748b', marginBottom: 3, fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div style={{
            background: 'rgba(15,20,34,0.5)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: 34,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Your name</label>
                <input style={inputStyle} placeholder="Ahmed Ali"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Email address</label>
                <input style={inputStyle} type="email" placeholder="ahmed@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Subject</label>
              <input style={inputStyle} placeholder="e.g. Request for Physics notes"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Message</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
                placeholder="Write your message here..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <button onClick={handleSubmit} disabled={status === 'sending'} style={{
              width: '100%', padding: '13px',
              borderRadius: 11,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
              transition: 'all 0.25s ease',
              opacity: status === 'sending' ? 0.7 : 1,
              letterSpacing: '-0.2px',
            }}
              onMouseEnter={e => {
                if (status !== 'sending') {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.5)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'
              }}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'sent' && (
              <div style={{
                marginTop: 14, padding: '12px 16px', borderRadius: 11,
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
                fontSize: 13, color: '#4ade80', textAlign: 'center', fontWeight: 500,
              }}>
                Message sent! We'll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div style={{
                marginTop: 14, padding: '12px 16px', borderRadius: 11,
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                fontSize: 13, color: '#f87171', textAlign: 'center', fontWeight: 500,
              }}>
                Something went wrong. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}