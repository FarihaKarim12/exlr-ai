import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { mastery, profile } = await req.json()

    const weakTopics = mastery.filter((m: any) => m.status === 'red')
    const partialTopics = mastery.filter((m: any) => m.status === 'amber')
    const masteredTopics = mastery.filter((m: any) => m.status === 'green')

    const prompt = `You are an expert AKUEB tutor. Based on this student's quiz performance, create a personalised learning path.

Student Profile:
- Grade: ${profile?.grade}
- Group: ${profile?.student_group}

Quiz Performance Analysis:
- Weak topics (need urgent attention): ${weakTopics.map((t: any) => `${t.topic} (${t.subject}, ${Math.round(t.score_percent)}%)`).join(', ') || 'None'}
- Partial topics (need more practice): ${partialTopics.map((t: any) => `${t.topic} (${t.subject}, ${Math.round(t.score_percent)}%)`).join(', ') || 'None'}
- Mastered topics: ${masteredTopics.map((t: any) => `${t.topic} (${t.subject})`).join(', ') || 'None'}

Create a focused 4-week learning path that:
1. Prioritises weak topics first
2. Then reinforces partial topics
3. Suggests specific daily activities
4. Recommends practice strategies for each weak topic
5. Gives estimated time per topic

Format it clearly week by week. Be specific and actionable.
Do not use markdown formatting like ** or ##. Use plain text with numbered lists.`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    })

    const path = response.choices[0]?.message?.content || 'Could not generate learning path.'
    return NextResponse.json({ path })
  } catch (err) {
    console.error('Learning path error:', err)
    return NextResponse.json({ path: 'Sorry, something went wrong.' }, { status: 500 })
  }
}