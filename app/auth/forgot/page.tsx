'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleReset = async () => {
    if (!email) return
    setStatus('sending')
    setError('')
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (resetError) throw resetError
      setStatus('sent')
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

        <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 16, padding: 32 }}>
          {status === 'sent' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Check your email</h1>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                We've sent a password reset link to <span style={{ color: '#818cf8' }}>{email}</span>. Click the link to reset your password.
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.5px', marginBottom: 6, color: '#f8fafc' }}>
                Reset password
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
                Enter your email and we'll send you a reset link.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  type="email"
                  placeholder="ahmed@email.com"
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

              <button onClick={handleReset} disabled={status === 'sending'} style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: '#6366f1', color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
                boxShadow: '0 0 24px #6366f140',
                opacity: status === 'sending' ? 0.7 : 1,
              }}>
                {status === 'sending' ? 'Sending...' : 'Send reset link →'}
              </button>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 20 }}>
          Remember your password?{' '}
          <a href="/auth/login" style={{ color: '#818cf8', fontWeight: 500 }}>Log in</a>
        </p>
      </div>
    </div>
  )
}