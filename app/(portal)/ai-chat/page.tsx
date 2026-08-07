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

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) window.location.href = '/auth/login'
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('exlr-ai-chat-sessions')
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as ChatSession[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        setChatSessions(parsed)
        setActiveChatId(parsed[0].id)
        setMessages(parsed[0].messages || [])
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('exlr-ai-chat-sessions', JSON.stringify(chatSessions))
    }
  }, [chatSessions])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startNewChat = () => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setChatSessions(prev => [newChat, ...prev])
    setActiveChatId(newChat.id)
    setMessages([])
    setInput('')
  }

  const selectChat = (chatId: string) => {
    const selected = chatSessions.find(chat => chat.id === chatId)
    if (!selected) return
    setActiveChatId(chatId)
    setMessages(selected.messages)
    setInput('')
  }

  const syncActiveChat = (nextMessages: Message[], title?: string) => {
    if (!activeChatId) return
    setChatSessions(prev => prev.map(chat => (
      chat.id === activeChatId
        ? { ...chat, messages: nextMessages, title: title ?? chat.title, updatedAt: new Date().toISOString() }
        : chat
    )))
  }

  const clearCurrentChat = () => {
    setMessages([])
    if (activeChatId) {
      setChatSessions(prev => prev.map(chat => (
        chat.id === activeChatId ? { ...chat, messages: [], title: 'New chat', updatedAt: new Date().toISOString() } : chat
      )))
    }
  }

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId))
    setMenuOpenId(null)
    if (activeChatId === chatId) {
      const remaining = chatSessions.filter(chat => chat.id !== chatId)
      if (remaining.length > 0) {
        const nextChat = remaining[0]
        setActiveChatId(nextChat.id)
        setMessages(nextChat.messages)
      } else {
        setActiveChatId(null)
        setMessages([])
      }
    }
  }

  const startRenameChat = (chatId: string, currentTitle: string) => {
    setRenamingId(chatId)
    setRenameDraft(currentTitle)
    setMenuOpenId(null)
  }

  const saveRenameChat = (chatId: string) => {
    const trimmed = renameDraft.trim() || 'New chat'
    setChatSessions(prev => prev.map(chat => (
      chat.id === chatId ? { ...chat, title: trimmed, updatedAt: new Date().toISOString() } : chat
    )))
    setRenamingId(null)
    setRenameDraft('')
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    const nextMessages = [...messages, userMessage]
    const chatId = activeChatId ?? `chat-${Date.now()}`

    if (!activeChatId) {
      const newChat: ChatSession = {
        id: chatId,
        title: input.trim().slice(0, 42) || 'New chat',
        messages: nextMessages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setChatSessions(prev => [newChat, ...prev])
      setActiveChatId(chatId)
    } else {
      syncActiveChat(nextMessages, messages.length === 0 ? input.trim().slice(0, 42) || 'New chat' : undefined)
    }

    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, subject: selectedSubject }),
      })
      const data = await res.json()
      const assistantMessage = { role: 'assistant' as const, content: data.reply }
      const updatedMessages = [...nextMessages, assistantMessage]
      setMessages(updatedMessages)
      syncActiveChat(updatedMessages)
    } catch {
      const fallbackMessage = { role: 'assistant' as const, content: 'Sorry, something went wrong. Please try again.' }
      const updatedMessages = [...nextMessages, fallbackMessage]
      setMessages(updatedMessages)
      syncActiveChat(updatedMessages)
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 20, padding: '0 32px 24px', width: '100%', maxWidth: 1400, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 220px)' }}>
          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {messages.length > 0 && (
              <button onClick={clearCurrentChat} style={{
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
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>Ask any question from your AKUEB syllabus. I'll give you a clear, accurate answer.</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                  {["What is Newton's second law?", 'Explain photosynthesis', "What is Ohm's law?", 'Difference between mitosis and meiosis'].map(q => (
                    <button key={q} onClick={() => setInput(q)} style={{
                      fontSize: 13, padding: '8px 14px', borderRadius: 9,
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

        <div style={{ width: 300, minWidth: 260, background: 'rgba(15,20,34,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 'calc(100vh - 320px)', position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#22d3ee', letterSpacing: '.08em', textTransform: 'uppercase' }}>Chat history</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Your saved conversations</div>
            </div>
            <button onClick={startNewChat} style={{
              padding: '7px 10px', borderRadius: 9, border: '1px solid rgba(99,102,241,0.25)',
              background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>
              + New Chat
            </button>
          </div>
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chatSessions.length === 0 ? (
              <div style={{ padding: '12px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', color: '#64748b', fontSize: 12, lineHeight: 1.6 }}>
                Start a new chat and it will appear here.
              </div>
            ) : (
              chatSessions.map(chat => {
                const preview = chat.messages.find(message => message.role === 'user')?.content || 'No messages yet'
                return (
                  <div key={chat.id} style={{ position: 'relative' }}>
                    {renamingId === chat.id ? (
                      <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <input
                          value={renameDraft}
                          onChange={(e) => setRenameDraft(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,14,26,0.6)', color: '#f8fafc', fontSize: 12, outline: 'none' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRenameChat(chat.id)
                            if (e.key === 'Escape') {
                              setRenamingId(null)
                              setRenameDraft('')
                            }
                          }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button onClick={() => saveRenameChat(chat.id)} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.2)', color: '#c7d2fe', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                            Save
                          </button>
                          <button onClick={() => { setRenamingId(null); setRenameDraft('') }} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: 'none', cursor: 'pointer', fontSize: 12 }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <button onClick={() => selectChat(chat.id)} style={{
                          flex: 1, textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                          background: activeChatId === chat.id ? 'rgba(99,102,241,0.16)' : 'rgba(255,255,255,0.04)',
                          border: activeChatId === chat.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.05)',
                          color: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s ease'
                        }}>
                          <div style={{ fontSize: 11, color: '#818cf8', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                            {chat.title || 'New chat'}
                          </div>
                          <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {preview.length > 70 ? `${preview.slice(0, 70)}...` : preview}
                          </div>
                        </button>
                        <div style={{ position: 'relative' }}>
                          <button onClick={() => setMenuOpenId(menuOpenId === chat.id ? null : chat.id)} style={{
                            marginTop: 4, width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', cursor: 'pointer', fontSize: 16, lineHeight: 1
                          }}>
                            ⋯
                          </button>
                          {menuOpenId === chat.id && (
                            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: 'rgba(10,14,26,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, minWidth: 120, zIndex: 10, overflow: 'hidden' }}>
                              <button onClick={() => startRenameChat(chat.id, chat.title)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', background: 'transparent', border: 'none', color: '#e2e8f0', cursor: 'pointer', fontSize: 12 }}>
                                Rename
                              </button>
                              <button onClick={() => deleteChat(chat.id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', background: 'transparent', border: 'none', color: '#fda4af', cursor: 'pointer', fontSize: 12 }}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
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