'use client';

import { useState } from 'react'
import { ArrowRight, Rocket } from 'lucide-react'

const STATS = [
  { number: '7', label: 'Core subjects covered', glyph: '◧', color: '#6366f1' },
  { number: '13', suffix: 'yrs', label: 'Past papers archive', glyph: '◈', color: '#22d3ee' },
  { number: '4', suffix: ' AI', label: 'Powered modules', glyph: '✦', color: '#818cf8' },
  { number: '100', suffix: '%', label: 'Free to start', glyph: '◎', color: '#4ade80' },
]

export default function Hero() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="hero" style={{ background: 'var(--bg)', padding: '80px 24px 60px', overflow: 'hidden', scrollMarginTop: 90 }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 48, alignItems: 'center',
      }} className="hero-grid">

        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 12, padding: '4px 12px', borderRadius: 99,
            border: '0.5px solid #22d3ee40', color: '#22d3ee',
            background: '#22d3ee0a', marginBottom: 24,
            fontWeight: 500, letterSpacing: '.04em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
            AKUEB · SSC & HSSC · Class IX to XII
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-2px',
            marginBottom: 20,
          }}>
            <span style={{ color: '#f8fafc' }}>Pakistan's</span>
            <br />
            <span style={{
              color: '#818cf8',
              textShadow: '0 0 40px #6366f180',
            }}>smartest</span>
            <br />
            <span style={{ color: '#22d3ee', textShadow: '0 0 40px #22d3ee60' }}>AKUEB prep</span>
            <br />
            <span style={{ color: '#f8fafc' }}>platform</span>
          </h1>

          <h2 style={{
            fontSize: 16, color: '#94a3b8', lineHeight: 1.75,
            marginBottom: 32, maxWidth: 460,
          }}>
            SLO-based notes, past papers 2012–2025, AI doubt solver,
            personalised study plans, and exam simulation —
            all free, all in one place.
          </h2>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
            <a
              href="/auth/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 14, fontWeight: 600, padding: '12px 26px',
                borderRadius: 10, background: '#6366f1', color: '#fff',
                boxShadow: '0 0 24px #6366f150',
                textDecoration: 'none',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 32px #6366f180'
                e.currentTarget.style.background = '#4f46e5'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 24px #6366f150'
                e.currentTarget.style.background = '#6366f1'
              }}
            >
              <Rocket size={16} /> Start learning free
            </a>
            <a
              href="past-papers"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 14, padding: '12px 26px', borderRadius: 10,
                border: '0.5px solid #252d45', color: '#94a3b8',
                textDecoration: 'none',
                transition: 'transform 0.25s ease, border-color 0.25s ease, color 0.25s ease, background 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = '#6366f180'
                e.currentTarget.style.color = '#f8fafc'
                e.currentTarget.style.background = 'rgba(99,102,241,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = '#252d45'
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Browse past papers <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#64748b' }}>
            <div style={{ display: 'flex' }}>
              {['A', 'S', 'R', 'Z', 'M'].map((l, i) => (
                <div key={l} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#1a2035', border: '2px solid #0a0e1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#818cf8', fontWeight: 700,
                  marginLeft: i === 0 ? 0 : -10,
                }}>{l}</div>
              ))}
            </div>
            <h3>Join thousands of AKUEB students</h3>
          </div>
        </div>

        {/* Right — stats grid, replaces the old feature-highlights card */}
        <div style={{ position: 'relative' }} className="hero-visual">

          {/* Glow behind */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300, height: 300, borderRadius: '50%',
            background: '#6366f120',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />

          <div style={{
            position: 'relative', zIndex: 1,
            padding: '20px 8px',
          }}>
            

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
            }}>
              {STATS.map((s, i) => {
                const isHovered = hovered === s.label
                const isRightCol = i % 2 === 1
                const isBottomRow = i >= 2
                return (
                  <div
                    key={s.label}
                    onMouseEnter={() => setHovered(s.label)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      textAlign: 'center',
                      padding: '26px 16px',
                      cursor: 'default',
                      borderRight: !isRightCol ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
                      borderBottom: !isBottomRow ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
                      transition: 'transform 0.3s ease',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <div style={{
                      fontSize: 'clamp(34px, 4.2vw, 50px)',
                      fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1,
                      marginBottom: 10,
                      transition: 'text-shadow 0.3s ease',
                    }}>
                      <span style={{
                        color: '#f8fafc',
                        textShadow: isHovered ? '0 0 30px rgba(248,250,252,0.35)' : 'none',
                      }}>{s.number}</span>
                      {s.suffix && <span style={{
                        color: s.color,
                        textShadow: isHovered ? `0 0 36px ${s.color}` : `0 0 18px ${s.color}90`,
                        transition: 'text-shadow 0.3s ease',
                      }}>{s.suffix}</span>}
                    </div>
                    <div style={{
                      fontSize: 12.5, color: isHovered ? '#cbd5e1' : '#64748b',
                      fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.4,
                      transition: 'color 0.3s ease',
                    }}>{s.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
        }
      `}</style>
    </section>
  )
}