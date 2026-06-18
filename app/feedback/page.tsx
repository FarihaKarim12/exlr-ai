'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

interface Feedback {
  id: string
  display_name: string
  message: string
  rating: number
  created_at: string
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [guestName, setGuestName] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      }

      const { data } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
      setFeedbacks(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleSubmit = async () => {
    if (!message.trim() || rating === 0) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from('feedback').insert({
        student_id: user?.id || null,
        display_name: isAnonymous ? 'Anonymous Visitor' : (profile?.full_name || guestName || 'Visitor'),
        message,
        rating,
      })
      if (error) throw error

      setSubmitted(true)
      setMessage('')
      setRating(0)

      const { data } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
      setFeedbacks(data || [])

      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error('Feedback error:', err)
    } finally {
      setSubmitting(false)
    }
  }
  
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0'

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 30) return `${days} days ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh', background: '#0a0e1a',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>
      <nav style={{
        background: '#0a0e1aee', borderBottom: '0.5px solid #252d45',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)',
      }}>
        <a href="/" style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
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
        <a href="/dashboard" style={{ fontSize: 13, color: '#94a3b8', padding: '6px 14px', borderRadius: 8, border: '0.5px solid #252d45' }}>
          Back to Home
        </a>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
            Feedback
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Have any feedback or suggestions? I'd love to hear them!.
          </p>
        </div>

        {/* Summary */}
        {feedbacks.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            background: '#0f1422', border: '0.5px solid #252d45',
            borderRadius: 12, padding: '20px 24px', marginBottom: 24,
          }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fbbf24', letterSpacing: '-1px' }}>{avgRating} ★</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Average rating</div>
            </div>
            <div style={{ height: 36, width: 0.5, background: '#252d45' }} />
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#6366f1', letterSpacing: '-1px' }}>{feedbacks.length}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Total reviews</div>
            </div>
          </div>
        )}

        {/* Submit form */}
        <div style={{
          background: '#0f1422', border: '0.5px solid #252d45',
          borderRadius: 14, padding: 24, marginBottom: 28,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginBottom: 16 }}>
            Share your feedback
          </div>

          {/* Rating */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Rating</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setRating(n)} style={{
                  fontSize: 24, background: 'none', border: 'none', cursor: 'pointer',
                  color: n <= rating ? '#fbbf24' : '#252d45',
                }}>★</button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Your feedback</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="What do you like? What can we improve?"
              style={{
                width: '100%', background: '#0a0e1a', border: '0.5px solid #252d45',
                borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#f8fafc',
                fontFamily: 'inherit', outline: 'none', resize: 'vertical', minHeight: 90,
              }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#252d45')}
            />
          </div>

          {/* Anonymous toggle */}
          {!user && !isAnonymous && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>Your name</label>
              <input
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: '100%', background: '#0a0e1a', border: '0.5px solid #252d45',
                  borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f8fafc',
                  fontFamily: 'inherit', outline: 'none',
                }}
              />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button onClick={() => setIsAnonymous(!isAnonymous)} style={{
              width: 40, height: 22, borderRadius: 99, border: 'none', cursor: 'pointer',
              background: isAnonymous ? '#6366f1' : '#252d45', position: 'relative',
              transition: 'background .2s',
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: isAnonymous ? 21 : 3,
                transition: 'left .2s',
              }} />
            </button>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              {isAnonymous ? 'Posting anonymously' : `Posting as ${profile?.full_name || 'Student'}`}
            </span>
          </div>

          <button onClick={handleSubmit} disabled={submitting || !message.trim() || rating === 0} style={{
            width: '100%', padding: 12, borderRadius: 10,
            background: '#6366f1', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 0 24px #6366f140',
            opacity: submitting || !message.trim() || rating === 0 ? 0.6 : 1,
            fontFamily: 'inherit',
          }}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>

          {submitted && (
            <div style={{
              marginTop: 14, padding: '10px 14px', borderRadius: 8,
              background: '#4ade8012', border: '0.5px solid #4ade8030',
              fontSize: 13, color: '#4ade80', textAlign: 'center',
            }}>✓ Thank you for your feedback!</div>
          )}
        </div>

        {/* Feedback list */}
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginBottom: 14 }}>
          What people are saying
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>
        ) : feedbacks.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 50,
            background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12,
            color: '#64748b', fontSize: 13,
          }}>No feedback yet. Be the first to share!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {feedbacks.map(f => (
              <div key={f.id} style={{
                background: '#0f1422', border: '0.5px solid #252d45',
                borderRadius: 12, padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', background: '#6366f120',
                      border: '0.5px solid #6366f130', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 12, color: '#818cf8',
                    }}>👤</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc' }}>{f.display_name}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{timeAgo(f.created_at)}</div>
                </div>
                <div style={{ color: '#fbbf24', fontSize: 13, marginBottom: 8 }}>
                  {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{f.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}