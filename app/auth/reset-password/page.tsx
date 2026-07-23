'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'updating' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleUpdate = async () => {
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setStatus('updating')
    setError('')
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setStatus('success')
      setTimeout(() => { window.location.href = '/dashboard' }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(10,14,26,0.6)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 11, padding: '13px 16px',
    fontSize: 14, color: '#f8fafc',
    fontFamily: 'inherit', outline: 'none',
    transition: 'all 0.25s ease',
  } as React.CSSProperties

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

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
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, margin: '0 auto 20px', color: '#4ade80',
              }}>✓</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>Password updated!</h1>
              <p style={{ fontSize: 13, color: '#64748b' }}>Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6, color: '#f8fafc' }}>
                Set new password
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, fontWeight: 400 }}>
                Choose a strong new password for your account.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>New password</label>
                  <div style={{ position: 'relative' }}>
                    <input value={password} onChange={e => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters"
                      style={inputStyle}
                      onFocus={e => {
                        e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                        e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} type="button" style={{
                      position: 'absolute', right: 14, top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#64748b',
                      fontSize: 13, padding: 0, fontFamily: 'inherit',
                    }}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Confirm password</label>
                  <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUpdate()}
                    type="password" placeholder="Re-enter password"
                    style={inputStyle}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {error && (
                  <div style={{
                    padding: '11px 15px', borderRadius: 10,
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    fontSize: 13, color: '#f87171', fontWeight: 500,
                  }}>{error}</div>
                )}

                <button onClick={handleUpdate} disabled={status === 'updating'} style={{
                  width: '100%', padding: '13px', borderRadius: 11,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                  transition: 'all 0.25s ease',
                  opacity: status === 'updating' ? 0.7 : 1,
                }}
                  onMouseEnter={e => {
                    if (status !== 'updating') {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.5)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'
                  }}
                >
                  {status === 'updating' ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}