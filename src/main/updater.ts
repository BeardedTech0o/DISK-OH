import { BrowserWindow, ipcMain } from 'electron'
import { IPC_CHANNELS } from '../shared/constants.js'
import { execSync } from 'child_process'

let autoUpdater: any

export async function setupUpdater() {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  try {
    if (!autoUpdater) {
      const mod = await import('electron-updater')
      autoUpdater = mod.autoUpdater
    }
  } catch (err) {
    console.error('Failed to load electron-updater:', err)
    return
  }

  if (!autoUpdater) {
    console.warn('autoUpdater not available')
    return
  }

  autoUpdater.allowDowngrade = false
  autoUpdater.allowPrerelease = false

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for app updates...')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version)

    const window = BrowserWindow.getAllWindows()[0]
    if (window) {
      window.webContents.send(IPC_CHANNELS.UPDATES_AVAILABLE, {
        type: 'app',
        version: info.version,
        message: `Version ${info.version} is available`,
      })
    }
  })

  autoUpdater.on('update-not-available', () => {
    console.log('App is up to date')
  })

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err)
  })

  autoUpdater.on('download-progress', (progress) => {
    const window = BrowserWindow.getAllWindows()[0]
    if (window) {
      window.webContents.send('update-progress', {
        percentage: Math.round(progress.percent),
      })
    }
  })

  autoUpdater.on('update-downloaded', () => {
    const window = BrowserWindow.getAllWindows()[0]
    if (window) {
      window.webContents.send('update-ready', {
        message: 'Update ready. Will install on next restart.',
      })
    }
  })

  // Check for updates on startup
  autoUpdater.checkForUpdatesAndNotify()

  // Check periodically (every 6 hours)
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify()
  }, 6 * 60 * 60 * 1000)
}

export function checkNpmUpdates(): {
  available: boolean
  count: number
  updates: string[]
} {
  try {
    const output = execSync('npm outdated --json', {
      encoding: 'utf-8',
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    const outdated = JSON.parse(output)
    const packages = Object.keys(outdated)

    return {
      available: packages.length > 0,
      count: packages.length,
      updates: packages,
    }
  } catch (err) {
    console.error('Failed to check npm updates:', err)
    return {
      available: false,
      count: 0,
      updates: [],
    }
  }
}

export function installUpdates(): void {
  try {
    // Run npm install with timeout
    execSync('npm install', {
      cwd: process.resourcesPath,
      timeout: 60000,
      stdio: 'inherit',
    })
  } catch (err) {
    throw new Error(`Failed to install updates: ${err}`)
  }
}

ipcMain.handle(IPC_CHANNELS.CHECK_UPDATES, async () => {
  return checkNpmUpdates()
})
