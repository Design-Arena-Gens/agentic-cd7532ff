import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F17',
        surface: '#111827',
        primary: '#60A5FA',
        secondary: '#34D399',
        accent: '#A78BFA'
      }
    }
  },
  plugins: []
} satisfies Config
