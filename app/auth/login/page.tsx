'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError('Please fill all fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
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
    width: '100%', background: '#0a0e1a',
    border: '0.5px solid #252d45', borderRadius: 10,
    padding: '12px 14px', fontSize: 14, color: '#f8fafc',
    fontFamily: 'inherit', outline: 'none',
  } as React.CSSProperties

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 20, fontWeight: 700, marginBottom: 40,
          justifyContent: 'center',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#6366f1', boxShadow: '0 0 10px #6366f1',
            display: 'inline-block',
          }} />
          <span style={{ color: '#f8fafc' }}>Exlr</span>
          <span style={{ color: '#818cf8' }}>AI</span>
        </a>

        <div style={{
          background: '#0f1422', border: '0.5px solid #252d45',
          borderRadius: 16, padding: 32,
        }}>
          <h1 style={{
            fontSize: 22, fontWeight: 700, letterSpacing: '-.5px',
            marginBottom: 6, color: '#f8fafc',
          }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>
            Log in to continue your AKUEB prep.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                Email address
              </label>
              <input style={inputStyle} type="email" placeholder="ahmed@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = '#252d45')}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>
                  Password
                </label>
                <a href="/auth/forgot" style={{ fontSize: 12, color: '#6366f1' }}>
                  Forgot password?
                </a>
              </div>
              <input style={inputStyle} type="password" placeholder="Your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={e => (e.target.style.borderColor = '#6366f1')}
                onBlur={e => (e.target.style.borderColor = '#252d45')}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: '#f8717112', border: '0.5px solid #f8717130',
                fontSize: 13, color: '#f87171',
              }}>{error}</div>
            )}

            <button onClick={handleLogin} disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: '#6366f1', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              boxShadow: '0 0 24px #6366f140', marginTop: 4,
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Logging in...' : 'Log in →'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 20 }}>
          Don't have an account?{' '}
          <a href="/auth/signup" style={{ color: '#818cf8', fontWeight: 500 }}>
            Sign up free
          </a>
        </p>

      </div>
    </div>
  )
}