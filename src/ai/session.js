// One turn of the assistant conversation, without any UI. The first turn works on the user's CV;
// a follow-up works on that CV with the suggestions the user has kept so far applied, so earlier
// progress is never lost and the model sees exactly what applying now would produce.

import { buildRequest } from './prompts.js'
import { parseAiJson } from './parseResponse.js'
import { sanitizeChanges } from './sanitize.js'
import { diffAll } from './diff.js'
import { parseScope } from './sections.js'

/** Everything the user has supplied. Job titles, numbers and new entries are checked against it. */
export function groundingFrom(reference, messages) {
  return [reference, ...messages.filter(m => m.role === 'user').map(m => m.text)].filter(Boolean).join('\n\n')
}

/**
 * @param complete    (system, user, signal, onRetry) => Promise<string>, the provider call
 * @param originalCv  the user's real CV
 * @param workingCv   what the model should work on: originalCv, or originalCv plus the accepted suggestions
 * @param messages    the conversation so far: [{ role: 'user' | 'assistant' | 'error', text }]
 * @param language    the language the user reads the app in, for the model's summary and reply
 * @param gender      the forms the person's Polish text uses: 'auto', 'masculine' or 'feminine'
 * @returns {Promise<{ summary, reply, notes, grounding, draftCv, sections, sectionIds }>}
 *   draftCv is workingCv with the new answer applied; sections compares it with originalCv
 */
export async function runTurn({
  complete, originalCv, workingCv, scope, instruction, reference = '', messages = [], others = '', newId, signal, onRetry, language = 'en', gender = 'auto',
}) {
  const history = messages.filter(m => m.role === 'user' || m.role === 'assistant')
  const { system, user, sectionIds } = buildRequest({ cvData: workingCv, originalCv, scope, instruction, reference, history, others, language, gender })

  const text = await complete({ system, user, signal, onRetry })
  const { summary, reply, targetJobTitle, changes } = parseAiJson(text)

  const grounding = groundingFrom(reference, [...history, { role: 'user', text: instruction }])
  const { result, notes } = sanitizeChanges(workingCv, changes, {
    newId,
    grounding,
    entryId: parseScope(scope).entryId,
    targetJobTitle,
    allowTitle: sectionIds.includes('personal'),
    restoreFrom: originalCv,
  })

  // The model may wander outside the sections it was asked about; ignore those.
  const inScope = Object.fromEntries(Object.entries(result).filter(([id]) => sectionIds.includes(id)))
  const draftCv = { ...workingCv, ...inScope }

  return { summary, reply, notes, grounding, draftCv, sections: diffAll(originalCv, draftCv), sectionIds }
}
