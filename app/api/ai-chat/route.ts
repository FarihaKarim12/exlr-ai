import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { messages, subject } = await req.json()

    const systemPrompt = `You are an expert AKUEB (Aga Khan University Examination Board) tutor helping SSC and HSSC students in Pakistan.

${subject ? `The student is asking about: ${subject}` : 'Help with any AKUEB subject.'}

Your rules:
- Answer ONLY questions related to the AKUEB syllabus (SSC Class 9-10, HSSC Class 11-12)
- Give clear, accurate, syllabus-specific answers
- Use simple language appropriate for secondary school students
- Respond in English by default. If the student writes in Roman Urdu, respond in Roman Urdu.
- Do NOT use markdown formatting like **bold**, ##headers, or ===lines. Write in plain, clean text only.
- Use numbered lists or simple bullet points with a dash (-) only when needed
- Always relate answers to the AKUEB exam format (Paper 1 MCQs, Paper 2 CRQs/ERQs)
- If a question is outside the AKUEB syllabus, politely say so`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      max_tokens: 1024,
    })

    const reply = response.choices[0]?.message?.content || 'Sorry, I could not process your question.'
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({ reply: 'Sorry, I could not process your question. Please try again.' }, { status: 500 })
  }
}