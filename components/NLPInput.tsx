"use client"
import { useEffect, useRef, useState } from 'react'
import { Mic, Send } from 'lucide-react'
import { z } from 'zod'

// Minimal browser speech types to satisfy TS
type SpeechRecognition = any
type SpeechRecognitionEvent = any

const ResponseSchema = z.object({
  reply: z.string(),
  actions: z.array(z.object({ type: z.string(), payload: z.any() })).optional(),
  suggestions: z.array(z.string()).optional()
})

export default function NLPInput({ onAction }: { onAction?: (action: { type: string; payload?: any }) => void }) {
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (SR) {
      const rec: SpeechRecognition = new SR()
      rec.lang = 'en-US'
      rec.continuous = false
      rec.interimResults = false
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = Array.from((e as any).results as any).map((r: any) => (r[0] as any).transcript).join(' ')
        setInput(transcript)
        setListening(false)
      }
      rec.onend = () => setListening(false)
      recognitionRef.current = rec
    }
  }, [])

  const startListening = () => {
    if (!recognitionRef.current) return
    setListening(true)
    recognitionRef.current.start()
  }

  const onSubmit = async () => {
    if (!input.trim()) return
    const res = await fetch('/api/nlp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input })
    })
    const json = await res.json()
    const parsed = ResponseSchema.safeParse(json)
    if (parsed.success) {
      if (parsed.data.actions) parsed.data.actions.forEach(a => onAction?.(a))
      speak(parsed.data.reply)
      addInteraction({ type: 'nlp', query: input, reply: parsed.data.reply, ts: Date.now() })
      setInput('')
    }
  }

  const speak = (text: string) => {
    if (typeof window === 'undefined') return
    const utter = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utter)
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        aria-label="Ask JARVIS"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        placeholder="Ask JARVIS anything?"
        className="flex-1 bg-surface rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
      />
      <button onClick={onSubmit} aria-label="Send" className="bg-primary text-black rounded p-2 hover:opacity-90">
        <Send size={18} />
      </button>
      <button onClick={startListening} aria-pressed={listening} aria-label="Voice input" className="bg-surface rounded p-2 hover:bg-white/10">
        <Mic size={18} />
      </button>
    </div>
  )
}

// lightweight telemetry for Learning Center
function addInteraction(event: any) {
  if (typeof window === 'undefined') return
  const raw = localStorage.getItem('jarvis_interactions')
  const arr = raw ? JSON.parse(raw) : []
  arr.push(event)
  localStorage.setItem('jarvis_interactions', JSON.stringify(arr))
}
