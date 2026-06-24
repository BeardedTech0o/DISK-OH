import { DriveInfo, FolderInfo } from '../../shared/types'
import { X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface ComparisonViewProps {
  drives: DriveInfo[]
  scannedData: Map<string, FolderInfo>
  onClose: () => void
}

export function ComparisonView({ drives, scannedData, onClose }: ComparisonViewProps) {
  const scannedDrives = Array.from(scannedData.entries())

  const chartData = scannedDrives.map(([drive, data]) => {
    const driveInfo = drives.find(d => d.letter === drive)
    return {
      name: drive,
      used: driveInfo?.used || 0,
      free: driveInfo?.free || 0,
      scanned: data.size,
    }
  })

  const pieData = drives
    .filter(d => scannedData.has(d.letter))
    .map(drive => ({
      name: drive.name,
      value: drive.used,
    }))

  const COLORS = ['#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b']

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Drive Comparison
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Storage Usage
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: any) => formatBytes(value)}
                />
                <Legend />
                <Bar dataKey="used" fill="#ef4444" name="Used" />
                <Bar dataKey="free" fill="#34d399" name="Free" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {pieData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Used Space Distribution
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatBytes(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatBytes(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Drive Details
          </h3>
          <div className="grid gap-4">
            {drives.map(drive => {
              const data = scannedData.get(drive.letter)
              const percentage = ((drive.used / drive.total) * 100).toFixed(1)

              return (
                <div key={drive.letter} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{drive.name}</h4>
                    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                      {percentage}% used
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${Math.min(parseInt(percentage), 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">Used</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatBytes(drive.used)}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">Free</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatBytes(drive.free)}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">Total</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatBytes(drive.total)}</p>
                    </div>
                  </div>

                  {data && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                      {data.children.length} folders scanned
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
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
