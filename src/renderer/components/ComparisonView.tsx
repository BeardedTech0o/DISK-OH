import { ComparisonData } from '../../shared/types'

interface ComparisonViewProps {
  data: ComparisonData[]
}

export function ComparisonView({ data }: ComparisonViewProps) {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-4">Drive Comparison</h2>
      <p className="text-slate-600 dark:text-slate-400">
        Comparison feature coming in Phase 4
      </p>
    </div>
  )
}
