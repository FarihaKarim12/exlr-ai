'use client'

const features = [
  {
    title: 'SLO Weakness Radar',
    desc: 'Auto-detects your weak Student Learning Outcomes after every quiz. One click to fix them.',
    color: '#6366f1',
  },
  {
    title: 'AI Doubt Solver',
    desc: 'Ask any AKUEB question.. Get instant, syllabus-accurate answers 24/7.',
    color: '#22d3ee',
  },
  {
    title: 'AI-Generated Notes',
    desc: 'Pre-generated SLO notes or generate your own on demand in seconds.',
    color: '#22d3ee',
  },
  {
    title: 'Past Papers 2012–2025',
    desc: 'Paper 1 + Paper 2, official answer keys. View or download instantly.',
    color: '#6366f1',
  },
  {
    title: 'Exam Simulator',
    desc: 'Full timed mock exams in exact AKUEB format. MCQs auto-marked, rubric shown for CRQs.',
    color: '#6366f1',
  },
  {
    title: 'Personalised Study Plan',
    desc: 'Week-by-week plan generated for your subjects. Adapts as your quiz results improve.',
    color: '#22d3ee',
  },
  {
    title: 'Progress Dashboard',
    desc: 'Study streak, syllabus coverage, topic mastery donut chart and full analytics.',
    color: '#6366f1',
  },
  {
    title: 'Learning Path',
    desc: 'AI analyses your weak topics and generates a focused 4-week improvement plan.',
    color: '#22d3ee',
  },
]

export default function Features() {
  return (
    <section id="features" style={{ padding: '90px 24px', background: 'transparent', position: 'relative' }}>

      <div style={{
        position: 'absolute', top: '20%', right: '-5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
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
            Platform features
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, letterSpacing: '-1.5px',
            lineHeight: 1.1, marginBottom: 16,
          }}>
            Everything you need to{' '}
            <span style={{ color: '#818cf8', textShadow: '0 0 40px rgba(99,102,241,0.5)' }}>ace AKUEB</span>
          </h2>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, fontWeight: 400 }}>
            Built specifically for SSC and HSSC students. Every feature is designed
            around the AKUEB scheme of studies and SLOs.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 12,
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: 'rgba(15, 20, 34, 0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '28px 24px',
              borderRadius: 16,
              transition: 'all 0.3s ease',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${f.color}30`
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px ${f.color}20`
                e.currentTarget.style.background = 'rgba(20, 25, 40, 0.7)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = 'rgba(15, 20, 34, 0.5)'
              }}
            >
              
              <div style={{
                fontSize: 16, fontWeight: 700,
                color: '#f8fafc', marginBottom: 10,
                letterSpacing: '-0.3px',
              }}>
                {f.title}
              </div>
              <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, fontWeight: 400 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}