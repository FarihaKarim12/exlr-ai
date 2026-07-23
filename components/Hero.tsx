'use client';

import { useState } from 'react'
import { ArrowRight, Rocket } from 'lucide-react'

const FEATURES = [
  { glyph: '◈', title: 'AI Doubt Solver', sub: '24/7 instant help', color: '#22d3ee' },
  { glyph: '✦', title: 'AI Notes', sub: 'On demand', color: '#818cf8' },
  { glyph: '◧', title: 'Past Papers', sub: '2012–2025', color: '#6366f1' },
  { glyph: '◉', title: 'MCQ Quiz', sub: 'AI generated', color: '#4ade80' },
  { glyph: '◎', title: 'Weakness Radar', sub: 'Auto-detected', color: '#f87171' },
  { glyph: '◷', title: 'Study Plan', sub: 'Personalised', color: '#f59e0b' },
]

export default function Hero() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section style={{ background: 'var(--bg)', padding: '80px 24px 60px', overflow: 'hidden' }}>
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

          <p style={{
            fontSize: 15, color: '#94a3b8', lineHeight: 1.75,
            marginBottom: 32, maxWidth: 460,
          }}>
            SLO-based notes, past papers 2012–2025, AI doubt solver,
            personalised study plans, and exam simulation —
            all free, all in one place.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
            <a href="/auth/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontWeight: 600, padding: '12px 26px',
              borderRadius: 10, background: '#6366f1', color: '#fff',
              boxShadow: '0 0 24px #6366f150',
            }}>
              <Rocket size={16} /> Start learning free
            </a>
            <a href="past-papers" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 14, padding: '12px 26px', borderRadius: 10,
              border: '0.5px solid #252d45', color: '#94a3b8',
            }}>
              Browse past papers <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#64748b' }}>
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
            <span>Join thousands of AKUEB students</span>
          </div>
        </div>

        {/* Right — feature highlights card */}
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
            background: 'rgba(15,20,34,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '0.5px solid #252d45',
            borderRadius: 18, padding: 28,
            position: 'relative', zIndex: 1,
          }}>
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <div style={{
                fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 6,
                letterSpacing: '-0.3px',
              }}>
                Everything you need to ace AKUEB
              </div>
              <div style={{
                fontSize: 11, color: '#64748b', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '.08em',
              }}>
                All tools · All subjects · Completely free
              </div>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}>
              {FEATURES.map(f => {
                const isHovered = hovered === f.title
                return (
                  <div
                    key={f.title}
                    onMouseEnter={() => setHovered(f.title)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: isHovered ? '#171d31' : '#141928',
                      border: isHovered ? `0.5px solid ${f.color}66` : '0.5px solid #252d45',
                      borderRadius: 12, padding: '15px 16px',
                      cursor: 'default',
                      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                      boxShadow: isHovered ? `0 10px 24px -8px ${f.color}55` : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: 7,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: f.color,
                      background: `${f.color}18`,
                      marginBottom: 10,
                      transition: 'transform 0.25s ease',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    }}>
                      {f.glyph}
                    </div>
                    <div style={{
                      fontSize: 12.5, fontWeight: 600, color: '#f1f5f9', marginBottom: 3,
                      lineHeight: 1.3, letterSpacing: '-0.1px',
                    }}>
                      {f.title}
                    </div>
                    <div style={{
                      fontSize: 11, color: '#64748b', fontWeight: 500,
                    }}>{f.sub}</div>
                    <div style={{ height: 3, background: '#252d45', borderRadius: 99, marginTop: 10, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: isHovered ? '85%' : '70%',
                        background: f.color,
                        borderRadius: 99,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
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