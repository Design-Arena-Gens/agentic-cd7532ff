"use client"
export default function FontSizer() {
  const setSize = (delta: number) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const current = parseFloat(getComputedStyle(root).getPropertyValue('--font-size') || '16')
    root.style.setProperty('--font-size', `${Math.max(12, Math.min(22, current + delta))}px`)
  }
  return (
    <div aria-label="Font size" className="flex items-center gap-2">
      <button onClick={() => setSize(-1)} className="rounded bg-surface px-2 py-1" aria-label="Decrease font size">A-</button>
      <button onClick={() => setSize(1)} className="rounded bg-surface px-2 py-1" aria-label="Increase font size">A+</button>
    </div>
  )
}
