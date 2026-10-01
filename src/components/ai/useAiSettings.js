import { useState, useCallback } from 'react'
import { PROVIDER_IDS } from '../../ai/providers'

// AI settings live under their own keys, never inside `cv_maker_data`, so backups
// (which export only the CV) can never contain an API key.
const PREFS_KEY = 'cv_maker_ai_prefs'
const keyName = id => `cv_maker_ai_key_${id}`

const attempt = (fn, fallback) => {
  try { return fn() } catch { return fallback }
}

const storageFor = remember => (remember ? window.localStorage : window.sessionStorage)

function loadPrefs() {
  const saved = attempt(() => JSON.parse(window.localStorage.getItem(PREFS_KEY)), null) || {}
  return {
    provider: PROVIDER_IDS.includes(saved.provider) ? saved.provider : PROVIDER_IDS[0],
    models: saved.models && typeof saved.models === 'object' ? saved.models : {},
    remember: saved.remember === true,
  }
}

function loadKeys() {
  return Object.fromEntries(PROVIDER_IDS.map(id => [
    id,
    attempt(() => window.localStorage.getItem(keyName(id)) || window.sessionStorage.getItem(keyName(id)) || '', ''),
  ]))
}

function savePrefs({ provider, models, remember }) {
  attempt(() => window.localStorage.setItem(PREFS_KEY, JSON.stringify({ provider, models, remember })))
}

function writeKey(id, value, remember) {
  attempt(() => {
    window.localStorage.removeItem(keyName(id))
    window.sessionStorage.removeItem(keyName(id))
    if (value) storageFor(remember).setItem(keyName(id), value)
  })
}

/**
 * Provider choice, per-provider model and key. By default the key lasts only for the
 * browser tab (sessionStorage); "remember" moves it to localStorage on this device.
 */
export function useAiSettings() {
  const [state, setState] = useState(() => ({ ...loadPrefs(), keys: loadKeys() }))

  const update = useCallback(patch => {
    setState(prev => {
      const next = { ...prev, ...patch }
      savePrefs(next)
      return next
    })
  }, [])

  const setProvider = useCallback(provider => update({ provider }), [update])

  const setModel = useCallback((id, model) => {
    setState(prev => {
      const next = { ...prev, models: { ...prev.models, [id]: model } }
      savePrefs(next)
      return next
    })
  }, [])

  const setKey = useCallback((id, value) => {
    setState(prev => {
      writeKey(id, value, prev.remember)
      return { ...prev, keys: { ...prev.keys, [id]: value } }
    })
  }, [])

  const setRemember = useCallback(remember => {
    setState(prev => {
      for (const id of PROVIDER_IDS) if (prev.keys[id]) writeKey(id, prev.keys[id], remember)
      const next = { ...prev, remember }
      savePrefs(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    attempt(() => {
      window.localStorage.removeItem(PREFS_KEY)
      for (const id of PROVIDER_IDS) {
        window.localStorage.removeItem(keyName(id))
        window.sessionStorage.removeItem(keyName(id))
      }
    })
    setState({ ...loadPrefs(), keys: Object.fromEntries(PROVIDER_IDS.map(id => [id, ''])) })
  }, [])

  const { provider, models, remember, keys } = state
  const apiKey = keys[provider] || ''
  const model = models[provider] || ''

  return {
    provider, models, remember, keys,
    apiKey, model,
    ready: Boolean(apiKey && model),
    setProvider, setModel, setKey, setRemember, clearAll,
  }
}
