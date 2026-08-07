import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { topic, subject, grade } = await req.json()

    const prompt = `Generate clear, structured study notes for an AKUEB student on the following topic:

Topic: ${topic}
${subject ? `Subject: ${subject}` : ''}
${grade ? `Grade: ${grade}` : ''}

Format the notes as plain text with this structure:
1. Start with a main title on its own line.
2. Use numbered headings like 1. Introduction, 2. Key Concepts, 3. Important Definitions, 4. Formulas, 5. Exam Tips, 6. Summary.
3. Under each heading, use bullet points and short numbered subpoints.
4. Make only the heading text bold.
5. Do not use hashtags or markdown headings like # or ##.
6. Keep the content concise, exam-focused, and relevant to the AKUEB syllabus.

Do not include any extra commentary outside the notes.`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    })

    const notes = response.choices[0]?.message?.content || 'Could not generate notes. Please try again.'
    return NextResponse.json({ notes })
  } catch (err) {
    console.error('AI notes error:', err)
    return NextResponse.json({ notes: 'Sorry, something went wrong. Please try again.' }, { status: 500 })
  }
}