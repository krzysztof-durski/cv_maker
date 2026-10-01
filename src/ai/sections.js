// Which parts of the CV the AI may see and change. Anything not listed here is never sent
// to a provider and never modified (contact details, section order).
//
// kind:      'object' -> one record (profile, personal), 'list' -> array of entries, 'custom' -> { title, entries }
// editable:  the only fields of an EXISTING entry the AI can change. Facts such as employer, school,
//            degree, dates and links are deliberately NOT editable, so a bad answer cannot rewrite history.
// fields:    every field of an entry. A brand-new entry (a duplicate merged away, or something moved here
//            from the wrong section) is built from these.
// identity:  the fields that say what an entry *is*; a new entry needs at least one, and they are checked
//            against the CV and the user's own text so a made-up employer gets flagged.
// freeform:  identity values are labels the AI may legitimately invent (skill categories), so skip that check.
// canAdd:    legacy answer format only (a bare array): which sections may gain entries that way.
// perEntry:  whether a single entry (one job, one project…) can be sent to the AI on its own.

const join = (...parts) => parts.filter(Boolean).join(' — ')

export const AI_SECTIONS = {
  personal: {
    label: 'Job title',
    kind: 'object',
    editable: ['jobTitle'],
  },
  profile: {
    label: 'Profile',
    kind: 'object',
    editable: ['text'],
  },
  experience: {
    perEntry: true,
    label: 'Experience',
    kind: 'list',
    editable: ['bullets'],
    fields: ['title', 'company', 'location', 'startDate', 'endDate', 'bullets'],
    identity: ['title', 'company'],
    entryLabel: e => join(e.title, e.company),
  },
  education: {
    perEntry: true,
    label: 'Education',
    kind: 'list',
    editable: ['bullets'],
    fields: ['school', 'degree', 'field', 'location', 'startDate', 'endDate', 'bullets'],
    identity: ['school', 'degree'],
    entryLabel: e => join(e.school, e.degree),
  },
  projects: {
    perEntry: true,
    label: 'Projects',
    kind: 'list',
    editable: ['description', 'technologies', 'bullets'],
    fields: ['name', 'technologies', 'startDate', 'endDate', 'link', 'description', 'bullets'],
    identity: ['name'],
    entryLabel: e => e.name,
  },
  skills: {
    label: 'Skills',
    kind: 'list',
    editable: ['category', 'items'],
    fields: ['category', 'items'],
    identity: ['category'],
    freeform: true,
    canAdd: true,
    entryLabel: e => e.category,
  },
  volunteer: {
    perEntry: true,
    label: 'Volunteer & Extracurriculars',
    kind: 'list',
    editable: ['bullets'],
    fields: ['role', 'org', 'location', 'startDate', 'endDate', 'bullets'],
    identity: ['role', 'org'],
    entryLabel: e => join(e.role, e.org),
  },
  certifications: {
    label: 'Certifications & Awards',
    kind: 'list',
    editable: ['description'],
    fields: ['name', 'issuer', 'date', 'description'],
    identity: ['name', 'issuer'],
    entryLabel: e => join(e.name, e.issuer),
  },
  languages: {
    label: 'Languages',
    kind: 'list',
    editable: [],
    fields: ['language', 'proficiency'],
    identity: ['language'],
    entryLabel: e => join(e.language, e.proficiency),
  },
  custom: {
    perEntry: true,
    label: 'Custom Section',
    kind: 'custom',
    editable: ['bullets'],
    fields: ['title', 'subtitle', 'startDate', 'endDate', 'bullets'],
    identity: ['title'],
    entryLabel: e => join(e.title, e.subtitle),
  },
}

export const FIELD_LABELS = {
  jobTitle: 'Job title',
  text: 'Bio',
  bullets: 'Bullets',
  description: 'Description',
  technologies: 'Technologies',
  category: 'Category',
  items: 'Skills',
  title: 'Title',
  company: 'Company',
  school: 'School',
  degree: 'Degree',
  field: 'Field of study',
  location: 'Location',
  startDate: 'Start',
  endDate: 'End',
  name: 'Name',
  link: 'Link',
  role: 'Role',
  org: 'Organisation',
  subtitle: 'Subtitle',
  issuer: 'Issuer',
  date: 'Date',
  language: 'Language',
  proficiency: 'Proficiency',
}

/** Sections that make sense as a scope on their own (there is something in them to rewrite). */
export const SCOPABLE_SECTIONS = Object.keys(AI_SECTIONS).filter(id => id !== 'personal' && AI_SECTIONS[id].editable.length > 0)

export function isAiSection(id) {
  return Object.prototype.hasOwnProperty.call(AI_SECTIONS, id)
}

export function getEntries(id, value) {
  if (AI_SECTIONS[id].kind === 'custom') return value?.entries || []
  return Array.isArray(value) ? value : []
}

export function withEntries(id, value, entries) {
  if (AI_SECTIONS[id].kind === 'custom') return { ...(value || {}), entries }
  return entries
}

export function entryLabel(id, entry) {
  return AI_SECTIONS[id].entryLabel?.(entry) || ''
}

// A scope says what the AI works on: 'cv' (everything), a section id such as 'experience',
// or one entry in a section, written 'experience#<entry id>'.
export const entryScope = (section, entryId) => `${section}#${entryId}`

export function parseScope(scope) {
  const value = scope || 'cv'
  const at = value.indexOf('#')
  return at === -1
    ? { section: value, entryId: null }
    : { section: value.slice(0, at), entryId: value.slice(at + 1) }
}

// Section ids the AI works on for a given scope. 'cv' = every enabled section on the CV.
export function sectionsForScope(cvData, scope) {
  const { section, entryId } = parseScope(scope)
  if (entryId) return AI_SECTIONS[section]?.perEntry ? [section] : []
  if (section === 'cv') {
    const enabled = (cvData.sectionOrder || []).filter(s => s.enabled).map(s => s.id)
    return ['personal', ...enabled.filter(id => id !== 'personal' && isAiSection(id))]
  }
  if (section === 'profile') return ['personal', 'profile']
  return isAiSection(section) ? [section] : []
}

const hasContent = entry =>
  Object.entries(entry).some(([key, value]) => key !== 'id' && (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== ''))

/** Every individual entry that can be edited on its own, for the scope picker. */
export function entryOptions(cvData) {
  const enabled = (cvData.sectionOrder || []).filter(s => s.enabled).map(s => s.id)
  return enabled
    .filter(id => AI_SECTIONS[id]?.perEntry)
    .flatMap(id => getEntries(id, cvData[id])
      .filter(hasContent)
      .map(entry => ({
        scope: entryScope(id, entry.id),
        section: id,
        label: entryLabel(id, entry) || 'Untitled entry',
      })))
}
