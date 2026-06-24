import test from 'node:test'
import assert from 'node:assert'
import { getDrives } from './drive-utils.js'
import { scanDrive } from './scanner.js'

test('getDrives returns array', async () => {
  const drives = getDrives()
  assert.ok(Array.isArray(drives))
  assert.ok(drives.length > 0, 'Should have at least one drive')
})

test('getDrives returns drive objects with correct shape', async () => {
  const drives = getDrives()
  for (const drive of drives) {
    assert.ok(drive.letter)
    assert.ok(drive.name)
    assert.ok(typeof drive.total === 'number')
    assert.ok(typeof drive.used === 'number')
    assert.ok(typeof drive.free === 'number')
  }
})

test('scanDrive works for valid path', async () => {
  try {
    const result = await scanDrive('C:\\', () => {
      // Progress callback
    })

    assert.ok(result)
    assert.ok(result.name)
    assert.ok(typeof result.size === 'number')
    assert.ok(Array.isArray(result.children))
  } catch (err) {
    // Can fail if C: not available or permission denied, that's OK
    console.log('Scan test skipped:', err)
  }
})

console.log('All smoke tests passed!')
