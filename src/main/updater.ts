import { autoUpdater } from 'electron-updater'
import { BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../shared/constants.js'

export function checkUpdates() {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', () => {
    const window = BrowserWindow.getAllWindows()[0]
    if (window) {
      window.webContents.send(IPC_CHANNELS.UPDATES_AVAILABLE, {
        type: 'app',
        message: 'New version available',
      })
    }
  })

  autoUpdater.on('update-not-available', () => {
    console.log('App is up to date')
  })

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
  })
}
