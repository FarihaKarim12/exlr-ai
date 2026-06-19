'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const subjects = [
  { name: 'Physics', slug: 'physics' },
  { name: 'Chemistry', slug: 'chemistry' },
  { name: 'Biology', slug: 'biology' },
  { name: 'Mathematics', slug: 'maths' },
  { name: 'Computer Science', slug: 'cs' },
  { name: 'Islamiyat', slug: 'islamiyat' },
  { name: 'Pakistan Studies', slug: 'pak-studies' },
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [language, setLanguage] = useState<'english' | 'urdu'>('english')
  const [user, setUser] = useState<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) window.location.href = '/auth/login'
      setUser(user)
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          subject: selectedSubject,
          language,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh', background: '#0a0e1a',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>

      <nav style={{
        background: '#0a0e1aee', borderBottom: '0.5px solid #252d45',
        padding: '0 24px', height: 60, flexShrink: 0,
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

      <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '24px 24px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#22d3ee', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>
            AI powered
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4 }}>
            Doubt Solver
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Ask any question. Get instant, syllabus-accurate answers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            style={{
              background: '#0f1422', border: '0.5px solid #252d45',
              borderRadius: 8, padding: '7px 12px', fontSize: 12,
              color: selectedSubject ? '#f8fafc' : '#64748b',
              fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="">All subjects</option>
            {subjects.map(s => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
          </select>

          {messages.length > 0 && (
            <button onClick={() => setMessages([])} style={{
              padding: '7px 14px', fontSize: 12, fontWeight: 500,
              background: 'transparent', border: '0.5px solid #252d45',
              borderRadius: 8, color: '#64748b', cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Clear chat
            </button>
          )}
        </div>

        <div style={{
          flex: 1, background: '#0f1422', border: '0.5px solid #252d45',
          borderRadius: 12, padding: 20, overflowY: 'auto',
          marginBottom: 16, minHeight: 400, maxHeight: 'calc(100vh - 340px)',
        }}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>Ask me anything</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                {[
                  "What is Newton's second law?",
                  'Explain photosynthesis',
                  "What is Ohm's law?",
                  'Difference between mitosis and meiosis',
                ].map(q => (
                  <button key={q} onClick={() => setInput(q)} style={{
                    fontSize: 12, padding: '6px 12px', borderRadius: 8,
                    background: '#141928', border: '0.5px solid #252d45',
                    color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit',
                  }}>{q}</button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%', padding: '12px 16px', borderRadius: 12,
                    fontSize: 13, lineHeight: 1.7,
                    background: m.role === 'user' ? '#6366f1' : '#141928',
                    color: m.role === 'user' ? '#fff' : '#f8fafc',
                    border: m.role === 'assistant' ? '0.5px solid #252d45' : 'none',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.role === 'assistant' && (
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 600, marginBottom: 6 }}>Exlr AI</div>
                    )}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '12px 16px', borderRadius: 12,
                    background: '#141928', border: '0.5px solid #252d45',
                    fontSize: 13, color: '#64748b',
                  }}>
                    <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 600, marginBottom: 6 }}>Exlr AI</div>
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, paddingBottom: 24 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask your AKUEB question here..."
            style={{
              flex: 1, background: '#0f1422',
              border: '0.5px solid #252d45', borderRadius: 10,
              padding: '12px 16px', fontSize: 13, color: '#f8fafc',
              fontFamily: 'inherit', outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#252d45')}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
            padding: '12px 20px', borderRadius: 10,
            background: '#6366f1', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            boxShadow: '0 0 20px #6366f140',
            opacity: loading || !input.trim() ? 0.5 : 1,
            fontFamily: 'inherit',
          }}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
