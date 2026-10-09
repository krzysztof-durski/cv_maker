// The CV has its own language, separate from the interface: someone can use the app in Polish
// and still write an English CV. 'auto' follows the interface.

import { isLanguage, DEFAULT_LANGUAGE } from './core.js'

export const CV_LANGUAGE_SETTINGS = ['auto', 'en', 'pl']
export const DEFAULT_CV_LANGUAGE = 'auto'

export const normalizeCvLanguage = setting => (CV_LANGUAGE_SETTINGS.includes(setting) ? setting : DEFAULT_CV_LANGUAGE)

/** The language the CV is printed in. */
export function resolveCvLanguage(setting, interfaceLanguage) {
  if (isLanguage(setting)) return setting
  return isLanguage(interfaceLanguage) ? interfaceLanguage : DEFAULT_LANGUAGE
}
