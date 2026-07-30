'use client';

import { useState } from 'react'

const stats = [
  { number: '7', label: 'Core subjects covered', glyph: '◧', color: '#6366f1' },
  { number: '13', suffix: 'yrs', label: 'Past papers archive', glyph: '◈', color: '#22d3ee' },
  { number: '4', suffix: ' AI', label: 'Powered modules', glyph: '✦', color: '#818cf8' },
  { number: '100', suffix: '%', label: 'Free to start', glyph: '◎', color: '#4ade80' },
]

export default function Stats() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{
      padding: '56px 24px',
      background: 'var(--bg)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
      }} className="stats-grid">
        {stats.map(s => {
          const isHovered = hovered === s.label
          return (
            <div
              key={s.label}
              onMouseEnter={() => setHovered(s.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHovered ? 'rgba(20,25,42,0.7)' : 'rgba(15,20,34,0.5)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isHovered ? `0.5px solid ${s.color}55` : '0.5px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '26px 24px',
                cursor: 'default',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered ? `0 14px 32px -12px ${s.color}55` : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, color: s.color,
                background: `${s.color}16`,
                marginBottom: 18,
                transition: 'transform 0.25s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}>
                {s.glyph}
              </div>

              <div style={{
                fontSize: 36, fontWeight: 700,
                letterSpacing: '-1.5px', lineHeight: 1,
                marginBottom: 10,
              }}>
                <span style={{ color: '#f8fafc' }}>{s.number}</span>
                {s.suffix && <span style={{
                  color: s.color,
                  textShadow: `0 0 20px ${s.color}80`,
                }}>{s.suffix}</span>}
              </div>

              <div style={{
                fontSize: 12.5, color: '#94a3b8', fontWeight: 500,
                letterSpacing: '0.01em', lineHeight: 1.4,
              }}>{s.label}</div>

              <div style={{
                height: 2, background: 'rgba(255,255,255,0.06)',
                borderRadius: 99, marginTop: 16, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: isHovered ? '100%' : '45%',
                  background: s.color,
                  borderRadius: 99,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 860px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}