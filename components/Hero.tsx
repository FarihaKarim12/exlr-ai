import { ArrowRight, Rocket } from 'lucide-react'

export default function Hero() {
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

        {/* Right — code block */}
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

          {/* Code block */}
          <div style={{
            background: '#0f1422',
            border: '0.5px solid #252d45',
            borderRadius: 14, overflow: 'hidden',
            fontFamily: 'monospace',
            position: 'relative', zIndex: 1,
          }}>
            {/* Window bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 16px',
              borderBottom: '0.5px solid #252d45',
              background: '#141928',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 8 }}>exlr.ai — student.ts</span>
            </div>

            {/* Code content */}
            <div style={{ padding: '20px 24px', fontSize: 13, lineHeight: 1.8 }}>
              <div>
                <span style={{ color: '#818cf8' }}>const</span>
                <span style={{ color: '#f8fafc' }}> student </span>
                <span style={{ color: '#64748b' }}>= </span>
                <span style={{ color: '#22d3ee' }}>"Ahmed Ali"</span>
                <span style={{ color: '#64748b' }}>;</span>
              </div>
              <div style={{ marginTop: 4 }}>
                <span style={{ color: '#818cf8' }}>const</span>
                <span style={{ color: '#f8fafc' }}> board </span>
                <span style={{ color: '#64748b' }}>= </span>
                <span style={{ color: '#22d3ee' }}>"AKUEB"</span>
                <span style={{ color: '#64748b' }}>;</span>
              </div>
              <br />
              <div>
                <span style={{ color: '#818cf8' }}>function</span>
                <span style={{ color: '#4ade80' }}> prepSmarter</span>
                <span style={{ color: '#f8fafc' }}>() {'{'}</span>
              </div>
              <div style={{ paddingLeft: 20 }}>
                <span style={{ color: '#818cf8' }}>return</span>
                <span style={{ color: '#f8fafc' }}> {'{'}</span>
              </div>
              <div style={{ paddingLeft: 40 }}>
                <span style={{ color: '#94a3b8' }}>sloMastery</span>
                <span style={{ color: '#64748b' }}>: </span>
                <span style={{ color: '#818cf8' }}>true</span>
                <span style={{ color: '#64748b' }}>,</span>
              </div>
              <div style={{ paddingLeft: 40 }}>
                <span style={{ color: '#94a3b8' }}>aiDoubtSolver</span>
                <span style={{ color: '#64748b' }}>: </span>
                <span style={{ color: '#818cf8' }}>true</span>
                <span style={{ color: '#64748b' }}>,</span>
              </div>
              <div style={{ paddingLeft: 40 }}>
                <span style={{ color: '#94a3b8' }}>pastPapers</span>
                <span style={{ color: '#64748b' }}>: </span>
                <span style={{ color: '#fbbf24' }}>2012</span>
                <span style={{ color: '#64748b' }}>-</span>
                <span style={{ color: '#fbbf24' }}>2025</span>
                <span style={{ color: '#64748b' }}>,</span>
              </div>
              <div style={{ paddingLeft: 40 }}>
                <span style={{ color: '#94a3b8' }}>targetGrade</span>
                <span style={{ color: '#64748b' }}>: </span>
                <span style={{ color: '#22d3ee' }}>"A*"</span>
              </div>
              <div style={{ paddingLeft: 20 }}>
                <span style={{ color: '#f8fafc' }}>{'}'}</span>
              </div>
              <div>
                <span style={{ color: '#f8fafc' }}>{'}'}</span>
              </div>
              <br />
              <div>
                <span style={{ color: '#4ade80' }}>prepSmarter</span>
                <span style={{ color: '#f8fafc' }}>();</span>
              </div>
            </div>

            {/* Bottom tag row */}
            <div style={{
              display: 'flex', gap: 8, padding: '10px 16px',
              borderTop: '0.5px solid #252d45', background: '#141928',
              flexWrap: 'wrap',
            }}>
              {['SLO Radar', 'AI Notes', 'Past Papers', 'Exam Sim'].map(t => (
                <span key={t} style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 4,
                  background: '#6366f115', color: '#818cf8',
                  border: '0.5px solid #6366f130',
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Floating stat cards */}
          <div style={{
            position: 'absolute', top: -16, right: -16,
            background: '#0f1422', border: '0.5px solid #252d45',
            borderRadius: 10, padding: '8px 14px',
            fontSize: 12, color: '#f8fafc', fontWeight: 600,
            zIndex: 2,
          }}>
            🧠 AI Doubt Solver <span style={{ color: '#4ade80', marginLeft: 4 }}>● live</span>
          </div>

          <div style={{
            position: 'absolute', bottom: 60, right: -20,
            background: '#0f1422', border: '0.5px solid #252d45',
            borderRadius: 10, padding: '8px 14px',
            fontSize: 12, color: '#f8fafc', fontWeight: 600,
            zIndex: 2,
          }}>
            📄 13 years of papers
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