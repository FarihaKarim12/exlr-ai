'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];
const DURATIONS = [
  { label: '20 min', seconds: 20 * 60 },
  { label: '40 min', seconds: 40 * 60 },
  { label: '60 min', seconds: 60 * 60 },
];

interface Question {
  question: string;
  options: string[];
  answer: number;
}

type Stage = 'setup' | 'running' | 'finished';

export default function ExamSimulatorPage() {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [stage, setStage] = useState<Stage>('setup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (stage !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          finishExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  async function startExam() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic: 'Full paper mock exam', difficulty: 'Mixed', count: 20 }),
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setQuestions(data.questions || []);
      setAnswers({});
      setCurrent(0);
      setTimeLeft(duration.seconds);
      setStage('running');
    } catch (e) {
      setError('Could not start the exam right now. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(optIndex: number) {
    setAnswers((prev) => ({ ...prev, [current]: optIndex }));
  }

  async function finishExam() {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage('finished');
    const score = questions.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0);
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase.from('exam_results').insert({
        user_id: userData.user.id,
        subject,
        duration_seconds: duration.seconds,
        score,
        total: questions.length,
      });
    }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  const score = questions.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      <div
        style={{
          padding: '32px 32px 0',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 28,
          paddingBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#6366f1',
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Practice
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
          Exam Simulator
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>
          A timed mock paper that mirrors real exam pressure
        </p>
      </div>

      <div style={{ padding: '0 32px 32px' }}>
        {stage === 'setup' && (
          <div
            style={{
              background: 'rgba(15,20,34,0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Subject</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: s === subject ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      background: s === subject ? 'rgba(99,102,241,0.15)' : 'rgba(10,14,26,0.4)',
                      color: s === subject ? '#a5b4fc' : '#94a3b8',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Duration</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {DURATIONS.map((d) => (
                  <button
                    key={d.label}
                    onClick={() => setDuration(d)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: d.label === duration.label ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      background: d.label === duration.label ? 'rgba(99,102,241,0.15)' : 'rgba(10,14,26,0.4)',
                      color: d.label === duration.label ? '#a5b4fc' : '#94a3b8',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</div>}

            <button
              onClick={startExam}
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                transition: 'all 0.25s ease',
              }}
            >
              {loading ? 'Preparing paper…' : 'Start Exam'}
            </button>
          </div>
        )}

        {stage === 'running' && questions.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                background: 'rgba(15,20,34,0.5)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: '14px 20px',
              }}
            >
              <span style={{ fontSize: 13, color: '#94a3b8' }}>
                Question {current + 1} / {questions.length}
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: timeLeft < 60 ? '#f87171' : '#a5b4fc',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ◷ {formatTime(timeLeft)}
              </span>
            </div>

            <div
              style={{
                background: 'rgba(15,20,34,0.5)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>{questions[current].question}</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {questions[current].options.map((opt, oi) => (
                  <div
                    key={oi}
                    onClick={() => selectAnswer(oi)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 10,
                      fontSize: 13,
                      cursor: 'pointer',
                      border:
                        answers[current] === oi ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      background: answers[current] === oi ? 'rgba(99,102,241,0.1)' : 'rgba(10,14,26,0.4)',
                      color: '#e2e8f0',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(15,20,34,0.5)',
                  color: '#94a3b8',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: current === 0 ? 'default' : 'pointer',
                  opacity: current === 0 ? 0.4 : 1,
                }}
              >
                ← Previous
              </button>
              {current < questions.length - 1 ? (
                <button
                  onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={finishExam}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                  }}
                >
                  ✦ Submit Exam
                </button>
              )}
            </div>
          </div>
        )}

        {stage === 'finished' && (
          <div>
            <div
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 16,
                padding: 28,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 700, color: '#a5b4fc' }}>
                {score} / {questions.length}
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
                {subject} · {duration.label} mock exam
              </div>
            </div>
            <button
              onClick={() => setStage('setup')}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              }}
            >
              ◈ Try Another Paper
            </button>
          </div>
        )}
      </div>
    </div>
  );
}