import fs from 'fs/promises'
import path from 'path'

export async function deleteFile(filePath: string): Promise<void> {
  // Security: Validate path to prevent directory traversal
  const normalizedPath = path.normalize(filePath)
  const realPath = await fs.realpath(filePath)

  // Ensure the real path hasn't escaped the intended directory
  if (!realPath.includes(normalizedPath.split(path.sep)[0])) {
    throw new Error('Invalid path: directory traversal detected')
  }

  try {
    const stat = await fs.stat(realPath)

    if (stat.isDirectory()) {
      await deleteDirectory(realPath)
    } else {
      await fs.unlink(realPath)
    }
  } catch (err) {
    throw new Error(`Failed to delete ${filePath}: ${err}`)
  }
}

async function deleteDirectory(dirPath: string): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)

      try {
        const stat = await fs.stat(fullPath)

        if (stat.isDirectory()) {
          await deleteDirectory(fullPath)
        } else {
          await fs.unlink(fullPath)
        }
      } catch (err) {
        // Log but continue deleting other files
        console.error(`Could not delete ${fullPath}:`, err)
      }
    }

    await fs.rmdir(dirPath)
  } catch (err) {
    throw new Error(`Failed to delete directory ${dirPath}: ${err}`)
  }
}
