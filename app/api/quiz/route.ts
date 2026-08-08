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
    const prompt = `Generate exactly 10 AKUEB-style MCQs for:
    Subject: ${subject}
    Grade: ${grade}
    ${topic ? `Topic: ${topic}` : 'Topic: Any topic from the syllabus'}

    For EACH question, work through it in this exact order:
    1. Solve the question fully and determine the final correct value/answer.
    2. Write four plausible options (a, b, c, d), making sure ONE of them is your exact solved answer from step 1.
    3. Set "correct" to the letter of the option that matches your solved answer — re-check this against your own working before finalizing.
    4. Write the explanation showing your work, and confirm the explanation's final result is identical to the option marked as "correct".

    This consistency check is mandatory: the letter in "correct" MUST correspond to the option whose value matches your explanation's conclusion. Mismatches are not acceptable.

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
        "explanation": "brief step-by-step explanation showing the work that leads to the correct option"
      }
    ]

    Rules:
    - Questions must be relevant to AKUEB syllabus for grade ${grade}
    - All 4 options must be plausible
    - Double-check arithmetic and exponent/algebra rules before finalizing "correct"
    - Explanation must be clear, educational, and end in the same value as the correct option
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