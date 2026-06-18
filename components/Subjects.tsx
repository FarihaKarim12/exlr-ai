'use client'

const subjects = [
  { icon: '⚛', name: 'Physics', group: 'Science · IX–XII', color: '#6366f1' },
  { icon: '🧪', name: 'Chemistry', group: 'Science · IX–XII', color: '#22d3ee' },
  { icon: '🧬', name: 'Biology', group: 'Science · IX–XII', color: '#4ade80' },
  { icon: '∑', name: 'Mathematics', group: 'Science · IX–XII', color: '#818cf8' },
  { icon: '💻', name: 'Computer Science', group: 'All groups · IX–XII', color: '#22d3ee' },
  { icon: '☪', name: 'Islamiyat', group: 'All groups · IX–XII', color: '#a78bfa' },
  { icon: '🗺', name: 'Pakistan Studies', group: 'All groups · IX–XII', color: '#34d399' },
]

export default function Subjects() {
  return (
    <section id="subjects" style={{
      padding: '80px 24px',
      background: '#0f1422',
      borderTop: '0.5px solid #252d45',
      borderBottom: '0.5px solid #252d45',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ marginBottom: 48, maxWidth: 600 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#6366f1',
            letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12,
          }}>Subjects offered</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, letterSpacing: '-1px',
            lineHeight: 1.15, marginBottom: 14,
          }}>
            <span style={{ color: '#f8fafc' }}>7 core subjects —{' '}</span>
            <span style={{ color: '#22d3ee', textShadow: '0 0 30px #22d3ee50' }}>SSC & HSSC</span>
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
            Science group covered across SSC and HSSC.
            More subjects coming soon.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 8,
        }}>
          {subjects.map(s => (
            <div key={s.name} style={{
              background: '#0a0e1a',
              border: '0.5px solid #252d45',
              borderRadius: 12, padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer',
              transition: 'border-color .2s, background .2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = s.color
                e.currentTarget.style.background = '#0f1422'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#252d45'
                e.currentTarget.style.background = '#0a0e1a'
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: `${s.color}15`,
                border: `0.5px solid ${s.color}30`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18,
              }}>{s.icon}</div>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: '#f8fafc', letterSpacing: '-.2px',
                }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s.group}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          More subjects coming soon ·{' '}
          <a href="#contact" style={{ color: '#6366f1', marginLeft: 4 }}>
            Request a subject →
          </a>
        </div>
      </div>
    </section>
  )
}