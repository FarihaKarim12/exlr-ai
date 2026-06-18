'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [mastery, setMastery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)

      setIsAdmin(data?.is_admin || false)

      const { data: masteryData } = await supabase
        .from('topic_mastery')
        .select('*')
        .eq('student_id', user.id)
      setMastery(masteryData || [])

      setLoading(false)
    }
    getProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh', background: '#0a0e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>
      <div style={{ fontSize: 14, color: '#64748b' }}>Loading...</div>
    </div>
  )

  const greenCount = mastery.filter(m => m.status === 'green').length
  const amberCount = mastery.filter(m => m.status === 'amber').length
  const redCount = mastery.filter(m => m.status === 'red').length

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh', background: '#0a0e1a',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>

      {/* Navbar */}
      <nav style={{
        background: '#0a0e1aee', borderBottom: '0.5px solid #252d45',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <a href="/" style={{ 
          fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', 
          display: 'flex', alignItems: 'center', gap: 8 
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: '#6366f1',
            boxShadow: '0 0 12px #6366f180',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
            </svg>
          </div>
          <span style={{ color: '#f8fafc' }}>Exlr</span>
          <span style={{ color: '#818cf8' }}>AI</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
           {isAdmin && (
            <a href="/admin" style={{
              fontSize: 12, padding: '6px 14px', borderRadius: 8,
              background: '#6366f120', border: '0.5px solid #6366f130',
              color: '#818cf8', fontWeight: 600,
            }}>⚙ Admin Panel</a>
          )}
          <span style={{ fontSize: 13, color: '#94a3b8' }}>
            Hi, <span style={{ color: '#f8fafc', fontWeight: 600 }}>{profile?.full_name?.split(' ')[0]}</span>
          </span>
          <button onClick={handleLogout} style={{
            fontSize: 12, padding: '6px 14px', borderRadius: 8,
            background: 'transparent', border: '0.5px solid #252d45',
            color: '#64748b', cursor: 'pointer',
          }}>Log out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700,
            letterSpacing: '-1px', marginBottom: 6,
          }}>
            Welcome back,{' '}
            <span style={{ color: '#818cf8', textShadow: '0 0 30px #6366f160' }}>
              {profile?.full_name?.split(' ')[0]}
            </span>{' '}👋
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Grade {profile?.grade} · {profile?.student_group?.charAt(0).toUpperCase() + profile?.student_group?.slice(1)} group · Keep going!
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 10, marginBottom: 32,
        }}>
          {[
            { label: 'Study streak', value: `${profile?.streak_count || 0}`, suffix: 'days', color: '#f59e0b' },
            { label: 'Topics tracked', value: `${mastery.length}`, suffix: 'total', color: '#4ade80' },
            { label: 'Quizzes taken', value: `${mastery.reduce((sum, m) => sum + (m.attempts || 0), 0)}`, suffix: 'questions', color: '#6366f1' },
            { label: 'Past papers', value: '0', suffix: 'attempted', color: '#22d3ee' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#0f1422', border: '0.5px solid #252d45',
              borderRadius: 12, padding: '18px 20px',
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px' }}>
                <span style={{ color: s.color }}>{s.value}</span>
                <span style={{ fontSize: 13, color: '#64748b', marginLeft: 4, fontWeight: 400 }}>{s.suffix}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12, marginBottom: 12,
        }} className="dash-grid">

          {/* Quick actions */}
          <div style={{
            background: '#0f1422', border: '0.5px solid #252d45',
            borderRadius: 12, padding: '20px 24px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 16 }}>
              Quick actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '📄', label: 'Browse past papers', href: '/past-papers', color: '#6366f1' },
                { icon: '🧠', label: 'AI doubt solver', href: '/ai-chat', color: '#22d3ee' },
                { icon: '✦', label: 'Generate AI notes', href: '/ai-notes', color: '#818cf8' },
                { icon: '⚡', label: 'Take a quiz', href: '/quiz', color: '#4ade80' },
                { icon: '⊙', label: 'Weakness radar', href: '/radar', color: '#f87171' },
                { icon: '🗺', label: 'Study plan', href: '/study-plan', color: '#f59e0b' },
                { icon: '🎯', label: 'Learning path', href: '/learning-path', color: '#22d3ee' },
                { icon: '⏱', label: 'Exam simulator', href: '/exam-simulator', color: '#6366f1' },
              ].map(a => (
                <a key={a.label} href={a.href} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  background: '#0a0e1a', border: '0.5px solid #252d45',
                  fontSize: 13, color: '#94a3b8',
                  transition: 'border-color .2s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = a.color
                    e.currentTarget.style.color = '#f8fafc'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#252d45'
                    e.currentTarget.style.color = '#94a3b8'
                  }}
                >
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  {a.label}
                  <span style={{ marginLeft: 'auto', fontSize: 16, color: '#252d45' }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Overall progress chart */}
          <div style={{
            background: '#0f1422', border: '0.5px solid #252d45',
            borderRadius: 12, padding: '20px 24px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>
              Overall Progress
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>
              Your performance across all quizzes taken
            </div>

            {mastery.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: 180, gap: 12,
              }}>
                <div style={{ fontSize: 40 }}>📊</div>
                <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>
                  No quiz data yet.<br />Take a quiz to see your progress.
                </div>
                <a href="/quiz" style={{
                  fontSize: 12, fontWeight: 600, padding: '8px 18px',
                  borderRadius: 8, background: '#6366f115',
                  border: '0.5px solid #6366f130', color: '#818cf8',
                }}>Take a quiz →</a>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
                    <svg width="90" height="90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="38" fill="none" stroke="#1a2035" strokeWidth="10" />
                      {(() => {
                        const total = mastery.length || 1
                        const circumference = 2 * Math.PI * 38
                        const greenLen = (greenCount / total) * circumference
                        const amberLen = (amberCount / total) * circumference
                        const redLen = (redCount / total) * circumference
                        return (
                          <>
                            <circle cx="45" cy="45" r="38" fill="none" stroke="#4ade80" strokeWidth="10"
                              strokeDasharray={`${greenLen} ${circumference}`} strokeDashoffset="0" transform="rotate(-90 45 45)" />
                            <circle cx="45" cy="45" r="38" fill="none" stroke="#fbbf24" strokeWidth="10"
                              strokeDasharray={`${amberLen} ${circumference}`} strokeDashoffset={`-${greenLen}`} transform="rotate(-90 45 45)" />
                            <circle cx="45" cy="45" r="38" fill="none" stroke="#f87171" strokeWidth="10"
                              strokeDasharray={`${redLen} ${circumference}`} strokeDashoffset={`-${greenLen + amberLen}`} transform="rotate(-90 45 45)" />
                          </>
                        )
                      })()}
                    </svg>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      fontSize: 18, fontWeight: 700, color: '#f8fafc',
                    }}>{mastery.length}</div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Mastered', count: greenCount, color: '#4ade80' },
                      { label: 'Partial', count: amberCount, color: '#fbbf24' },
                      { label: 'Weak', count: redCount, color: '#f87171' },
                    ].map(s => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                        <span style={{ color: '#94a3b8', flex: 1 }}>{s.label}</span>
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href="/radar" style={{
                  display: 'block', textAlign: 'center', padding: '10px',
                  borderRadius: 8, background: '#6366f115',
                  border: '0.5px solid #6366f130', color: '#818cf8',
                  fontSize: 12, fontWeight: 600,
                }}>View detailed weakness radar →</a>
              </>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}