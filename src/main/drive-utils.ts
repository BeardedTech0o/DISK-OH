import { execSync } from 'child_process'
import { DriveInfo } from '../shared/types.js'

export function getDrives(): DriveInfo[] {
  const drives: DriveInfo[] = []

  try {
    // Windows: use wmic to get drive info
    const output = execSync(
      'wmic logicaldisk get name,size,freespace /csv',
      {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 5000,
      }
    )

    const lines = output.trim().split('\n')

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim())

      if (parts.length >= 3) {
        const letter = parts[0].trim()
        const totalStr = parts[1].trim()
        const freeStr = parts[2].trim()

        // Validate input
        if (!letter || !totalStr || !freeStr) continue
        if (!letter.match(/^[A-Z]:$/)) continue

        const total = parseInt(totalStr, 10)
        const free = parseInt(freeStr, 10)

        if (!isNaN(total) && !isNaN(free) && total > 0) {
          const used = Math.max(0, total - free)

          drives.push({
            letter: letter.replace(':', ''),
            name: letter,
            total,
            used,
            free: Math.max(0, free),
          })
        }
      }
    }
  } catch (err) {
    console.error('Failed to get drives:', err)
  }

  return drives.sort((a, b) => a.letter.localeCompare(b.letter))
}
