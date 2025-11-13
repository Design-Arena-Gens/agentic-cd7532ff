"use client"
import { useEffect, useMemo, useState } from 'react'
import { Power, Cpu, Server, ThermometerSun, Newspaper } from 'lucide-react'
import Link from 'next/link'

export function WidgetGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>
}

export function WidgetCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-surface/70 border border-white/5 rounded-lg p-4 fade-in">
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-sm tracking-widest uppercase text-white/60">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  )
}

export function SmartHomeWidget() {
  const [devices, setDevices] = useState([
    { id: 'lights', name: 'Living Room Lights', on: false, icon: <Power size={16}/> },
    { id: 'thermostat', name: 'Thermostat', on: true, icon: <ThermometerSun size={16}/> },
  ])
  return (
    <WidgetCard title="Smart Home">
      <div className="space-y-2">
        {devices.map(d => (
          <label key={d.id} className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
            <span className="flex items-center gap-2">{d.icon}{d.name}</span>
            <input
              type="checkbox"
              role="switch"
              aria-checked={d.on}
              checked={d.on}
              onChange={() => {
                setDevices(prev => prev.map(x => x.id === d.id ? { ...x, on: !x.on } : x))
                addInteraction({ type: 'device_toggle', deviceId: d.id, newState: !d.on, ts: Date.now() })
              }}
              className="h-5 w-10"
            />
          </label>
        ))}
      </div>
    </WidgetCard>
  )
}

export function SystemStatusWidget() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 2000); return () => clearInterval(id) }, [])
  const mem = useMemo(() => (performance as any).memory?.usedJSHeapSize || 0, [now])
  return (
    <WidgetCard title="System Status">
      <ul className="text-sm grid grid-cols-2 gap-2">
        <li className="bg-black/20 rounded p-3 flex items-center gap-2"><Cpu size={16}/> FPS: {Math.round(1/(performance.now()%16/1000)||60)}</li>
        <li className="bg-black/20 rounded p-3 flex items-center gap-2"><Server size={16}/> Mem: {Math.round(mem/1024/1024)} MB</li>
      </ul>
    </WidgetCard>
  )
}

export function CalendarWidget() {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const days = Array.from({ length: end.getDate() }, (_, i) => i + 1)
  return (
    <WidgetCard title="Calendar" action={<Link className="text-xs text-primary" href="#">Open</Link>}>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-xs text-white/50">{d}</div>)}
        {Array.from({length: start.getDay()}).map((_, i) => <div key={i}></div>)}
        {days.map(d => (
          <div key={d} className={`rounded p-2 text-sm ${d===today.getDate()? 'bg-primary/20 ring-1 ring-primary/40':''}`}>{d}</div>
        ))}
      </div>
    </WidgetCard>
  )
}

export function NewsWidget() {
  const [news, setNews] = useState<{title: string; url: string}[]>([])
  useEffect(() => { (async () => {
    try {
      const res = await fetch('/api/news')
      const json = await res.json()
      setNews(json.items || [])
    } catch {}
  })() }, [])
  return (
    <WidgetCard title="News">
      <ul className="space-y-2 text-sm">
        {news.map((n, i) => (
          <li key={i}>
            <a className="text-primary hover:underline" href={n.url} target="_blank" rel="noreferrer">
              <Newspaper className="inline mr-2" size={14}/>{n.title}
            </a>
          </li>
        ))}
        {news.length===0 && <li className="text-white/50">No stories loaded.</li>}
      </ul>
    </WidgetCard>
  )
}

function addInteraction(event: any) {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem('jarvis_interactions')
  const arr = raw ? JSON.parse(raw) : []
  arr.push(event)
  localStorage.setItem('jarvis_interactions', JSON.stringify(arr))
}
