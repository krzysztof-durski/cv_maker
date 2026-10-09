import test from 'node:test'
import assert from 'node:assert/strict'
import { languageRules } from './languageRules.js'
import { buildRequest } from './prompts.js'
import { runTurn } from './session.js'
import { DEFAULT_DATA, mergeWithDefaults } from '../utils/defaultData.js'
import { normalizeGenderForms } from '../i18n/cvLanguage.js'

const [polish, english] = languageRules('auto')

test('Polish text is written in the first person, with the example from the brief', () => {
  assert.match(polish, /FIRST PERSON SINGULAR/)
  assert.match(polish, /"Founded and developed watchpapa" becomes "Założyłem i rozwijałem watchpapa"/)
  assert.match(polish, /never "Założył i rozwijał watchpapa"/)
  assert.match(polish, /without the pronoun "ja"/)
})

test('Polish text keeps names and numbers, uses the right tense and sounds natural', () => {
  assert.match(polish, /Keep the names of companies, products, projects, schools and technologies exactly as written/)
  assert.match(polish, /Keep every number and date exactly/)
  assert.match(polish, /past tense for finished roles/)
  assert.match(polish, /idiomatic Polish/)
  assert.match(polish, /frontend, backend, deploy/)
})

test('the rules only apply to text the model writes in that language, so they never force a translation', () => {
  assert.match(polish, /^Whenever you write CV text in Polish/)
  assert.match(english, /^Whenever you write CV text in English/)
})

test('masculine and feminine forms are asked for explicitly', () => {
  assert.match(languageRules('masculine')[0], /The person is a man: use masculine forms[^]*założyłem/)
  assert.doesNotMatch(languageRules('masculine')[0], /The person is a woman/)
  assert.match(languageRules('feminine')[0], /The person is a woman: use feminine forms[^]*założyłam/)
  assert.doesNotMatch(languageRules('feminine')[0], /The person is a man/)
})

test('without a choice the gender comes from the text and is never guessed from the name', () => {
  for (const gender of ['auto', undefined, 'nonsense']) {
    const text = languageRules(gender)[0]
    assert.match(text, /Take the grammatical gender from forms already used/)
    assert.match(text, /Never guess it from the name/)
    assert.match(text, /avoid gendered verb forms/)
  }
})

test('English CV text is written without pronouns', () => {
  assert.match(english, /without personal pronouns/)
  assert.match(english, /"Founded and developed watchpapa"/)
})

/* ---------- in the prompt the model gets ---------- */

const cv = (extra = {}) => ({
  ...DEFAULT_DATA,
  personal: { ...DEFAULT_DATA.personal, name: 'Krzysztof', jobTitle: 'Engineer' },
  experience: [{ id: 'e1', title: 'Founder', company: 'watchpapa', location: '', startDate: '2020', endDate: 'Present', bullets: ['Founded and developed watchpapa'] }],
  ...extra,
})

test('every request carries the language rules', () => {
  const { system } = buildRequest({ cvData: cv(), scope: 'cv', instruction: 'Translate', language: 'pl' })
  assert.match(system, /Założyłem i rozwijałem watchpapa/)
  assert.match(system, /Whenever you write CV text in English/)
})

test('the chosen gender reaches the prompt', () => {
  const ask = gender => buildRequest({ cvData: cv(), scope: 'cv', instruction: 'x', gender }).system
  assert.match(ask('feminine'), /The person is a woman/)
  assert.match(ask('masculine'), /The person is a man/)
  assert.match(ask('auto'), /Never guess it from the name/)
  assert.match(ask(undefined), /Never guess it from the name/)
})

test('the rules sit next to the instruction to keep the person\'s own language', () => {
  const { system } = buildRequest({ cvData: cv(), scope: 'cv', instruction: 'x' })
  assert.ok(system.indexOf('Whenever you write CV text in Polish') < system.indexOf("Keep the person's language"))
})

test('a conversation turn passes the gender on to the model', async () => {
  let seen
  const complete = async ({ system }) => { seen = system; return JSON.stringify({ summary: 's', changes: {} }) }
  await runTurn({ complete, originalCv: cv(), workingCv: cv(), scope: 'cv', instruction: 'Przetłumacz', newId: () => 'n', language: 'pl', gender: 'feminine' })
  assert.match(seen, /The person is a woman/)
})

/* ---------- the setting itself ---------- */

test('the gender setting defaults to auto and survives loading', () => {
  assert.equal(DEFAULT_DATA.gender, 'auto')
  assert.equal(mergeWithDefaults({}).gender, 'auto')
  assert.equal(mergeWithDefaults({ gender: 'feminine' }).gender, 'feminine')
  assert.equal(mergeWithDefaults({ gender: 'masculine' }).gender, 'masculine')
})

test('an unknown gender setting becomes auto', () => {
  assert.equal(normalizeGenderForms('other'), 'auto')
  assert.equal(normalizeGenderForms(undefined), 'auto')
})
