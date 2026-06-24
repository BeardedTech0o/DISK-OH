import { Treemap as RechartsTreemap, Tooltip, ResponsiveContainer } from 'recharts'
import { FolderInfo } from '../../shared/types'
import { useState } from 'react'
import { ChevronLeft, Folder } from 'lucide-react'

interface TreemapProps {
  data: FolderInfo
}

const LIGHT_COLORS = [
  '#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#f43f5e', '#8b5cf6', '#6366f1', '#14b8a6',
]

const DARK_COLORS = [
  '#60a5fa', '#22d3ee', '#2dd4bf', '#34d399', '#fbbf24',
  '#f87171', '#fb7185', '#a78bfa', '#818cf8', '#2ee7d5',
]

export function Treemap({ data }: TreemapProps) {
  const [history, setHistory] = useState<FolderInfo[]>([data])
  const current = history[history.length - 1]
  const isDark = document.documentElement.classList.contains('dark')

  const chartData = current.children
    .slice(0, 50)
    .map((child, index) => ({
      name: child.name,
      size: child.size,
      fill: isDark ? DARK_COLORS[index % DARK_COLORS.length] : LIGHT_COLORS[index % LIGHT_COLORS.length],
      data: child,
    }))

  function handleClick(clickedData: any) {
    if (clickedData.data && clickedData.data.children && clickedData.data.children.length > 0) {
      setHistory([...history, clickedData.data])
    }
  }

  function handleBack() {
    if (history.length > 1) {
      setHistory(history.slice(0, -1))
    }
  }

  const totalSize = current.size
  const percentage = ((current.size / data.size) * 100).toFixed(1)

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {history.length > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Folder size={24} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold truncate">
                {current.name || current.path}
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {current.path}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Size</p>
            <p className="text-xl font-bold">{formatBytes(totalSize)}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Folders</p>
            <p className="text-xl font-bold">{current.children.length}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Files</p>
            <p className="text-xl font-bold">{current.fileCount}</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Of Total</p>
            <p className="text-xl font-bold">{percentage}%</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsTreemap
            data={chartData}
            dataKey="size"
            stroke="#ffffff"
            fill="#8884d8"
            onClick={(state) => handleClick(state)}
          >
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: any) => formatBytes(value)}
              labelStyle={{ color: isDark ? '#fff' : '#000' }}
            />
          </RechartsTreemap>
        </ResponsiveContainer>
      </div>

      {current.children.length > 50 && (
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center">
          Showing top 50 of {current.children.length} folders
        </p>
      )}
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
