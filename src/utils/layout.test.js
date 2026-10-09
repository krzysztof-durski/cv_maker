import test from 'node:test'
import assert from 'node:assert/strict'
import { PANEL, clampPanelWidth, parseStoredWidth, fitTextHeight } from './layout.js'

test('a width inside the limits is kept', () => {
  assert.equal(clampPanelWidth(500, 1600), 500)
})

test('the panel cannot be narrower than its minimum or wider than its maximum', () => {
  assert.equal(clampPanelWidth(100, 1600), PANEL.min)
  assert.equal(clampPanelWidth(5000, 3000), PANEL.max)
})

test('the preview always keeps its minimum width', () => {
  assert.equal(clampPanelWidth(900, 1200), 1200 - PANEL.minPreview)
})

test('on a screen too small for both, the panel keeps its minimum', () => {
  assert.equal(clampPanelWidth(700, 700), PANEL.min)
})

test('fractions are rounded and junk falls back to the default', () => {
  assert.equal(clampPanelWidth(500.6, 1600), 501)
  assert.equal(clampPanelWidth(NaN, 1600), PANEL.default)
  assert.equal(clampPanelWidth(undefined, 1600), PANEL.default)
})

test('a stored width is read back, and damaged values give the default', () => {
  assert.equal(parseStoredWidth('512'), 512)
  assert.equal(parseStoredWidth(null), PANEL.default)
  assert.equal(parseStoredWidth('wide'), PANEL.default)
  assert.equal(parseStoredWidth('', 400), 400)
})

test('a text box is as tall as its content', () => {
  assert.deepEqual(fitTextHeight(80), { height: 80, scrolls: false })
})

test('a text box with a height limit stops growing and scrolls', () => {
  assert.deepEqual(fitTextHeight(500, 200), { height: 200, scrolls: true })
  assert.deepEqual(fitTextHeight(200, 200), { height: 200, scrolls: false })
})
