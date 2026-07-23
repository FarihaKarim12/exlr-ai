'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

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
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, margin: '0 auto 20px',
              }}>◈</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>Check your email</h1>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
                We've sent a password reset link to{' '}
                <span style={{ color: '#818cf8', fontWeight: 600 }}>{email}</span>.
                Click the link to reset your password.
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6, color: '#f8fafc' }}>
                Reset password
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, fontWeight: 400 }}>
                Enter your email and we'll send you a reset link.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                  Email address
                </label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  type="email"
                  placeholder="ahmed@email.com"
                  style={{
                    width: '100%',
                    background: 'rgba(10,14,26,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 11, padding: '13px 16px',
                    fontSize: 14, color: '#f8fafc',
                    fontFamily: 'inherit', outline: 'none',
                    transition: 'all 0.25s ease',
                  }}
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
                  padding: '11px 15px', borderRadius: 10, marginBottom: 16,
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  fontSize: 13, color: '#f87171', fontWeight: 500,
                }}>{error}</div>
              )}

              <button onClick={handleReset} disabled={status === 'sending'} style={{
                width: '100%', padding: '13px', borderRadius: 11,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600,
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                transition: 'all 0.25s ease',
                opacity: status === 'sending' ? 0.7 : 1,
              }}
                onMouseEnter={e => {
                  if (status !== 'sending') {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.5)'
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'
                }}
              >
                {status === 'sending' ? 'Sending...' : 'Send reset link'}
              </button>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 22 }}>
          Remember your password?{' '}
          <a href="/auth/login" style={{
            color: '#818cf8', fontWeight: 600, textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
            onMouseLeave={e => (e.currentTarget.style.color = '#818cf8')}
          >Log in</a>
        </p>
      </div>
    </div>
  )
}