'use client'

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.68 1.25 3.33.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
    </svg>
  )
}

function LinkedinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/>
    </svg>
  )
}

const navLinks = [
  { label: 'Subjects', href: '#subjects' },
  { label: 'Past Papers', href: '#papers' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Contact', href: '#contact' },
]

const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'English']

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0e1a',
      borderTop: '0.5px solid #252d45',
      padding: '56px 24px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow, matches Hero's visual treatment */}
      <div style={{
        position: 'absolute', top: -120, left: '50%',
        transform: 'translateX(-50%)',
        width: 480, height: 240, borderRadius: '50%',
        background: '#6366f114',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: 48, marginBottom: 44,
          paddingBottom: 44,
          borderBottom: '0.5px solid #252d45',
        }} className="footer-top">

          {/* Brand col */}
          <div>
            <a href="/" style={{
              fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px',
              display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16,
              textDecoration: 'none', width: 'fit-content',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.08) inset, 0 4px 16px rgba(99,102,241,0.4)',
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
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, maxWidth: 260, fontWeight: 400 }}>
              Pakistan's smartest AKUEB prep platform. Free for every SSC and HSSC student.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#f8fafc',
              letterSpacing: '.1em', textTransform: 'uppercase',
              marginBottom: 18,
            }}>Quick links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navLinks.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  style={{
                    fontSize: 13, color: '#64748b', fontWeight: 500,
                    padding: '5px 0',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease, transform 0.2s ease',
                    width: 'fit-content',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#f8fafc'
                    e.currentTarget.style.transform = 'translateX(3px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#64748b'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >{l.label}</a>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: '#f8fafc',
              letterSpacing: '.1em', textTransform: 'uppercase',
              marginBottom: 18,
            }}>Top subjects</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {subjects.map(s => (
                <a
                  key={s}
                  href="#subjects"
                  style={{
                    fontSize: 13, color: '#64748b', fontWeight: 500,
                    padding: '5px 0',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease, transform 0.2s ease',
                    width: 'fit-content',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#f8fafc'
                    e.currentTarget.style.transform = 'translateX(3px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#64748b'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
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
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
            © 2026 Exlr AI · All rights reserved.
          </div>

          {/* Dev links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 11, color: '#475569', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '.08em',
            }}>Developer</span>

            <a href="https://github.com/FarihaKarim12"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                fontSize: 12, fontWeight: 600,
                padding: '8px 14px', borderRadius: 9,
                background: 'rgba(20,25,40,0.7)',
                backdropFilter: 'blur(8px)',
                border: '0.5px solid #252d45',
                color: '#94a3b8', lineHeight: 1,
                textDecoration: 'none',
                transition: 'all 0.22s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#6366f180'
                e.currentTarget.style.color = '#f8fafc'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 18px -6px rgba(99,102,241,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#252d45'
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <GithubIcon size={14} /> GitHub
            </a>

            <a href="https://www.linkedin.com/in/fariha-karim-387090296/"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                fontSize: 12, fontWeight: 600,
                padding: '8px 14px', borderRadius: 9,
                background: 'rgba(20,25,40,0.7)',
                backdropFilter: 'blur(8px)',
                border: '0.5px solid #252d45',
                color: '#94a3b8', lineHeight: 1,
                textDecoration: 'none',
                transition: 'all 0.22s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#6366f180'
                e.currentTarget.style.color = '#f8fafc'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 18px -6px rgba(99,102,241,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#252d45'
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <LinkedinIcon size={14} /> LinkedIn
            </a>
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
