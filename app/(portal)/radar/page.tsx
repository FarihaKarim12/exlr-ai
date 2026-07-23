'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SubjectScore {
  subject: string;
  score: number; // 0-100
}

const ALL_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

function RadarChart({ data, size = 320 }: { data: SubjectScore[]; size?: number }) {
  const center = size / 2;
  const radius = size / 2 - 48;
  const angleStep = (Math.PI * 2) / data.length;

  function pointFor(index: number, value: number) {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  }

  const polygonPoints = data.map((d, i) => pointFor(i, d.score));
  const pointsAttr = polygonPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const rings = [20, 40, 60, 80, 100];

  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {rings.map((r) => {
        const ringPoints = data
          .map((_, i) => pointFor(i, r))
          .map((p) => `${p.x},${p.y}`)
          .join(' ');
        return (
          <polygon key={r} points={ringPoints} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        );
      })}
      {data.map((_, i) => {
        const outer = pointFor(i, 100);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={outer.x}
            y2={outer.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        );
      })}
      <polygon points={pointsAttr} fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth={2} />
      {polygonPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#818cf8" />
      ))}
      {data.map((d, i) => {
        const labelPoint = pointFor(i, 122);
        return (
          <text
            key={d.subject}
            x={labelPoint.x}
            y={labelPoint.y}
            fontSize={11}
            fill="#94a3b8"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {d.subject}
          </text>
        );
      })}
    </svg>
  );
}

export default function RadarPage() {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<SubjectScore[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('quiz_results')
      .select('subject, score, total')
      .eq('user_id', userData.user.id);

    const bySubject: Record<string, { total: number; count: number }> = {};
    (data || []).forEach((row: any) => {
      const pct = row.total > 0 ? (row.score / row.total) * 100 : 0;
      if (!bySubject[row.subject]) bySubject[row.subject] = { total: 0, count: 0 };
      bySubject[row.subject].total += pct;
      bySubject[row.subject].count += 1;
    });

    const result: SubjectScore[] = ALL_SUBJECTS.map((s) => ({
      subject: s,
      score: bySubject[s] ? Math.round(bySubject[s].total / bySubject[s].count) : 0,
    }));

    setScores(result);
    setLoading(false);
  }

  const strongest = [...scores].sort((a, b) => b.score - a.score)[0];
  const weakest = [...scores].sort((a, b) => a.score - b.score)[0];

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
          Analytics
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
          Performance Radar
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>
          See how you're performing across subjects, based on quiz history
        </p>
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
        ) : scores.every((s) => s.score === 0) ? (
          <div
            style={{
              background: 'rgba(15,20,34,0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: 40,
              textAlign: 'center',
              color: '#64748b',
              fontSize: 13,
            }}
          >
            No quiz data yet — take a few quizzes to see your performance radar.
          </div>
        ) : (
          <>
            <div
              style={{
                background: 'rgba(15,20,34,0.5)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 32,
                marginBottom: 24,
              }}
            >
              <RadarChart data={scores} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div
                style={{
                  background: 'rgba(15,20,34,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(74,222,128,0.15)',
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 700, letterSpacing: '.05em', marginBottom: 6 }}>
                  ◑ STRONGEST
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{strongest?.subject}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{strongest?.score}% average</div>
              </div>
              <div
                style={{
                  background: 'rgba(15,20,34,0.5)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(248,113,113,0.15)',
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <div style={{ fontSize: 11, color: '#f87171', fontWeight: 700, letterSpacing: '.05em', marginBottom: 6 }}>
                  ◒ NEEDS FOCUS
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{weakest?.subject}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{weakest?.score}% average</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {scores
                .sort((a, b) => b.score - a.score)
                .map((s) => (
                  <div
                    key={s.subject}
                    style={{
                      background: 'rgba(15,20,34,0.5)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <div style={{ width: 130, fontSize: 13, fontWeight: 600 }}>{s.subject}</div>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${s.score}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
                          borderRadius: 3,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                    <div style={{ width: 40, fontSize: 13, color: '#94a3b8', textAlign: 'right' }}>{s.score}%</div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}