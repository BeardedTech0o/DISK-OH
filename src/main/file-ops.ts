import fs from 'fs/promises'
import path from 'path'

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const stat = await fs.stat(filePath)

    if (stat.isDirectory()) {
      // Recursively delete directory
      await deleteDirectory(filePath)
    } else {
      // Delete file
      await fs.unlink(filePath)
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

      if (entry.isDirectory()) {
        await deleteDirectory(fullPath)
      } else {
        await fs.unlink(fullPath)
      }
    }

    await fs.rmdir(dirPath)
  } catch (err) {
    throw new Error(`Failed to delete directory ${dirPath}: ${err}`)
  }
}
