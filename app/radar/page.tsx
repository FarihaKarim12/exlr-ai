'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const subjects = [
  'Physics', 'Chemistry', 'Biology',
  'Mathematics', 'Computer Science',
  'Islamiyat', 'Pakistan Studies',
]

export default function RadarPage() {
  const [mastery, setMastery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      setUser(user)

      const { data } = await supabase
        .from('topic_mastery')
        .select('*')
        .eq('student_id', user.id)
        .order('updated_at', { ascending: false })

      setMastery(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = selectedSubject === 'All'
    ? mastery
    : mastery.filter(m => m.subject === selectedSubject)

  const getStats = () => {
    const green = mastery.filter(m => m.status === 'green').length
    const amber = mastery.filter(m => m.status === 'amber').length
    const red = mastery.filter(m => m.status === 'red').length
    return { green, amber, red, total: mastery.length }
  }

  const stats = getStats()

  const statusColor = (status: string) => {
    if (status === 'green') return { bg: '#4ade8015', border: '#4ade8040', text: '#4ade80' }
    if (status === 'amber') return { bg: '#fbbf2415', border: '#fbbf2440', text: '#fbbf24' }
    return { bg: '#f8717115', border: '#f8717140', text: '#f87171' }
  }

  const statusLabel = (status: string) => {
    if (status === 'green') return 'Mastered'
    if (status === 'amber') return 'Partial'
    return 'Weak'
  }

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh', background: '#0a0e1a',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>
      <nav style={{
        background: '#0a0e1aee', borderBottom: '0.5px solid #252d45',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <a href="/" style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: '#6366f1',
            boxShadow: '0 0 12px #6366f180', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
            </svg>
          </div>
          <span style={{ color: '#f8fafc' }}>Exlr</span>
          <span style={{ color: '#818cf8' }}>AI</span>
        </a>
        <a href="/dashboard" style={{ fontSize: 13, color: '#94a3b8', padding: '6px 14px', borderRadius: 8, border: '0.5px solid #252d45' }}>
          Back to Dashboard
        </a>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#f87171', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Weakness radar
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Your SLO Mastery Heatmap
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Based on your quiz results. Take more quizzes to see more topics.
          </p>
        </div>

        {/* Summary stats */}
        {mastery.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10, marginBottom: 28,
          }} className="radar-stats">
            {[
              { label: 'Topics tracked', value: stats.total, color: '#818cf8' },
              { label: 'Mastered', value: stats.green, color: '#4ade80' },
              { label: 'Partial', value: stats.amber, color: '#fbbf24' },
              { label: 'Weak', value: stats.red, color: '#f87171' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#0f1422', border: '0.5px solid #252d45',
                borderRadius: 12, padding: '16px 20px',
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: '-1px', marginBottom: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Subject filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {['All', ...subjects].map(s => (
            <button key={s} onClick={() => setSelectedSubject(s)} style={{
              fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 8,
              border: selectedSubject === s ? '1.5px solid #6366f1' : '0.5px solid #252d45',
              background: selectedSubject === s ? '#6366f115' : '#0f1422',
              color: selectedSubject === s ? '#818cf8' : '#64748b',
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{s}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>
        ) : mastery.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 60,
            background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12,
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>⊙</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>No quiz data yet</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
              Take quizzes to see your weakness radar populate.
            </div>
            <a href="/quiz" style={{
              fontSize: 13, fontWeight: 600, padding: '10px 22px',
              borderRadius: 9, background: '#6366f1', color: '#fff',
            }}>Take your first quiz →</a>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 40,
            background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12,
            fontSize: 13, color: '#64748b',
          }}>
            No quiz data for {selectedSubject} yet. Take a {selectedSubject} quiz first.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(m => {
              const c = statusColor(m.status)
              return (
                <div key={m.id} style={{
                  background: '#0f1422',
                  border: `0.5px solid ${c.border}`,
                  borderRadius: 12, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                }}>
                  {/* Status indicator */}
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: c.text, flexShrink: 0,
                    boxShadow: `0 0 8px ${c.text}`,
                  }} />

                  {/* Topic info */}
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginBottom: 2 }}>
                      {m.topic}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {m.subject} · Grade {m.grade}
                    </div>
                  </div>

                  {/* Score bar */}
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                      <span>Score</span>
                      <span>{Math.round(m.score_percent)}%</span>
                    </div>
                    <div style={{ height: 6, background: '#1a2035', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        background: c.text,
                        width: `${m.score_percent}%`,
                      }} />
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{
                    fontSize: 11, fontWeight: 600, padding: '4px 10px',
                    borderRadius: 99, background: c.bg, color: c.text,
                    border: `0.5px solid ${c.border}`,
                    flexShrink: 0,
                  }}>{statusLabel(m.status)}</div>

                  {/* Attempts */}
                  <div style={{ fontSize: 12, color: '#64748b', flexShrink: 0 }}>
                    {m.correct}/{m.attempts} correct
                  </div>

                  {/* Retake button */}
                  <a href={`/quiz?subject=${encodeURIComponent(m.subject)}&grade=${m.grade}&topic=${encodeURIComponent(m.topic)}`}
                    style={{
                      fontSize: 12, fontWeight: 500, padding: '6px 12px',
                      borderRadius: 8, background: '#6366f115',
                      border: '0.5px solid #6366f130', color: '#818cf8',
                      flexShrink: 0,
                    }}>
                    Retake →
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .radar-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}