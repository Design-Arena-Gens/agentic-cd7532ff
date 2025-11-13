"use client"
export default function ThemeToggle() {
  const toggle = () => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark')
  }
  return (
    <button aria-label="Toggle theme" onClick={toggle} className="rounded bg-surface px-3 py-1 text-sm hover:bg-white/10">
      Theme
    </button>
  )
}
