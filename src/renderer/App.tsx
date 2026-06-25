import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Treemap } from './components/Treemap'
import { SettingsPanel } from './components/SettingsPanel'
import { ComparisonView } from './components/ComparisonView'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { DriveInfo, FolderInfo, ScanProgress } from '../shared/types'
import './App.css'

function App() {
  const [drives, setDrives] = useState<DriveInfo[]>([])
  const [drivesLoaded, setDrivesLoaded] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState<string>('')
  const [folderData, setFolderData] = useState<FolderInfo | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [scannedData, setScannedData] = useState<Map<string, FolderInfo>>(new Map())
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    loadDrives()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!drivesLoaded) {
        setError('Failed to load drives. Please check your connection.')
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [drivesLoaded])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  async function loadDrives() {
    try {
      const driveList = await window.electron.getDrives()
      setDrives(driveList)
      setDrivesLoaded(true)
      if (driveList.length > 0) {
        setSelectedDrive(driveList[0].letter)
      }
    } catch (err) {
      setDrivesLoaded(true)
      setError('Failed to load drives. Make sure the app has administrator privileges.')
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
      setScannedData(prev => new Map(prev).set(drive, data))
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
      <div className="relative flex h-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
        {drivesLoaded ? (
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
        ) : (
          <div className="w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        )}

        <main className="flex-1 flex flex-col min-w-0">
          {!drivesLoaded ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="text-red-600 dark:text-red-400 text-4xl mb-4">!</div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 p-4 mx-4 mt-4 rounded-lg flex items-center gap-3">
                  <span className="text-lg">⚠</span>
                  <div className="flex-1">
                    <p>{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-lg cursor-pointer hover:opacity-75"
                  >
                    ×
                  </button>
                </div>
              )}

              {scanning && scanProgress && (
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-2">
                      Scanning… {scanProgress.current.toLocaleString()} folders
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="indeterminate-bar h-2 rounded-full bg-blue-600" />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 truncate">
                      {scanProgress.currentPath}
                    </div>
                  </div>
                </div>
              )}

              {showComparison ? (
                <ComparisonView
                  drives={drives}
                  scannedData={scannedData}
                  onClose={() => setShowComparison(false)}
                />
              ) : folderData ? (
                <div className="flex-1 flex flex-col min-h-0">
                  <Treemap
                    data={folderData}
                    driveTotal={drives.find((d) => d.letter === selectedDrive)?.total}
                  />
                  {scannedData.size > 1 && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => setShowComparison(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Compare {scannedData.size} Drives
                      </button>
                    </div>
                  )}
                </div>
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
            </>
          )}
        </main>

        {showSettings && (
          <>
            <div
              className="absolute inset-0 bg-black/30 z-10"
              onClick={() => setShowSettings(false)}
            />
            <div className="absolute right-0 top-0 h-full z-20 shadow-2xl">
              <SettingsPanel
                darkMode={darkMode}
                onDarkModeChange={setDarkMode}
                onClose={() => setShowSettings(false)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
