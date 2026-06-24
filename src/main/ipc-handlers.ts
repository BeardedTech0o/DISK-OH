import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../shared/constants.js'
import { scanDrive } from './scanner.js'
import { getDrives } from './drive-utils.js'
import { deleteFile } from './file-ops.js'

export function setupIPCHandlers() {
  ipcMain.handle(IPC_CHANNELS.GET_DRIVES, async () => {
    try {
      return getDrives()
    } catch (err) {
      console.error('Error getting drives:', err)
      return []
    }
  })

  ipcMain.handle(
    IPC_CHANNELS.SCAN_DRIVE,
    async (event, drive: string | unknown) => {
      // Input validation
      if (typeof drive !== 'string') {
        throw new Error('Invalid drive parameter')
      }

      if (!/^[A-Z]:?$/.test(drive.toUpperCase())) {
        throw new Error('Invalid drive letter')
      }

      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        throw new Error('Window not found')
      }

      try {
        return await scanDrive(drive, (progress) => {
          window.webContents.send(IPC_CHANNELS.SCAN_PROGRESS, progress)
        })
      } catch (err) {
        console.error('Scan error:', err)
        throw err
      }
    }
  )

  ipcMain.handle(
    IPC_CHANNELS.DELETE_FILE,
    async (_event, filePath: string | unknown) => {
      // Input validation
      if (typeof filePath !== 'string') {
        throw new Error('Invalid path parameter')
      }

      if (filePath.length === 0 || filePath.length > 260) {
        throw new Error('Invalid path length')
      }

      // Prevent deletion of critical system paths
      const forbiddenPaths = [
        'C:\\Windows',
        'C:\\Program Files',
        'C:\\Program Files (x86)',
        'C:\\ProgramData',
        'C:\\Users',
      ]

      const normalizedPath = filePath.toUpperCase().replace(/\//g, '\\')
      if (forbiddenPaths.some(fp => normalizedPath.startsWith(fp))) {
        throw new Error('Cannot delete system directory')
      }

      try {
        return await deleteFile(filePath)
      } catch (err) {
        console.error('Delete error:', err)
        throw err
      }
    }
  )
}
