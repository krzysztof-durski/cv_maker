// Validates what the AI returned against the CV schema. The model is never trusted to respect
// the prompt: only whitelisted fields are taken, entries are matched to the originals by id,
// and anything unexpected is dropped. The result is a full replacement value per section.
//
// For a list section the AI describes its edits as explicit operations (all optional):
//   update   existing entries whose editable fields change
//   add      brand-new entries (a merge, or something moved here from the wrong section)
//   remove   ids of entries to delete (duplicates, or entries moved elsewhere)
//   restore  ids of originals that earlier suggestions removed and the user wants back
//   order    the complete new order of the remaining entries
// Removal is explicit on purpose: an answer that merely forgets an entry never deletes it.

import { AI_SECTIONS, getEntries, withEntries, entryLabel } from './sections.js'
import { t } from '../i18n/core.js'

const BULLET_PREFIX = /^[\s•·●▪\-–—*]+/

function coerceString(value, fallback) {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)
  return fallback
}

function coerceBullets(value, fallback) {
  let list = value
  if (typeof list === 'string') list = list.split('\n')
  if (!Array.isArray(list)) return fallback
  const bullets = list
    .map(b => (typeof b === 'string' ? b : typeof b === 'number' ? String(b) : ''))
    .map(b => b.replace(BULLET_PREFIX, '').trim())
    .filter(Boolean)
  // An empty answer for something that had content is far more likely a model slip than intent.
  return bullets.length === 0 && Array.isArray(fallback) && fallback.length > 0 ? fallback : bullets
}

function coerceField(field, value, fallback) {
  if (value === undefined || value === null) return fallback
  if (field === 'bullets') return coerceBullets(value, fallback)
  if (field === 'items' && Array.isArray(value)) {
    return value.filter(v => typeof v === 'string' && v.trim()).map(v => v.trim()).join(', ')
  }
  return coerceString(value, fallback)
}

function mergeFields(fields, original, incoming) {
  const out = { ...original }
  for (const field of fields) {
    if (field in incoming) out[field] = coerceField(field, incoming[field], original[field])
  }
  return out
}

const normalize = text => String(text ?? '').toLowerCase().replace(/\s+/g, ' ').trim()
const stringIds = list => (Array.isArray(list) ? list : []).filter(x => typeof x === 'string')

/* ---------- job title ---------- */

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Finds `title` word for word in `text` and returns it as written there (so the casing and
 * punctuation of the job posting are kept), or '' if it isn't there. Whole words only: "Software
 * Engineer" is not found inside "Software Engineering Student".
 */
export function findVerbatim(title, text) {
  const words = String(title ?? '').trim().split(/\s+/).filter(Boolean)
  if (!words.length || !text) return ''
  const pattern = new RegExp(`(?:^|[^\\p{L}\\p{N}])(${words.map(escapeRegExp).join('\\s+')})(?![\\p{L}\\p{N}])`, 'iu')
  const match = pattern.exec(text)
  return match ? match[1].replace(/\s+/g, ' ') : ''
}

/* ---------- single record (profile) ---------- */

function sanitizeObject(spec, original = {}, incoming) {
  // Accept a bare string for single-field sections, e.g. "profile": "New bio…"
  if (typeof incoming === 'string' && spec.editable.length === 1) {
    incoming = { [spec.editable[0]]: incoming }
  }
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) return null
  return mergeFields(spec.editable, original, incoming)
}

/* ---------- lists ---------- */

function newEntry(spec, raw, newId) {
  if (!raw || typeof raw !== 'object') return null
  const entry = {}
  for (const field of spec.fields) entry[field] = coerceField(field, raw[field], field === 'bullets' ? [] : '')
  if (!spec.identity.some(field => String(entry[field]).trim())) return null
  return { id: newId(), ...entry }
}

function sanitizeStructured(id, spec, baseValue, incoming, newId, restoreFrom) {
  const base = getEntries(id, baseValue)
  const originals = getEntries(id, restoreFrom?.[id])
  const originalIds = new Set(originals.map(e => e.id))
  const byId = new Map(base.map(e => [e.id, e]))

  const removed = new Set(stringIds(incoming.remove).filter(entryId => byId.has(entryId)))

  const updates = new Map()
  for (const update of Array.isArray(incoming.update) ? incoming.update : []) {
    if (!update || typeof update !== 'object' || !byId.has(update.id) || removed.has(update.id) || updates.has(update.id)) continue
    // Entries the AI created earlier in the conversation are its own work, so they stay fully editable.
    const fields = originalIds.has(update.id) ? spec.editable : spec.fields
    updates.set(update.id, mergeFields(fields, byId.get(update.id), update))
  }
  let kept = base.filter(e => !removed.has(e.id)).map(e => updates.get(e.id) || e)

  // Put back originals that were removed earlier, in their original place.
  const originalIndex = new Map(originals.map((e, i) => [e.id, i]))
  for (const entryId of stringIds(incoming.restore)) {
    const entry = originals.find(e => e.id === entryId)
    if (!entry || kept.some(e => e.id === entryId)) continue
    const at = kept.findIndex(e => originalIndex.has(e.id) && originalIndex.get(e.id) > originalIndex.get(entryId))
    kept = at === -1 ? [...kept, entry] : [...kept.slice(0, at), entry, ...kept.slice(at)]
  }

  // A new order is only trusted if it names every remaining entry; a partial list would
  // quietly push everything it forgot to the end.
  if (Array.isArray(incoming.order)) {
    const order = [...new Set(stringIds(incoming.order))].filter(entryId => kept.some(e => e.id === entryId))
    if (order.length === kept.length) {
      const position = new Map(order.map((entryId, i) => [entryId, i]))
      kept = [...kept].sort((a, b) => position.get(a.id) - position.get(b.id))
    }
  }

  // New entries go at the end (the user can reorder), and never duplicate an entry that is already there.
  const label = entry => normalize(entryLabel(id, entry))
  const taken = new Set(kept.map(label).filter(Boolean))
  const added = []
  for (const raw of Array.isArray(incoming.add) ? incoming.add : []) {
    const entry = newEntry(spec, raw, newId)
    if (!entry) continue
    const name = label(entry)
    if (name && taken.has(name)) continue
    if (name) taken.add(name)
    added.push(entry)
  }

  return withEntries(id, baseValue, [...kept, ...added])
}

const isStructured = incoming =>
  incoming && typeof incoming === 'object' && !Array.isArray(incoming) &&
  ['update', 'add', 'remove', 'restore', 'order'].some(key => key in incoming)

function sanitizeList(id, spec, baseValue, incoming, newId, entryId, restoreFrom) {
  // Whole-section and whole-CV answers can restructure the list. A single entry never can.
  if (isStructured(incoming) && !entryId) return sanitizeStructured(id, spec, baseValue, incoming, newId, restoreFrom)

  const originals = getEntries(id, baseValue)
  let entries = isStructured(incoming) ? incoming.update
    : Array.isArray(incoming) ? incoming
    : Array.isArray(incoming?.entries) ? incoming.entries
    : null
  if (!Array.isArray(entries)) return null

  // One entry was sent on its own: touch only that entry and leave every other entry, and the order, alone.
  if (entryId) {
    const target = originals.find(e => e.id === entryId)
    const answer = entries.find(e => e && typeof e === 'object' && e.id === entryId)
      || (entries.length === 1 && entries[0] && typeof entries[0] === 'object' && !entries[0].id ? entries[0] : null)
    if (!target || !answer) return null
    return withEntries(id, baseValue, originals.map(e => (e.id === entryId ? mergeFields(spec.editable, e, answer) : e)))
  }

  // A bare array of entries (the older answer format). Same number of entries and no ids at all:
  // assume the model kept the original order.
  if (entries.length === originals.length && entries.every(e => e && typeof e === 'object' && !e.id)) {
    entries = entries.map((e, i) => ({ ...e, id: originals[i].id }))
  }

  const byId = new Map(originals.map(e => [e.id, e]))
  const used = new Set()
  const out = []

  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue
    const original = byId.get(entry.id)
    if (original) {
      if (used.has(original.id)) continue
      used.add(original.id)
      out.push(mergeFields(spec.editable, original, entry))
    } else if (spec.canAdd) {
      const fresh = mergeFields(spec.editable, Object.fromEntries(spec.editable.map(f => [f, ''])), entry)
      if (spec.editable.some(f => String(fresh[f]).trim())) out.push({ ...fresh, id: newId() })
    }
  }

  // In this format the AI cannot delete: anything it left out stays, after the ones it returned.
  for (const entry of originals) if (!used.has(entry.id)) out.push(entry)

  return withEntries(id, baseValue, out)
}

/**
 * @param base      the CV the AI was shown (the working copy: the real CV plus the suggestions accepted so far)
 * @param changes   the model's `changes` object
 * @param opts.newId             id generator for new entries
 * @param opts.grounding         everything the user supplied (job text, their messages); a job title must appear in it
 * @param opts.entryId           set when a single entry was sent to the AI; only that entry can change
 * @param opts.targetJobTitle    the role title the AI says the CV is tailored to
 * @param opts.allowTitle        whether the job title is in scope for this request
 * @param opts.restoreFrom       the user's real CV, source for `restore` and for telling original entries from new ones
 * @returns {{ result: object, notes: string[] }}
 *   result: id -> full replacement value for that section (only sections that came back valid)
 *   notes:  messages for the user about answers that were set aside
 */
export function sanitizeChanges(base, changes, {
  newId, grounding = '', entryId = null, targetJobTitle = '', allowTitle = false, restoreFrom = base,
} = {}) {
  const result = {}
  const notes = []
  const source = changes && typeof changes === 'object' ? changes : {}

  for (const [id, spec] of Object.entries(AI_SECTIONS)) {
    if (id === 'personal' || !Object.prototype.hasOwnProperty.call(source, id)) continue
    const next = spec.kind === 'object'
      ? sanitizeObject(spec, base[id], source[id])
      : sanitizeList(id, spec, base[id], source[id], newId, entryId, restoreFrom)
    if (next) result[id] = next
  }

  // The job title is never taken on the AI's word. It has to appear, word for word, in the job
  // text or in what the user wrote, and then it is used exactly as written there.
  if (allowTitle) {
    const current = base.personal?.jobTitle || ''
    const proposed = typeof source.personal?.jobTitle === 'string' ? source.personal.jobTitle.trim() : ''
    const chosen = (targetJobTitle && findVerbatim(targetJobTitle, grounding)) || (proposed && findVerbatim(proposed, grounding)) || ''
    if (chosen) {
      if (chosen !== current) result.personal = { ...base.personal, jobTitle: chosen }
    } else if (targetJobTitle || (proposed && proposed !== current)) {
      notes.push(t('ai.notes.jobTitleRejected', { title: targetJobTitle || proposed }))
    }
  }

  return { result, notes }
}

/* ---------- things worth a second look ---------- */

const NUMBER = /\d+(?:[.,]\d+)*/g

function collectText(value, out = []) {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach(v => collectText(v, out))
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) if (k !== 'id') collectText(v, out)
  }
  return out
}

const numbersIn = value => new Set(collectText(value).join('\n').match(NUMBER) || [])

/**
 * Warnings for the sections where `draft` differs from the user's real CV:
 *   - numbers that appear nowhere in the CV or in what the user supplied
 *   - new entries naming an employer, school, project… that appears nowhere either
 * @returns {Record<string, string[]>} section id -> messages
 */
export function computeWarnings(original, draft, { grounding = '' } = {}) {
  const warnings = {}
  const known = numbersIn({ cv: original, grounding })
  const source = normalize(collectText({ cv: original, grounding }).join('\n'))

  for (const [id, spec] of Object.entries(AI_SECTIONS)) {
    if (!(id in draft) || JSON.stringify(draft[id]) === JSON.stringify(original[id])) continue
    const messages = []

    const fresh = [...numbersIn(draft[id])].filter(n => !known.has(n))
    if (fresh.length) {
      messages.push(t('ai.notes.numbers', { numbers: fresh.slice(0, 6).join(', ') }))
    }

    if (spec.kind !== 'object' && !spec.freeform) {
      const originalIds = new Set(getEntries(id, original[id]).map(e => e.id))
      const unknown = new Set()
      for (const entry of getEntries(id, draft[id])) {
        if (originalIds.has(entry.id)) continue
        for (const field of spec.identity) {
          const value = String(entry[field] ?? '').trim()
          if (value.length >= 2 && !source.includes(normalize(value))) unknown.add(value)
        }
      }
      if (unknown.size) {
        messages.push(t('ai.notes.newEntries', { names: [...unknown].map(v => `"${v}"`).join(', ') }))
      }
    }

    if (messages.length) warnings[id] = messages
  }
  return warnings
}
