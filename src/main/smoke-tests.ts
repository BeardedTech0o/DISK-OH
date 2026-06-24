import test from 'node:test'
import assert from 'node:assert'
import { getDrives } from './drive-utils.js'
import { scanDrive, clearScanCache, getCachedScan } from './scanner.js'

test('getDrives returns array', () => {
  const drives = getDrives()
  assert.ok(Array.isArray(drives))
  assert.ok(drives.length > 0, 'Should have at least one drive')
})

test('getDrives returns valid drive objects', () => {
  const drives = getDrives()
  for (const drive of drives) {
    assert.ok(drive.letter, 'Drive letter required')
    assert.ok(drive.name, 'Drive name required')
    assert.ok(typeof drive.total === 'number', 'Total must be number')
    assert.ok(typeof drive.used === 'number', 'Used must be number')
    assert.ok(typeof drive.free === 'number', 'Free must be number')
    assert.ok(drive.total >= 0, 'Total must be non-negative')
    assert.ok(drive.used >= 0, 'Used must be non-negative')
    assert.ok(drive.free >= 0, 'Free must be non-negative')
  }
})

test('getDrives returns sorted drives', () => {
  const drives = getDrives()
  const letters = drives.map(d => d.letter)
  const sorted = [...letters].sort()
  assert.deepEqual(letters, sorted, 'Drives should be sorted alphabetically')
})

test('scanDrive returns proper structure', async () => {
  clearScanCache()

  const result = await scanDrive('C:\\', () => {})

  assert.ok(result, 'Should return result')
  assert.ok(result.path, 'Should have path')
  assert.ok(typeof result.size === 'number', 'Size must be number')
  assert.ok(result.size >= 0, 'Size must be non-negative')
  assert.ok(Array.isArray(result.children), 'Children must be array')
})

test('scanDrive result is cached', async () => {
  clearScanCache()

  const result1 = await scanDrive('C:\\', () => {})
  const cached = getCachedScan('C:\\')

  assert.ok(cached, 'Result should be cached')
  assert.deepEqual(result1, cached, 'Cached result should match original')
})

test('scanDrive children are sorted by size', async () => {
  clearScanCache()

  const result = await scanDrive('C:\\', () => {})

  if (result.children.length > 1) {
    for (let i = 1; i < result.children.length; i++) {
      assert.ok(
        result.children[i - 1].size >= result.children[i].size,
        'Children should be sorted by size descending'
      )
    }
  }
})

test('clearScanCache removes cached results', async () => {
  clearScanCache()
  await scanDrive('C:\\', () => {})

  const beforeClear = getCachedScan('C:\\')
  assert.ok(beforeClear, 'Should be cached')

  clearScanCache()
  const afterClear = getCachedScan('C:\\')
  assert.equal(afterClear, undefined, 'Cache should be empty after clear')
})

console.log('All smoke tests passed!')
