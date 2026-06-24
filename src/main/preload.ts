import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/constants.js'

contextBridge.exposeInMainWorld('electron', {
  scanDrive: (drive: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SCAN_DRIVE, drive),
  onScanProgress: (callback: (progress: any) => void) =>
    ipcRenderer.on(IPC_CHANNELS.SCAN_PROGRESS, (_, data) => callback(data)),
  deletePath: (path: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_FILE, path),
  getDrives: () => ipcRenderer.invoke(IPC_CHANNELS.GET_DRIVES),
  checkUpdates: () => ipcRenderer.invoke(IPC_CHANNELS.CHECK_UPDATES),
  onUpdatesAvailable: (callback: (updates: any) => void) =>
    ipcRenderer.on(IPC_CHANNELS.UPDATES_AVAILABLE, (_, data) => callback(data)),
  onUpdateProgress: (callback: (progress: any) => void) =>
    ipcRenderer.on('update-progress', (_, data) => callback(data)),
  onUpdateReady: (callback: (data: any) => void) =>
    ipcRenderer.on('update-ready', (_, data) => callback(data)),
  offUpdateProgress: () => ipcRenderer.removeAllListeners('update-progress'),
  offUpdateReady: () => ipcRenderer.removeAllListeners('update-ready'),
})

declare global {
  interface Window {
    electron: {
      scanDrive: (drive: string) => Promise<any>
      onScanProgress: (callback: (progress: any) => void) => void
      deletePath: (path: string) => Promise<void>
      getDrives: () => Promise<any[]>
      checkUpdates: () => Promise<any>
      onUpdatesAvailable: (callback: (updates: any) => void) => void
      onUpdateProgress: (callback: (progress: any) => void) => void
      onUpdateReady: (callback: (data: any) => void) => void
      offUpdateProgress: () => void
      offUpdateReady: () => void
    }
  }
}
