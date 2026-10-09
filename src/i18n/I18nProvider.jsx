import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { detectLanguage, setLanguage, translate, DEFAULT_LANGUAGE } from './core.js'

export const LANGUAGE_STORAGE_KEY = 'cv_maker_language'

const I18nContext = createContext({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  t: (key, params) => translate(DEFAULT_LANGUAGE, key, params),
})

/** Saved choice first, then the browser's languages. */
function startingLanguage() {
  let saved = null
  try {
    saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {
    // storage blocked: just follow the browser
  }
  const browser = window.navigator.languages?.length ? [...window.navigator.languages] : [window.navigator.language]
  return detectLanguage({ saved, browser })
}

/**
 * Provides the language to the whole app. Only an explicit choice is saved, so until the user picks
 * one the app keeps following their browser.
 */
export function I18nProvider({ children, initial }) {
  const [lang, setLangState] = useState(() => initial ?? startingLanguage())

  // Plain helpers outside React (error messages, AI notes) read the language from the core module,
  // so it must be in step before any child renders.
  setLanguage(lang)

  // The page language, the tab title and the description search engines show follow the app.
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translate(lang, 'meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(lang, 'meta.description'))
  }, [lang])

  const setLang = useCallback(code => {
    setLangState(code)
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
    } catch {
      // not remembered, still switched
    }
  }, [])

  const value = useMemo(() => ({ lang, setLang, t: (key, params) => translate(lang, key, params) }), [lang, setLang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** `const { t, lang, setLang } = useI18n()` */
export const useI18n = () => useContext(I18nContext)
