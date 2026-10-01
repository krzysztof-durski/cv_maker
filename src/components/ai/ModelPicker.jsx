import { useEffect, useState } from 'react'
import { PROVIDERS, PROVIDER_IDS, pickDefaultModel } from '../../ai/providers'

// Model lists are fetched once per key and remembered while the page is open.
const cache = new Map()

const selectClass =
  'min-w-0 max-w-[11rem] truncate rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'

/** Switch provider and model, also in the middle of a conversation. The next message uses the new choice. */
export default function ModelPicker({ settings, onOpenSettings }) {
  const { provider, apiKey, keys } = settings
  const cacheKey = `${provider}:${apiKey.slice(-8)}`
  const [lists, setLists] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!apiKey || cache.has(cacheKey)) return undefined
    const controller = new AbortController()
    setLoading(true)
    PROVIDERS[provider].listModels(apiKey, controller.signal)
      .then(found => {
        cache.set(cacheKey, found)
        setLists(prev => ({ ...prev, [cacheKey]: found }))
        if (!settings.models[provider]) settings.setModel(provider, pickDefaultModel(provider, found))
      })
      .catch(() => {}) // the dropdown simply stays short; Settings explains key problems
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [cacheKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const list = lists[cacheKey] || cache.get(cacheKey) || []
  const current = settings.model
  const providers = PROVIDER_IDS.filter(id => keys[id] || id === provider)

  return (
    <div className="flex flex-wrap items-center gap-1.5" data-testid="model-picker">
      <select
        aria-label="AI provider"
        value={provider}
        onChange={e => (e.target.value === '__add__' ? onOpenSettings() : settings.setProvider(e.target.value))}
        className={selectClass}
      >
        {providers.map(id => <option key={id} value={id}>{PROVIDERS[id].label}</option>)}
        <option value="__add__">Add another provider…</option>
      </select>
      <select
        aria-label="AI model"
        value={current}
        onChange={e => (e.target.value === '__other__' ? onOpenSettings() : settings.setModel(provider, e.target.value))}
        className={selectClass}
        title={loading ? 'Loading models…' : 'The next message uses this model'}
      >
        {!current && <option value="">{loading ? 'Loading…' : 'Select a model…'}</option>}
        {current && !list.some(m => m.id === current) && <option value={current}>{current}</option>}
        {list.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
        <option value="__other__">Other model…</option>
      </select>
    </div>
  )
}
