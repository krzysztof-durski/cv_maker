import test from 'node:test'
import assert from 'node:assert/strict'
import { pdfFileName } from './pdfFileName.js'

test('role, name and CV, joined with underscores', () => {
  assert.equal(pdfFileName({ jobTitle: 'AI Product & Growth Engineer', name: 'Ada Lovelace' }), 'AI_Product_Growth_Engineer_Ada_Lovelace_CV')
})

test('the role is left out when there is none', () => {
  assert.equal(pdfFileName({ jobTitle: '', name: 'Ada Lovelace' }), 'Ada_Lovelace_CV')
  assert.equal(pdfFileName({ jobTitle: '   ', name: 'Ada Lovelace' }), 'Ada_Lovelace_CV')
})

test('keeps accented and non-Latin letters, drops unsafe characters', () => {
  assert.equal(pdfFileName({ jobTitle: 'Full-Stack / Dev', name: 'Krzysztof Dürski-Żółć' }), 'Full_Stack_Dev_Krzysztof_Dürski_Żółć_CV')
  assert.ok(!/[\\/:*?"<>|]/.test(pdfFileName({ jobTitle: 'a/b:c*d?"e<f>g|h', name: 'x\\y' })))
})

test('falls back to just CV when nothing is filled in', () => {
  assert.equal(pdfFileName({}), 'CV')
  assert.equal(pdfFileName(undefined), 'CV')
})
