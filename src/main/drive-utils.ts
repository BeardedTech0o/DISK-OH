import { execSync } from 'child_process'
import { DriveInfo } from '../shared/types.js'

// Strip surrounding double quotes from a CSV field
function unquote(value: string): string {
  return value.trim().replace(/^"(.*)"$/, '$1')
}

export function getDrives(): DriveInfo[] {
  const drives: DriveInfo[] = []

  try {
    // wmic was removed from modern Windows 11 builds, so use PowerShell + CIM.
    // Where-Object Size filters out empty optical/card-reader slots (Size = 0/null).
    const output = execSync(
      'powershell -NoProfile -Command "Get-CimInstance Win32_LogicalDisk | Where-Object Size | Select-Object DeviceID,Size,FreeSpace | ConvertTo-Csv -NoTypeInformation"',
      {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 10000,
      }
    )

    const lines = output.trim().split(/\r?\n/)

    // Line 0 is the CSV header; data starts at line 1
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const parts = line.split(',').map(unquote)
      if (parts.length < 3) continue

      const letter = parts[0] // e.g. "C:"
      const total = parseInt(parts[1], 10)
      const free = parseInt(parts[2], 10)

      if (!letter.match(/^[A-Z]:$/)) continue
      if (isNaN(total) || isNaN(free) || total <= 0) continue

      const used = Math.max(0, total - free)

      drives.push({
        letter: letter.replace(':', ''),
        name: letter,
        total,
        used,
        free: Math.max(0, free),
      })
    }
  } catch (err) {
    console.error('Failed to get drives:', err)
  }

  return drives.sort((a, b) => a.letter.localeCompare(b.letter))
}
