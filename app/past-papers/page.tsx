'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

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
    padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
    border: active ? '1.5px solid #6366f1' : '0.5px solid #252d45',
    background: active ? '#6366f115' : '#0f1422',
    color: active ? '#818cf8' : '#64748b',
  } as React.CSSProperties)

  return (
    <div className={spaceGrotesk.variable} style={{
      minHeight: '100vh', background: '#0a0e1a',
      fontFamily: 'var(--font-space), system-ui, sans-serif',
    }}>

      {/* Navbar */}
      <nav style={{
        background: '#0a0e1aee', borderBottom: '0.5px solid #252d45',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        <a href="/" style={{ 
          fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', 
          display: 'flex', alignItems: 'center', gap: 8 
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: '#6366f1',
            boxShadow: '0 0 12px #6366f180',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="7,2 7,8 10,8 5,14 5,8 8,8" fill="white"/>
            </svg>
          </div>
          <span style={{ color: '#f8fafc' }}>Exlr</span>
          <span style={{ color: '#818cf8' }}>AI</span>
        </a>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/dashboard" style={{ fontSize: 13, color: '#94a3b8', padding: '6px 14px', borderRadius: 8, border: '0.5px solid #252d45' }}>
            ← Dashboard
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Past papers
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 6 }}>
            AKUEB Past Papers{' '}
            <span style={{ color: '#22d3ee', textShadow: '0 0 30px #22d3ee50' }}>2012–2025</span>
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Paper 1 + Paper 2 · Official answer keys · E-marking notes · View or download
          </p>
        </div>

        {/* Filters */}
        <div style={{
          background: '#0f1422', border: '0.5px solid #252d45',
          borderRadius: 12, padding: '20px 24px', marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Filter papers</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Grade filter */}
            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Grade</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button style={filterBtn(selectedGrade === '')} onClick={() => setSelectedGrade('')}>All</button>
                {grades.map(g => (
                  <button key={g} style={filterBtn(selectedGrade === g)} onClick={() => setSelectedGrade(g)}>
                    Grade {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject filter */}
            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Subject</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button style={filterBtn(selectedSubject === '')} onClick={() => setSelectedSubject('')}>All</button>
                {subjects.map(s => (
                  <button key={s.id} style={filterBtn(selectedSubject === s.id)} onClick={() => setSelectedSubject(s.id)}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Year filter */}
            <div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Year</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button style={filterBtn(selectedYear === '')} onClick={() => setSelectedYear('')}>All</button>
                {years.map(y => (
                  <button key={y} style={filterBtn(selectedYear === y)} onClick={() => setSelectedYear(y)}>
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer modal */}
        {viewing && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: '#0a0e1acc', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}>
            <div style={{
              background: '#0f1422', border: '0.5px solid #252d45',
              borderRadius: 16, width: '100%', maxWidth: 900,
              maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderBottom: '0.5px solid #252d45',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc' }}>{viewing.title}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={viewing.url} download target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 12, fontWeight: 500, padding: '6px 14px', borderRadius: 8,
                    background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer',
                  }}>⬇ Download</a>
                  <button onClick={() => setViewing(null)} style={{
                    fontSize: 12, padding: '6px 14px', borderRadius: 8,
                    background: 'transparent', border: '0.5px solid #252d45',
                    color: '#64748b', cursor: 'pointer',
                  }}>✕ Close</button>
                </div>
              </div>
              <iframe
                src={viewing.url}
                style={{ flex: 1, border: 'none', borderRadius: '0 0 16px 16px', minHeight: 500 }}
              />
            </div>
          </div>
        )}

        {/* Papers list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b', fontSize: 14 }}>
            Loading papers...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 60,
            background: '#0f1422', border: '0.5px solid #252d45',
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              No papers found. Try adjusting your filters.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(p => (
              <div key={p.id} style={{
                background: '#0f1422', border: '0.5px solid #252d45',
                borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f8fafc', marginBottom: 4 }}>
                    {p.subjects?.name} — Grade {p.grade}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    {p.year} · {p.paper === 'paper1' ? 'Paper 1 (MCQ)' : 'Paper 2 (CRQ/ERQ)'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.pdf_url && (
                    <button onClick={() => setViewing({ title: `${p.subjects?.name} ${p.year} ${p.paper === 'paper1' ? 'Paper 1' : 'Paper 2'}`, url: p.pdf_url })}
                      style={{
                        fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 8,
                        background: '#6366f115', border: '0.5px solid #6366f130',
                        color: '#818cf8', cursor: 'pointer',
                      }}>
                       View paper
                    </button>
                  )}
                  {p.answer_key_url && (
                    <button onClick={() => setViewing({ title: `${p.subjects?.name} ${p.year} Answer Key`, url: p.answer_key_url })}
                      style={{
                        fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 8,
                        background: '#22d3ee10', border: '0.5px solid #22d3ee30',
                        color: '#22d3ee', cursor: 'pointer',
                      }}>
                       Answer key
                    </button>
                  )}
                  {p.emarking_url && (
                    <button onClick={() => setViewing({ title: `${p.subjects?.name} ${p.year} E-Marking Notes`, url: p.emarking_url })}
                      style={{
                        fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 8,
                        background: '#4ade8010', border: '0.5px solid #4ade8030',
                        color: '#4ade80', cursor: 'pointer',
                      }}>
                       E-marking
                    </button>
                  )}
                  {p.pdf_url && (
                    <a href={p.pdf_url} download target="_blank" rel="noopener noreferrer"
                      style={{
                        fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 8,
                        background: '#0a0e1a', border: '0.5px solid #252d45',
                        color: '#64748b', cursor: 'pointer',
                      }}>
                      ⬇ Download
                    </a>
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
