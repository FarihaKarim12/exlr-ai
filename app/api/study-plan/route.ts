import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { grade, subjects, examDate, hoursPerDay } = await req.json()

    const prompt = `Create a detailed week-by-week study plan for an AKUEB student with these details:

Grade: ${grade}
Subjects: ${subjects.join(', ')}
Study hours per day: ${hoursPerDay}
${examDate ? `Exam date: ${examDate}` : 'Exam date: approximately 3 months from now'}

Create a 8-week study plan that:
1. Covers all subjects systematically
2. Allocates more time to harder subjects
3. Includes revision weeks before the exam
4. Balances daily study hours across subjects
5. Includes tips for each subject

Format it clearly week by week like:
WEEK 1 - Foundation
→ Monday: Subject - Topic (X hours)

→ Tuesday: Subject - Topic (X hours)
etc.

Rules:
- Be specific about which topics to cover each day
- Reference AKUEB syllabus topics
- Do not use markdown formatting like ** or ##
- Leave a line after each day
- Keep it practical and achievable
- Include a weekly goal for each week`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    })

    const plan = response.choices[0]?.message?.content || 'Could not generate plan. Please try again.'
    return NextResponse.json({ plan })
  } catch (err) {
    console.error('Study plan error:', err)
    return NextResponse.json({ plan: 'Sorry, something went wrong. Please try again.' }, { status: 500 })
  }
}