'use client';

const steps = [
  {
    n: '01',
    title: 'Sign up free',
    desc: 'Pick your group, grade, and subjects. Takes under a minute.',
    color: '#6366f1',
  },
  {
    n: '02',
    title: 'Get your study plan',
    desc: 'AI generates a week-by-week plan covering all your SLOs before the exam.',
    color: '#818cf8',
  },
  {
    n: '03',
    title: 'Study smart',
    desc: 'Notes, AI notes, and curated resources organised by chapter and SLO.',
    color: '#22d3ee',
  },
  {
    n: '04',
    title: 'Quiz + fix weaknesses',
    desc: 'After each quiz the SLO radar shows exactly what to revise.',
    color: '#22d3ee',
  },
  {
    n: '05',
    title: 'Simulate the exam',
    desc: 'Full timed mock in AKUEB format — Paper 1 and Paper 2. Score report after.',
    color: '#4ade80',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" style={{ padding: '90px 24px', background: 'transparent', position: 'relative' }}>

      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)',
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
            How it works
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, letterSpacing: '-1.5px',
            lineHeight: 1.1, marginBottom: 16,
          }}>
            Your journey from{' '}
            <span style={{ color: '#818cf8', textShadow: '0 0 40px rgba(99,102,241,0.5)' }}>signup</span>
            {' '}to{' '}
            <span style={{ color: '#4ade80', textShadow: '0 0 40px rgba(74,222,128,0.4)' }}>A*</span>
          </h2>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.75 }}>
            A smart connected system where every action improves your next step.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
          gap: 12, position: 'relative',
        }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              background: 'rgba(15, 20, 34, 0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '26px 22px',
              position: 'relative', overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${s.color}30`
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.2)`
                e.currentTarget.style.background = 'rgba(20,25,40,0.7)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = 'rgba(15,20,34,0.5)'
              }}
            >
              <div style={{
                position: 'absolute', top: -30, right: -10,
                fontSize: 80, fontWeight: 800,
                color: `${s.color}08`,
                letterSpacing: '-4px', lineHeight: 1,
                userSelect: 'none',
              }}>{s.n}</div>

              <div style={{
                fontSize: 13, fontWeight: 700, color: s.color,
                letterSpacing: '.1em', marginBottom: 16,
                textTransform: 'uppercase',
              }}>STEP {s.n}</div>

              <div style={{
                fontSize: 16, fontWeight: 700,
                color: '#f8fafc', marginBottom: 10,
                letterSpacing: '-0.3px', lineHeight: 1.3,
              }}>
                {s.title}
              </div>
              <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, fontWeight: 400 }}>
                {s.desc}
              </div>

              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', right: -14, top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 16, color: 'rgba(255,255,255,0.15)',
                  zIndex: 2,
                }} className="step-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .step-arrow { display: none !important; }
        }
      `}</style>
    </section>
  )
}