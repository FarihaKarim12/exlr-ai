'use client'

import { useState } from 'react'
import { Space_Grotesk } from 'next/font/google'
import { supabase } from '@/lib/supabase'

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

interface Question {
  question: string
  options: { a: string; b: string; c: string; d: string }
  correct: 'a' | 'b' | 'c' | 'd'
  explanation: string
}

export default function QuizPage() {
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [topic, setTopic] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const generateQuiz = async () => {
    if (!subject || !grade) return
    setLoading(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, grade, topic }),
      })
      const data = await res.json()

      if (!data.questions || data.questions.length === 0) {
        alert('Failed to generate quiz questions. This can happen if our AI provider is busy. Please wait a moment and try again.')
        setLoading(false)
        return
      }

      setQuestions(data.questions)
      setQuizStarted(true)
      setCurrent(0)
      setAnswers([])
      setSelected(null)
      setShowResult(false)
    } catch (err) {
      console.error('Quiz generation error:', err)
      alert('Failed to generate quiz. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (option: string) => {
    if (selected) return
    setSelected(option)
  }

  const handleNext = async () => {
    if (!selected) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)

    if (current + 1 >= questions.length) {
      // Save results to database
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const correct = newAnswers.filter((a, i) => a === questions[i]?.correct).length
        const scorePercent = (correct / questions.length) * 100
        const status = scorePercent >= 71 ? 'green' : scorePercent >= 41 ? 'amber' : 'red'

        await supabase.from('topic_mastery').upsert({
          student_id: user.id,
          subject,
          topic: topic || subject,
          grade,
          attempts: questions.length,
          correct,
          score_percent: scorePercent,
          status,
          last_attempted: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'student_id,subject,topic,grade'
        })
      }
      setShowResult(true)
    } else {
      setCurrent(current + 1)
      setSelected(null)
    }
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setQuestions([])
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setShowResult(false)
    setTopic('')
  }

  const score = answers.filter((a, i) => a === questions[i]?.correct).length

  const optionStyle = (opt: string) => {
    if (!selected) return {
      background: '#0a0e1a', border: '0.5px solid #252d45',
      color: '#94a3b8',
    }
    if (opt === questions[current]?.correct) return {
      background: '#4ade8015', border: '1.5px solid #4ade80',
      color: '#4ade80',
    }
    if (opt === selected && opt !== questions[current]?.correct) return {
      background: '#f8717115', border: '1.5px solid #f87171',
      color: '#f87171',
    }
    return {
      background: '#0a0e1a', border: '0.5px solid #252d45',
      color: '#64748b',
    }
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

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>

        {!quizStarted ? (
          <>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#22d3ee', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                AI powered
              </div>
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
                MCQ Quiz Engine
              </h1>
              <p style={{ fontSize: 13, color: '#64748b' }}>
                AI generates 10 AKUEB-style MCQs on any topic. Test your knowledge instantly.
              </p>
            </div>

            <div style={{
              background: '#0f1422', border: '0.5px solid #252d45',
              borderRadius: 14, padding: 24,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }} className="quiz-grid">
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Subject *</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} style={{
                    width: '100%', background: '#0a0e1a', border: '0.5px solid #252d45',
                    borderRadius: 10, padding: '10px 14px', fontSize: 13,
                    color: subject ? '#f8fafc' : '#64748b', fontFamily: 'inherit', outline: 'none',
                  }}>
                    <option value="">Select subject</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>Grade *</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} style={{
                    width: '100%', background: '#0a0e1a', border: '0.5px solid #252d45',
                    borderRadius: 10, padding: '10px 14px', fontSize: 13,
                    color: grade ? '#f8fafc' : '#64748b', fontFamily: 'inherit', outline: 'none',
                  }}>
                    <option value="">Select grade</option>
                    {['9', '10', '11', '12'].map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#94a3b8', marginBottom: 6 }}>
                  Topic <span style={{ color: '#64748b', fontWeight: 400 }}>(optional — leave blank for random)</span>
                </label>
                <input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Newton's Laws, Photosynthesis, Acids and Bases..."
                  style={{
                    width: '100%', background: '#0a0e1a', border: '0.5px solid #252d45',
                    borderRadius: 10, padding: '10px 14px', fontSize: 13,
                    color: '#f8fafc', fontFamily: 'inherit', outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#252d45')}
                />
              </div>

              <button onClick={generateQuiz} disabled={loading || !subject || !grade} style={{
                width: '100%', padding: 12, borderRadius: 10,
                background: '#6366f1', color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 14, fontWeight: 600,
                boxShadow: '0 0 24px #6366f140',
                opacity: loading || !subject || !grade ? 0.6 : 1,
                fontFamily: 'inherit',
              }}>
                {loading ? 'Generating quiz...' : '⚡ Generate 10 MCQs'}
              </button>
            </div>
          </>
        ) : showResult ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {score >= 8 ? '🎉' : score >= 6 ? '👍' : score >= 4 ? '📚' : '💪'}
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 8 }}>
              You scored <span style={{ color: score >= 7 ? '#4ade80' : score >= 5 ? '#fbbf24' : '#f87171' }}>{score}/10</span>
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 32 }}>
              {score >= 8 ? 'Excellent! You have a strong grasp of this topic.' :
               score >= 6 ? 'Good job! Review the questions you got wrong.' :
               score >= 4 ? 'Keep practising! Focus on the weak areas.' :
               'Don\'t give up! Review your notes and try again.'}
            </p>

            {/* Review answers */}
            <div style={{ textAlign: 'left', marginBottom: 28 }}>
              {questions.map((q, i) => (
                <div key={i} style={{
                  background: '#0f1422', border: `0.5px solid ${answers[i] === q.correct ? '#4ade8030' : '#f8717130'}`,
                  borderRadius: 12, padding: '16px 20px', marginBottom: 10,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#f8fafc', marginBottom: 8 }}>
                    {i + 1}. {q.question}
                  </div>
                  <div style={{ fontSize: 12, color: answers[i] === q.correct ? '#4ade80' : '#f87171', marginBottom: 4 }}>
                    Your answer: {q.options[answers[i] as keyof typeof q.options]}
                  </div>
                  {answers[i] !== q.correct && (
                    <div style={{ fontSize: 12, color: '#4ade80', marginBottom: 4 }}>
                      Correct: {q.options[q.correct]}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, paddingTop: 6, borderTop: '0.5px solid #252d45' }}>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={generateQuiz} style={{
                padding: '11px 24px', borderRadius: 10,
                background: '#6366f1', color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                fontFamily: 'inherit',
              }}>Try again</button>
              <button onClick={resetQuiz} style={{
                padding: '11px 24px', borderRadius: 10,
                background: 'transparent', color: '#94a3b8',
                border: '0.5px solid #252d45',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                fontFamily: 'inherit',
              }}>New quiz</button>
            </div>
          </div>
        ) : (
          <div>
            {/* Progress */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                <span>{subject} · Grade {grade}{topic ? ` · ${topic}` : ''}</span>
                <span>Question {current + 1} of {questions.length}</span>
              </div>
              <div style={{ height: 4, background: '#1a2035', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99, background: '#6366f1',
                  width: `${((current + 1) / questions.length) * 100}%`,
                  transition: 'width .3s',
                }} />
              </div>
            </div>

            {/* Question */}
            <div style={{
              background: '#0f1422', border: '0.5px solid #252d45',
              borderRadius: 14, padding: '24px', marginBottom: 14,
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', lineHeight: 1.6, marginBottom: 20 }}>
                {current + 1}. {questions[current]?.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(['a', 'b', 'c', 'd'] as const).map(opt => (
                  <button key={opt} onClick={() => handleAnswer(opt)} style={{
                    ...optionStyle(opt),
                    padding: '12px 16px', borderRadius: 10,
                    fontSize: 13, textAlign: 'left', cursor: selected ? 'default' : 'pointer',
                    fontFamily: 'inherit', transition: 'all .2s',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: selected === opt ? (opt === questions[current]?.correct ? '#4ade80' : '#f87171') :
                                  (selected && opt === questions[current]?.correct ? '#4ade80' : '#1a2035'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, flexShrink: 0,
                      color: '#fff',
                    }}>
                      {opt.toUpperCase()}
                    </span>
                    {questions[current]?.options[opt]}
                  </button>
                ))}
              </div>

              {selected && (
                <div style={{
                  marginTop: 16, padding: '12px 16px', borderRadius: 10,
                  background: selected === questions[current]?.correct ? '#4ade8010' : '#f8717110',
                  border: `0.5px solid ${selected === questions[current]?.correct ? '#4ade8030' : '#f8717130'}`,
                  fontSize: 13,
                  color: selected === questions[current]?.correct ? '#4ade80' : '#f87171',
                }}>
                  {selected === questions[current]?.correct ? '✓ Correct! ' : '✗ Incorrect. '}
                  <span style={{ color: '#94a3b8' }}>{questions[current]?.explanation}</span>
                </div>
              )}
            </div>

            <button onClick={handleNext} disabled={!selected} style={{
              width: '100%', padding: 12, borderRadius: 10,
              background: '#6366f1', color: '#fff', border: 'none',
              cursor: selected ? 'pointer' : 'default',
              fontSize: 14, fontWeight: 600,
              opacity: selected ? 1 : 0.4,
              fontFamily: 'inherit',
            }}>
              {current + 1 >= questions.length ? 'See results →' : 'Next question →'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .quiz-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}