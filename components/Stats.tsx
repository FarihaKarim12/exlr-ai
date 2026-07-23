'use client';

const stats = [
  { number: '7', label: 'Core subjects covered' },
  { number: '13', suffix: 'yrs', label: 'Past papers archive' },
  { number: '4', suffix: ' AI', label: 'Powered modules' },
  { number: '100', suffix: '%', label: 'Free to start' },
]

export default function Stats() {
  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      background: 'rgba(15, 20, 34, 0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }} className="stats-grid">
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding: '32px 36px',
          borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'background 0.25s ease',
          cursor: 'default',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            fontSize: 38, fontWeight: 700,
            letterSpacing: '-2px', lineHeight: 1,
            marginBottom: 8,
          }}>
            <span style={{ color: '#f8fafc' }}>{s.number}</span>
            {s.suffix && <span style={{
              color: '#6366f1',
              textShadow: '0 0 20px rgba(99,102,241,0.5)',
            }}>{s.suffix}</span>}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, letterSpacing: '0.02em' }}>{s.label}</div>
        </div>
      ))}

      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}