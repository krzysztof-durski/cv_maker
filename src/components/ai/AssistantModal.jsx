import { useEffect, useMemo, useRef, useState } from 'react'
import Modal, { primaryBtn, secondaryBtn } from './Modal'
import ReviewChanges from './ReviewChanges'
import ModelPicker from './ModelPicker'
import { useConversations } from './useConversations'
import { Spinner, PaperclipIcon, CloseIcon, SparkleIcon } from './icons'
import { PROVIDERS } from '../../ai/providers'
import { AI_SECTIONS, SCOPABLE_SECTIONS, entryOptions, parseScope } from '../../ai/sections'
import { presetsForScope, MAX_REFERENCE_CHARS, FOLLOW_UPS } from '../../ai/prompts'
import { runTurn, groundingFrom } from '../../ai/session'
import { computeWarnings } from '../../ai/sanitize'
import { diffAll, applyItems, countChanges } from '../../ai/diff'
import { describeOthers, rewindConversation, scopeTitle } from '../../ai/awareness'
import { extractText, ACCEPT } from '../../ai/extractText'
import { newId, inputClass, labelClass } from '../editor/sections/shared'

const allKeys = sections => sections.flatMap(s => s.items.map(i => i.key))

/**
 * The assistant. It stays mounted while closed, so conversations and the suggestions under review
 * survive closing the dialog (and editing the CV by hand). The user can run several conversations
 * side by side; each new message tells the model what the others have pending. Every message of
 * the user's can be rewound to, restoring the chat and suggestions as they were before it.
 */
export default function AssistantModal({ open, requestId, initialScope = 'cv', cvData, settings, onClose, onOpenSettings, onApply }) {
  const {
    conversations, active: c, patch, activate, add, remove, reset, setAbort, abort, isCurrent, abortAll,
  } = useConversations()

  // The job description and attachments are shared by every conversation.
  const [reference, setReference] = useState('')
  const [files, setFiles] = useState([]) // [{ name, text, truncated }]
  const [reading, setReading] = useState(false)
  const [attachError, setAttachError] = useState('')

  const fileInputRef = useRef(null)
  const chatInputRef = useRef(null)
  const transcriptRef = useRef(null)
  const lastRequest = useRef(null)

  const provider = PROVIDERS[settings.provider]
  const inSession = c.messages.length > 0
  const stage = inSession ? 'session' : c.busy ? 'running' : 'compose'

  // Opened (again): resume the conversation about this scope, or use a blank one, or start a new one.
  useEffect(() => {
    if (!open || lastRequest.current === requestId) return
    lastRequest.current = requestId
    const same = conversations.find(x => x.messages.length > 0 && x.scope === initialScope)
    if (same) { activate(same.id); return }
    const blank = c.messages.length === 0 && !c.busy ? c : conversations.find(x => x.messages.length === 0 && !x.busy)
    if (blank) {
      patch(blank.id, { scope: initialScope, instruction: '', presetId: null, error: '' })
      activate(blank.id)
      return
    }
    add(initialScope)
  }, [open, requestId]) // eslint-disable-line react-hooks/exhaustive-deps

  const referenceText = [
    reference.trim(),
    ...files.map(f => `[Attached file: ${f.name}]\n${f.text}`),
  ].filter(Boolean).join('\n\n')
  const tooLong = referenceText.length > MAX_REFERENCE_CHARS
  const grounding = useMemo(() => groundingFrom(referenceText, c.messages), [referenceText, c.messages])

  // The suggestions, re-compared with the CV as it is now (it may have been edited since).
  const live = useMemo(() => {
    if (!open || c.sections.length === 0) return []
    return diffAll(cvData, applyItems(cvData, c.sections, allKeys(c.sections)))
  }, [open, cvData, c.sections])
  const warnings = useMemo(
    () => (live.length ? computeWarnings(cvData, applyItems(cvData, live, allKeys(live)), { grounding }) : {}),
    [cvData, live, grounding]
  )
  const accepted = useMemo(() => new Set(allKeys(live).filter(key => !c.declined.has(key))), [live, c.declined])
  const count = countChanges(live, accepted)
  const itemByKey = useMemo(() => new Map(live.flatMap(s => s.items.map(i => [i.key, i]))), [live])

  useEffect(() => {
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [c.messages, c.busy, c.id, open])

  useEffect(() => () => abortAll(), []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- scope picker ---------- */

  const opened = parseScope(c.scope)
  const enabledIds = new Set(cvData.sectionOrder.filter(s => s.enabled).map(s => s.id))
  const scopeOptions = SCOPABLE_SECTIONS.filter(id => enabledIds.has(id) || id === opened.section)
  const entries = entryOptions(cvData)
  if (opened.entryId && !entries.some(o => o.scope === c.scope)) {
    entries.push({ scope: c.scope, section: opened.section, label: 'Untitled entry' })
  }
  const title = c.scope === 'cv' ? 'AI assistant' : `Improve ${scopeTitle(c.scope, cvData).replace(/^[^:]*: /, '')}`
  const presets = presetsForScope(c.scope)
  const activePreset = presets.find(p => p.id === c.presetId)

  /* ---------- conversation ---------- */

  // The first message starts from the user's CV. Later ones continue it, working on the CV with the
  // suggestions the user has kept so far, so nothing they accepted is lost.
  const converse = async (text, first) => {
    const id = c.id
    const controller = new AbortController()
    setAbort(id, controller)

    const userMessage = {
      role: 'user',
      text,
      // what the screen looked like before this message, so it can be rewound to
      snapshot: first ? null : { sections: c.sections, declined: new Set(c.declined), notes: c.notes },
    }
    patch(id, { busy: true, retryNote: '', error: '', ...(first ? {} : { messages: [...c.messages, userMessage], chatInput: '' }) })

    const modelUsed = settings.model
    try {
      const turn = await runTurn({
        complete: ({ system, user, signal, onRetry }) =>
          provider.complete({ key: settings.apiKey, model: settings.model, system, user, signal, onRetry }),
        originalCv: cvData,
        workingCv: first ? cvData : applyItems(cvData, live, accepted),
        scope: c.scope,
        instruction: text,
        reference: referenceText,
        messages: first ? [] : c.messages,
        others: describeOthers(cvData, conversations.filter(x => x.id !== id)),
        newId,
        signal: controller.signal,
        onRetry: ({ attempt, total }) => patch(id, { retryNote: `${provider.label.split(' ')[0]} is busy right now. Retrying (${attempt} of ${total})…` }),
      })

      const answer = [turn.summary, turn.reply].filter(Boolean).join('\n\n')
      if (first && turn.sections.length === 0 && !turn.reply && !turn.summary) {
        patch(id, { error: ['The AI had no changes to suggest for that request. Try rephrasing, or add more detail.', ...turn.notes].join(' ') })
        return
      }
      const assistant = {
        role: 'assistant',
        text: answer || (turn.sections.length ? 'Here are my suggestions.' : 'I have no changes to suggest.'),
        model: modelUsed,
      }
      patch(id, prev => ({
        messages: first ? [userMessage, assistant] : [...prev.messages, assistant],
        sections: turn.sections,
        declined: new Set(), // the ones declined were left out of this round
        notes: turn.notes,
      }))
    } catch (err) {
      if (err?.name === 'AbortError') {
        if (!first) patch(id, prev => ({ messages: prev.messages.slice(0, -1), chatInput: text })) // take it back so it can be edited
        return
      }
      const message = err.message || 'Something went wrong. Please try again.'
      if (first) patch(id, { error: message })
      else patch(id, prev => ({ messages: [...prev.messages, { role: 'error', text: message }] })) // the suggestions stay as they were
    } finally {
      if (isCurrent(id, controller)) patch(id, { busy: false, retryNote: '' })
    }
  }

  const send = () => {
    const text = c.chatInput.trim()
    if (!text || c.busy || !settings.ready) return
    converse(text, false)
  }

  const rewind = index => {
    const changes = rewindConversation(c, index)
    if (!changes) return
    if (!window.confirm('Go back to before this message? It and everything after it, including the suggestions it produced, will be removed. Its text is put back so you can edit it.')) return
    abort(c.id)
    patch(c.id, { ...changes, busy: false, retryNote: '' })
    setTimeout(() => chatInputRef.current?.focus(), 50)
  }

  const discuss = item => {
    patch(c.id, { chatInput: `About "${item.label || item.fieldLabel}"${item.label ? ` (${item.fieldLabel})` : ''}: ` })
    chatInputRef.current?.focus()
  }

  const toggleItem = key => patch(c.id, prev => {
    const next = new Set(prev.declined)
    const keys = [key, itemByKey.get(key)?.pair].filter(Boolean) // a move is accepted or declined as a whole
    const declining = !prev.declined.has(key)
    for (const k of keys) { if (declining) next.add(k); else next.delete(k) }
    return { declined: next }
  })

  const toggleSection = id => {
    const section = live.find(s => s.id === id)
    if (!section) return
    const keys = section.items.flatMap(i => [i.key, i.pair].filter(Boolean))
    const allOn = section.items.every(i => !c.declined.has(i.key))
    patch(c.id, prev => {
      const next = new Set(prev.declined)
      for (const k of keys) { if (allOn) next.add(k); else next.delete(k) }
      return { declined: next }
    })
  }

  const apply = () => {
    onApply(live, [...accepted], count)
    reset(c.id)
    onClose()
  }

  const startOver = () => {
    if (live.length === 0 || window.confirm('Discard these suggestions and the conversation?')) reset(c.id)
  }

  const closeConversation = conversation => {
    if (conversation.messages.length > 0 && !window.confirm('Close this conversation and discard its suggestions?')) return
    remove(conversation.id)
  }

  const attach = async fileList => {
    setAttachError('')
    setReading(true)
    for (const file of Array.from(fileList)) {
      try {
        const result = await extractText(file)
        setFiles(prev => [...prev.filter(f => f.name !== result.name), result])
      } catch (err) {
        setAttachError(err.message)
      }
    }
    setReading(false)
  }

  if (!open) return null

  const latest = [...c.messages].reverse().find(m => m.role === 'assistant')

  /* ---------- footer per stage ---------- */

  let footer
  if (stage === 'compose') {
    footer = (
      <>
        <button className={secondaryBtn} onClick={onClose}>Cancel</button>
        <button
          className={primaryBtn}
          disabled={!settings.ready || !c.instruction.trim() || reading}
          onClick={() => converse(c.instruction, true)}
        >
          <SparkleIcon className="h-4 w-4" /> Get suggestions
        </button>
      </>
    )
  } else if (stage === 'running') {
    footer = <button className={secondaryBtn} onClick={() => abort(c.id)}>Cancel request</button>
  } else {
    footer = (
      <div className="w-full space-y-2">
        {!c.busy && !c.chatInput && (
          <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {FOLLOW_UPS.map(text => (
              <button
                key={text}
                onClick={() => { patch(c.id, { chatInput: text }); chatInputRef.current?.focus() }}
                className="shrink-0 whitespace-nowrap rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-600"
              >
                {text}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={e => { e.preventDefault(); send() }} className="flex items-end gap-2">
          <textarea
            ref={chatInputRef}
            id="ai-chat-input"
            value={c.chatInput}
            onChange={e => patch(c.id, { chatInput: e.target.value })}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            rows={2}
            disabled={c.busy || !settings.ready}
            placeholder={'Ask a question, or tell the AI what to change, e.g. "shorten the Initech bullets"'}
            className={`${inputClass} resize-none`}
          />
          <button type="submit" className={primaryBtn} disabled={c.busy || !c.chatInput.trim() || !settings.ready}>Send</button>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button onClick={startOver} className="text-xs text-gray-500 hover:text-red-600 hover:underline dark:text-gray-400">
            Start over
          </button>
          <div className="flex items-center gap-2">
            <button className={secondaryBtn} onClick={onClose} title="Your suggestions are kept">Close</button>
            <button className={primaryBtn} disabled={count === 0 || c.busy} onClick={apply}>
              Apply {count} change{count === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const subtitle = settings.ready ? `${provider.label} · ${settings.model}` : 'Connect your own AI account to get started'

  return (
    <Modal title={title} subtitle={subtitle} size={stage === 'session' ? 'xl' : 'lg'} onClose={onClose} footer={footer}>
      {(conversations.length > 1 || inSession) && (
        <div role="tablist" aria-label="Conversations" className="thin-scroll mb-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          {conversations.map(x => {
            const pending = x.sections.reduce((n, s) => n + s.items.length, 0)
            const selected = x.id === c.id
            return (
              <div
                key={x.id}
                className={`flex shrink-0 items-center rounded-lg border text-xs ${
                  selected
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-800 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-200'
                    : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                <button
                  role="tab"
                  aria-selected={selected}
                  onClick={() => activate(x.id)}
                  className="flex max-w-[13rem] items-center gap-1.5 px-2.5 py-1.5"
                >
                  <span className="font-semibold">{x.number}</span>
                  <span className="truncate">{scopeTitle(x.scope, cvData)}</span>
                  {x.busy && <Spinner className="h-3 w-3" />}
                  {pending > 0 && !x.busy && (
                    <span className="rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold text-white">{pending}</span>
                  )}
                </button>
                {conversations.length > 1 && (
                  <button
                    onClick={() => closeConversation(x)}
                    aria-label={`Close conversation ${x.number}`}
                    className="mr-1 grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/10"
                  >
                    <CloseIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            )
          })}
          <button
            onClick={() => add('cv')}
            className="shrink-0 rounded-lg border border-dashed border-gray-300 px-2.5 py-1.5 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400"
            title="Start another conversation. It knows what the others are suggesting."
          >
            + New conversation
          </button>
        </div>
      )}

      {stage === 'running' && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Spinner className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Asking {settings.model}…</p>
          <p className="max-w-xs text-xs text-gray-500 dark:text-gray-400">
            This can take up to a minute for a full CV. Your CV only changes after you review the suggestions.
          </p>
          {c.retryNote && (
            <p className="max-w-xs rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              {c.retryNote}
            </p>
          )}
        </div>
      )}

      {stage === 'session' && (
        <div className="flex flex-col gap-4 lg:grid lg:h-[54vh] lg:grid-cols-[2fr_3fr]">
          {/* conversation */}
          <section className="order-2 flex min-h-0 flex-col lg:order-1">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <h3 className={`${labelClass} mb-0`}>Conversation</h3>
              <ModelPicker settings={settings} onOpenSettings={onOpenSettings} />
            </div>
            <div
              ref={transcriptRef}
              data-testid="transcript"
              className="thin-scroll max-h-72 min-h-0 flex-1 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800/50 lg:max-h-none"
            >
              {c.messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'ml-6' : 'mr-6'}>
                  <div
                    className={`whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : m.role === 'error'
                          ? 'border border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300'
                          : 'border border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                    }`}
                  >
                    {m.text}
                    {m.role === 'assistant' && m.model && (
                      <p data-model-label className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">{m.model}</p>
                    )}
                  </div>
                  {m.role === 'user' && !c.busy && (
                    <button
                      onClick={() => rewind(i)}
                      className="ml-auto mt-0.5 block text-[11px] text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Go back to before this message and edit it"
                    >
                      ↩ Rewind &amp; edit
                    </button>
                  )}
                </div>
              ))}
              {c.busy && (
                <div className="mr-6 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <Spinner className="h-3.5 w-3.5" />
                  <span>{c.retryNote || 'Thinking…'}</span>
                  <button onClick={() => abort(c.id)} className="ml-auto text-indigo-600 hover:underline dark:text-indigo-400">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* suggestions */}
          <section className="thin-scroll order-1 min-h-0 lg:order-2 lg:overflow-y-auto lg:pr-1">
            {latest && (
              <p className="mb-3 whitespace-pre-wrap rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200 lg:hidden">
                {latest.text}
              </p>
            )}
            {live.length > 0 ? (
              <ReviewChanges
                sections={live}
                warnings={warnings}
                notes={c.notes}
                declined={c.declined}
                onToggleItem={toggleItem}
                onToggleSection={toggleSection}
                onDiscuss={discuss}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                {c.notes.map((note, i) => <p key={i} className="mb-2 text-amber-800 dark:text-amber-300">⚠ {note}</p>)}
                No suggested changes right now. Ask a question, or tell the AI what to change.
              </div>
            )}
            {live.length > 0 && (
              <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                Changes you untick are dropped when you send your next message.
              </p>
            )}
          </section>
        </div>
      )}

      {stage === 'compose' && (
        <div className="space-y-4">
          {!settings.ready ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="text-xs text-amber-900 dark:text-amber-200">
                Add your own OpenAI, Claude or Gemini API key to use the assistant.
              </p>
              <button className={primaryBtn} onClick={onOpenSettings}>Add API key</button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ModelPicker settings={settings} onOpenSettings={onOpenSettings} />
              <button onClick={onOpenSettings} className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">AI settings</button>
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="ai-scope">What should the AI work on?</label>
            <select
              id="ai-scope"
              value={c.scope}
              onChange={e => patch(c.id, { scope: e.target.value, presetId: null })}
              className={inputClass}
            >
              <option value="cv">Entire CV</option>
              <optgroup label="One section">
                {scopeOptions.map(id => <option key={id} value={id}>{AI_SECTIONS[id].label} only</option>)}
              </optgroup>
              {entries.length > 0 && (
                <optgroup label="One job, project or entry">
                  {entries.map(o => <option key={o.scope} value={o.scope}>{AI_SECTIONS[o.section].label}: {o.label}</option>)}
                </optgroup>
              )}
            </select>
          </div>

          <div>
            <p className={labelClass}>Quick prompts</p>
            <div className="flex flex-wrap gap-1.5" data-testid="presets">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => patch(c.id, { presetId: p.id, instruction: p.instruction, error: '' })}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    p.id === c.presetId
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="ai-instruction">Instruction</label>
            <textarea
              id="ai-instruction"
              value={c.instruction}
              onChange={e => patch(c.id, { instruction: e.target.value, presetId: null })}
              rows={4}
              placeholder="Pick a quick prompt above, or describe what you want, e.g. “I'm applying for the AI Product & Growth Engineer role. Tailor my CV for it.”"
              className={`${inputClass} resize-y`}
            />
            {activePreset?.needsReference && !referenceText && (
              <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">
                This works best with a job description. Paste one or attach a file below.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="ai-reference">Job description or other reference (optional, shared by all conversations)</label>
            <textarea
              id="ai-reference"
              value={reference}
              onChange={e => setReference(e.target.value)}
              rows={5}
              placeholder="Paste the job posting, notes about the role, or anything else the AI should use as context."
              className={`${inputClass} resize-y`}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button className={secondaryBtn} disabled={reading} onClick={() => fileInputRef.current?.click()}>
                {reading ? <Spinner className="h-3.5 w-3.5" /> : <PaperclipIcon className="h-3.5 w-3.5" />}
                {reading ? 'Reading…' : 'Attach file'}
              </button>
              <span className="text-xs text-gray-400 dark:text-gray-500">PDF, Word (.docx), text or HTML</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPT}
                className="hidden"
                onChange={e => { attach(e.target.files); e.target.value = '' }}
              />
            </div>

            {files.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {files.map(f => (
                  <li
                    key={f.name}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 py-1 pl-2.5 pr-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <span className="max-w-[12rem] truncate">{f.name}</span>
                    <span className="text-gray-400">{f.text.length.toLocaleString()} chars{f.truncated ? ' (cut)' : ''}</span>
                    <button
                      onClick={() => setFiles(prev => prev.filter(x => x.name !== f.name))}
                      className="grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Remove file"
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {attachError && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{attachError}</p>}
            {tooLong && (
              <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">
                The reference text is over {MAX_REFERENCE_CHARS.toLocaleString()} characters, so the end will be left out.
              </p>
            )}
          </div>

          {c.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/40 dark:text-red-300">{c.error}</p>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Your CV text and any reference you add are sent to {provider.label.split(' ')[0]} using your key.
            The AI can rewrite, reorder, remove duplicates and move entries between sections, but it cannot change your
            contact details, or the employers, schools and dates of existing entries. When you tailor to a job, your job
            title becomes the role's exact title from the job text.
          </p>
        </div>
      )}
    </Modal>
  )
}
