'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const navItems = [
  { icon: '⊞', label: 'Dashboard', href: '/dashboard' },
  { icon: '📄', label: 'Past Papers', href: '/past-papers' },
  { icon: '🧠', label: 'AI Doubt Solver', href: '/ai-chat' },
  { icon: '✦', label: 'AI Notes', href: '/ai-notes' },
  { icon: '⚡', label: 'Quiz', href: '/quiz' },
  { icon: '⊙', label: 'Weakness Radar', href: '/radar' },
  { icon: '🗺', label: 'Study Plan', href: '/study-plan' },
  { icon: '🎯', label: 'Learning Path', href: '/learning-path' },
  { icon: '⏱', label: 'Exam Simulator', href: '/exam-simulator' },
  { icon: '💬', label: 'Feedback', href: '/feedback' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('full_name, grade, student_group, is_admin')
        .eq('id', user.id)
        .single()
      setProfile(data)
      setIsAdmin(data?.is_admin || false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      minHeight: '100vh',
      background: '#0f1422',
      borderRight: '0.5px solid #252d45',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width .25s ease',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>

      {/* Logo + toggle */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '18px 0' : '18px 16px',
        borderBottom: '0.5px solid #252d45',
        flexShrink: 0,
      }}>
        {!collapsed && (
          <a href="/" style={{
            fontSize: 18, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
            textDecoration: 'none',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: '#6366f1',
              boxShadow: '0 0 10px #6366f180',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
              </svg>
            </div>
            <span style={{ color: '#f8fafc' }}>Exlr</span>
            <span style={{ color: '#818cf8' }}>AI</span>
          </a>
        )}

        {collapsed && (
          <a href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: '#6366f1',
              boxShadow: '0 0 10px #6366f180',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
              </svg>
            </div>
          </a>
        )}

        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748b', fontSize: 16, padding: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Profile card */}
      {!collapsed && profile && (
        <div style={{
          margin: '12px 12px 4px',
          background: '#141928',
          border: '0.5px solid #252d45',
          borderRadius: 10, padding: '12px 14px',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 2 }}>
            {profile.full_name?.split(' ')[0]}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            Grade {profile.grade} · {profile.student_group?.charAt(0).toUpperCase() + profile.student_group?.slice(1)}
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: collapsed ? '8px 0' : '8px 10px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <a key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 10,
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '10px 0' : '9px 12px',
              borderRadius: 9, marginBottom: 2,
              fontSize: 13, fontWeight: active ? 600 : 400,
              background: active ? '#6366f115' : 'transparent',
              color: active ? '#818cf8' : '#64748b',
              border: active ? '0.5px solid #6366f130' : '0.5px solid transparent',
              textDecoration: 'none',
              transition: 'all .15s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = '#141928'
                  e.currentTarget.style.color = '#f8fafc'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#64748b'
                }
              }}
              title={collapsed ? item.label : ''}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </a>
          )
        })}

        {/* Admin link */}
        {isAdmin && (
          <a href="/admin" style={{
            display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '9px 12px',
            borderRadius: 9, marginTop: 8,
            fontSize: 13, fontWeight: 400,
            background: '#6366f110',
            color: '#818cf8',
            border: '0.5px solid #6366f120',
            textDecoration: 'none',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}
            title={collapsed ? 'Admin Panel' : ''}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚙</span>
            {!collapsed && <span>Admin Panel</span>}
          </a>
        )}
      </nav>

      {/* Logout */}
      <div style={{
        padding: collapsed ? '12px 0' : '12px',
        borderTop: '0.5px solid #252d45',
        flexShrink: 0,
      }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '8px 0' : '8px 12px',
          borderRadius: 9, background: 'none',
          border: '0.5px solid #252d45',
          color: '#64748b', cursor: 'pointer',
          fontSize: 13, fontFamily: 'inherit',
          whiteSpace: 'nowrap', overflow: 'hidden',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#f87171'
            e.currentTarget.style.color = '#f87171'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#252d45'
            e.currentTarget.style.color = '#64748b'
          }}
          title={collapsed ? 'Log out' : ''}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>↩</span>
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  )
}
