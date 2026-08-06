'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PlanDay {
  day: string;
  focus: string;
  tasks: string[];
}

export default function StudyPlanPage() {
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<PlanDay[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadExisting();
  }, []);

  async function loadExisting() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;
    const { data } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (data?.plan) setPlan(data.plan);
  }

  async function generatePlan() {
    if (!subjects.trim() || !examDate) {
      setError('Add your exam date and the subjects you want to cover.');
      return;
    }
    setError('');
    setLoading(true);
    setPlan([]);
    try {
      const res = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examDate, subjects, hoursPerDay }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      const newPlan = data.plan || [];
      setPlan(newPlan);

      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase.from('study_plans').insert({
          user_id: userData.user.id,
          exam_date: examDate,
          subjects,
          hours_per_day: Number(hoursPerDay),
          plan: newPlan,
        });
      }
    } catch (e) {
      setError('Could not generate a plan right now. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  function toggleTask(key: string) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const totalTasks = plan.reduce((acc, d) => acc + d.tasks.length, 0);
  const doneTasks = Object.values(checked).filter(Boolean).length;

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
          Planning
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
          Study Plan
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>
          A personalized day-by-day schedule that fits your exam date
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
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ flex: '1 1 160px' }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Exam date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: '2 1 260px' }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>
                Subjects (comma separated)
              </label>
              <input
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="Mathematics, Physics, Chemistry"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, display: 'block' }}>Hours / day</label>
              <input
                type="number"
                min={1}
                max={12}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <button
            onClick={generatePlan}
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
            {loading ? 'Building plan…' : 'Generate Study Plan'}
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

        {plan.length > 0 && !loading && (
          <>
            <div
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 16,
                padding: '16px 20px',
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, color: '#a5b4fc' }}>Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc' }}>
                {doneTasks} / {totalTasks} tasks done
              </span>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              {plan.map((day, di) => (
                <div
                  key={di}
                  style={{
                    background: 'rgba(15,20,34,0.5)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{day.day}</div>
                    <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>{day.focus}</div>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {day.tasks.map((task, ti) => {
                      const key = `${di}-${ti}`;
                      return (
                        <label
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            fontSize: 13,
                            color: checked[key] ? '#64748b' : '#cbd5e1',
                            textDecoration: checked[key] ? 'line-through' : 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <input type="checkbox" checked={!!checked[key]} onChange={() => toggleTask(key)} />
                          {task}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(10,14,26,0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  color: '#e2e8f0',
  fontSize: 14,
  outline: 'none',
};