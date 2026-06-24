import { DriveInfo } from '../../shared/types'
import { Settings, HardDrive } from 'lucide-react'

interface SidebarProps {
  drives: DriveInfo[]
  selectedDrive: string
  onSelectDrive: (drive: string) => void
  scanning: boolean
  onSettingsClick: () => void
}

export function Sidebar({
  drives,
  selectedDrive,
  onSelectDrive,
  scanning,
  onSettingsClick,
}: SidebarProps) {
  return (
    <div className="w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          DiskOH
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Disk Space Analyzer
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 px-2">
          Your Drives
        </h2>

        <div className="space-y-2">
          {drives.map((drive) => {
            const usagePercent = ((drive.used / drive.total) * 100).toFixed(0)
            const isSelected = selectedDrive === drive.letter

            return (
              <button
                key={drive.letter}
                onClick={() => onSelectDrive(drive.letter)}
                disabled={scanning}
                className={`w-full text-left p-4 rounded-lg transition group ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                } ${scanning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <HardDrive
                    size={20}
                    className={isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{drive.name}</div>
                    <div className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-500'}`}>
                      {usagePercent}% used
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isSelected ? 'bg-white' : 'bg-blue-600 dark:bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(parseInt(usagePercent), 100)}%` }}
                    />
                  </div>
                </div>

                <div className={`flex justify-between text-xs ${isSelected ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                  <span>{formatBytes(drive.used)} used</span>
                  <span>{formatBytes(drive.free)} free</span>
                </div>

                <div className={`text-xs mt-1 font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-500'}`}>
                  {formatBytes(drive.total)} total
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition font-medium"
        >
          <Settings size={18} />
          Settings
        </button>
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
