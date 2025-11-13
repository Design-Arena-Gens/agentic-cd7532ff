import NLPInput from '@/components/NLPInput'
import { CalendarWidget, NewsWidget, SmartHomeWidget, SystemStatusWidget, WidgetGrid } from '@/components/widgets'

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="bg-surface/70 border border-white/5 rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-3">Hello, I am JARVIS</h1>
        <NLPInput />
      </div>
      <WidgetGrid>
        <CalendarWidget />
        <NewsWidget />
        <SystemStatusWidget />
        <SmartHomeWidget />
      </WidgetGrid>
    </div>
  )
}
