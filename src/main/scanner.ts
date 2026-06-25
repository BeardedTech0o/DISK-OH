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
    let entries
    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true })
    } catch {
      // Skip directories we cannot read (permission denied, etc.)
      return
    }

    const folders: FolderInfo[] = []
    const fileStats: Promise<void>[] = []

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      // Skip reparse points / symlinks to avoid infinite loops and double-counting
      if (entry.isSymbolicLink()) continue

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

        if (scannedCount % 25 === 0) {
          onProgress({
            current: scannedCount,
            total: totalDirs,
            percentage: Math.round((scannedCount / Math.max(totalDirs, 1)) * 100),
            currentPath: fullPath,
          })
        }

        await scanDirectory(fullPath, folder)

        parent.size += folder.size
        parent.fileCount += folder.fileCount
      } else if (entry.isFile()) {
        // Stat files in parallel — huge speedup over awaiting one-by-one
        fileStats.push(
          fs.stat(fullPath).then(
            (stat) => {
              parent.size += stat.size
              parent.fileCount++
            },
            () => {
              // File may have been deleted/locked, skip it
            }
          )
        )
      }
    }

    if (fileStats.length > 0) {
      await Promise.all(fileStats)
    }

    parent.children = folders.sort((a, b) => b.size - a.size)
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
  // Use backslashes for Windows
  let p = drivePath.trim().replace(/\//g, '\\')

  // A bare drive letter like "C:" refers to the *current directory* on that
  // drive, NOT its root. Append a backslash so we scan the actual drive root.
  if (/^[A-Za-z]:$/.test(p)) {
    p = p + '\\'
  }

  return p
}
