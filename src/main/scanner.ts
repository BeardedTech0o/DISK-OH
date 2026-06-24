import fs from 'fs/promises'
import path from 'path'
import { FolderInfo, ScanProgress } from '../shared/types.js'

interface ScanCallback {
  (progress: ScanProgress): void
}

interface ScanCache {
  [path: string]: FolderInfo
}

const scanCache: ScanCache = {}

export async function scanDrive(
  drive: string,
  onProgress: ScanCallback
): Promise<FolderInfo> {
  const normalizedDrive = normalizePath(drive)

  // Check cache first
  if (scanCache[normalizedDrive]) {
    return scanCache[normalizedDrive]
  }

  const root: FolderInfo = {
    name: normalizedDrive,
    path: normalizedDrive,
    size: 0,
    children: [],
    fileCount: 0,
  }

  let scannedCount = 0
  let totalDirs = 1

  async function scanDirectory(dirPath: string, parent: FolderInfo): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true })
      const folders: FolderInfo[] = []

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

            folders.push(folder)
            scannedCount++
            totalDirs++

            if (scannedCount % 10 === 0) {
              onProgress({
                current: scannedCount,
                total: totalDirs,
                percentage: Math.round(
                  (scannedCount / Math.max(totalDirs, 1)) * 100
                ),
                currentPath: fullPath,
              })
            }

            await scanDirectory(fullPath, folder)

            parent.size += folder.size
            parent.fileCount += folder.fileCount
          } else {
            try {
              const stat = await fs.stat(fullPath)
              parent.size += stat.size
              parent.fileCount++
            } catch {
              // File may have been deleted, skip it
            }
          }
        } catch {
          // Skip inaccessible files/folders
        }
      }

      parent.children = folders.sort((a, b) => b.size - a.size)
    } catch {
      // Skip directories we cannot read
    }
  }

  await scanDirectory(normalizedDrive, root)
  onProgress({
    current: scannedCount,
    total: totalDirs,
    percentage: 100,
    currentPath: normalizedDrive,
  })

  // Cache the result
  scanCache[normalizedDrive] = root
  return root
}

export function clearScanCache(): void {
  Object.keys(scanCache).forEach(key => delete scanCache[key])
}

export function getCachedScan(drivePath: string): FolderInfo | undefined {
  return scanCache[normalizePath(drivePath)]
}

function normalizePath(drivePath: string): string {
  return drivePath.replace(/\\/g, '/').toUpperCase()
}
