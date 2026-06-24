import { Treemap as RechartsTreemap, Tooltip, ResponsiveContainer } from 'recharts'
import { FolderInfo } from '../../shared/types'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

interface TreemapProps {
  data: FolderInfo
}

export function Treemap({ data }: TreemapProps) {
  const [history, setHistory] = useState<FolderInfo[]>([data])
  const current = history[history.length - 1]

  const chartData = current.children
    .sort((a, b) => b.size - a.size)
    .slice(0, 50)
    .map((child) => ({
      name: child.name,
      size: child.size,
      fill: getColor(child.size, current.children),
      data: child,
    }))

  function handleClick(data: any) {
    if (data.data && data.data.children && data.data.children.length > 0) {
      setHistory([...history, data.data])
    }
  }

  function handleBack() {
    if (history.length > 1) {
      setHistory(history.slice(0, -1))
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex items-center gap-4 mb-6">
        {history.length > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold">
            {current.path}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {current.children.length} folders • {formatBytes(current.size)}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsTreemap
            data={chartData}
            dataKey="size"
            stroke="#e2e8f0"
            fill="#8884d8"
            onClick={(state) => handleClick(state)}
          >
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              formatter={(value: any) => formatBytes(value)}
              labelStyle={{ color: '#fff' }}
            />
          </RechartsTreemap>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function getColor(size: number, all: FolderInfo[]): string {
  const max = Math.max(...all.map((f) => f.size))
  const ratio = size / max
  if (ratio > 0.7) return '#ef4444'
  if (ratio > 0.4) return '#f97316'
  if (ratio > 0.2) return '#eab308'
  return '#84cc16'
}
