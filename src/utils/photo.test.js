import test from 'node:test'
import assert from 'node:assert/strict'
import { centerCropSquare, photoFileProblem, parseImageDataUrl, MAX_PHOTO_FILE_BYTES } from './photo.js'

test('a landscape picture is cropped from the middle of its width', () => {
  assert.deepEqual(centerCropSquare(1000, 600), { sx: 200, sy: 0, side: 600 })
})

test('a portrait picture is cropped from the middle of its height', () => {
  assert.deepEqual(centerCropSquare(600, 1000), { sx: 0, sy: 200, side: 600 })
})

test('a square picture is used whole, and odd leftovers are rounded', () => {
  assert.deepEqual(centerCropSquare(500, 500), { sx: 0, sy: 0, side: 500 })
  assert.deepEqual(centerCropSquare(501, 500), { sx: 1, sy: 0, side: 500 })
})

test('only reasonably sized pictures are accepted as photos', () => {
  assert.equal(photoFileProblem({ type: 'image/png', size: 1000 }), '')
  assert.equal(photoFileProblem({ type: 'image/jpeg', size: 1000 }), '')
  assert.match(photoFileProblem({ type: 'application/pdf', size: 1000 }), /JPG, PNG/)
  assert.match(photoFileProblem({ type: 'image/svg+xml', size: 1000 }), /JPG, PNG/)
  assert.match(photoFileProblem({ type: 'image/png', size: MAX_PHOTO_FILE_BYTES + 1 }), /too large/)
  assert.match(photoFileProblem(undefined), /JPG, PNG/)
})

test('a base64 image data URL is split into its type and bytes', () => {
  const parsed = parseImageDataUrl('data:image/jpeg;base64,AQID')
  assert.equal(parsed.type, 'image/jpeg')
  assert.deepEqual([...parsed.bytes], [1, 2, 3])
})

test('anything that is not a base64 image data URL is rejected', () => {
  for (const bad of ['', undefined, 'https://x.com/a.jpg', 'data:text/html;base64,AQID', 'data:image/png,raw', 'data:image/png;base64,<script>']) {
    assert.equal(parseImageDataUrl(bad), null, String(bad))
  }
})
