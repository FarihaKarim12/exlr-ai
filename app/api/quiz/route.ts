import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { subject, grade, topic } = await req.json()

    const prompt = `Generate exactly 10 AKUEB-style MCQs for:
Subject: ${subject}
Grade: ${grade}
${topic ? `Topic: ${topic}` : 'Topic: Any topic from the syllabus'}

Return ONLY a valid JSON array with exactly this structure, no other text:
[
  {
    "question": "question text here",
    "options": {
      "a": "option a text",
      "b": "option b text", 
      "c": "option c text",
      "d": "option d text"
    },
    "correct": "a",
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

    // Clean and parse JSON
    const cleaned = content.replace(/```json|```/g, '').trim()
    const questions = JSON.parse(cleaned)

    return NextResponse.json({ questions })
  } catch (err) {
    console.error('Quiz generation error:', err)
    return NextResponse.json({ questions: [] }, { status: 500 })
  }
}