import { Moon, Sun, X } from 'lucide-react'

interface SettingsPanelProps {
  darkMode: boolean
  onDarkModeChange: (enabled: boolean) => void
  onClose: () => void
}

export function SettingsPanel({
  darkMode,
  onDarkModeChange,
  onClose,
}: SettingsPanelProps) {
  return (
    <div className="w-80 bg-slate-100 dark:bg-slate-900 border-l border-slate-300 dark:border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Settings
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Appearance
            </h3>
            <button
              onClick={() => onDarkModeChange(!darkMode)}
              className="w-full flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            >
              {darkMode ? (
                <>
                  <Moon size={20} />
                  <span>Dark Mode: ON</span>
                </>
              ) : (
                <>
                  <Sun size={20} />
                  <span>Light Mode: ON</span>
                </>
              )}
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Updates
            </h3>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Check for Updates
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Last checked: never
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              About
            </h3>
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>DiskOH</strong> v0.1.0
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Modern disk space analyzer for Windows
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
