'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function LearningPathPage() {
  const [mastery, setMastery] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [path, setPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }

      const [{ data: profileData }, { data: masteryData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('topic_mastery').select('*').eq('student_id', user.id).order('score_percent'),
      ])

      setProfile(profileData)
      setMastery(masteryData || [])
      setDataLoading(false)
    }
    load()
  }, [])

  const generatePath = async () => {
    setLoading(true)
    setPath('')
    try {
      const res = await fetch('/api/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mastery, profile }),
      })
      const data = await res.json()
      setPath(data.path)
    } catch {
      setPath('Sorry, something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const weakTopics = mastery.filter(m => m.status === 'red')
  const partialTopics = mastery.filter(m => m.status === 'amber')
  const masteredTopics = mastery.filter(m => m.status === 'green')

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

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#22d3ee', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            AI powered
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Your Personalised Learning Path
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            AI analyses your quiz results and generates a focused study path targeting your weak areas.
          </p>
        </div>

        {dataLoading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading your data...</div>
        ) : mastery.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 60,
            background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12,
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🗺</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', marginBottom: 8 }}>
              No quiz data yet
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
              Take some quizzes first so AI can analyse your strengths and weaknesses.
            </div>
            <a href="/quiz" style={{
              fontSize: 13, fontWeight: 600, padding: '10px 22px',
              borderRadius: 9, background: '#6366f1', color: '#fff',
            }}>Take a quiz →</a>
          </div>
        ) : (
          <>
            {/* Current performance summary */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10, marginBottom: 24,
            }} className="path-grid">
              <div style={{ background: '#f8717110', border: '0.5px solid #f8717130', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f87171', marginBottom: 4 }}>{weakTopics.length}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Weak topics</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Need urgent attention</div>
              </div>
              <div style={{ background: '#fbbf2410', border: '0.5px solid #fbbf2430', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#fbbf24', marginBottom: 4 }}>{partialTopics.length}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Partial topics</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Need more practice</div>
              </div>
              <div style={{ background: '#4ade8010', border: '0.5px solid #4ade8030', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>{masteredTopics.length}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Mastered topics</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Keep it up!</div>
              </div>
            </div>

            {/* Weak topics list */}
            {weakTopics.length > 0 && (
              <div style={{
                background: '#0f1422', border: '0.5px solid #252d45',
                borderRadius: 12, padding: '20px', marginBottom: 20,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f87171', marginBottom: 12 }}>
                  🔴 Topics needing urgent attention
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {weakTopics.map(t => (
                    <div key={t.id} style={{
                      fontSize: 12, padding: '4px 10px', borderRadius: 6,
                      background: '#f8717110', border: '0.5px solid #f8717130', color: '#f87171',
                    }}>
                      {t.topic} ({t.subject} G{t.grade}) — {Math.round(t.score_percent)}%
                    </div>
                  ))}
                </div>
              </div>
            )}

            {partialTopics.length > 0 && (
              <div style={{
                background: '#0f1422', border: '0.5px solid #252d45',
                borderRadius: 12, padding: '20px', marginBottom: 20,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24', marginBottom: 12 }}>
                  🟡 Topics needing more practice
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {partialTopics.map(t => (
                    <div key={t.id} style={{
                      fontSize: 12, padding: '4px 10px', borderRadius: 6,
                      background: '#fbbf2410', border: '0.5px solid #fbbf2430', color: '#fbbf24',
                    }}>
                      {t.topic} ({t.subject} G{t.grade}) — {Math.round(t.score_percent)}%
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={generatePath} disabled={loading} style={{
              width: '100%', padding: 12, borderRadius: 10,
              background: '#6366f1', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              boxShadow: '0 0 24px #6366f140',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit', marginBottom: 20,
            }}>
              {loading ? 'Generating your personalised path...' : '🗺 Generate My Learning Path'}
            </button>

            {(path || loading) && (
              <div style={{
                background: '#0f1422', border: '0.5px solid #252d45',
                borderRadius: 14, overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px', borderBottom: '0.5px solid #252d45',
                  background: '#141928',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>
                    Your personalised learning path
                  </div>
                  {path && (
                    <button onClick={() => navigator.clipboard.writeText(path)} style={{
                      fontSize: 12, padding: '5px 12px', borderRadius: 7,
                      background: '#6366f115', border: '0.5px solid #6366f130',
                      color: '#818cf8', cursor: 'pointer', fontFamily: 'inherit',
                    }}>Copy</button>
                  )}
                </div>
                <div style={{ padding: '20px 24px' }}>
                  {loading ? (
                    <div style={{ color: '#64748b', fontSize: 13 }}>Analysing your performance and generating path...</div>
                  ) : (
                    <div style={{ fontSize: 13, color: '#f8fafc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {path}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .path-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}