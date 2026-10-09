// What the other conversations are up to, written for the model so a conversation does not
// contradict or repeat suggestions that are pending elsewhere. Changes that were already
// applied need no mention: they are in the CV every conversation works from.

import { parseScope, getEntries, entryLabel, sectionLabel } from './sections.js'
import { t, translate, withLanguage } from '../i18n/core.js'
import { diffAll, applyItems } from './diff.js'

const MAX_ITEMS_EACH = 20
const MAX_TOTAL = 4000
const clip = (text, n) => {
  const flat = String(text ?? '').replace(/\s+/g, ' ').trim()
  return flat.length > n ? `${flat.slice(0, n - 1)}…` : flat
}

/** A short name for what a conversation is about, in `lang` (default: the current language). */
export function scopeTitle(scope, cvData, lang) {
  const { section, entryId } = parseScope(scope)
  if (section === 'cv') return lang ? translate(lang, 'ai.scope.all') : t('ai.scope.all')
  const label = sectionLabel(section, lang)
  if (!entryId) return label
  const entry = getEntries(section, cvData?.[section]).find(e => e.id === entryId)
  const name = entry && entryLabel(section, entry)
  return name ? `${label}: ${name}` : label
}

/** The change items of a conversation that are still pending, compared with the CV as it is now. */
export function pendingItems(cvData, conversation) {
  if (!conversation.sections?.length) return []
  const keys = conversation.sections.flatMap(s => s.items.map(i => i.key))
  const live = diffAll(cvData, applyItems(cvData, conversation.sections, keys))
  const declined = conversation.declined || new Set()
  return live.flatMap(section => section.items.filter(i => !declined.has(i.key)).map(item => ({ section, item })))
}

/**
 * @param conversations the user's OTHER conversations: [{ number, scope, messages, sections, declined }]
 * @returns {string} text for <other_conversations>, or '' when there is nothing to tell
 */
export function describeOthers(cvData, conversations) {
  // This is read by the model, not the user, so it is always English: labels, field names and all.
  return withLanguage('en', () => describeInEnglish(cvData, conversations))
}

function describeInEnglish(cvData, conversations) {
  const blocks = []
  for (const c of conversations) {
    if (!c.messages?.length) continue
    const pending = pendingItems(cvData, c)
    const reply = [...c.messages].reverse().find(m => m.role === 'assistant')
    const lines = [`Conversation ${c.number} (${scopeTitle(c.scope, cvData)}), ${pending.length ? `${pending.length} pending suggestion${pending.length === 1 ? '' : 's'}, not applied yet` : 'no pending suggestions'}:`]
    for (const { section, item } of pending.slice(0, MAX_ITEMS_EACH)) {
      const what = [sectionLabel(section.id), item.label, item.kind === 'remove' ? '' : item.fieldLabel].filter(Boolean).join(' · ')
      lines.push(`- ${what}: ${item.kind === 'remove' ? 'remove it' : clip(item.after, 200)}`)
    }
    if (pending.length > MAX_ITEMS_EACH) lines.push(`- … and ${pending.length - MAX_ITEMS_EACH} more`)
    if (reply) lines.push(`Its last message: ${clip(reply.text, 300)}`)
    blocks.push(lines.join('\n'))
  }
  return blocks.join('\n\n').slice(0, MAX_TOTAL)
}

/**
 * The state of a conversation as it was just before the user message at `index` was sent.
 * Messages from that one on are dropped, the suggestions go back to what they were, and the
 * message text is returned so it can be edited and sent again.
 */
export function rewindConversation(conversation, index) {
  const message = conversation.messages[index]
  if (!message || message.role !== 'user') return null
  const snapshot = message.snapshot
  const first = index === 0
  return {
    messages: conversation.messages.slice(0, index),
    sections: snapshot?.sections ?? [],
    declined: new Set(snapshot?.declined ?? []),
    notes: snapshot?.notes ?? [],
    error: '',
    // the first message lives in the instruction box (the compose screen), later ones in the chat box
    ...(first ? { instruction: message.text, chatInput: '' } : { chatInput: message.text }),
  }
}
