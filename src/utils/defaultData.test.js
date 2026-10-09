import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_DATA, mergeWithDefaults } from './defaultData.js'
import { normalizeTemplate, DEFAULT_TEMPLATE, TEMPLATE_IDS } from './templates.js'

const ids = order => order.map(s => s.id)

test('a new CV lists education after experience and projects', () => {
  const order = ids(DEFAULT_DATA.sectionOrder)
  assert.deepEqual(order.slice(0, 5), ['profile', 'experience', 'projects', 'education', 'skills'])
  assert.ok(order.indexOf('education') > order.indexOf('experience'))
  assert.ok(order.indexOf('education') > order.indexOf('projects'))
})

test('the default sections that were on stay on, the optional ones stay off', () => {
  const enabled = ids(DEFAULT_DATA.sectionOrder.filter(s => s.enabled))
  assert.deepEqual(enabled, ['profile', 'experience', 'projects', 'education', 'skills'])
})

test("a saved CV keeps the section order its owner chose", () => {
  const saved = { sectionOrder: [{ id: 'education', enabled: true }, { id: 'experience', enabled: true }] }
  const merged = mergeWithDefaults(saved)
  assert.deepEqual(ids(merged.sectionOrder).slice(0, 2), ['education', 'experience'])
  assert.ok(ids(merged.sectionOrder).includes('projects'), 'sections added later are appended')
})

test('the classic template and no photo are the defaults', () => {
  assert.equal(DEFAULT_DATA.template, 'classic')
  assert.equal(DEFAULT_DATA.personal.photo, '')
})

test('an older CV without a template or photo opens with the classic one', () => {
  const merged = mergeWithDefaults({ personal: { name: 'Ada', links: [] } })
  assert.equal(merged.template, 'classic')
  assert.equal(merged.personal.photo, '')
})

test('a CV in the old linkedin/github format still migrates and gets the photo field', () => {
  const merged = mergeWithDefaults({ personal: { name: 'Ada', linkedin: 'in/ada' } })
  assert.equal(merged.personal.links[0].url, 'in/ada')
  assert.equal(merged.personal.photo, '')
})

test('the template and photo survive loading', () => {
  const merged = mergeWithDefaults({ template: 'photo', personal: { name: 'Ada', links: [], photo: 'data:image/jpeg;base64,AA==' } })
  assert.equal(merged.template, 'photo')
  assert.equal(merged.personal.photo, 'data:image/jpeg;base64,AA==')
})

test('an unknown template falls back to classic', () => {
  assert.equal(mergeWithDefaults({ template: 'neon' }).template, 'classic')
  assert.equal(normalizeTemplate(undefined), DEFAULT_TEMPLATE)
  assert.equal(normalizeTemplate('photo'), 'photo')
  assert.ok(TEMPLATE_IDS.includes(DEFAULT_TEMPLATE))
})

test('a new CV follows the app language, and an unknown CV language does too', () => {
  assert.equal(DEFAULT_DATA.language, 'auto')
  assert.equal(mergeWithDefaults({}).language, 'auto')
  assert.equal(mergeWithDefaults({ language: 'klingon' }).language, 'auto')
})

test('a chosen CV language survives loading', () => {
  assert.equal(mergeWithDefaults({ language: 'pl' }).language, 'pl')
  assert.equal(mergeWithDefaults({ language: 'en' }).language, 'en')
})
