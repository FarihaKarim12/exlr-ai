'use client'

import { useState } from 'react'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const subjects = [
  'Physics', 'Chemistry', 'Biology',
  'Mathematics', 'Computer Science',
  'Islamiyat', 'Pakistan Studies',
]

export default function StudyPlanPage() {
  const [grade, setGrade] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState('2')
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleSubject = (s: string) => {
    setSelectedSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const generatePlan = async () => {
    if (!grade || selectedSubjects.length === 0) return
    setLoading(true)
    setPlan('')
    try {
      const res = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, subjects: selectedSubjects, examDate, hoursPerDay }),
      })
      const data = await res.json()
      setPlan(data.plan)
    } catch {
      setPlan('Sorry, something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#0a0e1a',
    border: '0.5px solid #252d45',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13, color: '#f8fafc',
    fontFamily: 'inherit', outline: 'none',
    width: '100%',
  } as React.CSSProperties

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh', background: '#0a0e1a',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>
      <nav style={{
        background: '#0a0e1aee', borderBottom: '0.5px solid #252d45',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <a href="/" style={{ 
          fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', 
          display: 'flex', alignItems: 'center', gap: 8 
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
        <a href="/dashboard" style={{ fontSize: 13, color: '#94a3b8', padding: '6px 14px', borderRadius: 8, border: '0.5px solid #252d45' }}>
          Back to Dashboard
        </a>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#22d3ee', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            AI powered
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Personalised Study Plan
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Tell us your grade, subjects, and exam date — AI generates a week-by-week study plan just for you.
          </p>
        </div>

        <div style={{
          background: '#0f1422', border: '0.5px solid #252d45',
          borderRadius: 14, padding: 24, marginBottom: 24,
        }}>
          {/* Grade + hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }} className="plan-grid">
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Grade *</label>
              <select value={grade} onChange={e => setGrade(e.target.value)} style={inputStyle}>
                <option value="">Select grade</option>
                {['9', '10', '11', '12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Hours per day</label>
              <select value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} style={inputStyle}>
                {['1', '2', '3', '4', '5', '6'].map(h => (
                  <option key={h} value={h}>{h} hour{h !== '1' ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Exam date */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
              Exam date <span style={{ color: '#64748b', fontWeight: 400 }}>(optional)</span>
            </label>
            <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>

          {/* Subject selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 10 }}>
              Select your subjects *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {subjects.map(s => (
                <button key={s} onClick={() => toggleSubject(s)} style={{
                  padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: selectedSubjects.includes(s) ? '1.5px solid #6366f1' : '0.5px solid #252d45',
                  background: selectedSubjects.includes(s) ? '#6366f115' : '#0a0e1a',
                  color: selectedSubjects.includes(s) ? '#818cf8' : '#64748b',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
                }}>
                  {selectedSubjects.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generatePlan} disabled={loading || !grade || selectedSubjects.length === 0} style={{
            width: '100%', padding: 12, borderRadius: 10,
            background: '#6366f1', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 0 24px #6366f140',
            opacity: loading || !grade || selectedSubjects.length === 0 ? 0.6 : 1,
            fontFamily: 'inherit',
          }}>
            {loading ? 'Generating your plan...' : 'Generate Study Plan'}
          </button>
        </div>

        {/* Plan output */}
        {(plan || loading) && (
          <div style={{
            background: '#0f1422', border: '0.5px solid #252d45',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px', borderBottom: '0.5px solid #252d45',
              background: '#141928',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>
                Your personalised study plan
              </div>
              {plan && (
                <button onClick={() => navigator.clipboard.writeText(plan)} style={{
                  fontSize: 12, padding: '5px 12px', borderRadius: 7,
                  background: '#6366f115', border: '0.5px solid #6366f130',
                  color: '#818cf8', cursor: 'pointer', fontFamily: 'inherit',
                }}>Copy plan</button>
              )}
            </div>
            <div style={{ padding: '20px 24px' }}>
              {loading ? (
                <div style={{ color: '#64748b', fontSize: 13 }}>Generating your personalised study plan...</div>
              ) : (
                <div style={{ fontSize: 13, color: '#f8fafc', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {plan}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .plan-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
