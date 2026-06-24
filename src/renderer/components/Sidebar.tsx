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
    <div className="w-64 bg-slate-100 dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-300 dark:border-slate-700">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          DiskOH
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Disk Space Analyzer
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Drives
        </h2>

        <div className="space-y-2">
          {drives.map((drive) => (
            <button
              key={drive.letter}
              onClick={() => onSelectDrive(drive.letter)}
              className={`w-full text-left p-3 rounded-lg transition flex items-center gap-2 ${
                selectedDrive === drive.letter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              } ${scanning ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={scanning}
            >
              <HardDrive size={18} />
              <div className="flex-1">
                <div className="font-medium">{drive.name}</div>
                <div className="text-xs opacity-75">
                  {formatBytes(drive.free)} free
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-300 dark:border-slate-700">
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
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
