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

Format the notes as follows:
1. Brief introduction (2-3 sentences)
2. Key concepts (list the main points)
3. Important definitions
4. Key formulas or facts (if applicable)
5. Common exam questions on this topic
6. Quick revision summary

Rules:
- Keep it relevant to the AKUEB syllabus
- Use simple, clear language for SSC/HSSC students
- Do not use markdown formatting like ** or ##
- Use plain numbered lists and simple dashes for bullet points
- Be concise but comprehensive`

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