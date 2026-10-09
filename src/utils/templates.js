// CV layouts. The template changes how the header looks, not which sections or text the CV holds.
// Their names and descriptions are in the dictionary (template.<id>).
export const TEMPLATE_IDS = ['classic', 'photo']

export const DEFAULT_TEMPLATE = 'classic'

export const isTemplate = id => TEMPLATE_IDS.includes(id)

/** An unknown or missing template (an old backup, a hand-edited file) falls back to the classic one. */
export const normalizeTemplate = id => (isTemplate(id) ? id : DEFAULT_TEMPLATE)
