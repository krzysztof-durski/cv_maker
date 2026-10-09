import { useEffect, useRef, useState } from 'react'
import { PROVIDERS, PROVIDER_IDS, pickDefaultModel } from '../../ai/providers'
import Modal, { primaryBtn, secondaryBtn } from './Modal'
import { Spinner } from './icons'
import { inputClass, labelClass } from '../editor/sections/shared'
import { useI18n } from '../../i18n/I18nProvider'

export default function AiSettingsModal({ settings, onClose }) {
  const { t } = useI18n()
  const { provider, keys, models, remember } = settings
  const meta = PROVIDERS[provider]
  const apiKey = keys[provider] || ''

  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState(null) // { ok: boolean, text: string }
  const [available, setAvailable] = useState({}) // provider id -> [{ id, label }] (fetched this session)
  const [customModel, setCustomModel] = useState(false) // typing a model ID instead of picking from the list
  const controllerRef = useRef(null)

  useEffect(() => () => controllerRef.current?.abort(), [])
  useEffect(() => { setStatus(null); setShowKey(false); setCustomModel(false) }, [provider])

  // Fetches the model list, which also proves the key works. `announce` shows the success message
  // (wanted after pressing the button, noise when it happens on its own).
  const loadModels = async ({ announce = true } = {}) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setTesting(true)
    setStatus(null)
    try {
      const found = await meta.listModels(apiKey.trim(), controller.signal)
      setAvailable(prev => ({ ...prev, [provider]: found }))
      // Only choose a default when nothing is set; never replace a model the user picked or typed.
      if (!models[provider]) settings.setModel(provider, pickDefaultModel(provider, found))
      if (announce) setStatus({ ok: true, text: t('ai.settings.keyWorks', { count: found.length }) })
    } catch (err) {
      if (err?.name === 'AbortError') return
      setStatus({ ok: false, text: err.message })
    } finally {
      if (controllerRef.current === controller) setTesting(false)
    }
  }

  // With a key already saved, load the list as soon as the provider is shown, so the dropdown is
  // ready without pressing the button. (Not on every keystroke: only when the provider changes.)
  useEffect(() => {
    if (apiKey && !available[provider]) loadModels({ announce: false })
  }, [provider]) // eslint-disable-line react-hooks/exhaustive-deps

  const list = available[provider] || []
  const currentModel = models[provider] || ''
  const CUSTOM = '__custom__'
  const tab = active =>
    `flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
        : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
    }`

  return (
    <Modal
      title={t('ai.settings.title')}
      subtitle={t('ai.settings.subtitle')}
      size="md"
      onClose={onClose}
      footer={<button className={primaryBtn} onClick={onClose}>{t('common.done')}</button>}
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
          {t('ai.settings.privacy')}
        </div>

        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-0.5 dark:border-gray-700 dark:bg-gray-800">
          {PROVIDER_IDS.map(id => (
            <button key={id} className={tab(id === provider)} onClick={() => settings.setProvider(id)}>
              {PROVIDERS[id].label}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <label className={labelClass} htmlFor="ai-key">{t('ai.settings.key')}</label>
            <a href={meta.keyUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">
              {t('ai.settings.getKey')}
            </a>
          </div>
          <div className="flex gap-2">
            <input
              id="ai-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => { settings.setKey(provider, e.target.value.trim()); setStatus(null) }}
              placeholder={meta.keyPlaceholder}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className={inputClass}
            />
            <button className={secondaryBtn} onClick={() => setShowKey(v => !v)}>{showKey ? t('common.hide') : t('common.show')}</button>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <label className={labelClass} htmlFor="ai-model">{t('ai.settings.model')}</label>
            {list.length > 0 && customModel && (
              <button onClick={() => setCustomModel(false)} className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">
                {t('ai.settings.chooseFromList')}
              </button>
            )}
          </div>

          {list.length > 0 && !customModel ? (
            // A real dropdown: a text box with suggestions only shows the entries matching what is typed.
            <select
              id="ai-model"
              value={currentModel}
              onChange={e => (e.target.value === CUSTOM ? setCustomModel(true) : settings.setModel(provider, e.target.value))}
              className={inputClass}
            >
              {!currentModel && <option value="">{t('ai.settings.selectModel')}</option>}
              {currentModel && !list.some(m => m.id === currentModel) && (
                <option value={currentModel}>{t('ai.settings.notInList', { model: currentModel })}</option>
              )}
              {list.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              <option value={CUSTOM}>{t('ai.settings.otherModel')}</option>
            </select>
          ) : (
            <input
              id="ai-model"
              value={currentModel}
              onChange={e => settings.setModel(provider, e.target.value.trim())}
              placeholder={apiKey ? (testing ? t('ai.settings.placeholderLoading') : t('ai.settings.placeholderTypeOrTest')) : t('ai.settings.placeholderNeedKey')}
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className={primaryBtn} disabled={!apiKey || testing} onClick={() => loadModels()}>
            {testing && <Spinner className="h-3.5 w-3.5" />}
            {testing ? t('ai.settings.checking') : t('ai.settings.test')}
          </button>
          {apiKey && (
            <button
              className={`${secondaryBtn} text-red-600 dark:text-red-400`}
              onClick={() => {
                settings.setKey(provider, '')
                setAvailable(prev => ({ ...prev, [provider]: undefined }))
                setCustomModel(false)
                setStatus(null)
              }}
            >
              {t('ai.settings.removeKey')}
            </button>
          )}
        </div>

        {status && (
          <p className={`rounded-lg px-3 py-2 text-xs ${
            status.ok
              ? 'bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-300'
              : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
          }`}>
            {status.text}
          </p>
        )}

        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => settings.setRemember(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-indigo-600"
          />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            <span className="font-medium text-gray-800 dark:text-gray-100">{t('ai.settings.rememberTitle')}</span>
            <br />
            {t('ai.settings.rememberText')}
          </span>
        </label>
      </div>
    </Modal>
  )
}
