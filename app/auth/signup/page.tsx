'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const groups = ['Science', 'Humanities', 'Commerce']
const grades = ['9', '10', '11', '12']

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    grade: '', group: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    try {
        const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        })
        if (signUpError) throw signUpError

        if (data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
            id: data.user.id,
            full_name: form.fullName,
            email: form.email,
            grade: form.grade,
            student_group: form.group.toLowerCase(),
            language_pref: 'both',
            is_admin: false,
            streak_count: 0,
            })
        if (profileError) {
            console.error('Profile error:', profileError)
            throw new Error(profileError.message)
        }
        }

        window.location.href = '/dashboard'
    } catch (err: unknown) {
        console.error('Signup error:', err)
        setError(err instanceof Error ? err.message : JSON.stringify(err))
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
      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Logo */}
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 20, fontWeight: 700, marginBottom: 40,
          justifyContent: 'center',
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

        <div style={{
          background: '#0f1422', border: '0.5px solid #252d45',
          borderRadius: 16, padding: 32,
        }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: 3, borderRadius: 99,
                background: step >= s ? '#6366f1' : '#252d45',
                transition: 'background .3s',
              }} />
            ))}
          </div>

          <h1 style={{
            fontSize: 22, fontWeight: 700, letterSpacing: '-.5px',
            marginBottom: 6, color: '#f8fafc',
          }}>
            {step === 1 ? 'Create your account' : 'Your academic profile'}
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
            {step === 1 ? 'Join thousands of AKUEB students. Free forever.' : 'Help us personalise your study plan.'}
          </p>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Full name</label>
                <input style={inputStyle} placeholder="Enter your name"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#252d45')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Email address</label>
                <input style={inputStyle} type="email" placeholder="Enter your email address"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#252d45')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Password</label>
                <input style={inputStyle} type="password" placeholder="Min 8 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#252d45')}
                />
              </div>
              <button onClick={() => {
                if (!form.fullName || !form.email || !form.password) {
                  setError('Please fill all fields')
                  return
                }
                setError('')
                setStep(2)
              }} style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: '#6366f1', color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
                boxShadow: '0 0 24px #6366f140', marginTop: 4,
              }}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 10 }}>Select your grade</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {grades.map(g => (
                    <button key={g} onClick={() => setForm({ ...form, grade: g })} style={{
                      padding: '10px 0', borderRadius: 10, fontSize: 14, fontWeight: 600,
                      border: form.grade === g ? '1.5px solid #6366f1' : '0.5px solid #252d45',
                      background: form.grade === g ? '#6366f115' : '#0a0e1a',
                      color: form.grade === g ? '#818cf8' : '#64748b',
                      cursor: 'pointer',
                    }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 10 }}>Select your group</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {groups.map(g => (
                    <button key={g} onClick={() => setForm({ ...form, group: g })} style={{
                      padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                      border: form.group === g ? '1.5px solid #6366f1' : '0.5px solid #252d45',
                      background: form.group === g ? '#6366f115' : '#0a0e1a',
                      color: form.group === g ? '#818cf8' : '#64748b',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      {g === 'Science' && '⚛ '}
                      {g === 'Humanities' && '📚 '}
                      {g === 'Commerce' && '💼 '}
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: '#f8717112', border: '0.5px solid #f8717130',
                  fontSize: 13, color: '#f87171',
                }}>{error}</div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: '12px', borderRadius: 10,
                  background: 'transparent', color: '#64748b',
                  border: '0.5px solid #252d45', cursor: 'pointer',
                  fontSize: 14, fontWeight: 500,
                }}>← Back</button>
                <button onClick={handleSignup} disabled={loading || !form.grade || !form.group} style={{
                  flex: 2, padding: '12px', borderRadius: 10,
                  background: '#6366f1', color: '#fff', border: 'none',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  boxShadow: '0 0 24px #6366f140',
                  opacity: loading || !form.grade || !form.group ? 0.6 : 1,
                }}>
                  {loading ? 'Creating account...' : 'Start learning free 🚀'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 20 }}>
          Already have an account?{' '}
          <a href="/auth/login" style={{ color: '#818cf8', fontWeight: 500 }}>Log in</a>
        </p>
      </div>
    </div>
  )
}
