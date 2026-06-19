'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'updating' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
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

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 20, fontWeight: 700, marginBottom: 40, justifyContent: 'center',
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

        <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 16, padding: 32 }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Password updated!</h1>
              <p style={{ fontSize: 13, color: '#64748b' }}>Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', marginBottom: 6, color: '#f8fafc' }}>
                Set new password
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
                Choose a strong new password for your account.
              </p>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>New password</label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  placeholder="Min 6 characters"
                  style={{
                    width: '100%', background: '#0a0e1a', border: '0.5px solid #252d45',
                    borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#f8fafc',
                    fontFamily: 'inherit', outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#252d45')}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Confirm password</label>
                <input
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUpdate()}
                  type="password"
                  placeholder="Re-enter password"
                  style={{
                    width: '100%', background: '#0a0e1a', border: '0.5px solid #252d45',
                    borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#f8fafc',
                    fontFamily: 'inherit', outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#252d45')}
                />
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8, marginBottom: 14,
                  background: '#f8717112', border: '0.5px solid #f8717130',
                  fontSize: 13, color: '#f87171',
                }}>{error}</div>
              )}

              <button onClick={handleUpdate} disabled={status === 'updating'} style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: '#6366f1', color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
                boxShadow: '0 0 24px #6366f140',
                opacity: status === 'updating' ? 0.7 : 1,
              }}>
                {status === 'updating' ? 'Updating...' : 'Update password →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
