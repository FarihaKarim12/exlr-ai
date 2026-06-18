const stats = [
  { number: '7', label: 'Core subjects covered' },
  { number: '13', suffix: 'yrs', label: 'Past papers archive' },
  { number: '4', suffix: ' AI', label: 'Powered modules' },
  { number: '100%', label: 'Free to start' },
]

export default function Stats() {
  return (
    <div style={{
      borderTop: '0.5px solid #252d45',
      borderBottom: '0.5px solid #252d45',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      background: '#0f1422',
    }} className="stats-grid">
      {stats.map((s, i) => (
        <div key={s.label} style={{
          padding: '28px 32px',
          borderRight: i < stats.length - 1 ? '0.5px solid #252d45' : 'none',
        }}>
          <div style={{
            fontSize: 36, fontWeight: 700,
            letterSpacing: '-1px', lineHeight: 1,
            marginBottom: 8, color: '#f8fafc',
          }}>
            {s.number}
            {s.suffix && (
              <span style={{ color: '#6366f1' }}>{s.suffix}</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
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