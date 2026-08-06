'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Urdu', 'Pakistan Studies'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export default function QuizPage() {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  async function generateQuiz() {
    if (!topic.trim()) {
      setError('Enter a topic to build your quiz.');
      return;
    }
    setError('');
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, difficulty }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (e) {
      setError('Could not generate the quiz right now. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(qIndex: number, optIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  async function submitQuiz() {
    setSubmitted(true);
    const score = questions.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0);
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase.from('quiz_results').insert({
        user_id: userData.user.id,
        subject,
        topic,
        difficulty,
        score,
        total: questions.length,
      });
    }
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
          Quiz
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>Test yourself with AI-generated MCQs</p>
      </div>

      <div style={{ padding: '0 32px 32px' }}>
        <div
          style={{
            background: 'rgba(15,20,34,0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ flex: '1 1 180px' }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={selectStyle}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s} style={{ background: '#0a0e1a' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: '2 1 240px' }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Topic</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Cell Division, Trigonometry"
                style={selectStyle}
              />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={selectStyle}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} style={{ background: '#0a0e1a' }}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <button
            onClick={generateQuiz}
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
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'Building quiz…' : 'Generate Quiz'}
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div
              style={{
                width: 32,
                height: 32,
                border: '3px solid rgba(99,102,241,0.2)',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {questions.length > 0 && (
          <>
            {submitted && (
              <div
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 700, color: '#a5b4fc' }}>
                  {score} / {questions.length}
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Your score</div>
              </div>
            )}

            <div style={{ display: 'grid', gap: 16 }}>
              {questions.map((q, qi) => (
                <div
                  key={qi}
                  style={{
                    background: 'rgba(15,20,34,0.5)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
                    {qi + 1}. {q.question}
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {q.options.map((opt, oi) => {
                      const isSelected = answers[qi] === oi;
                      const isCorrect = submitted && oi === q.answer;
                      const isWrong = submitted && isSelected && oi !== q.answer;
                      return (
                        <div
                          key={oi}
                          onClick={() => selectAnswer(qi, oi)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 10,
                            fontSize: 13,
                            cursor: submitted ? 'default' : 'pointer',
                            border: isCorrect
                              ? '1px solid rgba(74,222,128,0.5)'
                              : isWrong
                              ? '1px solid rgba(248,113,113,0.5)'
                              : isSelected
                              ? '1px solid rgba(99,102,241,0.5)'
                              : '1px solid rgba(255,255,255,0.06)',
                            background: isCorrect
                              ? 'rgba(74,222,128,0.1)'
                              : isWrong
                              ? 'rgba(248,113,113,0.1)'
                              : isSelected
                              ? 'rgba(99,102,241,0.1)'
                              : 'rgba(10,14,26,0.4)',
                            color: '#e2e8f0',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                  {submitted && q.explanation && (
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 10, lineHeight: 1.6 }}>
                       {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!submitted && (
              <button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length !== questions.length}
                style={{
                  marginTop: 20,
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: Object.keys(answers).length === questions.length ? 'pointer' : 'default',
                  opacity: Object.keys(answers).length === questions.length ? 1 : 0.5,
                  boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                  transition: 'all 0.25s ease',
                }}
              >
                ✦ Submit Answers
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(10,14,26,0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: '#e2e8f0',
  fontSize: 14,
  outline: 'none',
};