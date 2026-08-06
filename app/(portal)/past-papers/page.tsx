'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const grades = ['9', '10', '11', '12']
const years = ['2025','2024','2023','2022','2021','2019','2018','2017','2016','2015','2014','2013','2012']

export default function PastPapersPage() {
  const [papers, setPapers] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [viewing, setViewing] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const { data: subs } = await supabase.from('subjects').select('*').eq('is_active', true).order('name')
      setSubjects(subs || [])
      const { data: paps } = await supabase.from('past_papers').select('*, subjects(name)').order('year', { ascending: false })
      setPapers(paps || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = papers.filter(p => {
    if (selectedGrade && p.grade !== selectedGrade) return false
    if (selectedSubject && p.subject_id !== selectedSubject) return false
    if (selectedYear && p.year.toString() !== selectedYear) return false
    return true
  })

  const filterBtn = (active: boolean) => ({
    fontSize: 12, fontWeight: 500,
    padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
    border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
    background: active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
    color: active ? '#818cf8' : '#64748b',
    transition: 'all 0.2s ease',
    boxShadow: active ? '0 0 0 3px rgba(99,102,241,0.08)' : 'none',
  } as React.CSSProperties)

  return (
    <div style={{ minHeight: '100vh' }}>

      <div style={{ padding: '32px 32px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 28, paddingBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Past papers
        </div>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
          AKUEB Past Papers{' '}
          <span style={{ color: '#22d3ee', textShadow: '0 0 30px rgba(34,211,238,0.4)' }}>2012–2025</span>
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 400 }}>
          Paper 1 + Paper 2 · Official answer keys · View or download instantly
        </p>
      </div>

      <div style={{ padding: '0 32px 32px' }}>

        {/* Filters */}
        <div style={{
          background: 'rgba(15,20,34,0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '22px 24px', marginBottom: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16, letterSpacing: '0.02em' }}>Filter papers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 500 }}>Grade</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button style={filterBtn(selectedGrade === '')} onClick={() => setSelectedGrade('')}
                  onMouseEnter={e => { if (selectedGrade !== '') { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#94a3b8' } }}
                  onMouseLeave={e => { if (selectedGrade !== '') { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#64748b' } }}
                >All</button>
                {grades.map(g => (
                  <button key={g} style={filterBtn(selectedGrade === g)} onClick={() => setSelectedGrade(g)}
                    onMouseEnter={e => { if (selectedGrade !== g) { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = '#94a3b8' } }}
                    onMouseLeave={e => { if (selectedGrade !== g) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#64748b' } }}
                  >Grade {g}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 500 }}>Subject</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button style={filterBtn(selectedSubject === '')} onClick={() => setSelectedSubject('')}>All</button>
                {subjects.map(s => (
                  <button key={s.id} style={filterBtn(selectedSubject === s.id)} onClick={() => setSelectedSubject(s.id)}>{s.name}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 500 }}>Year</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button style={filterBtn(selectedYear === '')} onClick={() => setSelectedYear('')}>All</button>
                {years.map(y => (
                  <button key={y} style={filterBtn(selectedYear === y)} onClick={() => setSelectedYear(y)}>{y}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer modal */}
        {viewing && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(10,14,26,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}>
            <div style={{
              background: 'rgba(15,20,34,0.9)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, width: '100%', maxWidth: 920,
              maxHeight: '92vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>{viewing.title}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={viewing.url} download target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 9,
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#fff', textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                    transition: 'all 0.25s ease',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.45)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.3)'
                    }}
                  >Download</a>
                  <button onClick={() => setViewing(null)} style={{
                    fontSize: 13, padding: '8px 16px', borderRadius: 9,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#64748b', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = '#f8fafc'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.color = '#64748b'
                    }}
                  >Close</button>
                </div>
              </div>
              <iframe src={viewing.url} style={{ flex: 1, border: 'none', borderRadius: '0 0 20px 20px', minHeight: 520 }} />
            </div>
          </div>
        )}

        {/* Papers list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#64748b', fontSize: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
            }} />
            Loading papers...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 80,
            background: 'rgba(15,20,34,0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16,
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>No papers found</div>
            <div style={{ fontSize: 14, color: '#64748b' }}>Try adjusting your filters</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(p => (
              <div key={p.id} style={{
                background: 'rgba(15,20,34,0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 13, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'
                  e.currentTarget.style.background = 'rgba(20,25,40,0.7)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.background = 'rgba(15,20,34,0.5)'
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc', marginBottom: 4, letterSpacing: '-0.2px' }}>
                    {p.subjects?.name} — Grade {p.grade}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', fontWeight: 400 }}>
                    {p.year} · {p.paper === 'paper1' ? 'Paper 1 (MCQ)' : 'Paper 2 (CRQ/ERQ)'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.pdf_url && (
                    <button onClick={() => setViewing({ title: `${p.subjects?.name} ${p.year} ${p.paper === 'paper1' ? 'Paper 1' : 'Paper 2'}`, url: p.pdf_url })}
                      style={{
                        fontSize: 13, fontWeight: 500, padding: '7px 14px', borderRadius: 8,
                        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                        color: '#818cf8', cursor: 'pointer', transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >View paper</button>
                  )}
                  {p.answer_key_url && (
                    <button onClick={() => setViewing({ title: `${p.subjects?.name} ${p.year} Answer Key`, url: p.answer_key_url })}
                      style={{
                        fontSize: 13, fontWeight: 500, padding: '7px 14px', borderRadius: 8,
                        background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)',
                        color: '#22d3ee', cursor: 'pointer', transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(34,211,238,0.12)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(34,211,238,0.06)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >Answer key</button>
                  )}
                  {p.pdf_url && (
                    <a href={p.pdf_url} download target="_blank" rel="noopener noreferrer"
                      style={{
                        fontSize: 13, fontWeight: 500, padding: '7px 14px', borderRadius: 8,
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#64748b', textDecoration: 'none', transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                        e.currentTarget.style.color = '#94a3b8'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.color = '#64748b'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >Download</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}