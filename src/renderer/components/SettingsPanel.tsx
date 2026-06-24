import { Moon, Sun, X, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'

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
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'uptodate'>('idle')

  async function handleCheckUpdates() {
    setCheckingUpdates(true)
    setUpdateStatus('checking')

    try {
      const result = await window.electron.checkUpdates()
      setUpdateStatus(result ? 'available' : 'uptodate')

      setTimeout(() => {
        setCheckingUpdates(false)
        setTimeout(() => setUpdateStatus('idle'), 3000)
      }, 1500)
    } catch (err) {
      setCheckingUpdates(false)
      setUpdateStatus('idle')
    }
  }

  return (
    <div className="w-96 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
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
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
              Appearance
            </h3>
            <button
              onClick={() => onDarkModeChange(!darkMode)}
              className="w-full flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            >
              {darkMode ? (
                <>
                  <Moon size={20} className="text-blue-600" />
                  <span className="font-medium">Dark Mode</span>
                  <span className="ml-auto text-xs font-semibold text-green-600 dark:text-green-400">ON</span>
                </>
              ) : (
                <>
                  <Sun size={20} className="text-amber-600" />
                  <span className="font-medium">Light Mode</span>
                  <span className="ml-auto text-xs font-semibold text-green-600 dark:text-green-400">ON</span>
                </>
              )}
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
              Updates
            </h3>
            <button
              onClick={handleCheckUpdates}
              disabled={checkingUpdates}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
            >
              {checkingUpdates ? 'Checking...' : 'Check for Updates'}
            </button>

            {updateStatus === 'checking' && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                <p className="text-sm text-blue-900 dark:text-blue-100">Checking for updates...</p>
              </div>
            )}

            {updateStatus === 'available' && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-900 dark:text-amber-100">Update available</p>
              </div>
            )}

            {updateStatus === 'uptodate' && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg flex items-center gap-2">
                <Check size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-900 dark:text-green-100">You are up to date</p>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
              Automatically checks on startup. Updates install on next launch.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
              About
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-slate-900 dark:text-white">DiskOH</p>
                  <p className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                    v0.1.0
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Modern disk space analyzer for Windows
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Built with
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Electron', 'React', 'TypeScript', 'Tailwind'].map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
