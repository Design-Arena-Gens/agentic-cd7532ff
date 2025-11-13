import './globals.css'
import { ReactNode } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import FontSizer from '@/components/FontSizer'

export const metadata = {
  title: 'JARVIS Assistant',
  description: 'Proactive AI personal assistant',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-surface px-3 py-2 rounded">Skip to content</a>
        <header className="sticky top-0 z-50 backdrop-blur bg-background/70 border-b border-white/5">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-wide">JARVIS</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-primary">Dashboard</Link>
              <Link href="/learning" className="hover:text-primary">Learning Center</Link>
              <Link href="/skills" className="hover:text-primary">Skills</Link>
              <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <FontSizer />
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main id="main" className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}

// interactive components moved to client components
