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
    const [usersRes, quizzesRes, notesRes, feedbackRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('quiz_results').select('id', { count: 'exact', head: true }),
      supabase.from('ai_notes').select('id', { count: 'exact', head: true }),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
    ]);

    const feedbackData = (feedbackRes.data as FeedbackItem[]) || [];
    setStats({
      totalUsers: usersRes.count || 0,
      totalQuizzes: quizzesRes.count || 0,
      totalNotes: notesRes.count || 0,
      openFeedback: feedbackData.filter((f) => f.status === 'open').length,
    });
    setFeedback(feedbackData);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    await supabase.from('feedback').update({ status }).eq('id', id);
    loadDashboard();
  }

  function statusColor(status: string) {
    if (status === 'resolved') return { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' };
    if (status === 'in_progress') return { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#a5b4fc' };
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
                  const colors = statusColor(item.status);
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
                          {item.status.replace('_', ' ')}
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
                            disabled={item.status === s}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              cursor: item.status === s ? 'default' : 'pointer',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: item.status === s ? 'rgba(255,255,255,0.03)' : 'rgba(10,14,26,0.4)',
                              color: item.status === s ? '#475569' : '#94a3b8',
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