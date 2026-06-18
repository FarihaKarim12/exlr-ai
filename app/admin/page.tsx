'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({ users: 0, papers: 0, messages: 0 })
  const [users, setUsers] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) { window.location.href = '/'; return }
      setIsAdmin(true)
      loadData()
    }
    check()
  }, [])

  const loadData = async () => {
    const [{ count: userCount }, { count: paperCount }, { count: msgCount }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_admin', false),
      supabase.from('past_papers').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    ])
    setStats({ users: userCount || 0, papers: paperCount || 0, messages: msgCount || 0 })

    const { data: usersData } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', false)
      .order('created_at', { ascending: false })
      .limit(20)
    setUsers(usersData || [])

    const { data: msgsData } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(msgsData || [])

    setLoading(false)
  }

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m))
  }

  const tabBtn = (tab: string, label: string) => (
    <button onClick={() => setActiveTab(tab)} style={{
      padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
      border: activeTab === tab ? '1.5px solid #6366f1' : '0.5px solid #252d45',
      background: activeTab === tab ? '#6366f115' : 'transparent',
      color: activeTab === tab ? '#818cf8' : '#64748b',
      cursor: 'pointer', fontFamily: 'inherit',
    }}>{label}</button>
  )

  if (!isAdmin) return null

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
        <a href="/dashboard" style={{ fontSize: 13, color: '#94a3b8', padding: '6px 14px', borderRadius: 8, border: '0.5px solid #252d45' }}>
          Back to Dashboard
        </a>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4 }}>Admin Panel</h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>Manage your Exlr AI platform</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabBtn('overview', 'Overview')}
          {tabBtn('users', `Users (${stats.users})`)}
          {tabBtn('messages', `Messages (${messages.filter(m => m.status === 'unread').length} unread)`)}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Loading...</div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === 'overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 28 }}>
                  {[
                    { label: 'Total students', value: stats.users, color: '#6366f1' },
                    { label: 'Past papers', value: stats.papers, color: '#22d3ee' },
                    { label: 'Contact messages', value: stats.messages, color: '#4ade80' },
                    { label: 'Unread messages', value: messages.filter(m => m.status === 'unread').length, color: '#f87171' },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: '#0f1422', border: '0.5px solid #252d45',
                      borderRadius: 12, padding: '20px 24px',
                    }}>
                      <div style={{ fontSize: 32, fontWeight: 700, color: s.color, letterSpacing: '-1px', marginBottom: 4 }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: '#0f1422', border: '0.5px solid #252d45',
                  borderRadius: 12, padding: '20px 24px',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 16 }}>Quick links</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                    {[
                      { label: 'View past papers', href: '/past-papers', icon: '📄' },
                      { label: 'Test AI chat', href: '/ai-chat', icon: '🧠' },
                      { label: 'Test AI notes', href: '/ai-notes', icon: '✦' },
                      { label: 'Test quiz', href: '/quiz', icon: '⚡' },
                      { label: 'Test study plan', href: '/study-plan', icon: '🗺' },
                      { label: 'View landing page', href: '/', icon: '🌐' },
                    ].map(l => (
                      <a key={l.label} href={l.href} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 14px', borderRadius: 10,
                        background: '#0a0e1a', border: '0.5px solid #252d45',
                        fontSize: 13, color: '#94a3b8',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#6366f1'
                          e.currentTarget.style.color = '#f8fafc'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#252d45'
                          e.currentTarget.style.color = '#94a3b8'
                        }}
                      >
                        <span>{l.icon}</span>{l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #252d45', fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>
                  Registered students
                </div>
                {users.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>No students yet</div>
                ) : (
                  users.map((u, i) => (
                    <div key={u.id} style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
                      borderBottom: i < users.length - 1 ? '0.5px solid #252d45' : 'none',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: '#6366f120',
                        border: '0.5px solid #6366f130', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 14, color: '#818cf8', fontWeight: 600, flexShrink: 0,
                      }}>
                        {u.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#f8fafc' }}>{u.full_name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{u.email}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', textAlign: 'right' }}>
                        <div>Grade {u.grade}</div>
                        <div style={{ textTransform: 'capitalize' }}>{u.student_group}</div>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Messages */}
            {activeTab === 'messages' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.length === 0 ? (
                  <div style={{
                    padding: 60, textAlign: 'center', color: '#64748b', fontSize: 13,
                    background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12,
                  }}>No messages yet</div>
                ) : (
                  messages.map(m => (
                    <div key={m.id} style={{
                      background: '#0f1422',
                      border: `0.5px solid ${m.status === 'unread' ? '#6366f140' : '#252d45'}`,
                      borderRadius: 12, padding: '16px 20px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 2 }}>
                            {m.name}
                            {m.status === 'unread' && (
                              <span style={{
                                fontSize: 10, padding: '2px 6px', borderRadius: 4, marginLeft: 8,
                                background: '#6366f120', color: '#818cf8', border: '0.5px solid #6366f130',
                              }}>NEW</span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{m.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {new Date(m.created_at).toLocaleDateString()}
                          </div>
                          {m.status === 'unread' && (
                            <button onClick={() => markRead(m.id)} style={{
                              fontSize: 11, padding: '4px 10px', borderRadius: 6,
                              background: '#4ade8015', border: '0.5px solid #4ade8030',
                              color: '#4ade80', cursor: 'pointer', fontFamily: 'inherit',
                            }}>Mark read</button>
                          )}
                        </div>
                      </div>
                      {m.subject && (
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                          Subject: {m.subject}
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{m.message}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}