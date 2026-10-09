import test from 'node:test'
import assert from 'node:assert/strict'
import { dateRange, degreeLine, localizeDate, sectionHeading } from './cvText.js'

test('a date range joins start and end, in either language', () => {
  assert.equal(dateRange('2019', '2021'), '2019 – 2021')
  assert.equal(dateRange('2019', '2021', 'pl'), '2019 – 2021')
})

test('only a start date, only an end date, or none', () => {
  assert.equal(dateRange('2019', ''), '2019')
  assert.equal(dateRange('', '2021'), ' – 2021')
  assert.equal(dateRange('', ''), '')
  assert.equal(dateRange(undefined, undefined), '')
})

test('"Present" follows the language of the CV', () => {
  assert.equal(dateRange('2020', 'Present'), '2020 – Present')
  assert.equal(dateRange('2020', 'Present', 'pl'), '2020 – Obecnie')
})

test('"Present" is recognised however it was typed, and nothing else is changed', () => {
  assert.equal(localizeDate('present', 'pl'), 'Obecnie')
  assert.equal(localizeDate(' PRESENT ', 'pl'), 'Obecnie')
  assert.equal(localizeDate('Expected Jun 2027', 'pl'), 'Expected Jun 2027')
  assert.equal(localizeDate('Presentation', 'pl'), 'Presentation')
  assert.equal(localizeDate(undefined, 'pl'), undefined)
})

test('degree and field are joined the way the language does it', () => {
  assert.equal(degreeLine('BSc', 'Maths'), 'BSc in Maths')
  assert.equal(degreeLine('BSc', 'Maths', 'en'), 'BSc in Maths')
  assert.equal(degreeLine('Licencjat', 'Matematyka', 'pl'), 'Licencjat, Matematyka')
})

test('degree or field alone is shown as it is', () => {
  assert.equal(degreeLine('BSc', '', 'pl'), 'BSc')
  assert.equal(degreeLine('', 'Maths', 'pl'), 'Maths')
  assert.equal(degreeLine('', '', 'pl'), '')
})

test('every section has a heading in both languages', () => {
  const ids = ['profile', 'education', 'experience', 'projects', 'skills', 'languages', 'certifications', 'volunteer', 'custom']
  for (const lang of ['en', 'pl']) for (const id of ids) assert.ok(sectionHeading(id, lang) && !sectionHeading(id, lang).startsWith('cv.'), `${lang} ${id}`)
  assert.equal(sectionHeading('experience', 'en'), 'Experience')
  assert.equal(sectionHeading('experience', 'pl'), 'Doświadczenie')
  assert.equal(sectionHeading('skills', 'pl'), 'Umiejętności techniczne')
})
