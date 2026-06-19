'use client'

const navLinks = [
  { label: 'Subjects', href: '#subjects' },
  { label: 'Past Papers', href: '#papers' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0e1a',
      borderTop: '0.5px solid #252d45',
      padding: '48px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: 48, marginBottom: 48,
          paddingBottom: 48,
          borderBottom: '0.5px solid #252d45',
        }} className="footer-top">

          {/* Brand col */}
          <div>
            <a href="/" style={{
              fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px',
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
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
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, maxWidth: 260 }}>
              Pakistan's smartest AKUEB prep platform. Free for every SSC and HSSC student.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#f8fafc',
              letterSpacing: '.08em', textTransform: 'uppercase',
              marginBottom: 16,
            }}>Quick links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {navLinks.map(l => (
                <a key={l.label} href={l.href} style={{ fontSize: 13, color: '#64748b' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >{l.label}</a>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#f8fafc',
              letterSpacing: '.08em', textTransform: 'uppercase',
              marginBottom: 16,
            }}>Top subjects</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'English'].map(s => (
                <a key={s} href="#subjects" style={{ fontSize: 13, color: '#64748b' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >{s}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            © 2026 Exlr AI · All rights reserved.
          </div>

          {/* Dev links */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Developer
            </div>
            <a href="https://github.com/FarihaKarim12"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 500,
                padding: '7px 14px', borderRadius: 8,
                background: '#141928', border: '0.5px solid #252d45',
                color: '#94a3b8',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#6366f1'
                e.currentTarget.style.color = '#f8fafc'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#252d45'
                e.currentTarget.style.color = '#94a3b8'
              }}
            >⌥ GitHub</a>

            <a href="https://www.linkedin.com/in/fariha-karim-387090296/"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 500,
                padding: '7px 14px', borderRadius: 8,
                background: '#141928', border: '0.5px solid #252d45',
                color: '#94a3b8',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#6366f1'
                e.currentTarget.style.color = '#f8fafc'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#252d45'
                e.currentTarget.style.color = '#94a3b8'
              }}
            >in LinkedIn</a>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-top { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  )
}
