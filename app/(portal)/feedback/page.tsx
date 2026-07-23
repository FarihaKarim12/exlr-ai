'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['Bug Report', 'Feature Request', 'Content Issue', 'General Feedback'];

interface FeedbackItem {
  id: string;
  category: string;
  message: string;
  created_at: string;
  status: string;
}

export default function FeedbackPage() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoadingHistory(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setLoadingHistory(false);
      return;
    }
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    setHistory((data as FeedbackItem[]) || []);
    setLoadingHistory(false);
  }

  async function submitFeedback() {
    if (!message.trim()) {
      setError('Write a message before submitting.');
      return;
    }
    setError('');
    setSuccess(false);
    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('not signed in');
      const { error: insertError } = await supabase.from('feedback').insert({
        user_id: userData.user.id,
        category,
        message,
        status: 'open',
      });
      if (insertError) throw insertError;
      setMessage('');
      setSuccess(true);
      loadHistory();
    } catch (e) {
      setError('Could not submit your feedback right now. Try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  }

  function statusColor(status: string) {
    if (status === 'resolved') return { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' };
    if (status === 'in_progress') return { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', text: '#a5b4fc' };
    return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#94a3b8' };
  }

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
          Support
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
          Feedback
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>
          Report a bug, request a feature, or tell us what's on your mind
        </p>
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
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Category</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: c === category ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    background: c === category ? 'rgba(99,102,241,0.15)' : 'rgba(10,14,26,0.4)',
                    color: c === category ? '#a5b4fc' : '#94a3b8',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what happened, or what you'd like to see…"
              rows={5}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(10,14,26,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                color: '#e2e8f0',
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ color: '#4ade80', fontSize: 13, marginBottom: 12 }}>◈ Thanks — your feedback was submitted.</div>}

          <button
            onClick={submitFeedback}
            disabled={submitting}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => !submitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {submitting ? 'Submitting…' : '✦ Submit Feedback'}
          </button>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Your submissions</h3>
        {loadingHistory ? (
          <div style={{ fontSize: 13, color: '#64748b' }}>Loading…</div>
        ) : history.length === 0 ? (
          <div
            style={{
              background: 'rgba(15,20,34,0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: 24,
              fontSize: 13,
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            No feedback submitted yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {history.map((item) => {
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 700 }}>{item.category}</span>
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
                  <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{item.message}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}