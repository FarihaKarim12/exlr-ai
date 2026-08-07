import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groqApiKey = process.env.GROQ_API_KEY
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null

function buildFallbackQuestions(subject: string, topic: string, difficulty: string, count: number) {
  const baseTopic = topic || 'core concepts'
  const difficultyLabel = difficulty?.toLowerCase() || 'medium'

  return Array.from({ length: count }, (_, index) => ({
    question: `${subject}: ${baseTopic} (${difficultyLabel}) question ${index + 1}`,
    options: [
      `Primary option ${index + 1}`,
      `Secondary option ${index + 2}`,
      `Correct option ${index + 3}`,
      `Alternative option ${index + 4}`,
    ],
    answer: 2,
    explanation: `Review ${baseTopic} in ${subject} to understand why option 3 is correct.`,
  }))
}

function normalizeQuestions(rawQuestions: any[], count: number) {
  const safeQuestions = Array.isArray(rawQuestions) ? rawQuestions : []

  return safeQuestions.slice(0, count).map((item, index) => {
    const options = Array.isArray(item?.options)
      ? item.options
      : item?.options
        ? Object.values(item.options as Record<string, string>)
        : []

    const correctIndex = typeof item?.correct === 'number'
      ? item.correct
      : typeof item?.correct === 'string'
        ? ['a', 'b', 'c', 'd'].indexOf(item.correct.toLowerCase())
        : 0

    return {
      question: item?.question || `Question ${index + 1}`,
      options: options.slice(0, 4),
      answer: correctIndex >= 0 && correctIndex < options.length ? correctIndex : 0,
      explanation: item?.explanation || 'Review the topic to confirm the correct answer.',
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const subject = body.subject || 'General Studies'
    const topic = body.topic || 'core concepts'
    const difficulty = body.difficulty || 'Medium'
    const count = Math.max(1, Math.min(10, Number(body.count) || 5))

    if (!groq) {
      return NextResponse.json({ questions: buildFallbackQuestions(subject, topic, difficulty, count) })
    }

    const grade = body.grade || '10'
    const prompt = `Generate exactly ${count} AKUEB-style MCQs for:
Subject: ${subject}
Grade: ${grade}
${topic ? `Topic: ${topic}` : 'Topic: Any topic from the syllabus'}
Difficulty: ${difficulty}

Return ONLY a valid JSON array with exactly this structure, no other text:
[
  {
    "question": "question text here",
    "options": ["option a", "option b", "option c", "option d"],
    "correct": 2,
    "explanation": "brief explanation why this is correct"
  }
]

Rules:
- Questions must be relevant to AKUEB syllabus for grade ${grade}
- All 4 options must be plausible
- Correct answer must be accurate
- Explanation must be clear and educational
- Return ONLY the JSON array, no markdown, no extra text`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || '[]'

    let parsedQuestions: any[] = []
    try {
      const cleaned = content.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      parsedQuestions = Array.isArray(parsed) ? parsed : []
    } catch (parseErr) {
      console.error('Failed to parse quiz JSON:', parseErr, 'Raw content:', content)
    }

    return NextResponse.json({ questions: normalizeQuestions(parsedQuestions, count) })
  } catch (err) {
    console.error('Quiz generation error:', err)
    return NextResponse.json({ questions: buildFallbackQuestions('General Studies', 'core concepts', 'Medium', 5) })
  }
}