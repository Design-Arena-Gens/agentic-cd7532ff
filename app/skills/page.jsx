// @ts-nocheck
"use client"
import React, { useEffect, useState } from 'react'
import { Plus, Check } from 'lucide-react'

export default function SkillsPage() {
  const [available, setAvailable] = useState([])
  const [installed, setInstalled] = useState([])
  const [customName, setCustomName] = useState('')
  const [customCommand, setCustomCommand] = useState('')

  useEffect(() => { (async () => {
    const res = await fetch('/api/skills')
    const json = await res.json()
    setAvailable(json.skills || [])
    const raw = localStorage.getItem('jarvis_skills')
    setInstalled(raw ? JSON.parse(raw) : [])
  })() }, [])

  const install = (id) => {
    const next = Array.from(new Set([...(installed || []), id]))
    setInstalled(next)
    localStorage.setItem('jarvis_skills', JSON.stringify(next))
  }

  const addCustom = () => {
    if (!customName || !customCommand) return
    const id = `custom:${customName}`
    const skills = JSON.parse(localStorage.getItem('jarvis_custom_skills') || '{}')
    skills[id] = { name: customName, command: customCommand }
    localStorage.setItem('jarvis_custom_skills', JSON.stringify(skills))
    install(id)
    setCustomName(''); setCustomCommand('')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Skills Marketplace</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {available.map(s => (
          <div key={s.id} className="bg-surface/70 border border-white/5 rounded-lg p-4">
            <h3 className="font-medium">{s.name}</h3>
            <p className="text-sm text-white/70 mb-3">{s.description}</p>
            <button onClick={() => install(s.id)} className="text-sm bg-primary text-black rounded px-3 py-1">
              {installed.includes(s.id) ? <span className="inline-flex items-center gap-1"><Check size={16}/> Installed</span> : <span className="inline-flex items-center gap-1"><Plus size={16}/> Install</span>}
            </button>
          </div>
        ))}
      </section>

      <section className="bg-surface/70 border border-white/5 rounded-lg p-4">
        <h2 className="text-sm tracking-widest uppercase text-white/60 mb-3">Add Custom Skill</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input value={customName} onChange={(e)=>setCustomName(e.target.value)} placeholder="Skill name" className="bg-black/20 rounded px-3 py-2" />
          <input value={customCommand} onChange={(e)=>setCustomCommand(e.target.value)} placeholder={'Trigger phrase (e.g., "turn on office lights")'} className="bg-black/20 rounded px-3 py-2" />
          <button onClick={addCustom} className="bg-primary text-black rounded px-3 py-2">Add</button>
        </div>
        <p className="text-xs text-white/50 mt-2">Custom skills are stored locally and processed on-device for privacy.</p>
      </section>
    </div>
  )
}
