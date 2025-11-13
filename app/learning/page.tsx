"use client"
import { useEffect, useMemo, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'

export default function LearningCenter() {
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('jarvis_interactions')
    setData(raw ? JSON.parse(raw) : [])
  }, [])

  const byHour = useMemo(() => {
    const buckets: Record<string, number> = {}
    data.forEach(d => {
      const hour = new Date(d.ts).getHours()
      buckets[hour] = (buckets[hour] || 0) + 1
    })
    return Array.from({length: 24}, (_, h) => ({ hour: `${h}:00`, count: buckets[h] || 0 }))
  }, [data])

  const suggestions = useMemo(() => generateSuggestions(data), [data])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Learning Center</h1>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface/70 border border-white/5 rounded-lg p-4">
          <h2 className="text-sm tracking-widest uppercase text-white/60 mb-3">Interactions by Hour</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byHour}>
                <XAxis dataKey="hour" stroke="#9CA3AF"/>
                <YAxis stroke="#9CA3AF"/>
                <Tooltip/>
                <Line dataKey="count" stroke="#60A5FA" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-surface/70 border border-white/5 rounded-lg p-4">
          <h2 className="text-sm tracking-widest uppercase text-white/60 mb-3">Event Types</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregateByType(data)}>
                <XAxis dataKey="type" stroke="#9CA3AF"/>
                <YAxis stroke="#9CA3AF"/>
                <Tooltip/>
                <Bar dataKey="count" fill="#34D399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="bg-surface/70 border border-white/5 rounded-lg p-4">
        <h2 className="text-sm tracking-widest uppercase text-white/60 mb-3">Recommended Automations</h2>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="bg-black/20 rounded p-3 flex items-center justify-between">
              <span>{s.text}</span>
              <button className="text-sm bg-primary text-black rounded px-3 py-1">Enable</button>
            </li>
          ))}
          {suggestions.length===0 && <li className="text-white/50">Interact with the dashboard to generate insights.</li>}
        </ul>
      </section>
    </div>
  )
}

function aggregateByType(data: any[]) {
  const counts: Record<string, number> = {}
  data.forEach(d => { counts[d.type] = (counts[d.type] || 0) + 1 })
  return Object.entries(counts).map(([type, count]) => ({ type, count }))
}

function generateSuggestions(data: any[]): { text: string }[] {
  if (data.length < 5) return []
  const hours = data.map(d => new Date(d.ts).getHours())
  const night = hours.filter(h => h >= 20 || h <= 6).length
  const toggles = data.filter(d => d.type === 'device_toggle').length
  const nlp = data.filter(d => d.type === 'nlp').length
  const out: { text: string }[] = []
  if (night > data.length * 0.4) out.push({ text: 'Schedule Night Mode automation between 9pm and 6am.' })
  if (toggles > 3) out.push({ text: 'Create a routine to toggle lights with a single command.' })
  if (nlp > 3) out.push({ text: 'Add quick actions for your most frequent requests.' })
  return out
}
