import test from 'node:test'
import assert from 'node:assert/strict'
import { runTurn } from './session.js'
import { buildRequest } from './prompts.js'
import { DEFAULT_DATA } from '../utils/defaultData.js'

const PHOTO = 'data:image/jpeg;base64,/9j/PHOTO-BYTES-THAT-MUST-STAY-HOME=='

const cv = () => ({
  ...DEFAULT_DATA,
  template: 'photo',
  personal: { ...DEFAULT_DATA.personal, name: 'Ada Lovelace', jobTitle: 'Engineer', email: 'ada@example.com', photo: PHOTO },
  profile: { text: 'I build things.' },
  experience: [{ id: 'e1', title: 'Engineer', company: 'Acme', location: '', startDate: '2020', endDate: 'Present', bullets: ['Built billing'] }],
})

const scopes = ['cv', 'profile', 'experience', 'experience#e1', 'skills']

test('the photo is never part of what is sent to an AI provider', () => {
  for (const scope of scopes) {
    const { system, user } = buildRequest({ cvData: cv(), originalCv: cv(), scope, instruction: 'Tailor my CV', reference: '', history: [], others: '' })
    for (const text of [system, user]) {
      assert.ok(!text.includes('PHOTO-BYTES'), `photo leaked for scope ${scope}`)
      assert.ok(!text.includes('data:image'), `image data leaked for scope ${scope}`)
      assert.ok(!/"photo"/.test(text), `photo field leaked for scope ${scope}`)
    }
  }
})

test('the template and CV language choices are not sent either', () => {
  const { user } = buildRequest({ cvData: cv(), originalCv: cv(), scope: 'cv', instruction: 'x', reference: '', history: [], others: '' })
  assert.ok(!/"template"/.test(user))
  assert.ok(!/"language"/.test(user))
})

test('an answer that tries to replace the photo or template is ignored', async () => {
  const original = cv()
  const complete = async () => JSON.stringify({
    summary: 'Done.',
    changes: {
      profile: { text: 'Builds reliable things.' },
      personal: { jobTitle: 'Engineer', photo: 'data:image/png;base64,EVIL', name: 'Mallory' },
      template: 'classic',
    },
  })
  const turn = await runTurn({ complete, originalCv: original, workingCv: original, scope: 'cv', instruction: 'Rewrite my profile', newId: () => 'n1' })
  assert.equal(turn.draftCv.personal.photo, PHOTO)
  assert.equal(turn.draftCv.personal.name, 'Ada Lovelace')
  assert.equal(turn.draftCv.template, 'photo')
  assert.equal(turn.draftCv.profile.text, 'Builds reliable things.')
})

test('applying an accepted AI suggestion keeps the photo and template', async () => {
  const { diffAll, applyItems } = await import('./diff.js')
  const original = cv()
  const draft = { ...original, personal: { ...original.personal, jobTitle: 'Backend Engineer' } }
  const sections = diffAll(original, draft)
  const applied = applyItems(original, sections, sections.flatMap(s => s.items.map(i => i.key)))
  assert.equal(applied.personal.jobTitle, 'Backend Engineer')
  assert.equal(applied.personal.photo, PHOTO)
  assert.equal(applied.template, 'photo')
})
