// Tips shown behind the "?" button of each section. The text is in the dictionary (tips.<section>).

import { t } from '../i18n/core.js'

/** { intro, tips } for a section, in the current language. */
export function sectionHelp(id) {
  return { intro: t(`tips.${id}.intro`), tips: t(`tips.${id}.items`) }
}
