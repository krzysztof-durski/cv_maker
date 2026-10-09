// Before/after comparison for the review screen, and applying the changes the user accepts.
//
// A comparison is a list of items, one per individual change. Each item carries the operation
// needed to apply it (`op`), so any subset can be applied, and the same items can be applied
// again later onto a CV that has since been edited by hand.
//
//   kind     meaning                              op
//   edit     one field of one entry (or record)   { field, value } / { entryId, field, value }
//   add      a new entry                          { entry }
//   remove   delete an entry                      { entryId }
//   order    new order of the entries             { ids }

import { AI_SECTIONS, FIELD_LABELS, getEntries, withEntries, entryLabel } from './sections.js'
import { t } from '../i18n/core.js'

export function valueToText(value) {
  if (Array.isArray(value)) return value.map(v => `• ${v}`).join('\n')
  return value == null ? '' : String(value)
}

const same = (a, b) => JSON.stringify(a ?? '') === JSON.stringify(b ?? '')

/** A whole entry as readable text, for showing a new or removed entry. */
export function entryToText(id, entry) {
  return AI_SECTIONS[id].fields
    .map(field => {
      const value = entry[field]
      if (Array.isArray(value)) return value.map(v => `• ${v}`).join('\n')
      return value ? `${FIELD_LABELS[field] || field}: ${value}` : ''
    })
    .filter(Boolean)
    .join('\n')
}

function diffObject(id, spec, before = {}, after = {}) {
  return spec.editable
    .filter(field => !same(before[field], after[field]))
    .map(field => ({
      key: `${id}:${field}`,
      kind: 'edit',
      label: '',
      fieldLabel: FIELD_LABELS[field] || field,
      before: valueToText(before[field]),
      after: valueToText(after[field]),
      op: { field, value: after[field] },
    }))
}

function diffList(id, spec, beforeValue, afterValue) {
  const beforeEntries = getEntries(id, beforeValue)
  const afterEntries = getEntries(id, afterValue)
  const beforeById = new Map(beforeEntries.map(e => [e.id, e]))
  const afterIds = new Set(afterEntries.map(e => e.id))
  const name = entry => entryLabel(id, entry) || t('ai.diff.untitled')
  const items = []

  for (const entry of afterEntries) {
    const prev = beforeById.get(entry.id)
    if (!prev) {
      items.push({
        key: `${id}:+${entry.id}`,
        kind: 'add',
        label: name(entry),
        fieldLabel: t('ai.diff.newEntry'),
        before: '',
        after: entryToText(id, entry),
        op: { entry },
      })
      continue
    }
    for (const field of spec.editable) {
      if (same(prev[field], entry[field])) continue
      items.push({
        key: `${id}:${entry.id}:${field}`,
        kind: 'edit',
        label: name(entry),
        fieldLabel: FIELD_LABELS[field] || field,
        before: valueToText(prev[field]),
        after: valueToText(entry[field]),
        op: { entryId: entry.id, field, value: entry[field] },
      })
    }
  }

  for (const entry of beforeEntries) {
    if (afterIds.has(entry.id)) continue
    items.push({
      key: `${id}:-${entry.id}`,
      kind: 'remove',
      label: name(entry),
      fieldLabel: t('ai.diff.removedEntry'),
      before: entryToText(id, entry),
      after: '',
      op: { entryId: entry.id },
    })
  }

  const sharedBefore = beforeEntries.filter(e => afterIds.has(e.id))
  const sharedAfter = afterEntries.filter(e => beforeById.has(e.id))
  if (!same(sharedBefore.map(e => e.id), sharedAfter.map(e => e.id))) {
    items.push({
      key: `${id}:order`,
      kind: 'order',
      label: t('ai.diff.entryOrder'),
      fieldLabel: t('ai.diff.order'),
      before: sharedBefore.map(name).join('\n'),
      after: sharedAfter.map(name).join('\n'),
      op: { ids: sharedAfter.map(e => e.id) },
    })
  }
  return items
}

export function diffSection(id, before, after) {
  const spec = AI_SECTIONS[id]
  const items = spec.kind === 'object' ? diffObject(id, spec, before, after) : diffList(id, spec, before, after)
  return { changed: items.length > 0, items }
}

const normalize = text => String(text).toLowerCase().replace(/\s+/g, ' ').trim()

// An entry removed from one section and added to another is a move. Link the two so they are
// accepted or declined together: taking only the removal would lose the entry.
function linkMoves(sections) {
  for (const from of sections) {
    for (const removal of from.items.filter(i => i.kind === 'remove' && !i.pair)) {
      const name = normalize(removal.label)
      for (const to of sections) {
        if (to.id === from.id) continue
        const addition = to.items.find(i => {
          if (i.kind !== 'add' || i.pair) return false
          const other = normalize(i.label)
          return name.length >= 3 && other.length >= 3 && (other.includes(name) || name.includes(other))
        })
        if (!addition) continue
        removal.pair = addition.key
        addition.pair = removal.key
        removal.fieldLabel = t('ai.diff.movedTo', { section: AI_SECTIONS[to.id].label })
        addition.fieldLabel = t('ai.diff.movedFrom', { section: AI_SECTIONS[from.id].label })
        break
      }
    }
  }
  return sections
}

/** Sections whose content differs between the user's CV and the draft, as lists of change items. */
export function diffAll(original, draft) {
  const sections = Object.keys(AI_SECTIONS)
    .filter(id => id in draft)
    .map(id => ({ id, label: AI_SECTIONS[id].label, ...diffSection(id, original[id], draft[id]) }))
    .filter(section => section.changed)
  return linkMoves(sections)
}

/** How many separate decisions the user is making: a move (removal + addition) counts once. */
export function countChanges(sections, acceptedKeys) {
  const accepted = acceptedKeys instanceof Set ? acceptedKeys : new Set(acceptedKeys)
  let count = 0
  for (const section of sections) {
    for (const item of section.items) {
      if (!accepted.has(item.key)) continue
      if (item.pair && item.pair < item.key && accepted.has(item.pair)) continue
      count++
    }
  }
  return count
}

function reorder(entries, ids) {
  const position = new Map(ids.map((entryId, i) => [entryId, i]))
  // Entries the order doesn't mention (e.g. one whose removal was declined) keep their relative place at the end.
  return [...entries].sort((a, b) => (position.get(a.id) ?? Infinity) - (position.get(b.id) ?? Infinity) || 0)
}

/** A new CV with only the accepted items applied to `cvData`. */
export function applyItems(cvData, sections, acceptedKeys) {
  const accepted = acceptedKeys instanceof Set ? acceptedKeys : new Set(acceptedKeys)
  const next = { ...cvData }

  for (const section of sections) {
    const picked = section.items.filter(item => accepted.has(item.key))
    if (!picked.length) continue

    if (AI_SECTIONS[section.id].kind === 'object') {
      next[section.id] = { ...next[section.id], ...Object.fromEntries(picked.map(i => [i.op.field, i.op.value])) }
      continue
    }

    let entries = [...getEntries(section.id, next[section.id])]
    for (const item of picked) {
      if (item.kind === 'remove') entries = entries.filter(e => e.id !== item.op.entryId)
      else if (item.kind === 'edit') entries = entries.map(e => (e.id === item.op.entryId ? { ...e, [item.op.field]: item.op.value } : e))
      else if (item.kind === 'add' && !entries.some(e => e.id === item.op.entry.id)) entries.push(item.op.entry)
    }
    const order = picked.find(item => item.kind === 'order')
    if (order) entries = reorder(entries, order.op.ids)
    next[section.id] = withEntries(section.id, next[section.id], entries)
  }
  return next
}
