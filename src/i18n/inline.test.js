import test from 'node:test'
import assert from 'node:assert/strict'
import { parseInline } from './inline.js'

test('plain text is one part', () => {
  assert.deepEqual(parseInline('Hello world'), [{ type: 'text', text: 'Hello world' }])
})

test('bold, italic and code are picked out of a sentence', () => {
  assert.deepEqual(parseInline('Click **Save** then *wait* for `file.json`.'), [
    { type: 'text', text: 'Click ' },
    { type: 'bold', text: 'Save' },
    { type: 'text', text: ' then ' },
    { type: 'italic', text: 'wait' },
    { type: 'text', text: ' for ' },
    { type: 'code', text: 'file.json' },
    { type: 'text', text: '.' },
  ])
})

test('links keep their text and address', () => {
  assert.deepEqual(parseInline('See [the docs](https://example.com/a?b=1) now'), [
    { type: 'text', text: 'See ' },
    { type: 'link', text: 'the docs', href: 'https://example.com/a?b=1' },
    { type: 'text', text: ' now' },
  ])
  assert.deepEqual(parseInline('[mail me](mailto:a@b.c)')[0], { type: 'link', text: 'mail me', href: 'mailto:a@b.c' })
})

test('bold can contain punctuation and spaces', () => {
  assert.deepEqual(parseInline('**Test key & load models**'), [{ type: 'bold', text: 'Test key & load models' }])
})

test('stray symbols are left alone', () => {
  assert.deepEqual(parseInline('2 * 3 = 6 and a ~ b'), [{ type: 'text', text: '2 * 3 = 6 and a ~ b' }])
  assert.deepEqual(parseInline('a lone ** pair'), [{ type: 'text', text: 'a lone ** pair' }])
})

test('square brackets that are not links stay as text', () => {
  assert.deepEqual(parseInline('[Attached file: cv.pdf]'), [{ type: 'text', text: '[Attached file: cv.pdf]' }])
})

test('an empty string gives no parts', () => {
  assert.deepEqual(parseInline(''), [])
})
