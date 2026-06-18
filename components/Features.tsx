'use client'

const features = [
  {
    icon: '⊙',
    title: 'SLO Weakness Radar',
    desc: 'Auto-detects your weak Student Learning Outcomes after every quiz. One click to fix them.',
    ai: false,
    color: '#6366f1',
  },
  {
    icon: '🧠',
    title: 'AI Doubt Solver',
    desc: 'Ask any AKUEB question. Get instant, syllabus-accurate answers 24/7.',
    ai: false,
    color: '#22d3ee',
  },
  {
    icon: '✦',
    title: 'AI-Generated Notes',
    desc: 'Pre-generated SLO notes or generate your own on demand in seconds.',
    ai: false,
    color: '#22d3ee',
  },
  {
    icon: '📄',
    title: 'Past Papers 2012–2025',
    desc: 'Paper 1 + Paper 2, official answer keys, and e-marking notes. View or download instantly.',
    ai: false,
    color: '#6366f1',
  },
  {
    icon: '⏱',
    title: 'Exam Simulator',
    desc: 'Full timed mock exams in exact AKUEB format. MCQs auto-marked, rubric shown for CRQs.',
    ai: false,
    color: '#6366f1',
  },
  {
    icon: '🗺',
    title: 'Personalised Study Plan',
    desc: 'Week-by-week plan generated for your subjects. Adapts as your quiz results improve.',
    ai: false,
    color: '#22d3ee',
  },
  {
    icon: '📊',
    title: 'Progress Dashboard',
    desc: 'Study streak, syllabus coverage, predicted grade, and a parent view with weekly summary.',
    ai: false,
    color: '#6366f1',
  },
  {
    icon: '⚡',
    title: 'MCQ Quiz Engine',
    desc: 'AI generated 10 AKUEB-style MCQs on any topic. Test your knowledge instantly.',
    ai: false,
    color: '#6366f1',
  },
]

export default function Features() {
  return (
    <section id="features" style={{ padding: '80px 24px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48, maxWidth: 600 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: '#6366f1',
            letterSpacing: '.1em', textTransform: 'uppercase',
            marginBottom: 12,
          }}>Platform features</div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700, letterSpacing: '-1px',
            lineHeight: 1.15, marginBottom: 14,
          }}>
            Everything you need to{' '}
            <span style={{ color: '#818cf8', textShadow: '0 0 30px #6366f160' }}>ace AKUEB</span>
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
            Built specifically for SSC and HSSC students. Every feature is designed
            around the AKUEB scheme of studies and SLOs.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px',
          background: '#252d45',
          border: '0.5px solid #252d45',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: '#0a0e1a',
              padding: '28px 24px',
              transition: 'background .2s',
              cursor: 'default',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0f1422')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0a0e1a')}
            >
              {f.ai && (
                <div style={{
                  display: 'inline-block', fontSize: 10, fontWeight: 600,
                  padding: '2px 8px', borderRadius: 4, marginBottom: 10,
                  background: '#22d3ee10', color: '#22d3ee',
                  border: '0.5px solid #22d3ee30',
                  letterSpacing: '.05em', textTransform: 'uppercase',
                }}>AI powered</div>
              )}
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                border: `0.5px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 16,
                background: `${f.color}10`,
              }}>{f.icon}</div>
              <div style={{
                fontSize: 15, fontWeight: 600,
                color: '#f8fafc', marginBottom: 8,
                letterSpacing: '-.2px',
              }}>
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}