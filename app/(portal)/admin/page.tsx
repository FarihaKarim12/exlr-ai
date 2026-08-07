'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface FeedbackItem {
  id: string;
  category: string;
  message: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface Stats {
  totalUsers: number;
  totalQuizzes: number;
  totalNotes: number;
  openFeedback: number;
}

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved'];
const FEEDBACK_STORAGE_KEY = 'exlr-admin-feedback';

function buildSeedFeedback(): FeedbackItem[] {
  return [
    {
      id: 'seed-open-1',
      category: 'Bug Report',
      message: 'The AI notes page sometimes fails to save notes when Supabase is unavailable.',
      status: 'open',
      created_at: new Date().toISOString(),
      user_id: 'demo-user-1',
    },
    {
      id: 'seed-progress-1',
      category: 'Feature Request',
      message: 'Add more study-plan customization options for exam preparation.',
      status: 'in_progress',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user_id: 'demo-user-2',
    },
    {
      id: 'seed-resolved-1',
      category: 'General Feedback',
      message: 'The new AI notes formatting is much easier to review.',
      status: 'resolved',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      user_id: 'demo-user-3',
    },
  ];
}

function readFallbackFeedback() {
  if (typeof window === 'undefined') return buildSeedFeedback();
  try {
    const stored = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed as FeedbackItem[] : buildSeedFeedback();
  } catch {
    return buildSeedFeedback();
  }
}

function saveFallbackFeedback(items: FeedbackItem[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items));
  }
}

function buildStatsFromFallback(feedback: FeedbackItem[]) {
  if (typeof window === 'undefined') {
    return { totalUsers: 0, totalQuizzes: 0, totalNotes: 0, openFeedback: feedback.filter((f) => f.status === 'open').length };
  }

  const quizResults = window.localStorage.getItem('exlr-quiz-results');
  const notes = window.localStorage.getItem('exlr-ai-notes');
  const quizCount = quizResults ? JSON.parse(quizResults).length : 0;
  const noteCount = notes ? JSON.parse(notes).length : 0;

  return {
    totalUsers: 0,
    totalQuizzes: quizCount,
    totalNotes: noteCount,
    openFeedback: feedback.filter((f) => f.status === 'open').length,
  };
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalQuizzes: 0, totalNotes: 0, openFeedback: 0 });
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const fallbackFeedback = readFallbackFeedback();
    const fallbackStats = buildStatsFromFallback(fallbackFeedback);
    setFeedback(fallbackFeedback);
    setStats(fallbackStats);

    try {
      const [usersRes, quizzesRes, notesRes, feedbackRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('quiz_results').select('id', { count: 'exact', head: true }),
        supabase.from('ai_notes').select('id', { count: 'exact', head: true }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false }),
      ]);

      const feedbackData = Array.isArray((feedbackRes as { data?: FeedbackItem[] }).data)
        ? ((feedbackRes as { data?: FeedbackItem[] }).data as FeedbackItem[])
        : [];

      if (feedbackData.length > 0 || (usersRes as { count?: number }).count || (quizzesRes as { count?: number }).count || (notesRes as { count?: number }).count) {
        const nextStats = {
          totalUsers: Number((usersRes as { count?: number }).count) || 0,
          totalQuizzes: Number((quizzesRes as { count?: number }).count) || 0,
          totalNotes: Number((notesRes as { count?: number }).count) || 0,
          openFeedback: feedbackData.filter((f) => f.status === 'open').length,
        };
        setStats(nextStats);
        setFeedback(feedbackData);
        if (feedbackData.length > 0) {
          saveFallbackFeedback(feedbackData);
        }
      }
    } catch {
      setStats(fallbackStats);
      setFeedback(fallbackFeedback);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const nextFeedback = feedback.map((f) => (f.id === id ? { ...f, status } : f));
    setFeedback(nextFeedback);
    saveFallbackFeedback(nextFeedback);

    try {
      await supabase.from('feedback').update({ status }).eq('id', id);
    } catch {
      // Fall back silently; the local UI already updated.
    }

    loadDashboard();
  }

  function normalizeStatus(status?: string) {
    return typeof status === 'string' && status.trim() ? status : 'open';
  }

  function formatStatus(status?: string) {
    return normalizeStatus(status).replace('_', ' ');
  }

  function statusColor(status?: string) {
    const safeStatus = normalizeStatus(status);
    if (safeStatus === 'resolved') return { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' };
    if (safeStatus === 'in_progress') return { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#a5b4fc' };
    return { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', text: '#f87171' };
  }

  const filteredFeedback = filter === 'all' ? feedback : feedback.filter((f) => f.status === filter);

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
          Admin
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>Platform overview and feedback moderation</p>
      </div>

      <div style={{ padding: '0 32px 32px' }}>
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
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 16,
                marginBottom: 28,
              }}
            >
              {[
                { label: 'Users', value: stats.totalUsers },
                { label: 'Quizzes', value: stats.totalQuizzes },
                { label: 'Notes', value: stats.totalNotes },
                { label: 'Open Feedback', value: stats.openFeedback },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    background: 'rgba(15,20,34,0.5)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: 18,
                  }}
                >
                  <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
                    {card.label}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc' }}>{card.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8' }}>Feedback Queue</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {['all', ...STATUS_OPTIONS].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      border: filter === s ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      background: filter === s ? 'rgba(99,102,241,0.15)' : 'rgba(15,20,34,0.5)',
                      color: filter === s ? '#a5b4fc' : '#94a3b8',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {filteredFeedback.length === 0 ? (
              <div
                style={{
                  background: 'rgba(15,20,34,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16,
                  padding: 40,
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                Nothing here.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {filteredFeedback.map((item) => {
                  const normalizedStatus = normalizeStatus(item.status);
                  const displayStatus = formatStatus(normalizedStatus);
                  const colors = statusColor(normalizedStatus);
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(15,20,34,0.5)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 14,
                        padding: 18,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, marginRight: 10 }}>
                            {item.category}
                          </span>
                          <span style={{ fontSize: 11, color: '#64748b' }}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: 6,
                            background: colors.bg,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                            textTransform: 'capitalize',
                          }}
                        >
                          {displayStatus}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 14 }}>
                        {item.message}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(item.id, s)}
                            disabled={normalizedStatus === s}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              cursor: item.status === s ? 'default' : 'pointer',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: normalizedStatus === s ? 'rgba(255,255,255,0.03)' : 'rgba(10,14,26,0.4)',
                              color: normalizedStatus === s ? '#475569' : '#94a3b8',
                              transition: 'all 0.25s ease',
                            }}
                          >
                            {s.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}