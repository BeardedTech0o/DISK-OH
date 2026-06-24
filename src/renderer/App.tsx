import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Treemap } from './components/Treemap'
import { SettingsPanel } from './components/SettingsPanel'
import { DriveInfo, FolderInfo } from '../shared/types'
import './App.css'

function App() {
  const [drives, setDrives] = useState<DriveInfo[]>([])
  const [selectedDrive, setSelectedDrive] = useState<string>('')
  const [folderData, setFolderData] = useState<FolderInfo | null>(null)
  const [scanning, setScanning] = useState(false)
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
    const driveList = await window.electron.getDrives()
    setDrives(driveList)
    if (driveList.length > 0) {
      setSelectedDrive(driveList[0].letter)
    }
  }

  async function scanDrive(drive: string) {
    setScanning(true)
    try {
      window.electron.onScanProgress((progress) => {
        console.log(`Scanning: ${progress.percentage}%`)
      })

      const data = await window.electron.scanDrive(drive + ':')
      setFolderData(data)
    } catch (err) {
      console.error('Scan failed:', err)
    } finally {
      setScanning(false)
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
          {folderData ? (
            <Treemap data={folderData} />
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-4">
                  Select a drive to analyze
                </p>
                {selectedDrive && (
                  <button
                    onClick={() => scanDrive(selectedDrive)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Scan {selectedDrive}:
                  </button>
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
