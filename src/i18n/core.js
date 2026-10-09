// Translation without a library. Dictionaries are plain nested objects (en.js is the reference, pl.js the Polish one).
//
//   t('menu.saveBackup')                          -> 'Save backup'
//   t('menu.savedOn', { date })                   -> 'Saved 9 Oct 2026'     ({name} is replaced)
//   t('profile.characters', { count: 3 })         -> '3 characters'         (an object of plural forms is chosen by count)
//   t('help.sections')                            -> the array or object itself, for content pages
//
// A missing Polish string falls back to English, and a missing key shows the key, so a gap is visible but never blank.

import en from './en.js'
import pl from './pl.js'

export const DICTIONARIES = { en, pl }
export const LANGUAGES = {
  en: { code: 'en', name: 'English', short: 'EN' },
  pl: { code: 'pl', name: 'Polski', short: 'PL' },
}
export const LANGUAGE_CODES = Object.keys(LANGUAGES)
export const DEFAULT_LANGUAGE = 'en'

export const isLanguage = code => Object.prototype.hasOwnProperty.call(LANGUAGES, code)

/** The language to open in: the saved choice, else the first browser language we have, else English. */
export function detectLanguage({ saved, browser = [] } = {}) {
  if (isLanguage(saved)) return saved
  for (const tag of browser) {
    const code = String(tag || '').toLowerCase().split('-')[0]
    if (isLanguage(code)) return code
  }
  return DEFAULT_LANGUAGE
}

/** The entry for a dotted key, or undefined. Array indexes work too: 'help.sections.0.title'. */
export function lookup(lang, key) {
  let node = DICTIONARIES[lang]
  for (const part of key.split('.')) {
    if (node === null || typeof node !== 'object' || !(part in node)) return undefined
    node = node[part]
  }
  return node
}

const PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other']
const isPluralForms = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && 'other' in value &&
  Object.keys(value).every(k => PLURAL_CATEGORIES.includes(k))

export const fill = (text, params) => text.replace(/\{(\w+)\}/g, (whole, name) => (name in params ? String(params[name]) : whole))

export function translate(lang, key, params = {}) {
  let value = lookup(lang, key)
  if (value === undefined) value = lookup(DEFAULT_LANGUAGE, key)
  if (value === undefined) return key
  if (isPluralForms(value)) {
    const category = new Intl.PluralRules(lang).select(Number(params.count))
    value = value[category] ?? value.other
  }
  return typeof value === 'string' ? fill(value, params) : value
}

/* ---------- the language the app is currently shown in ---------- */
// Plain functions elsewhere in the app (error messages, AI notes) cannot use React hooks, so the
// current language lives here. The I18nProvider sets it; tests and Node default to English.

let current = DEFAULT_LANGUAGE

export const getLanguage = () => current
export function setLanguage(code) {
  current = isLanguage(code) ? code : DEFAULT_LANGUAGE
}

/** Runs `fn` with the app temporarily in another language (for text that is not meant for the user, such as prompts). */
export function withLanguage(code, fn) {
  const previous = current
  setLanguage(code)
  try {
    return fn()
  } finally {
    setLanguage(previous)
  }
}

/** Translate into the current language. */
export const t = (key, params) => translate(current, key, params)

/** An object whose values are looked up in the current language each time one is read. */
export function localizedMap(ids, prefix) {
  const map = {}
  for (const id of ids) Object.defineProperty(map, id, { enumerable: true, get: () => t(`${prefix}.${id}`) })
  return map
}

/** The language's own name, e.g. 'Polski'. */
export const languageName = code => LANGUAGES[code]?.name ?? LANGUAGES[DEFAULT_LANGUAGE].name

/** A language's name written in the given language: nameIn('pl', 'en') is 'angielski'. */
export const nameIn = (lang, code) => translate(lang, `lang.names.${code}`)
