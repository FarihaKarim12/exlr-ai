'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'Urdu', 'Pakistan Studies'];

interface SavedNote {
  id: string;
  subject: string;
  topic: string;
  content: string;
  created_at: string;
}

export default function AINotesPage() {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<SavedNote[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadSaved();
  }, []);

  useEffect(() => {
    if (!actionMessage) return;
    const timeout = window.setTimeout(() => setActionMessage(''), 2200);
    return () => window.clearTimeout(timeout);
  }, [actionMessage]);

  async function loadSaved() {
    setLoadingSaved(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setLoadingSaved(false);
      return;
    }
    const notesResult = await supabase
      .from('ai_notes')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    const savedNotes = Array.isArray((notesResult as { data?: SavedNote[] }).data)
      ? ((notesResult as { data?: SavedNote[] }).data as SavedNote[])
      : [];

    if (savedNotes.length === 0 && typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('exlr-ai-notes');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SavedNote[];
          if (parsed.length > 0) {
            setSaved(parsed);
            setLoadingSaved(false);
            return;
          }
        } catch {}
      }
    }

    setSaved(savedNotes);
    setLoadingSaved(false);
  }

  async function generateNotes() {
    if (!topic.trim()) {
      setError('Enter a topic to generate notes for.');
      return;
    }
    setError('');
    setLoading(true);
    setNotes('');
    try {
      const res = await fetch('/api/ai-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setNotes(data.notes || data.content || '');
    } catch (e) {
      setError('Could not generate notes right now. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  function syncSavedNotes(next: SavedNote[]) {
    setSaved(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('exlr-ai-notes', JSON.stringify(next));
    }
  }

  async function saveNote() {
    if (!notes) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      const fallbackNotes = [{
        id: `${Date.now()}`,
        subject,
        topic,
        content: notes,
        created_at: new Date().toISOString(),
      }];
      const existing = typeof window !== 'undefined' ? window.localStorage.getItem('exlr-ai-notes') : null;
      const parsed = existing ? JSON.parse(existing) : [];
      const next = [...parsed, ...fallbackNotes];
      syncSavedNotes(next);
      setActionMessage('Note saved locally.');
      return;
    }

    const insertResult = await supabase.from('ai_notes').insert({
      user_id: userData.user.id,
      subject,
      topic,
      content: notes,
    });

    if (insertResult.error) {
      const fallbackNotes = [{
        id: `${Date.now()}`,
        subject,
        topic,
        content: notes,
        created_at: new Date().toISOString(),
      }];
      const existing = typeof window !== 'undefined' ? window.localStorage.getItem('exlr-ai-notes') : null;
      const parsed = existing ? JSON.parse(existing) : [];
      const next = [...parsed, ...fallbackNotes];
      syncSavedNotes(next);
      setActionMessage('Note saved locally.');
      return;
    }

    loadSaved();
    setActionMessage('Note saved.');
  }

  async function deleteNote(id: string) {
    const next = saved.filter((note) => note.id !== id);
    syncSavedNotes(next);
    setActionMessage('Note deleted.');

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    await supabase.from('ai_notes').delete().eq('id', id);
  }

  const filteredNotes = saved.filter((n) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSubject = subjectFilter === 'All' || n.subject === subjectFilter;
    const matchesQuery = !query || [n.subject, n.topic, n.content].join(' ').toLowerCase().includes(query);
    return matchesSubject && matchesQuery;
  });

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
          Study Tools
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
          AI Notes
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>
          Generate concise, exam-ready notes on any AKUEB topic
        </p>
      </div>

      <div style={{ padding: '0 32px 32px' }}>
        {actionMessage && (
          <div
            style={{
              marginBottom: 16,
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid rgba(16,185,129,0.25)',
              background: 'rgba(16,185,129,0.12)',
              color: '#86efac',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {actionMessage}
          </div>
        )}
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
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(10,14,26,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  color: '#e2e8f0',
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s} style={{ background: '#0a0e1a' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: '2 1 300px' }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Topic</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quadratic Equations, Newton's Laws"
                onKeyDown={(e) => e.key === 'Enter' && generateNotes()}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(10,14,26,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  color: '#e2e8f0',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <button
            onClick={generateNotes}
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
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.38)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.3)';
            }}
          >
            {loading ? 'Generating…' : 'Generate Notes'}
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

        {notes && !loading && (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>
                {subject} — {topic}
              </h3>
              <button
                onClick={saveNote}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 8,
                  color: '#a5b4fc',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                Save
              </button>
            </div>
            <div
              style={{ fontSize: 14, lineHeight: 1.7, color: '#cbd5e1', whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{
                __html: notes
                  .replace(/\n/g, '<br />')
                  .replace(/^(\d+\.\s+.+)$/gm, '<div style="margin: 10px 0 4px; font-weight: 700; color: #f8fafc;">$1</div>')
                  .replace(/^(\s*[-•]\s+.+)$/gm, '<div style="margin: 4px 0 4px 16px;">• $1</div>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', margin: 0 }}>Saved Notes</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              style={{
                minWidth: 150,
                padding: '10px 12px',
                background: 'rgba(10,14,26,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                color: '#e2e8f0',
                fontSize: 13,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="All" style={{ background: '#0a0e1a' }}>All subjects</option>
              {SUBJECTS.map((subjectOption) => (
                <option key={subjectOption} value={subjectOption} style={{ background: '#0a0e1a' }}>
                  {subjectOption}
                </option>
              ))}
            </select>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes"
              style={{
                width: 220,
                padding: '10px 12px',
                background: 'rgba(10,14,26,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                color: '#e2e8f0',
                fontSize: 13,
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)';
                e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        {loadingSaved ? (
          <div style={{ fontSize: 13, color: '#64748b' }}>Loading…</div>
        ) : saved.length === 0 ? (
          <div
            style={{
              background: 'rgba(15,20,34,0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: 24,
              fontSize: 14,
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            No saved notes yet — generate one above and save it.
          </div>
        ) : filteredNotes.length === 0 ? (
          <div
            style={{
              background: 'rgba(15,20,34,0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: 24,
              fontSize: 14,
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            No notes match your search.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {filteredNotes.map((n) => (
              <div
                key={n.id}
                style={{
                  background: 'rgba(15,20,34,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14,
                  padding: 18,
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSubject(n.subject);
                  setTopic(n.topic);
                  setNotes(n.content);
                  setActionMessage('Note loaded into editor.');
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, marginBottom: 4 }}>{n.subject}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{n.topic}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(n.id);
                    }}
                    style={{
                      border: 'none',
                      background: 'rgba(248,113,113,0.12)',
                      color: '#fda4af',
                      borderRadius: 8,
                      padding: '6px 10px',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.background = 'rgba(248,113,113,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(248,113,113,0.12)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}