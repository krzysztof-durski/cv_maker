import { t } from '../i18n/core.js'

// Turns the raw text a model returns into { summary, reply, targetJobTitle, changes }. Models sometimes
// wrap JSON in code fences or add a sentence before/after it, so parsing is deliberately tolerant.
//
//   summary          what changed, in a sentence or two
//   reply            an answer to a question, or a note to the user (shown in the chat)
//   targetJobTitle   the exact title of the role the CV is being tailored to, when there is one
//   changes          the proposed edits per section

function stripFences(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  return fenced ? fenced[1] : text
}

function tryParse(text) {
  try { return JSON.parse(text) } catch { return undefined }
}

const clean = value => (typeof value === 'string' ? value.trim() : '')

export function parseAiJson(raw) {
  const original = String(raw ?? '').trim()
  const text = stripFences(original).trim()

  let data = tryParse(text)
  if (data === undefined) {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start !== -1 && end > start) data = tryParse(text.slice(start, end + 1))
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    // Braces that never closed look like a cut-off answer. Plain prose is the model just talking
    // (answering a question, or declining), which is worth showing as it is.
    if (text.includes('{')) throw new Error(t('ai.errors.cutoff'))
    if (original) return { summary: '', reply: original, targetJobTitle: '', changes: {} }
    throw new Error(t('ai.errors.empty'))
  }

  let changes = data.changes
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
    // Be forgiving: some models put the sections at the top level.
    const { summary: _s, reply: _r, targetJobTitle: _t, changes: _c, ...rest } = data
    changes = rest
  }
  return {
    summary: clean(data.summary),
    reply: clean(data.reply),
    targetJobTitle: clean(data.targetJobTitle),
    changes,
  }
}
