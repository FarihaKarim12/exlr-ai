'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [mastery, setMastery] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setIsAdmin(data?.is_admin || false)
      const { data: masteryData } = await supabase.from('topic_mastery').select('*').eq('student_id', user.id)
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
    <div style={{
      minHeight: '100vh', background: '#0a0e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(99,102,241,0.2)',
          borderTopColor: '#6366f1',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ fontSize: 14, color: '#64748b' }}>Loading your dashboard...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const greenCount = mastery.filter(m => m.status === 'green').length
  const amberCount = mastery.filter(m => m.status === 'amber').length
  const redCount = mastery.filter(m => m.status === 'red').length

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>

      {/* Page header */}
      <div style={{
        padding: '32px 32px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        marginBottom: 32,
        paddingBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700,
              letterSpacing: '-1px', marginBottom: 6,
            }}>
              Hey,{' '}
              <span style={{ color: '#818cf8', textShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
                {profile?.full_name?.split(' ')[0]}
              </span>{' '}
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>
              Grade {profile?.grade} · {profile?.student_group?.charAt(0).toUpperCase() + profile?.student_group?.slice(1)} group · Keep going!
            </p>
          </div>
          {isAdmin && (
            <a href="/admin" style={{
              fontSize: 12, padding: '8px 16px', borderRadius: 9,
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#818cf8', fontWeight: 600,
              transition: 'all 0.25s ease', textDecoration: 'none',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.18)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >Admin Panel</a>
          )}
        </div>
      </div>

      <div style={{ padding: '0 32px 32px' }}>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12, marginBottom: 28,
        }}>
          {[
            { label: 'Study streak', value: `${profile?.streak_count || 0}`, suffix: 'days', color: '#f59e0b' },
            { label: 'Topics tracked', value: `${mastery.length}`, suffix: 'total', color: '#4ade80' },
            { label: 'Questions answered', value: `${mastery.reduce((sum, m) => sum + (m.attempts || 0), 0)}`, suffix: 'total', color: '#6366f1' },
            { label: 'Past papers', value: '0', suffix: 'attempted', color: '#22d3ee' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(15,20,34,0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '20px 22px',
              transition: 'all 0.25s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${s.color}25`
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.15)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
                <span style={{ color: s.color }}>{s.value}</span>
                <span style={{ fontSize: 12, color: '#64748b', marginLeft: 5, fontWeight: 400 }}>{s.suffix}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 640px)',
          justifyContent: 'center',
          gap: 14,
        }} className="dash-grid">

          {/* Overall progress */}
          <div style={{
            background: 'rgba(15,20,34,0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: '22px 24px',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 6, letterSpacing: '-0.3px' }}>
              Overall Progress
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 24, fontWeight: 400 }}>
              Your performance across all quizzes taken
            </div>

            {mastery.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: 200, gap: 14,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28,
                }}>◎</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>No quiz data yet</div>
                <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 1.6 }}>
                  Take a quiz to see your<br />progress appear here
                </div>
                <a href="/quiz" style={{
                  fontSize: 12, fontWeight: 600, padding: '9px 20px',
                  borderRadius: 9,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: '#fff', textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                  transition: 'all 0.25s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.45)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.3)'
                  }}
                >Take your first quiz</a>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                  <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                      {(() => {
                        const total = mastery.length || 1
                        const circumference = 2 * Math.PI * 42
                        const greenLen = (greenCount / total) * circumference
                        const amberLen = (amberCount / total) * circumference
                        const redLen = (redCount / total) * circumference
                        return (
                          <>
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#4ade80" strokeWidth="10"
                              strokeDasharray={`${greenLen} ${circumference}`} strokeDashoffset="0" transform="rotate(-90 50 50)"
                              style={{ filter: 'drop-shadow(0 0 4px rgba(74,222,128,0.4))' }} />
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#fbbf24" strokeWidth="10"
                              strokeDasharray={`${amberLen} ${circumference}`} strokeDashoffset={`-${greenLen}`} transform="rotate(-90 50 50)"
                              style={{ filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.4))' }} />
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#f87171" strokeWidth="10"
                              strokeDasharray={`${redLen} ${circumference}`} strokeDashoffset={`-${greenLen + amberLen}`} transform="rotate(-90 50 50)"
                              style={{ filter: 'drop-shadow(0 0 4px rgba(248,113,113,0.4))' }} />
                          </>
                        )
                      })()}
                    </svg>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      fontSize: 20, fontWeight: 700, color: '#f8fafc',
                    }}>{mastery.length}</div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Mastered', count: greenCount, color: '#4ade80' },
                      { label: 'Partial', count: amberCount, color: '#fbbf24' },
                      { label: 'Weak', count: redCount, color: '#f87171' },
                    ].map(s => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: s.color,
                          boxShadow: `0 0 6px ${s.color}`,
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: 12, color: '#94a3b8', flex: 1 }}>{s.label}</span>
                        <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 600 }}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href="/radar" style={{
                  display: 'block', textAlign: 'center', padding: '11px',
                  borderRadius: 10,
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  color: '#818cf8', fontSize: 13, fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >View detailed weakness radar</a>
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