'use client'

const subjects = [
  { icon: '◈', name: 'Physics', group: 'Science · IX–XII', color: '#6366f1' },
  { icon: '◉', name: 'Chemistry', group: 'Science · IX–XII', color: '#22d3ee' },
  { icon: '◎', name: 'Biology', group: 'Science · IX–XII', color: '#4ade80' },
  { icon: '◍', name: 'Mathematics', group: 'Science · IX–XII', color: '#818cf8' },
  { icon: '◐', name: 'Computer Science', group: 'All groups · IX–XII', color: '#22d3ee' },
  { icon: '◑', name: 'Islamiyat', group: 'All groups · IX–XII', color: '#a78bfa' },
  { icon: '◒', name: 'Pakistan Studies', group: 'All groups · IX–XII', color: '#34d399' },
]

export default function Subjects() {
  return (
    <section id="subjects" style={{
      padding: '90px 24px',
      background: 'transparent',
      position: 'relative',
    }}>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(15,20,34,0.3)',
        backdropFilter: 'blur(2px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ marginBottom: 56, maxWidth: 600 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#6366f1',
            letterSpacing: '.12em', textTransform: 'uppercase',
            marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 20, height: 1, background: '#6366f1', display: 'inline-block' }} />
            Subjects offered
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, letterSpacing: '-1.5px',
            lineHeight: 1.1, marginBottom: 16,
          }}>
            <span style={{ color: '#f8fafc' }}>7 core subjects —{' '}</span>
            <span style={{ color: '#22d3ee', textShadow: '0 0 40px rgba(34,211,238,0.4)' }}>SSC & HSSC</span>
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75 }}>
            Science, Humanities, and Commerce groups all covered.
            More subjects coming soon.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 10,
        }}>
          {subjects.map(s => (
            <div key={s.name} style={{
              background: 'rgba(15, 20, 34, 0.5)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${s.color}40`
                e.currentTarget.style.background = 'rgba(20,25,40,0.7)'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.2), 0 0 0 1px ${s.color}20`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.background = 'rgba(15, 20, 34, 0.5)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: `${s.color}12`,
                border: `1px solid ${s.color}25`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 20,
                color: s.color,
              }}>{s.icon}</div>
              <div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: '#f8fafc', letterSpacing: '-0.3px',
                }}>{s.name}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3, fontWeight: 400 }}>{s.group}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          More subjects coming soon ·{' '}
          <a href="#contact" style={{
            color: '#6366f1', marginLeft: 4, fontWeight: 500,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6366f1')}
          >
            Request a subject →
          </a>
        </div>
      </div>
    </section>
  )
}