import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { TestTypeTab } from '@/hooks/useDashboardStore'

interface ScoreCardProps {
  score: number
  testTypeTab: TestTypeTab
  label: string
}

export default function ScoreCard({
  score,
  testTypeTab,
  label,
}: ScoreCardProps) {
  return (
    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
      <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
      <div className="text-sm text-blue-600 font-medium">
        {testTypeTab === TestTypeTab.PRE_TEST ? 'Pre-test' : 'Post-test'}{' '}
        {label}
      </div>
    </div>
  )
}
