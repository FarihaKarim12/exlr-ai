'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const groups = ['Science', 'Humanities', 'Commerce']
const grades = ['9', '10', '11', '12']

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', grade: '', group: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email, password: form.password,
      })
      if (signUpError) throw signUpError
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: form.fullName,
          email: form.email,
          grade: form.grade,
          student_group: form.group.toLowerCase(),
          language_pref: 'both',
          is_admin: false,
          streak_count: 0,
        })
        if (profileError) throw new Error(profileError.message)
      }
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
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
      <div style={{ width: '100%', maxWidth: 460 }}>

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

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: 3, borderRadius: 99,
                background: step >= s
                  ? 'linear-gradient(90deg, #6366f1, #818cf8)'
                  : 'rgba(255,255,255,0.06)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>

          <h1 style={{
            fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px',
            marginBottom: 6, color: '#f8fafc',
          }}>
            {step === 1 ? 'Create your account' : 'Your academic profile'}
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, fontWeight: 400 }}>
            {step === 1 ? 'Join thousands of AKUEB students. Free forever.' : 'Help us personalise your study plan.'}
          </p>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Full name</label>
                <input style={inputStyle} placeholder="Ahmed Ali"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
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
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Email address</label>
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
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input style={inputStyle} type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters"
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

              <button onClick={() => {
                if (!form.fullName || !form.email || !form.password) {
                  setError('Please fill all fields'); return
                }
                setError(''); setStep(2)
              }} style={{
                width: '100%', padding: '13px', borderRadius: 11,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600,
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                transition: 'all 0.25s ease', marginTop: 4,
                letterSpacing: '-0.2px',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'
                }}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Select your grade</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {grades.map(g => (
                    <button key={g} onClick={() => setForm({ ...form, grade: g })} style={{
                      padding: '11px 0', borderRadius: 10, fontSize: 14, fontWeight: 600,
                      border: form.grade === g
                        ? '1px solid rgba(99,102,241,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      background: form.grade === g
                        ? 'rgba(99,102,241,0.12)'
                        : 'rgba(255,255,255,0.03)',
                      color: form.grade === g ? '#818cf8' : '#64748b',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      boxShadow: form.grade === g ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                    }}
                      onMouseEnter={e => {
                        if (form.grade !== g) {
                          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                          e.currentTarget.style.color = '#94a3b8'
                        }
                      }}
                      onMouseLeave={e => {
                        if (form.grade !== g) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                          e.currentTarget.style.color = '#64748b'
                        }
                      }}
                    >{g}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Select your group</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {groups.map(g => (
                    <button key={g} onClick={() => setForm({ ...form, group: g })} style={{
                      padding: '13px 16px', borderRadius: 11, fontSize: 13, fontWeight: 500,
                      border: form.group === g
                        ? '1px solid rgba(99,102,241,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      background: form.group === g
                        ? 'rgba(99,102,241,0.1)'
                        : 'rgba(255,255,255,0.02)',
                      color: form.group === g ? '#818cf8' : '#64748b',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: form.group === g ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                    }}
                      onMouseEnter={e => {
                        if (form.group !== g) {
                          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'
                          e.currentTarget.style.color = '#94a3b8'
                        }
                      }}
                      onMouseLeave={e => {
                        if (form.group !== g) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                          e.currentTarget.style.color = '#64748b'
                        }
                      }}
                    >{g}</button>
                  ))}
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

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: '13px', borderRadius: 11,
                  background: 'rgba(255,255,255,0.04)',
                  color: '#64748b', border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', fontSize: 14, fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = '#94a3b8'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.color = '#64748b'
                  }}
                >Back</button>
                <button onClick={handleSignup} disabled={loading || !form.grade || !form.group} style={{
                  flex: 2, padding: '13px', borderRadius: 11,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                  transition: 'all 0.25s ease', letterSpacing: '-0.2px',
                  opacity: loading || !form.grade || !form.group ? 0.6 : 1,
                }}
                  onMouseEnter={e => {
                    if (!loading && form.grade && form.group) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.5)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'
                  }}
                >
                  {loading ? 'Creating account...' : 'Start learning free'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 22 }}>
          Already have an account?{' '}
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