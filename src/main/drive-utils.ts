import { execSync } from 'child_process'
import { DriveInfo } from '../shared/types.js'

export function getDrives(): DriveInfo[] {
  const drives: DriveInfo[] = []

  try {
    // Windows: use wmic to get drive info
    const output = execSync(
      'wmic logicaldisk get name,size,freespace /csv',
      { encoding: 'utf-8' }
    )

    const lines = output.trim().split('\n')
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',')
      if (parts.length >= 3) {
        const letter = parts[0].trim()
        const total = parseInt(parts[1].trim()) || 0
        const free = parseInt(parts[2].trim()) || 0
        const used = total - free

        if (letter && total > 0) {
          drives.push({
            letter: letter.replace(':', ''),
            name: letter,
            total,
            used,
            free,
          })
        }
      }
    }
  } catch (err) {
    console.error('Failed to get drives:', err)
  }

  return drives
}
