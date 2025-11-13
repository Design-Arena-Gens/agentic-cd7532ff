"use client"
import { useState } from 'react'
import { encrypt, decrypt } from '@/lib/crypto'

export default function SettingsPanel() {
  const [pass, setPass] = useState('')
  const [status, setStatus] = useState('')

  const saveEncrypted = async () => {
    try {
      const secret = await encrypt(pass, { preferences: { theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' } })
      localStorage.setItem('jarvis_secure', secret)
      setStatus('Saved securely')
    } catch { setStatus('Failed to save') }
  }

  const loadEncrypted = async () => {
    try {
      const raw = localStorage.getItem('jarvis_secure')
      if (!raw) return setStatus('Nothing saved')
      const data = await decrypt(pass, raw)
      setStatus('Loaded: ' + JSON.stringify(data))
    } catch { setStatus('Failed to load') }
  }

  return (
    <div className="bg-surface/70 border border-white/5 rounded-lg p-4 space-y-2">
      <h2 className="text-sm tracking-widest uppercase text-white/60">Secure Preferences</h2>
      <div className="flex gap-2">
        <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="Passphrase" className="bg-black/20 rounded px-3 py-2"/>
        <button onClick={saveEncrypted} className="bg-primary text-black rounded px-3">Encrypt & Save</button>
        <button onClick={loadEncrypted} className="bg-white/20 rounded px-3">Load</button>
      </div>
      <p className="text-xs text-white/60">{status}</p>
    </div>
  )
}
