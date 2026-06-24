export const IPC_CHANNELS = {
  SCAN_DRIVE: 'scan-drive',
  SCAN_PROGRESS: 'scan-progress',
  SCAN_COMPLETE: 'scan-complete',
  DELETE_FILE: 'delete-file',
  DELETE_COMPLETE: 'delete-complete',
  GET_DRIVES: 'get-drives',
  CHECK_UPDATES: 'check-updates',
  UPDATES_AVAILABLE: 'updates-available',
} as const

export const MIN_FILE_SIZE_BYTES = 1024
export const SCAN_BATCH_SIZE = 100
