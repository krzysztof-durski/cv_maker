import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DICTIONARIES, LANGUAGE_CODES, DEFAULT_LANGUAGE, detectLanguage, translate, lookup, isLanguage,
  getLanguage, setLanguage, t, nameIn,
} from './core.js'
import { resolveCvLanguage, normalizeCvLanguage } from './cvLanguage.js'

/* ---------- the two dictionaries match ---------- */

const PLURAL = ['zero', 'one', 'two', 'few', 'many', 'other']
const isPlural = v => v && typeof v === 'object' && !Array.isArray(v) && 'other' in v && Object.keys(v).every(k => PLURAL.includes(k))

/** Every path to a string in a dictionary, e.g. 'menu.saveBackup', 'pages.help.sections.0.title'. A plural entry is one leaf. */
function leaves(node, path = []) {
  if (typeof node === 'string') return [[path.join('.'), node]]
  if (isPlural(node)) return [[path.join('.'), node]]
  if (Array.isArray(node)) return node.flatMap((item, i) => leaves(item, [...path, i]))
  return Object.entries(node).flatMap(([key, value]) => leaves(value, [...path, key]))
}

const placeholders = text => [...String(text).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort()
const allText = value => (typeof value === 'string' ? value : Object.values(value).join(' '))

const en = new Map(leaves(DICTIONARIES.en))

test('English is the reference and there is a Polish dictionary', () => {
  assert.deepEqual(LANGUAGE_CODES.sort(), ['en', 'pl'])
  assert.ok(en.size > 500, 'the dictionary should be substantial')
})

for (const code of LANGUAGE_CODES.filter(c => c !== 'en')) {
  const other = new Map(leaves(DICTIONARIES[code]))

  test(`${code}: has exactly the same keys as English`, () => {
    const missing = [...en.keys()].filter(k => !other.has(k))
    const extra = [...other.keys()].filter(k => !en.has(k))
    assert.deepEqual(missing, [], `missing in ${code}`)
    assert.deepEqual(extra, [], `not in English`)
  })

  test(`${code}: no entry is empty`, () => {
    for (const [key, value] of other) assert.ok(allText(value).trim() !== '', key)
  })

  test(`${code}: every placeholder survives translation`, () => {
    const names = text => [...new Set(placeholders(allText(text)))]
    for (const [key, value] of en) assert.deepEqual(names(other.get(key)), names(value), key)
  })

  test(`${code}: plural entries have the forms the language needs`, () => {
    const needed = new Intl.PluralRules(code).resolvedOptions().pluralCategories
    for (const [key, value] of other) {
      if (!isPlural(value)) continue
      for (const category of needed) assert.ok(category in value, `${key} lacks "${category}"`)
    }
  })

  test(`${code}: formatting marks (bold, code, links) are balanced`, () => {
    for (const [key, value] of other) {
      const text = allText(value)
      assert.equal((text.match(/\*\*/g) || []).length % 2, 0, `${key}: unbalanced bold`)
      assert.equal((text.match(/`/g) || []).length % 2, 0, `${key}: unbalanced code`)
      assert.equal((text.match(/\[/g) || []).length, (text.match(/\]\(/g) || []).length, `${key}: link without address`)
    }
  })

  test(`${code}: the same entries are plural in both languages`, () => {
    for (const [key, value] of en) assert.equal(isPlural(other.get(key)), isPlural(value), key)
  })
}

test('markup in a translation matches the English entry (same number of bold, code and link marks)', () => {
  const pl = new Map(leaves(DICTIONARIES.pl))
  for (const [key, value] of en) {
    const count = (text, re) => (allText(text).match(re) || []).length
    for (const re of [/\*\*/g, /`/g, /\]\(/g]) {
      assert.equal(count(pl.get(key), re), count(value, re), `${key}: ${re}`)
    }
  }
})

/* ---------- looking up and filling in text ---------- */

test('a key is looked up by its dotted path, arrays included', () => {
  assert.equal(lookup('en', 'menu.saveBackup'), 'Save backup')
  assert.equal(lookup('pl', 'menu.saveBackup'), 'Zapisz kopię zapasową')
  assert.ok(Array.isArray(lookup('en', 'pages.help.sections')))
  assert.equal(typeof lookup('en', 'pages.help.sections.0.title'), 'string')
  assert.equal(lookup('en', 'no.such.key'), undefined)
  assert.equal(lookup('en', 'menu.saveBackup.deeper'), undefined)
})

test('{name} placeholders are filled in, and unknown ones are left visible', () => {
  assert.equal(translate('en', 'menu.savedOn', { date: '9 Oct' }), 'Saved 9 Oct')
  assert.equal(translate('en', 'menu.savedOn'), 'Saved {date}')
  assert.equal(translate('pl', 'menu.savedOn', { date: '9 paź' }), 'Zapisano 9 paź')
})

test('English plurals: one and other', () => {
  assert.equal(translate('en', 'review.changes'.replace('review', 'ai.review'), { count: 1 }), '1 change')
  assert.equal(translate('en', 'ai.review.changes', { count: 0 }), '0 changes')
  assert.equal(translate('en', 'ai.review.changes', { count: 5 }), '5 changes')
})

test('Polish plurals: one, few, many', () => {
  const forms = n => translate('pl', 'ai.review.changes', { count: n })
  assert.equal(forms(1), '1 zmiana')
  for (const n of [2, 3, 4, 22, 23, 24, 102]) assert.equal(forms(n), `${n} zmiany`, String(n))
  for (const n of [0, 5, 11, 12, 13, 14, 21, 25, 100]) assert.equal(forms(n), `${n} zmian`, String(n))
})

test('a missing Polish entry falls back to English, and a missing key shows the key', () => {
  const original = DICTIONARIES.pl.common.close
  delete DICTIONARIES.pl.common.close
  try {
    assert.equal(translate('pl', 'common.close'), 'Close')
  } finally {
    DICTIONARIES.pl.common.close = original
  }
  assert.equal(translate('pl', 'definitely.missing'), 'definitely.missing')
})

test('arrays and objects are returned as they are, for content pages', () => {
  assert.ok(Array.isArray(translate('pl', 'ai.followUps')))
  assert.equal(translate('pl', 'ai.followUps').length, translate('en', 'ai.followUps').length)
})

test('language names are written in the language asked for', () => {
  assert.equal(nameIn('en', 'pl'), 'Polish')
  assert.equal(nameIn('pl', 'pl'), 'polski')
  assert.equal(nameIn('pl', 'en'), 'angielski')
})

/* ---------- the current language ---------- */

test('the app starts in English and can be switched', () => {
  assert.equal(getLanguage(), DEFAULT_LANGUAGE)
  assert.equal(t('menu.saveBackup'), 'Save backup')
  setLanguage('pl')
  try {
    assert.equal(getLanguage(), 'pl')
    assert.equal(t('menu.saveBackup'), 'Zapisz kopię zapasową')
  } finally {
    setLanguage('en')
  }
})

test('an unknown language falls back to English', () => {
  setLanguage('de')
  assert.equal(getLanguage(), 'en')
  assert.equal(isLanguage('de'), false)
  assert.equal(isLanguage('pl'), true)
})

/* ---------- choosing the language ---------- */

test('a saved choice wins over the browser language', () => {
  assert.equal(detectLanguage({ saved: 'en', browser: ['pl-PL'] }), 'en')
  assert.equal(detectLanguage({ saved: 'pl', browser: ['en-US'] }), 'pl')
})

test('without a saved choice the browser language is used, region ignored', () => {
  assert.equal(detectLanguage({ browser: ['pl-PL', 'en'] }), 'pl')
  assert.equal(detectLanguage({ browser: ['PL'] }), 'pl')
  assert.equal(detectLanguage({ browser: ['en-GB'] }), 'en')
})

test('the first supported browser language is used', () => {
  assert.equal(detectLanguage({ browser: ['de-DE', 'pl', 'en'] }), 'pl')
})

test('English is the fallback for anything else', () => {
  assert.equal(detectLanguage({ browser: ['de-DE', 'fr'] }), 'en')
  assert.equal(detectLanguage({ saved: 'xx', browser: [] }), 'en')
  assert.equal(detectLanguage({}), 'en')
  assert.equal(detectLanguage(), 'en')
  assert.equal(detectLanguage({ browser: [undefined, null, ''] }), 'en')
})

/* ---------- the CV's own language ---------- */

test("the CV language follows the app unless a language is chosen", () => {
  assert.equal(resolveCvLanguage('auto', 'pl'), 'pl')
  assert.equal(resolveCvLanguage('auto', 'en'), 'en')
  assert.equal(resolveCvLanguage('en', 'pl'), 'en')
  assert.equal(resolveCvLanguage('pl', 'en'), 'pl')
  assert.equal(resolveCvLanguage(undefined, 'pl'), 'pl')
  assert.equal(resolveCvLanguage('auto', 'xx'), 'en')
})

test('an unknown CV language setting becomes auto', () => {
  assert.equal(normalizeCvLanguage('de'), 'auto')
  assert.equal(normalizeCvLanguage(undefined), 'auto')
  assert.equal(normalizeCvLanguage('pl'), 'pl')
  assert.equal(normalizeCvLanguage('auto'), 'auto')
})
