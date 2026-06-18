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

export default function AINotesPage() {
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const generateNotes = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setNotes('')
    try {
      const res = await fetch('/api/ai-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, grade }),
      })
      const data = await res.json()
      setNotes(data.notes)
    } catch {
      setNotes('Sorry, something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyNotes = () => {
    navigator.clipboard.writeText(notes)
  }

  const inputStyle = {
    background: '#0a0e1a',
    border: '0.5px solid #252d45',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 13, color: '#f8fafc',
    fontFamily: 'inherit', outline: 'none',
  } as React.CSSProperties

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh', background: '#0a0e1a',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>

      {/* Navbar */}
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

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#22d3ee', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            AI powered
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
            AI Note Generator
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Enter any AKUEB topic and get instant, structured study notes.
          </p>
        </div>

        {/* Input section */}
        <div style={{
          background: '#0f1422', border: '0.5px solid #252d45',
          borderRadius: 14, padding: '24px', marginBottom: 24,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="notes-grid">
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}
                style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}>
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Grade</label>
              <select value={grade} onChange={e => setGrade(e.target.value)}
                style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}>
                <option value="">Select grade</option>
                {['9', '10', '11', '12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Topic</label>
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateNotes()}
              placeholder="e.g. Newton's Laws of Motion, Photosynthesis, Acids and Bases..."
              style={{ ...inputStyle, width: '100%' }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#252d45')}
            />
          </div>

          <button onClick={generateNotes} disabled={loading || !topic.trim()} style={{
            width: '100%', padding: '12px', borderRadius: 10,
            background: '#6366f1', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 0 24px #6366f140',
            opacity: loading || !topic.trim() ? 0.6 : 1,
            fontFamily: 'inherit',
          }}>
            {loading ? 'Generating notes...' : '✦ Generate AI Notes'}
          </button>

          {/* Quick topic suggestions */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Quick topics:</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                "Newton's Laws",
                'Photosynthesis',
                'Acids and Bases',
                'Democracy in Pakistan',
                'Binary Numbers',
                'Cell Division',
              ].map(t => (
                <button key={t} onClick={() => setTopic(t)} style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 6,
                  background: '#141928', border: '0.5px solid #252d45',
                  color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit',
                }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes output */}
        {(notes || loading) && (
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
                ✦ Generated notes{topic ? ` — ${topic}` : ''}
              </div>
              {notes && (
                <button onClick={copyNotes} style={{
                  fontSize: 12, padding: '5px 12px', borderRadius: 7,
                  background: '#6366f115', border: '0.5px solid #6366f130',
                  color: '#818cf8', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Copy notes
                </button>
              )}
            </div>
            <div style={{ padding: '20px 24px' }}>
              {loading ? (
                <div style={{ color: '#64748b', fontSize: 13 }}>Generating your notes...</div>
              ) : (
                <div style={{
                  fontSize: 13, color: '#f8fafc', lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                }}>{notes}</div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .notes-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}