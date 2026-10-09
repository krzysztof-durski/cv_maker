import { createContext, useContext, useMemo } from 'react'
import { DEFAULT_LANGUAGE, translate } from '../../i18n/core'
import { dateRange, degreeLine, sectionHeading } from '../../utils/cvText'

const CvLanguageContext = createContext(DEFAULT_LANGUAGE)

/** Everything inside prints the CV's own wording (headings, "Present"…) in this language. */
export const CvLanguageProvider = CvLanguageContext.Provider

/** The CV's wording in the CV's language, for the preview sections. */
export function useCvText() {
  const lang = useContext(CvLanguageContext)
  return useMemo(() => ({
    lang,
    heading: id => sectionHeading(id, lang),
    dateRange: (start, end) => dateRange(start, end, lang),
    degreeLine: (degree, field) => degreeLine(degree, field, lang),
    photoOf: name => (name ? translate(lang, 'template.photoOf', { name }) : translate(lang, 'template.photoAlt')),
  }), [lang])
}
