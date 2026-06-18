'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Subjects', href: '#subjects' },
  { label: 'Past Papers', href: 'past-papers' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: '#0a0e1aee',
      borderBottom: '0.5px solid #252d45',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ 
          fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', 
          display: 'flex', alignItems: 'center', gap: 8 
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: '#6366f1',
            boxShadow: '0 0 12px #6366f180',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
            </svg>
          </div>
          <span style={{ color: '#f8fafc' }}>Exlr</span>
          <span style={{ color: '#818cf8' }}>AI</span>
        </a>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="hidden-mobile">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ fontSize: 13, color: '#94a3b8', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >{l.label}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="/auth/login" className="show-desktop" style={{
            fontSize: 13, color: '#94a3b8', padding: '7px 14px',
            borderRadius: 8, border: '0.5px solid #252d45',
          }}>Log in</a>
          <a href="/auth/signup" style={{
            fontSize: 13, fontWeight: 500, padding: '7px 16px',
            borderRadius: 8, background: '#6366f1', color: '#fff',
          }}>Start free</a>
          <button onClick={() => setOpen(!open)} className="show-mobile"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ background: '#0f1422', borderTop: '0.5px solid #252d45', padding: '12px 24px 20px' }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '10px 0', fontSize: 14,
              color: '#94a3b8', borderBottom: '0.5px solid #1e2640',
            }}>{l.label}</a>
          ))}
          <a href="/auth/signup" style={{
            display: 'block', marginTop: 14, textAlign: 'center',
            padding: '10px', background: '#6366f1', color: '#fff',
            borderRadius: 8, fontSize: 13, fontWeight: 500,
          }}>Start for free</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
          .show-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .show-desktop { display: block !important; }
        }
      `}</style>
    </nav>
  )
}