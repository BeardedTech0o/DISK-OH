export interface DriveInfo {
  letter: string
  name: string
  total: number
  used: number
  free: number
}

export interface FolderInfo {
  name: string
  path: string
  size: number
  children: FolderInfo[]
  fileCount: number
}

export interface ScanProgress {
  current: number
  total: number
  percentage: number
  currentPath: string
}

export interface ComparisonData {
  drive: string
  folders: FolderInfo[]
  total: number
}
