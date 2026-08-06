'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

interface Module {
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
}

export default function LearningPathPage() {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    loadPath(subject);
  }, [subject]);

  async function loadPath(subj: string) {
    setLoading(true);
    setError('');
    try {
      const { data: userData } = await supabase.auth.getUser();
      let completedTitles: string[] = [];
      if (userData?.user) {
        const { data } = await supabase
          .from('learning_progress')
          .select('module_title')
          .eq('user_id', userData.user.id)
          .eq('subject', subj);
        completedTitles = (data || []).map((r: any) => r.module_title);
      }

      const res = await fetch('/api/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subj }),
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      const raw: { title: string; description: string }[] = data.modules || [];

      const withStatus: Module[] = raw.map((m, i) => {
        if (completedTitles.includes(m.title)) return { ...m, status: 'completed' };
        const prevCompleted = i === 0 || completedTitles.includes(raw[i - 1].title);
        return { ...m, status: prevCompleted ? 'available' : 'locked' };
      });
      setModules(withStatus);
    } catch (e) {
      setError('Could not load the learning path right now.');
    } finally {
      setLoading(false);
    }
  }

  async function markComplete(title: string) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    await supabase.from('learning_progress').insert({
      user_id: userData.user.id,
      subject,
      module_title: title,
    });
    loadPath(subject);
  }

  const completedCount = modules.filter((m) => m.status === 'completed').length;
  const progressPct = modules.length ? Math.round((completedCount / modules.length) * 100) : 0;

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
          Curriculum
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
          Learning Path
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>
          A guided sequence of modules built for the AKUEB syllabus
        </p>
      </div>

      <div style={{ padding: '0 32px 32px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
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
                background: s === subject ? 'rgba(99,102,241,0.15)' : 'rgba(15,20,34,0.5)',
                color: s === subject ? '#a5b4fc' : '#94a3b8',
                transition: 'all 0.25s ease',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
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
        ) : (
          <>
            <div
              style={{
                background: 'rgba(15,20,34,0.5)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: '#94a3b8' }}>{subject} progress</span>
                <span style={{ color: '#a5b4fc', fontWeight: 700 }}>{progressPct}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
                    borderRadius: 4,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              {modules.map((m, i) => (
                <div
                  key={m.title}
                  style={{
                    background: 'rgba(15,20,34,0.5)',
                    backdropFilter: 'blur(20px)',
                    border:
                      m.status === 'completed'
                        ? '1px solid rgba(74,222,128,0.2)'
                        : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    opacity: m.status === 'locked' ? 0.5 : 1,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      background:
                        m.status === 'completed'
                          ? 'rgba(74,222,128,0.15)'
                          : m.status === 'available'
                          ? 'rgba(99,102,241,0.15)'
                          : 'rgba(255,255,255,0.05)',
                      color: m.status === 'completed' ? '#4ade80' : m.status === 'available' ? '#a5b4fc' : '#64748b',
                    }}
                  >
                    {m.status === 'completed' ? '✦' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{m.description}</div>
                  </div>
                  {m.status === 'available' && (
                    <button
                      onClick={() => markComplete(m.title)}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      Mark done
                    </button>
                  )}
                  {m.status === 'completed' && (
                    <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Completed</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}