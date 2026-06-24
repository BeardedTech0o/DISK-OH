import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../shared/constants.js'
import { scanDrive } from './scanner.js'
import { getDrives } from './drive-utils.js'
import { deleteFile } from './file-ops.js'

export function setupIPCHandlers() {
  ipcMain.handle(IPC_CHANNELS.GET_DRIVES, async () => {
    return getDrives()
  })

  ipcMain.handle(IPC_CHANNELS.SCAN_DRIVE, async (event, drive: string) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (!window) return

    return scanDrive(drive, (progress) => {
      window.webContents.send(IPC_CHANNELS.SCAN_PROGRESS, progress)
    })
  })

  ipcMain.handle(IPC_CHANNELS.DELETE_FILE, async (_event, path: string) => {
    return deleteFile(path)
  })
}
