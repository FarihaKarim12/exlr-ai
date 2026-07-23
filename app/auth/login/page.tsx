'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields'); return }
    setLoading(true)
    setError('')
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email, password: form.password,
      })
      if (loginError) throw loginError
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(10,14,26,0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 11,
    padding: '13px 16px',
    fontSize: 14, color: '#f8fafc',
    fontFamily: 'inherit', outline: 'none',
    transition: 'all 0.25s ease',
    backdropFilter: 'blur(8px)',
  } as React.CSSProperties

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(34,211,238,0.05) 0%, transparent 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 22, fontWeight: 700, marginBottom: 44,
          justifyContent: 'center', textDecoration: 'none',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            boxShadow: '0 0 20px rgba(99,102,241,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
            </svg>
          </div>
          <span style={{ color: '#f8fafc' }}>Exlr</span>
          <span style={{ color: '#818cf8' }}>AI</span>
        </a>

        <div style={{
          background: 'rgba(15,20,34,0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: 36,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          <h1 style={{
            fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px',
            marginBottom: 6, color: '#f8fafc',
          }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 30, fontWeight: 400 }}>
            Log in to continue your AKUEB prep.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                Email address
              </label>
              <input style={inputStyle} type="email" placeholder="ahmed@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.target.style.boxShadow = 'none'
                }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Password</label>
                <a href="/auth/forgot" style={{
                  fontSize: 12, color: '#6366f1', fontWeight: 500,
                  transition: 'color 0.2s', textDecoration: 'none',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6366f1')}
                >Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input style={inputStyle} type={showPassword ? 'text' : 'password'} placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.boxShadow = 'none'
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button onClick={() => setShowPassword(!showPassword)} type="button" style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: '#64748b',
                  fontSize: 13, padding: 0, fontFamily: 'inherit',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '11px 15px', borderRadius: 10,
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                fontSize: 13, color: '#f87171', fontWeight: 500,
              }}>{error}</div>
            )}

            <button onClick={handleLogin} disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 11,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600,
              boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
              transition: 'all 0.25s ease', marginTop: 4,
              opacity: loading ? 0.7 : 1,
              letterSpacing: '-0.2px',
            }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.5)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'
              }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 22 }}>
          Don't have an account?{' '}
          <a href="/auth/signup" style={{
            color: '#818cf8', fontWeight: 600, textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
            onMouseLeave={e => (e.currentTarget.style.color = '#818cf8')}
          >Sign up free</a>
        </p>
      </div>
    </div>
  )
}