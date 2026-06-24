import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Treemap } from './components/Treemap'
import { SettingsPanel } from './components/SettingsPanel'
import { DriveInfo, FolderInfo, ScanProgress } from '../shared/types'
import './App.css'

function App() {
  const [drives, setDrives] = useState<DriveInfo[]>([])
  const [selectedDrive, setSelectedDrive] = useState<string>('')
  const [folderData, setFolderData] = useState<FolderInfo | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadDrives()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  async function loadDrives() {
    try {
      const driveList = await window.electron.getDrives()
      setDrives(driveList)
      if (driveList.length > 0) {
        setSelectedDrive(driveList[0].letter)
      }
    } catch (err) {
      setError('Failed to load drives')
      console.error('Load drives error:', err)
    }
  }

  async function scanDrive(drive: string) {
    setError(null)
    setScanning(true)
    setScanProgress(null)

    try {
      window.electron.onScanProgress((progress: ScanProgress) => {
        setScanProgress(progress)
      })

      const data = await window.electron.scanDrive(drive + ':')
      setFolderData(data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Scan failed: ${errorMsg}`)
      console.error('Scan error:', err)
    } finally {
      setScanning(false)
      setScanProgress(null)
    }
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
        <Sidebar
          drives={drives}
          selectedDrive={selectedDrive}
          onSelectDrive={(drive) => {
            setSelectedDrive(drive)
            scanDrive(drive)
          }}
          scanning={scanning}
          onSettingsClick={() => setShowSettings(!showSettings)}
        />

        <main className="flex-1 flex flex-col">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 p-4 mx-4 mt-4 rounded-lg">
              {error}
            </div>
          )}

          {scanning && scanProgress && (
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2">
                    Scanning: {scanProgress.percentage}%
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${scanProgress.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    {scanProgress.currentPath}
                  </div>
                </div>
              </div>
            </div>
          )}

          {folderData ? (
            <Treemap data={folderData} />
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                {scanning ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                      Scanning {selectedDrive}:
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">
                      Select a drive to analyze
                    </p>
                    {selectedDrive && (
                      <button
                        onClick={() => scanDrive(selectedDrive)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Scan {selectedDrive}:
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </main>

        {showSettings && (
          <SettingsPanel
            darkMode={darkMode}
            onDarkModeChange={setDarkMode}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  )
}

export default App
