import { Treemap as RechartsTreemap, Tooltip, ResponsiveContainer } from 'recharts'
import { FolderInfo } from '../../shared/types'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Folder, FileText } from 'lucide-react'

interface TreemapProps {
  data: FolderInfo
  /** Total capacity of the drive in bytes, for the "Of Drive" stat */
  driveTotal?: number
}

const LIGHT_COLORS = [
  '#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#f43f5e', '#8b5cf6', '#6366f1', '#14b8a6',
]

const DARK_COLORS = [
  '#60a5fa', '#22d3ee', '#2dd4bf', '#34d399', '#fbbf24',
  '#f87171', '#fb7185', '#a78bfa', '#818cf8', '#2ee7d5',
]

export function Treemap({ data, driveTotal }: TreemapProps) {
  const [history, setHistory] = useState<FolderInfo[]>([data])
  const current = history[history.length - 1]
  const isDark = document.documentElement.classList.contains('dark')
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS

  const sortedChildren = [...current.children].sort((a, b) => b.size - a.size)

  const chartData = sortedChildren.slice(0, 50).map((child, index) => ({
    name: child.name,
    size: child.size,
    fill: colors[index % colors.length],
    data: child,
  }))

  function drillInto(folder: FolderInfo) {
    if (folder.children && folder.children.length > 0) {
      setHistory([...history, folder])
    }
  }

  function handleBack() {
    if (history.length > 1) setHistory(history.slice(0, -1))
  }

  function jumpTo(index: number) {
    setHistory(history.slice(0, index + 1))
  }

  const ofDrive =
    driveTotal && driveTotal > 0
      ? ((current.size / driveTotal) * 100).toFixed(1) + '%'
      : data.size > 0
        ? ((current.size / data.size) * 100).toFixed(1) + '%'
        : '—'

  // Largest child size, used to scale the per-row bars
  const maxChildSize = sortedChildren.length > 0 ? sortedChildren[0].size : 0

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 p-4 sm:p-6 overflow-hidden">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {history.length > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition text-sm"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}
        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 flex-wrap min-w-0">
          {history.map((folder, i) => (
            <span key={i} className="flex items-center gap-1 min-w-0">
              {i > 0 && <ChevronRight size={14} className="flex-shrink-0" />}
              <button
                onClick={() => jumpTo(i)}
                className={`truncate max-w-[200px] hover:text-blue-600 dark:hover:text-blue-400 transition ${
                  i === history.length - 1 ? 'font-semibold text-slate-900 dark:text-white' : ''
                }`}
              >
                {folder.name || folder.path}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Stat cards — responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label="Size" value={formatBytes(current.size)} />
        <StatCard label="Folders" value={String(current.children.length)} />
        <StatCard label="Files" value={current.fileCount.toLocaleString()} />
        <StatCard label="Of Drive" value={ofDrive} />
      </div>

      {/* Compact treemap visual */}
      {chartData.length > 0 && (
        <div className="h-48 flex-shrink-0 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsTreemap
              data={chartData}
              dataKey="size"
              stroke={isDark ? '#0f172a' : '#ffffff'}
              fill="#8884d8"
              isAnimationActive={false}
              onClick={(state: any) => state?.data && drillInto(state.data)}
            >
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                formatter={(value: any) => formatBytes(value)}
                labelStyle={{ color: isDark ? '#fff' : '#000' }}
              />
            </RechartsTreemap>
          </ResponsiveContainer>
        </div>
      )}

      {/* Folder list — the TreeSize-style sortable breakdown */}
      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <span>Name</span>
          <span className="text-right w-28">Size</span>
          <span className="text-right w-16">Share</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sortedChildren.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No subfolders. This folder contains {current.fileCount.toLocaleString()} file
              {current.fileCount !== 1 ? 's' : ''} ({formatBytes(current.size)}).
            </div>
          ) : (
            sortedChildren.map((child, index) => {
              const share = current.size > 0 ? (child.size / current.size) * 100 : 0
              const barWidth = maxChildSize > 0 ? (child.size / maxChildSize) * 100 : 0
              const color = colors[index % colors.length]
              const hasChildren = child.children && child.children.length > 0

              return (
                <button
                  key={child.path}
                  onClick={() => drillInto(child)}
                  disabled={!hasChildren}
                  className={`w-full grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 text-left transition ${
                    hasChildren
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'
                      : 'cursor-default'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {hasChildren ? (
                        <Folder size={16} className="text-slate-400 flex-shrink-0" />
                      ) : (
                        <FileText size={16} className="text-slate-400 flex-shrink-0" />
                      )}
                      <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
                        {child.name}
                      </span>
                    </div>
                    {/* relative size bar */}
                    <div className="mt-1.5 ml-[18px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${barWidth}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                  <span className="text-right w-28 text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatBytes(child.size)}
                  </span>
                  <span className="text-right w-16 text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                    {share.toFixed(1)}%
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg min-w-0">
      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide truncate">
        {label}
      </p>
      <p className="text-lg font-bold truncate">{value}</p>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
