import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    // Mock response with basic intent parsing
    const lower = String(query || '').toLowerCase()
    let reply = 'Acknowledged.'
    const actions: any[] = []
    if (lower.includes('turn on') && lower.includes('light')) {
      reply = 'Turning on the lights.'
      actions.push({ type: 'device', payload: { id: 'lights', on: true } })
    } else if (lower.includes('weather')) {
      reply = 'It looks like a great day. High of 24?C.'
    } else if (lower.includes('news')) {
      reply = 'Fetching the latest headlines for you.'
    }
    return new Response(JSON.stringify({ reply, actions }), { headers: { 'Content-Type': 'application/json' } })
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are JARVIS, a proactive assistant. Respond concisely and include actionable intents as JSON when relevant.' },
          { role: 'user', content: String(query) }
        ],
        temperature: 0.4,
      })
    })
    const json = await resp.json()
    const reply = json.choices?.[0]?.message?.content || 'OK.'
    return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ reply: 'There was an error contacting the AI service.' }), { headers: { 'Content-Type': 'application/json' } })
  }
}
