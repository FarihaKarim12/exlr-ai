import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groqApiKey = process.env.GROQ_API_KEY
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null

function buildFallbackPlan(subjects: string[], examDate: string, hoursPerDay: number) {
  return Array.from({ length: 8 }, (_, index) => {
    const weekNumber = index + 1
    const focus = weekNumber <= 2 ? 'Foundation' : weekNumber <= 5 ? 'Practice' : 'Revision'
    const tasks = subjects.flatMap((subject) => [
      `${subject}: review key notes`,
      `${subject}: solve 10 practice questions`,
    ])

    return {
      day: `Week ${weekNumber} - ${focus}`,
      focus,
      tasks: tasks.slice(0, Math.max(4, Math.min(8, hoursPerDay + 2))),
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const grade = body.grade || '10'
    const rawSubjects = Array.isArray(body.subjects)
      ? body.subjects
      : typeof body.subjects === 'string'
        ? body.subjects.split(',').map((subject: string) => subject.trim()).filter(Boolean)
        : ['Mathematics']
    const examDate = body.examDate || '3 months from now'
    const hoursPerDay = Number(body.hoursPerDay) || 3

    if (!groq) {
      return NextResponse.json({ plan: buildFallbackPlan(rawSubjects, examDate, hoursPerDay) })
    }

    const prompt = `Create a detailed week-by-week study plan for an AKUEB student with these details:

Grade: ${grade}
Subjects: ${rawSubjects.join(', ')}
Study hours per day: ${hoursPerDay}
${examDate ? `Exam date: ${examDate}` : 'Exam date: approximately 3 months from now'}

Create a 8-week study plan that:
1. Covers all subjects systematically
2. Allocates more time to harder subjects
3. Includes revision weeks before the exam
4. Balances daily study hours across subjects
5. Includes tips for each subject

Return ONLY a valid JSON array with objects in this shape:
[{"day":"Week 1 - Foundation","focus":"Foundation","tasks":["Mathematics: review key notes","Physics: solve practice questions"]}]

Rules:
- Be specific about the topics to cover
- Reference AKUEB syllabus topics
- Return ONLY valid JSON, no markdown, no extra text`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content || '[]'
    let plan = []
    try {
      const cleaned = content.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      plan = Array.isArray(parsed) ? parsed : []
    } catch (parseErr) {
      console.error('Failed to parse study plan JSON:', parseErr, 'Raw content:', content)
    }

    return NextResponse.json({ plan: plan.length > 0 ? plan : buildFallbackPlan(rawSubjects, examDate, hoursPerDay) })
  } catch (err) {
    console.error('Study plan error:', err)
    return NextResponse.json({ plan: buildFallbackPlan(['Mathematics'], '3 months from now', 3) })
  }
}