'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Subjects', href: '#subjects' },
  { label: 'Past Papers', href: 'past-papers' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Contact', href: '#contact' },
  { label: 'Feedback', href: '/feedback' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? '#0a0e1af2' : '#0a0e1ac0',
      borderBottom: scrolled ? '0.5px solid #2d3654' : '0.5px solid #1a2036',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
      transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px', height: scrolled ? 58 : 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'height 0.3s ease',
      }}>
        <a href="/" style={{
          fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px',
          display: 'flex', alignItems: 'center', gap: 9,
          textDecoration: 'none',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08) inset, 0 4px 16px rgba(99,102,241,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
            </svg>
          </div>
          <span style={{ color: '#f8fafc' }}>Exlr</span>
          <span style={{ color: '#818cf8' }}>AI</span>
        </a>

        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hidden-mobile">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              onMouseEnter={() => setHovered(l.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative',
                fontSize: 13,
                fontWeight: 500,
                color: hovered === l.label ? '#f8fafc' : '#94a3b8',
                padding: '8px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                background: hovered === l.label ? 'rgba(99,102,241,0.08)' : 'transparent',
                transition: 'color 0.2s ease, background 0.2s ease',
              }}
            >
              {l.label}
              <span style={{
                position: 'absolute',
                left: 12, right: 12, bottom: 3,
                height: 2, borderRadius: 2,
                background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                transform: hovered === l.label ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center',
                transition: 'transform 0.25s ease',
              }} />
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a
            href="/auth/login"
            className="show-desktop"
            style={{
              fontSize: 13, color: '#94a3b8', padding: '7px 14px',
              borderRadius: 8, border: '0.5px solid #252d45',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f8fafc'
              e.currentTarget.style.borderColor = '#3a4468'
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#94a3b8'
              e.currentTarget.style.borderColor = '#252d45'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Log in
          </a>
          <a
            href="/auth/signup"
            style={{
              fontSize: 13, fontWeight: 600, padding: '7px 16px',
              borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff', textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(99,102,241,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.35)'
            }}
          >
            Start free
          </a>
          <button onClick={() => setOpen(!open)} className="show-mobile"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div style={{
          background: '#0f1422e6',
          backdropFilter: 'blur(16px)',
          borderTop: '0.5px solid #252d45',
          padding: '12px 24px 20px',
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '12px 4px', fontSize: 14,
              color: '#94a3b8', borderBottom: '0.5px solid #1e2640',
              transition: 'color 0.2s ease, padding-left 0.2s ease',
              textDecoration: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.paddingLeft = '10px' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.paddingLeft = '4px' }}
            >{l.label}</a>
          ))}
          <a href="/auth/signup" style={{
            display: 'block', marginTop: 14, textAlign: 'center',
            padding: '11px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
            borderRadius: 8, fontSize: 13, fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
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