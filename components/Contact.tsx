'use client'

import { useState } from 'react'
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
    background: '#0a0e1a',
    border: '0.5px solid #252d45',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 13,
    color: '#f8fafc',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color .2s',
  } as React.CSSProperties

  return (
    <section id="contact" style={{
      padding: '80px 24px',
      background: '#0f1422',
      borderTop: '0.5px solid #252d45',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}
        className="contact-grid">

        {/* Left */}
        <div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#6366f1',
            letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12,
          }}>Get in touch</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, letterSpacing: '-1px',
            lineHeight: 1.15, marginBottom: 16,
          }}>
            Have a{' '}
            <span style={{ color: '#818cf8', textShadow: '0 0 30px #6366f160' }}>question</span>
            <br />or suggestion?
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, marginBottom: 32 }}>
            Drop a message and we'll get back to you as soon as possible.
            We read every message personally.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '📧', label: 'Email', value: 'exlrai.official@gmail.com' },
              { icon: '⏱', label: 'Response time', value: 'Within 24 hours' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: '#0a0e1a', border: '0.5px solid #252d45',
                borderRadius: 10, padding: '12px 16px',
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#f8fafc' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div style={{
          background: '#0a0e1a',
          border: '0.5px solid #252d45',
          borderRadius: 16, padding: 32,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Name</label>
              <input style={inputStyle} placeholder="Enter your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = '#252d45')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Email address</label>
              <input style={inputStyle} type="email" placeholder="Enter your email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = '#252d45')}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Subject</label>
            <input style={inputStyle} placeholder="e.g. Request for Physics notes"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#252d45')}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Message</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
              placeholder="Write your message here..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#252d45')}
            />
          </div>

          <button onClick={handleSubmit} disabled={status === 'sending'} style={{
            width: '100%', padding: '12px',
            borderRadius: 10, background: '#6366f1',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600,
            boxShadow: '0 0 24px #6366f140',
            opacity: status === 'sending' ? 0.7 : 1,
            letterSpacing: '-.2px', fontFamily: 'inherit',
          }}>
            {status === 'sending' ? 'Sending...' : '✉ Send Message'}
          </button>

          {status === 'sent' && (
            <div style={{
              marginTop: 14, padding: '12px 16px', borderRadius: 10,
              background: '#4ade8012', border: '0.5px solid #4ade8030',
              fontSize: 13, color: '#4ade80', textAlign: 'center', fontWeight: 500,
            }}>
              ✓ Message sent! We'll get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div style={{
              marginTop: 14, padding: '12px 16px', borderRadius: 10,
              background: '#f8717112', border: '0.5px solid #f8717130',
              fontSize: 13, color: '#f87171', textAlign: 'center', fontWeight: 500,
            }}>
              ✗ Something went wrong. Please try again.
            </div>
          )}
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
