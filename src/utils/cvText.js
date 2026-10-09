// Wording that ends up on the CV itself, in the CV's language. Shared by the preview and the Word export.

import { translate } from '../i18n/core.js'

const PRESENT = /^present$/i // what the "Currently ongoing" checkbox stores

/** 'Present' becomes 'Obecnie' on a Polish CV. Anything else the person typed is left alone. */
export const localizeDate = (value, lang) => (PRESENT.test(String(value ?? '').trim()) ? translate(lang, 'cv.present') : value)

export function dateRange(start, end, lang = 'en') {
  const from = localizeDate(start, lang)
  const to = localizeDate(end, lang)
  if (!from && !to) return ''
  if (!to) return from
  return `${from} – ${to}`
}

/** 'BSc in Maths' / 'BSc, Matematyka'. Either part may be missing. */
export function degreeLine(degree, field, lang = 'en') {
  if (degree && field) return translate(lang, 'cv.degreeInField', { degree, field })
  return degree || field || ''
}

export const sectionHeading = (id, lang = 'en') => translate(lang, `cv.headings.${id}`)
