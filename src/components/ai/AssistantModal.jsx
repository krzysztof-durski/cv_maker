import { useEffect, useMemo, useRef, useState } from 'react'
import Modal, { primaryBtn, secondaryBtn } from './Modal'
import ReviewChanges from './ReviewChanges'
import ModelPicker from './ModelPicker'
import AiErrorNotice from './AiErrorNotice'
import BusyAdvice from './BusyAdvice'
import AutoTextarea from '../editor/AutoTextarea'
import { useConversations } from './useConversations'
import { Spinner, PaperclipIcon, CloseIcon, SparkleIcon } from './icons'
import { PROVIDERS } from '../../ai/providers'
import { AI_SECTIONS, SCOPABLE_SECTIONS, entryOptions, parseScope } from '../../ai/sections'
import { presetsForScope, MAX_REFERENCE_CHARS } from '../../ai/prompts'
import { runTurn, groundingFrom } from '../../ai/session'
import { needsBusyAdvice, retryMessage } from '../../ai/troubleshooting'
import { computeWarnings } from '../../ai/sanitize'
import { diffAll, applyItems, countChanges } from '../../ai/diff'
import { describeOthers, rewindConversation, scopeTitle } from '../../ai/awareness'
import { extractText, ACCEPT } from '../../ai/extractText'
import { newId, inputClass, labelClass } from '../editor/sections/shared'
import { useI18n } from '../../i18n/I18nProvider'
import { resolveCvLanguage } from '../../i18n/cvLanguage'
import { nameIn } from '../../i18n/core'

// Text boxes grow with their text up to these heights (px), then scroll, so a long pasted job posting can't push the buttons off screen.
const CHAT_INPUT_MAX_HEIGHT = 160
const FORM_TEXT_MAX_HEIGHT = 260

const allKeys = sections => sections.flatMap(s => s.items.map(i => i.key))

/**
 * The assistant. It stays mounted while closed, so conversations and the suggestions under review
 * survive closing the dialog (and editing the CV by hand). The user can run several conversations
 * side by side; each new message tells the model what the others have pending. Every message of
 * the user's can be rewound to, restoring the chat and suggestions as they were before it.
 */
export default function AssistantModal({ open, requestId, initialScope = 'cv', cvData, settings, onClose, onOpenSettings, onApply }) {
  const { t, lang } = useI18n()
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
      patch(blank.id, { scope: initialScope, instruction: '', presetId: null, error: '', errorKind: '' })
      activate(blank.id)
      return
    }
    add(initialScope)
  }, [open, requestId]) // eslint-disable-line react-hooks/exhaustive-deps

  const referenceText = [
    reference.trim(),
    ...files.map(f => `[Attached file: ${f.name}]\n${f.text}`), // read by the model, so always English
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
    entries.push({ scope: c.scope, section: opened.section, label: t('ai.assistant.untitled') })
  }
  const title = c.scope === 'cv' ? t('ai.assistant.title') : t('ai.assistant.improve', { name: scopeTitle(c.scope, cvData).replace(/^[^:]*: /, '') })
  const presets = presetsForScope(c.scope)
  // Prompts that translate need to know the language of the CV, written the way the app's own language names it.
  const presetVars = { language: nameIn(lang, resolveCvLanguage(cvData.language, lang)) }
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
    patch(id, { busy: true, retryNote: '', error: '', errorKind: '', ...(first ? {} : { messages: [...c.messages, userMessage], chatInput: '' }) })

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
        language: lang,
        gender: cvData.gender,
        messages: first ? [] : c.messages,
        others: describeOthers(cvData, conversations.filter(x => x.id !== id)),
        newId,
        signal: controller.signal,
        onRetry: progress => patch(id, { retryNote: retryMessage(provider.label.split(' ')[0], progress) }),
      })

      const answer = [turn.summary, turn.reply].filter(Boolean).join('\n\n')
      if (first && turn.sections.length === 0 && !turn.reply && !turn.summary) {
        patch(id, { error: [t('ai.assistant.noChanges'), ...turn.notes].join(' ') })
        return
      }
      const assistant = {
        role: 'assistant',
        text: answer || (turn.sections.length ? t('ai.assistant.hereAre') : t('ai.assistant.noneToSuggest')),
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
      const message = err.message || t('ai.assistant.genericError')
      if (first) patch(id, { error: message, errorKind: err.kind || '' })
      else patch(id, prev => ({ messages: [...prev.messages, { role: 'error', text: message, kind: err.kind || '' }] })) // the suggestions stay as they were
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
    if (!window.confirm(t('ai.assistant.confirmRewind'))) return
    abort(c.id)
    patch(c.id, { ...changes, busy: false, retryNote: '' })
    setTimeout(() => chatInputRef.current?.focus(), 50)
  }

  const discuss = item => {
    patch(c.id, { chatInput: `${item.label ? t('ai.assistant.aboutItemField', { label: item.label, field: item.fieldLabel }) : t('ai.assistant.aboutItem', { label: item.fieldLabel })}: ` })
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
    if (live.length === 0 || window.confirm(t('ai.assistant.confirmStartOver'))) reset(c.id)
  }

  const closeConversation = conversation => {
    if (conversation.messages.length > 0 && !window.confirm(t('ai.assistant.confirmCloseConversation'))) return
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
        <button className={secondaryBtn} onClick={onClose}>{t('ai.assistant.cancel')}</button>
        <button
          className={primaryBtn}
          disabled={!settings.ready || !c.instruction.trim() || reading}
          onClick={() => converse(c.instruction, true)}
        >
          <SparkleIcon className="h-4 w-4" /> {t('ai.assistant.getSuggestions')}
        </button>
      </>
    )
  } else if (stage === 'running') {
    footer = <button className={secondaryBtn} onClick={() => abort(c.id)}>{t('ai.assistant.cancelRequest')}</button>
  } else {
    footer = (
      <div className="w-full space-y-2">
        {!c.busy && !c.chatInput && (
          <div className="thin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {t('ai.followUps').map(text => (
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
          <AutoTextarea
            ref={chatInputRef}
            id="ai-chat-input"
            value={c.chatInput}
            maxHeight={CHAT_INPUT_MAX_HEIGHT}
            onChange={v => patch(c.id, { chatInput: v })}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            rows={2}
            disabled={c.busy || !settings.ready}
            placeholder={t('ai.assistant.chatPlaceholder')}
          />
          <button type="submit" className={primaryBtn} disabled={c.busy || !c.chatInput.trim() || !settings.ready}>{t('ai.assistant.send')}</button>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button onClick={startOver} className="text-xs text-gray-500 hover:text-red-600 hover:underline dark:text-gray-400">
            {t('ai.assistant.startOver')}
          </button>
          <div className="flex items-center gap-2">
            <button className={secondaryBtn} onClick={onClose} title={t('ai.assistant.closeTitle')}>{t('ai.assistant.close')}</button>
            <button className={primaryBtn} disabled={count === 0 || c.busy} onClick={apply}>
              {t('ai.assistant.apply', { count })}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const subtitle = settings.ready ? `${provider.label} · ${settings.model}` : t('ai.assistant.connect')

  return (
    <Modal title={title} subtitle={subtitle} size={stage === 'session' ? 'xl' : 'lg'} onClose={onClose} footer={footer}>
      {(conversations.length > 1 || inSession) && (
        <div role="tablist" aria-label={t('ai.assistant.conversations')} className="thin-scroll mb-3 flex items-center gap-1.5 overflow-x-auto pb-1">
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
                    aria-label={`${t('ai.assistant.closeConversation')} ${x.number}`}
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
            title={t('ai.assistant.newConversationTitle')}
          >
            {t('ai.assistant.newConversation')}
          </button>
        </div>
      )}

      {stage === 'running' && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Spinner className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{t('ai.assistant.asking', { model: settings.model })}</p>
          <p className="max-w-xs text-xs text-gray-500 dark:text-gray-400">
            {t('ai.assistant.takesAMinute')}
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
              <h3 className={`${labelClass} mb-0`}>{t('ai.assistant.conversation')}</h3>
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
                    {m.role === 'error' && needsBusyAdvice(m.kind) && <div className="mt-2 whitespace-normal"><BusyAdvice compact /></div>}
                    {m.role === 'assistant' && m.model && (
                      <p data-model-label className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">{m.model}</p>
                    )}
                  </div>
                  {m.role === 'user' && !c.busy && (
                    <button
                      onClick={() => rewind(i)}
                      className="ml-auto mt-0.5 block text-[11px] text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title={t('ai.assistant.rewindTitle')}
                    >
                      {t('ai.assistant.rewind')}
                    </button>
                  )}
                </div>
              ))}
              {c.busy && (
                <div className="mr-6 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <Spinner className="h-3.5 w-3.5" />
                  <span>{c.retryNote || t('ai.assistant.thinking')}</span>
                  <button onClick={() => abort(c.id)} className="ml-auto text-indigo-600 hover:underline dark:text-indigo-400">
                    {t('ai.assistant.cancel')}
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
                {t('ai.assistant.noSuggestions')}
              </div>
            )}
            {live.length > 0 && (
              <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                {t('ai.review.untickNote')}
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
                {t('ai.assistant.addKeyPrompt')}
              </p>
              <button className={primaryBtn} onClick={onOpenSettings}>{t('ai.assistant.addKey')}</button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <ModelPicker settings={settings} onOpenSettings={onOpenSettings} />
              <button onClick={onOpenSettings} className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">{t('ai.assistant.settings')}</button>
            </div>
          )}

          <div>
            <label className={labelClass} htmlFor="ai-scope">{t('ai.assistant.scopeLabel')}</label>
            <select
              id="ai-scope"
              value={c.scope}
              onChange={e => patch(c.id, { scope: e.target.value, presetId: null })}
              className={inputClass}
            >
              <option value="cv">{t('ai.assistant.scopeAll')}</option>
              <optgroup label={t('ai.assistant.scopeSection')}>
                {scopeOptions.map(id => <option key={id} value={id}>{t('ai.assistant.scopeSectionOption', { label: AI_SECTIONS[id].label })}</option>)}
              </optgroup>
              {entries.length > 0 && (
                <optgroup label={t('ai.assistant.scopeEntry')}>
                  {entries.map(o => <option key={o.scope} value={o.scope}>{AI_SECTIONS[o.section].label}: {o.label}</option>)}
                </optgroup>
              )}
            </select>
          </div>

          <div>
            <p className={labelClass}>{t('ai.assistant.quickPrompts')}</p>
            <div className="flex flex-wrap gap-1.5" data-testid="presets">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => patch(c.id, { presetId: p.id, instruction: p.instructionFor(presetVars), error: '', errorKind: '' })}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    p.id === c.presetId
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-300'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-600'
                  }`}
                >
                  {p.labelFor(presetVars)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="ai-instruction">{t('ai.assistant.instruction')}</label>
            <AutoTextarea
              id="ai-instruction"
              value={c.instruction}
              maxHeight={FORM_TEXT_MAX_HEIGHT}
              onChange={v => patch(c.id, { instruction: v, presetId: null })}
              rows={4}
              placeholder={t('ai.assistant.instructionPlaceholder')}
            />
            {activePreset?.needsReference && !referenceText && (
              <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">
                {t('ai.assistant.needsJob')}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="ai-reference">{t('ai.assistant.reference')}</label>
            <AutoTextarea
              id="ai-reference"
              value={reference}
              maxHeight={FORM_TEXT_MAX_HEIGHT}
              onChange={setReference}
              rows={5}
              placeholder={t('ai.assistant.referencePlaceholder')}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button className={secondaryBtn} disabled={reading} onClick={() => fileInputRef.current?.click()}>
                {reading ? <Spinner className="h-3.5 w-3.5" /> : <PaperclipIcon className="h-3.5 w-3.5" />}
                {reading ? t('ai.assistant.reading') : t('ai.assistant.attach')}
              </button>
              <span className="text-xs text-gray-400 dark:text-gray-500">{t('ai.assistant.fileTypes')}</span>
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
                    <span className="text-gray-400">{t('ai.assistant.chars', { count: f.text.length.toLocaleString(lang) })}{f.truncated ? t('ai.assistant.cut') : ''}</span>
                    <button
                      onClick={() => setFiles(prev => prev.filter(x => x.name !== f.name))}
                      className="grid h-5 w-5 place-items-center rounded text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      title={t('ai.assistant.removeFile')}
                      aria-label={t('ai.assistant.removeFile')}
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
                {t('ai.assistant.tooLong', { max: MAX_REFERENCE_CHARS.toLocaleString(lang) })}
              </p>
            )}
          </div>

          <AiErrorNotice message={c.error} kind={c.errorKind} />

          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t('ai.assistant.privacyNote', { provider: provider.label.split(' ')[0] })}
          </p>
        </div>
      )}
    </Modal>
  )
}
