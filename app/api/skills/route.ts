export const runtime = 'edge'

export async function GET() {
  const skills = [
    { id: 'calendar-sync', name: 'Calendar Sync', description: 'Sync with your Google Calendar.' },
    { id: 'smart-home-scenes', name: 'Smart Home Scenes', description: 'Create scenes for lights and thermostat.' },
    { id: 'daily-briefing', name: 'Daily Briefing', description: 'Get morning news, weather, and agenda.' }
  ]
  return new Response(JSON.stringify({ skills }), { headers: { 'Content-Type': 'application/json' } })
}
