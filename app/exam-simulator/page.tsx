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
  'Physics', 'Chemistry', 'Biology',
  'Mathematics', 'Computer Science',
  'Islamiyat', 'Pakistan Studies',
]

interface MCQ {
  question: string
  options: { a: string; b: string; c: string; d: string }
  correct: 'a' | 'b' | 'c' | 'd'
  explanation: string
}

export default function ExamSimulatorPage() {
  const [stage, setStage] = useState<'setup' | 'paper1' | 'paper2' | 'results'>('setup')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [questions, setQuestions] = useState<MCQ[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(false)
  const [p1Score, setP1Score] = useState(0)
  const [p2SelfScore, setP2SelfScore] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const P1_TIME = 30 * 60 // 30 minutes for paper 1
  const P2_TIME = 60 * 60 // 60 minutes for paper 2

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          if (stage === 'paper1') finishPaper1()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const startExam = async () => {
    if (!subject || !grade) return
    setLoading(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, grade, topic: '', count: 20 }),
      })
      const data = await res.json()

      if (!data.questions || data.questions.length === 0) {
        alert('Failed to generate exam questions. This can happen if our AI provider is busy. Please wait a moment and try again.')
        setLoading(false)
        return
      }

      setQuestions(data.questions)
      setAnswers({})
      setCurrent(0)
      setSelected(null)
      setStage('paper1')
      startTimer(P1_TIME)
    } catch (err) {
      console.error('Exam generation error:', err)
      alert('Failed to generate exam. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (opt: string) => {
    if (answers[current]) return
    setSelected(opt)
    setAnswers(prev => ({ ...prev, [current]: opt }))
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      finishPaper1()
    } else {
      setCurrent(current + 1)
      setSelected(answers[current + 1] || null)
    }
  }

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1)
      setSelected(answers[current - 1] || null)
    }
  }

  const finishPaper1 = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    const score = questions.filter((q, i) => answers[i] === q.correct).length
    setP1Score(score)
    setStage('paper2')
    startTimer(P2_TIME)
  }

  const finishPaper2 = (selfScore: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setP2SelfScore(selfScore)
    setStage('results')
  }

  const optionStyle = (opt: string, idx: number) => {
    const answered = answers[idx]
    if (!answered) return {
      background: '#0a0e1a', border: '0.5px solid #252d45', color: '#94a3b8',
    }
    if (opt === questions[idx]?.correct) return {
      background: '#4ade8015', border: '1.5px solid #4ade80', color: '#4ade80',
    }
    if (opt === answered) return {
      background: '#f8717115', border: '1.5px solid #f87171', color: '#f87171',
    }
    return { background: '#0a0e1a', border: '0.5px solid #252d45', color: '#64748b' }
  }

  const NavBar = () => (
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
      {stage !== 'setup' && stage !== 'results' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 14, fontWeight: 600,
          color: timeLeft < 300 ? '#f87171' : '#22d3ee',
        }}>
          ⏱ {formatTime(timeLeft)}
          {timeLeft < 300 && <span style={{ fontSize: 11, color: '#f87171' }}>Time running out!</span>}
        </div>
      )}
      <a href="/dashboard" style={{ fontSize: 13, color: '#94a3b8', padding: '6px 14px', borderRadius: 8, border: '0.5px solid #252d45' }}>
        Back to Dashboard
      </a>
    </nav>
  )

  // Setup screen
  if (stage === 'setup') return (
    <div className={spaceGrotesk.variable} style={{ minHeight: '100vh', background: '#0a0e1a', fontFamily: 'var(--font-space), system-ui, sans-serif' }}>
      <NavBar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#22d3ee', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Exam simulator</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
            Full Mock Exam
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
            Simulates the real AKUEB exam experience with Paper 1 (MCQs, 30 min) and Paper 2 (CRQ/ERQ, 60 min).
          </p>
        </div>

        <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }} className="exam-grid">
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

          {/* Exam info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div style={{ background: '#141928', border: '0.5px solid #252d45', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>Paper 1</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>20 MCQs · 30 minutes · Auto-marked</div>
            </div>
            <div style={{ background: '#141928', border: '0.5px solid #252d45', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>Paper 2</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>CRQ + ERQ · 60 minutes · Self-assessed</div>
            </div>
          </div>

          <button onClick={startExam} disabled={loading || !subject || !grade} style={{
            width: '100%', padding: 12, borderRadius: 10,
            background: '#6366f1', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 14, fontWeight: 600,
            boxShadow: '0 0 24px #6366f140',
            opacity: loading || !subject || !grade ? 0.6 : 1,
            fontFamily: 'inherit',
          }}>
            {loading ? 'Preparing your exam...' : 'Start Full Mock Exam'}
          </button>
        </div>

        <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 1.6 }}>
          Once started, the timer cannot be paused. Make sure you're ready before clicking Start.
        </div>
      </div>
      <style>{`.exam-grid { grid-template-columns: 1fr 1fr; } @media(max-width:640px){ .exam-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )

  // Paper 1
  if (stage === 'paper1') return (
    <div className={spaceGrotesk.variable} style={{ minHeight: '100vh', background: '#0a0e1a', fontFamily: 'var(--font-space), system-ui, sans-serif' }}>
      <NavBar />
      <div style={{ maxWidth: 750, margin: '0 auto', padding: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', letterSpacing: '.1em', textTransform: 'uppercase' }}>Paper 1 — MCQs</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginTop: 2 }}>{subject} · Grade {grade}</div>
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Question {current + 1} of {questions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: '#1a2035', borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{
            height: '100%', borderRadius: 99, background: '#6366f1',
            width: `${((current + 1) / questions.length) * 100}%`,
            transition: 'width .3s',
          }} />
        </div>

        {/* Question dots */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
          {questions.map((_, i) => (
            <button key={i} onClick={() => { setCurrent(i); setSelected(answers[i] || null) }} style={{
              width: 28, height: 28, borderRadius: 6, fontSize: 11, fontWeight: 600,
              border: i === current ? '1.5px solid #6366f1' : '0.5px solid #252d45',
              background: answers[i]
                ? (answers[i] === questions[i]?.correct ? '#4ade8020' : '#f8717120')
                : (i === current ? '#6366f115' : '#0f1422'),
              color: answers[i]
                ? (answers[i] === questions[i]?.correct ? '#4ade80' : '#f87171')
                : (i === current ? '#818cf8' : '#64748b'),
              cursor: 'pointer', fontFamily: 'inherit',
            }}>{i + 1}</button>
          ))}
        </div>

        {/* Question */}
        <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 14, padding: 24, marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', lineHeight: 1.6, marginBottom: 20 }}>
            {current + 1}. {questions[current]?.question}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['a', 'b', 'c', 'd'] as const).map(opt => (
              <button key={opt} onClick={() => handleAnswer(opt)} style={{
                ...optionStyle(opt, current),
                padding: '12px 16px', borderRadius: 10, fontSize: 13,
                textAlign: 'left', cursor: answers[current] ? 'default' : 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all .2s',
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', background: '#1a2035',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0, color: '#fff',
                }}>{opt.toUpperCase()}</span>
                {questions[current]?.options[opt]}
              </button>
            ))}
          </div>

          {answers[current] && (
            <div style={{
              marginTop: 14, padding: '10px 14px', borderRadius: 10,
              background: answers[current] === questions[current]?.correct ? '#4ade8010' : '#f8717110',
              border: `0.5px solid ${answers[current] === questions[current]?.correct ? '#4ade8030' : '#f8717130'}`,
              fontSize: 12,
              color: answers[current] === questions[current]?.correct ? '#4ade80' : '#f87171',
            }}>
              {answers[current] === questions[current]?.correct ? '✓ Correct! ' : '✗ Incorrect. '}
              <span style={{ color: '#94a3b8' }}>{questions[current]?.explanation}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handlePrev} disabled={current === 0} style={{
            padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            background: 'transparent', border: '0.5px solid #252d45', color: '#64748b',
            cursor: current === 0 ? 'default' : 'pointer', opacity: current === 0 ? 0.4 : 1,
            fontFamily: 'inherit',
          }}>← Prev</button>
          <button onClick={handleNext} style={{
            flex: 1, padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            {current + 1 >= questions.length ? 'Finish Paper 1 →' : 'Next →'}
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
          Answered: {Object.keys(answers).length}/{questions.length} · You can navigate between questions freely
        </div>
      </div>
    </div>
  )

  // Paper 2
  if (stage === 'paper2') return (
    <div className={spaceGrotesk.variable} style={{ minHeight: '100vh', background: '#0a0e1a', fontFamily: 'var(--font-space), system-ui, sans-serif' }}>
      <NavBar />
      <div style={{ maxWidth: 750, margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#22d3ee', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>Paper 2 — CRQ / ERQ</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 4 }}>{subject} · Grade {grade}</h2>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Paper 1 complete — you scored <span style={{ color: '#4ade80', fontWeight: 600 }}>{p1Score}/20</span>
          </div>
        </div>

        <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 12 }}>
            Paper 2 Instructions
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8, marginBottom: 20 }}>
            Paper 2 contains Constructed Response Questions (CRQs) and Extended Response Questions (ERQs).
            For this simulation, use your actual AKUEB past paper for {subject} Grade {grade} Paper 2.
            Write your answers on paper, then self-assess using the answer key.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              { title: 'Section A — CRQs', desc: 'Short structured questions worth 2-4 marks each. Answer all questions.', marks: '40 marks' },
              { title: 'Section B — ERQs', desc: 'Extended response questions worth 8-12 marks each. Choose required number.', marks: '45 marks' },
            ].map(s => (
              <div key={s.title} style={{
                background: '#141928', border: '0.5px solid #252d45',
                borderRadius: 10, padding: '14px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{s.desc}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', flexShrink: 0 }}>{s.marks}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#6366f110', border: '0.5px solid #6366f130', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#818cf8' }}>
            💡 Tip: Use your downloaded past papers for the actual Paper 2 questions. Check your answers against the answer key after finishing.
          </div>

          <a href="/past-papers" target="_blank" style={{
            display: 'block', textAlign: 'center', padding: '10px',
            borderRadius: 10, background: '#141928', border: '0.5px solid #252d45',
            fontSize: 13, color: '#94a3b8', marginBottom: 20,
          }}>
            Open Past Papers → download your paper
          </a>

          <div style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8', marginBottom: 10 }}>
            After completing Paper 2, rate your performance:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {[
              { label: 'Poor', score: 20, color: '#f87171' },
              { label: 'Below avg', score: 40, color: '#fb923c' },
              { label: 'Average', score: 60, color: '#fbbf24' },
              { label: 'Good', score: 75, color: '#4ade80' },
              { label: 'Excellent', score: 90, color: '#22d3ee' },
            ].map(r => (
              <button key={r.label} onClick={() => finishPaper2(r.score)} style={{
                padding: '10px 6px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                border: `0.5px solid ${r.color}40`,
                background: `${r.color}10`, color: r.color,
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
              }}>
                {r.label}<br/>
                <span style={{ fontSize: 13 }}>{r.score}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Results
  if (stage === 'results') {
    const p1Percent = (p1Score / questions.length) * 100
    const overall = p2SelfScore !== null ? (p1Percent + p2SelfScore) / 2 : p1Percent
    const grade_result = overall >= 80 ? 'A*' : overall >= 70 ? 'A' : overall >= 60 ? 'B' : overall >= 50 ? 'C' : overall >= 40 ? 'D' : 'F'
    const gradeColor = overall >= 70 ? '#4ade80' : overall >= 50 ? '#fbbf24' : '#f87171'

    return (
      <div className={spaceGrotesk.variable} style={{ minHeight: '100vh', background: '#0a0e1a', fontFamily: 'var(--font-space), system-ui, sans-serif' }}>
        <NavBar />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>
              {overall >= 70 ? '🎉' : overall >= 50 ? '👍' : '📚'}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 8 }}>
              Exam Complete!
            </h1>
            <div style={{ fontSize: 48, fontWeight: 700, color: gradeColor, letterSpacing: '-2px', marginBottom: 4 }}>
              {grade_result}
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              {subject} · Grade {grade} · Overall {Math.round(overall)}%
            </div>
          </div>

          {/* Score breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Paper 1 (MCQs)</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#6366f1', letterSpacing: '-1px', marginBottom: 4 }}>
                {p1Score}/{questions.length}
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{Math.round(p1Percent)}% — Auto marked</div>
            </div>
            <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Paper 2 (CRQ/ERQ)</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#22d3ee', letterSpacing: '-1px', marginBottom: 4 }}>
                {p2SelfScore}%
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Self assessed</div>
            </div>
          </div>

          {/* Review Paper 1 */}
          <div style={{ background: '#0f1422', border: '0.5px solid #252d45', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', marginBottom: 14 }}>Paper 1 Review</div>
            {questions.map((q, i) => (
              <div key={i} style={{
                padding: '12px 0', borderBottom: i < questions.length - 1 ? '0.5px solid #252d45' : 'none',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 4 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: answers[i] === q.correct ? '#4ade8020' : '#f8717120',
                    border: `0.5px solid ${answers[i] === q.correct ? '#4ade8040' : '#f8717140'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: answers[i] === q.correct ? '#4ade80' : '#f87171',
                  }}>
                    {answers[i] === q.correct ? '✓' : '✗'}
                  </span>
                  <div style={{ fontSize: 12, color: '#94a3b8', flex: 1 }}>{q.question}</div>
                </div>
                {answers[i] !== q.correct && (
                  <div style={{ fontSize: 11, color: '#64748b', paddingLeft: 28 }}>
                    Correct: <span style={{ color: '#4ade80' }}>{q.options[q.correct]}</span>
                    {' · '}{q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setStage('setup'); setAnswers({}); setCurrent(0); setSelected(null) }} style={{
              flex: 1, padding: '12px', borderRadius: 10, background: '#6366f1',
              color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'inherit',
            }}>Try another exam</button>
            <a href="/radar" style={{
              flex: 1, padding: '12px', borderRadius: 10,
              background: 'transparent', border: '0.5px solid #252d45',
              color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              fontFamily: 'inherit', textAlign: 'center',
            }}>View weakness radar →</a>
          </div>
        </div>
      </div>
    )
  }

  return null
}
