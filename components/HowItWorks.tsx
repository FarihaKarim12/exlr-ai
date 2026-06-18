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
    desc: 'Notes, AI notes, and curated YouTube playlists organised by chapter and SLO.',
    color: '#22d3ee',
  },
  {
    n: '04',
    title: 'Quiz + fix weaknesses',
    desc: 'After each quiz the SLO radar shows exactly what to revise. One click to fix it.',
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
    <section id="how" style={{ padding: '80px 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48, maxWidth: 600 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#6366f1',
            letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12,
          }}>How it works</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, letterSpacing: '-1px',
            lineHeight: 1.15, marginBottom: 14,
          }}>
            Your journey from{' '}
            <span style={{ color: '#818cf8', textShadow: '0 0 30px #6366f160' }}>signup</span>
            {' '}to{' '}
            <span style={{ color: '#4ade80', textShadow: '0 0 30px #4ade8050' }}>A*</span>
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
            A smart connected system where every action improves your next step.
          </p>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 10, position: 'relative',
        }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              background: '#0f1422',
              border: '0.5px solid #252d45',
              borderRadius: 14, padding: '24px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Glow top left */}
              <div style={{
                position: 'absolute', top: -20, left: -20,
                width: 80, height: 80, borderRadius: '50%',
                background: `${s.color}15`,
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }} />

              <div style={{
                fontSize: 11, fontWeight: 700, color: s.color,
                letterSpacing: '.08em', marginBottom: 16,
                textTransform: 'uppercase',
              }}>STEP {s.n}</div>

              <div style={{
                fontSize: 32, fontWeight: 700,
                color: `${s.color}20`,
                position: 'absolute', top: 16, right: 20,
                letterSpacing: '-2px', lineHeight: 1,
              }}>{s.n}</div>

              <div style={{
                fontSize: 15, fontWeight: 600,
                color: '#f8fafc', marginBottom: 8,
                letterSpacing: '-.2px', lineHeight: 1.3,
              }}>
                {s.title}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>
                {s.desc}
              </div>

              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', right: -14, top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 16, color: '#252d45',
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