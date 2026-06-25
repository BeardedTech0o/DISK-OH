import { app, dialog } from 'electron'
import { execFile } from 'child_process'
import isAdmin from 'is-admin'

export async function ensureAdmin(): Promise<boolean> {
  const admin = await isAdmin()

  if (!admin) {
    const { response } = await dialog.showMessageBox({
      type: 'warning',
      title: 'Administrator Rights Required',
      message: 'DiskOH needs administrator privileges to scan your drives.',
      detail: 'Click "Yes" to restart the application with admin rights.',
      buttons: ['Yes', 'Cancel'],
      defaultId: 0,
    })

    if (response === 0) {
      execFile('powershell.exe', [
        '-NoProfile',
        '-Command',
        `Start-Process -FilePath "${app.getPath('exe')}" -Verb RunAs`,
      ])
      app.quit()
      return false
    } else {
      app.quit()
      return false
    }
  }

  return true
}
