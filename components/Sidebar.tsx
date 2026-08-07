'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Past Papers', href: '/past-papers' },
  { label: 'AI Doubt Solver', href: '/ai-chat' },
  { label: 'AI Notes', href: '/ai-notes' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Weakness Radar', href: '/radar' },
  { label: 'Study Plan', href: '/study-plan' },
  { label: 'Learning Path', href: '/learning-path' },
  { label: 'Exam Simulator', href: '/exam-simulator' },
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
      width: collapsed ? 68 : 248,
      minHeight: '100vh',
      background: 'rgba(10, 14, 26, 0.8)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      zIndex: 40,
    }}>

      {/* Logo + toggle */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '20px 0' : '20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        {!collapsed && (
          <a href="/" style={{
            fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px',
            display: 'flex', alignItems: 'center', gap: 8,
            textDecoration: 'none',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 0 12px rgba(99,102,241,0.5)',
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
          <a href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 0 12px rgba(99,102,241,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
              </svg>
            </div>
          </a>
        )}

        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 7,
          cursor: 'pointer',
          color: '#64748b', fontSize: 13, padding: '5px 8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(99,102,241,0.12)'
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
            e.currentTarget.style.color = '#818cf8'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = '#64748b'
          }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Profile card */}
      {!collapsed && profile && (
        <div style={{
          margin: '14px 12px 4px',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: 11, padding: '13px 15px',
          flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
            marginBottom: 8,
          }}>
            {profile.full_name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 3, letterSpacing: '-0.2px' }}>
            {profile.full_name?.split(' ')[0]}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>
            Grade {profile.grade} · {profile.student_group?.charAt(0).toUpperCase() + profile.student_group?.slice(1)}
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: collapsed ? '10px 0' : '10px 10px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = pathname === item.href
          return (
            <a key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '11px 0' : '10px 13px',
              borderRadius: 10, marginBottom: 3,
              fontSize: 15, fontWeight: active ? 600 : 400,
              background: active
                ? 'rgba(99,102,241,0.12)'
                : 'transparent',
              color: active ? '#818cf8' : '#64748b',
              border: active
                ? '1px solid rgba(99,102,241,0.2)'
                : '1px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = '#f8fafc'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#64748b'
                  e.currentTarget.style.borderColor = 'transparent'
                }
              }}
              title={collapsed ? item.label : ''}
            >
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <span style={{
                  marginLeft: 'auto', width: 6, height: 6,
                  borderRadius: '50%', background: '#6366f1',
                  boxShadow: '0 0 8px rgba(99,102,241,0.8)',
                  flexShrink: 0,
                }} />
              )}
            </a>
          )
        })}

        {isAdmin && (
          <a href="/admin" style={{
            display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 11,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '11px 0' : '10px 13px',
            borderRadius: 10, marginTop: 10,
            fontSize: 14, fontWeight: 500,
            background: 'rgba(99,102,241,0.08)',
            color: '#818cf8',
            border: '1px solid rgba(99,102,241,0.15)',
            textDecoration: 'none',
            whiteSpace: 'nowrap', overflow: 'hidden',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'
            }}
            title={collapsed ? 'Admin Panel' : ''}
          >
            {!collapsed && <span>Admin Panel</span>}
          </a>
        )}
      </nav>

      {/* Logout */}
      <div style={{
        padding: collapsed ? '14px 0' : '14px 10px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : 11,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '10px 0' : '10px 13px',
          borderRadius: 10,
          background: 'rgba(248,113,113,0.04)',
          border: '1px solid rgba(248,113,113,0.1)',
          color: '#64748b', cursor: 'pointer',
          fontSize: 14, fontWeight: 500, fontFamily: 'inherit',
          whiteSpace: 'nowrap', overflow: 'hidden',
          transition: 'all 0.25s ease',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(248,113,113,0.1)'
            e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'
            e.currentTarget.style.color = '#f87171'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(248,113,113,0.04)'
            e.currentTarget.style.borderColor = 'rgba(248,113,113,0.1)'
            e.currentTarget.style.color = '#64748b'
          }}
          title={collapsed ? 'Log out' : ''}
        >
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  )
}