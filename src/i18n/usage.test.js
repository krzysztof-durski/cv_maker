// Keeps the code and the dictionaries in step: every key the code asks for exists, and nothing
// in the dictionary is left unused.

import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { DICTIONARIES, lookup } from './core.js'

const SRC = new URL('..', import.meta.url).pathname

const DICTIONARY_DIRS = /\/i18n\/(en|pl)$/ // the dictionaries themselves are not "code that asks for keys"

function sourceFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return DICTIONARY_DIRS.test(path) || name === 'testing' ? [] : sourceFiles(path)
    return /\.(jsx?)$/.test(name) && !/\.test\.jsx?$/.test(name) && name !== 'core.js' ? [path] : []
  })
}

const files = sourceFiles(SRC).map(path => ({ path, text: readFileSync(path, 'utf8') }))
const all = files.map(f => f.text).join('\n')

// t('a.b.c') / translate(lang, 'a.b.c') with a literal key.
const LITERAL = /\b(?:t|translate)\((?:[a-zA-Z]+, )?'([\w.]+)'/g
const usedLiterals = [...new Set([...all.matchAll(LITERAL)].map(m => m[1]))]

// t(`prefix.${id}.suffix`): only the fixed beginning can be checked.
const DYNAMIC = /\b(?:t|translate)\((?:[a-zA-Z]+, )?`([\w.]+)\.\$\{/g
const dynamicPrefixes = [...new Set([...all.matchAll(DYNAMIC)].map(m => m[1]))]

// Other places that name a key: localizedMap(ids, 'prefix'), the page loader, the dynamic helpers.
const OTHER_PREFIXES = ['sections', 'linkTypes', 'ai.fields', 'lang.names', 'pages', 'cv.headings']

function flatten(node, path = []) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return [path.join('.')]
  const keys = Object.keys(node)
  if ('other' in node && keys.every(k => ['zero', 'one', 'two', 'few', 'many', 'other'].includes(k))) return [path.join('.')]
  return keys.flatMap(key => flatten(node[key], [...path, key]))
}

const dictionaryKeys = flatten(DICTIONARIES.en)

test('there are keys to check', () => {
  assert.ok(usedLiterals.length > 150, `only ${usedLiterals.length} literal keys found`)
  assert.ok(dynamicPrefixes.length >= 3)
})

test('every key the code asks for exists in English and Polish', () => {
  const missing = usedLiterals.filter(key => lookup('en', key) === undefined || lookup('pl', key) === undefined)
  assert.deepEqual(missing, [])
})

test('every dynamic key prefix the code uses exists as a group', () => {
  const missing = dynamicPrefixes.filter(prefix => lookup('en', prefix) === undefined)
  assert.deepEqual(missing, [])
})

test('no dictionary entry is left unused', () => {
  const prefixes = [...dynamicPrefixes, ...OTHER_PREFIXES]
  const covered = key => usedLiterals.includes(key)
    || usedLiterals.some(used => key.startsWith(`${used}.`))
    || prefixes.some(prefix => key === prefix || key.startsWith(`${prefix}.`))
  const unused = dictionaryKeys.filter(key => !covered(key))
  assert.deepEqual(unused, [])
})
