import fs from 'fs/promises'
import path from 'path'
import { FolderInfo, ScanProgress } from '../shared/types.js'

interface ScanCallback {
  (progress: ScanProgress): void
}

let scannedCount = 0
let totalDirs = 0

export async function scanDrive(
  drive: string,
  onProgress: ScanCallback
): Promise<FolderInfo> {
  scannedCount = 0
  totalDirs = 1

  const root: FolderInfo = {
    name: drive,
    path: drive,
    size: 0,
    children: [],
    fileCount: 0,
  }

  await scanDirectory(drive, root, onProgress)
  return root
}

async function scanDirectory(
  dirPath: string,
  parent: FolderInfo,
  onProgress: ScanCallback
): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      try {
        const fullPath = path.join(dirPath, entry.name)

        if (entry.isDirectory()) {
          const folder: FolderInfo = {
            name: entry.name,
            path: fullPath,
            size: 0,
            children: [],
            fileCount: 0,
          }

          parent.children.push(folder)
          scannedCount++
          totalDirs++

          onProgress({
            current: scannedCount,
            total: totalDirs,
            percentage: Math.round((scannedCount / Math.max(totalDirs, 1)) * 100),
            currentPath: fullPath,
          })

          await scanDirectory(fullPath, folder, onProgress)

          parent.size += folder.size
          parent.fileCount += folder.fileCount
        } else {
          const stat = await fs.stat(fullPath)
          parent.size += stat.size
          parent.fileCount++
        }
      } catch (err) {
        // Skip files/folders we can't access
      }
    }
  } catch (err) {
    // Skip directories we can't access
  }
}
