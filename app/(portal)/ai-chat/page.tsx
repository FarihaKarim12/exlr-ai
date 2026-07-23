'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const subjects = [
  'Physics', 'Chemistry', 'Biology',
  'Mathematics', 'Computer Science',
  'Islamiyat', 'Pakistan Studies',
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
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) window.location.href = '/auth/login'
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
        body: JSON.stringify({ messages: [...messages, userMessage], subject: selectedSubject }),
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '32px 32px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 24, paddingBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#22d3ee', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>AI powered</div>
        <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>AI Doubt Solver</h1>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>Ask any AKUEB question and get instant, syllabus-accurate answers.</p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 32px 24px', maxWidth: 900, width: '100%' }}>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} style={{
            background: 'rgba(15,20,34,0.6)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 9, padding: '8px 14px', fontSize: 12,
            color: selectedSubject ? '#f8fafc' : '#64748b', fontFamily: 'inherit', outline: 'none',
            backdropFilter: 'blur(8px)', cursor: 'pointer', transition: 'border-color 0.2s',
          }}
            onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.4)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            <option value="">All subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {messages.length > 0 && (
            <button onClick={() => setMessages([])} style={{
              padding: '8px 14px', fontSize: 12, fontWeight: 500,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748b' }}
            >Clear chat</button>
          )}
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1, background: 'rgba(15,20,34,0.5)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24,
          overflowY: 'auto', marginBottom: 16, minHeight: 400, maxHeight: 'calc(100vh - 320px)',
        }}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#22d3ee',
              }}>◈</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>Ask me anything</div>
              <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center', maxWidth: 360, lineHeight: 1.7 }}>
                Ask any question from your AKUEB syllabus. I'll give you a clear, accurate answer.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                {["What is Newton's second law?", 'Explain photosynthesis', "What is Ohm's law?", 'Difference between mitosis and meiosis'].map(q => (
                  <button key={q} onClick={() => setInput(q)} style={{
                    fontSize: 12, padding: '8px 14px', borderRadius: 9,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; e.currentTarget.style.color = '#818cf8' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}
                  >{q}</button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%', padding: '13px 17px', borderRadius: 14,
                    fontSize: 13, lineHeight: 1.75,
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                      : 'rgba(255,255,255,0.04)',
                    color: '#f8fafc',
                    border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    boxShadow: m.role === 'user' ? '0 4px 15px rgba(99,102,241,0.25)' : 'none',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.role === 'assistant' && (
                      <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Exlr AI
                      </div>
                    )}
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '13px 17px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    fontSize: 13, color: '#64748b',
                  }}>
                    <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Exlr AI</div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: '50%', background: '#64748b',
                          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask your AKUEB question here..."
            style={{
              flex: 1, background: 'rgba(15,20,34,0.6)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
              padding: '13px 18px', fontSize: 13, color: '#f8fafc',
              fontFamily: 'inherit', outline: 'none', transition: 'all 0.25s ease',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
            padding: '13px 22px', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
            opacity: loading || !input.trim() ? 0.5 : 1,
            transition: 'all 0.25s ease',
          }}
            onMouseEnter={e => { if (!loading && input.trim()) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.45)' } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.3)' }}
          >Send</button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}