// Thin fetch adapters for the three providers. Everything runs in the user's browser with
// the user's own key; there is no backend. No SDKs, so nothing here adds to the bundle.
//
// CORS notes (checked against the live endpoints):
//   - OpenAI only allows the `authorization` and `content-type` request headers, so don't add others.
//   - Anthropic requires `anthropic-dangerous-direct-browser-access: true` for browser calls.
//   - Gemini accepts the key in `x-goog-api-key`, which keeps it out of URLs and logs.

import { t } from '../i18n/core.js'

export class AiError extends Error {
  constructor(message, kind = 'api', { retryable = false } = {}) {
    super(message)
    this.name = 'AiError'
    this.kind = kind // 'auth' | 'quota' | 'network' | 'cutoff' | 'blocked' | 'unavailable' | 'api'
    this.retryable = retryable
  }
}

// Overload and server errors usually clear within seconds (Gemini's 503 "The model is overloaded"
// is the common one), so those requests are retried before the user ever sees an error.
// One entry per retry, so this is 5 retries (6 attempts in all) over about 40 seconds.
export const retryPolicy = { delaysMs: [2000, 4000, 8000, 12000, 15000] }
const RETRYABLE_STATUS = new Set([500, 502, 503, 504, 529]) // 529 = Anthropic "overloaded"

// Sleep that rejects as soon as the user cancels.
const wait = (ms, signal) => new Promise((resolve, reject) => {
  const abort = () => {
    clearTimeout(timer)
    reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }))
  }
  const timer = setTimeout(() => {
    signal?.removeEventListener('abort', abort)
    resolve()
  }, ms)
  if (signal?.aborted) abort()
  else signal?.addEventListener('abort', abort, { once: true })
})

async function readError(res) {
  try {
    const data = await res.json()
    const detail = data?.error?.message || data?.message || ''
    return String(detail).slice(0, 400)
  } catch {
    return ''
  }
}

async function callOnce(label, url, { method = 'GET', headers, body, signal }) {
  let res
  try {
    res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined, signal })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    // OpenAI answers a rejected key without CORS headers, so a wrong key can surface here too.
    throw new AiError(t('ai.errors.network', { provider: label }), 'network')
  }
  if (res.ok) return res.json()

  const detail = await readError(res)
  const suffix = detail ? `: ${detail}` : ''
  // Gemini reports a bad key as 400 rather than 401.
  const badKey = res.status === 400 && /api key (is )?(not valid|invalid)|invalid api key/i.test(detail)
  if (res.status === 401 || res.status === 403 || badKey) {
    throw new AiError(t('ai.errors.auth', { provider: label, detail: suffix }), 'auth')
  }
  if (res.status === 429) {
    throw new AiError(t('ai.errors.quota', { provider: label, detail: suffix }), 'quota')
  }
  if (res.status >= 500) {
    throw new AiError(t('ai.errors.unavailable', { provider: label, status: res.status, detail: suffix }), 'unavailable', {
      retryable: RETRYABLE_STATUS.has(res.status),
    })
  }
  throw new AiError(t('ai.errors.other', { provider: label, status: res.status, detail: suffix }))
}

// `onRetry({ attempt, total })` lets the UI say "busy, retrying…" while we back off.
async function call(label, url, options) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await callOnce(label, url, options)
    } catch (err) {
      if (!err.retryable) throw err
      const delay = retryPolicy.delaysMs[attempt]
      if (delay === undefined) {
        const tried = attempt > 0 ? t('ai.errors.tried', { count: attempt + 1 }) : ''
        err.message += `${tried}${t('ai.errors.tryAgain')}`
        throw err
      }
      options.onRetry?.({ attempt: attempt + 1, total: retryPolicy.delaysMs.length })
      await wait(delay, options.signal)
    }
  }
}

/* ---------- which models are worth offering ---------- */
// Providers list everything they sell: image, audio, video, embedding and research models, dated
// snapshots, aliases. Only current text chat models can edit a CV, so each provider's list is
// reduced to those with an allow-list (not a block-list, which new product names slip past).
// A model that is not offered can still be typed in under "Other…" in the settings.

// gpt-5, gpt-4.1, gpt-4o, gpt-5-mini, gpt-5-nano, gpt-5-pro, o3, o4-mini: no dated snapshots, audio, image or search variants.
const OPENAI_CHAT = /^(gpt-\d+(\.\d+)*o?(-mini|-nano|-pro)?|o\d+(-mini|-pro)?)$/

export function relevantOpenAiModels(models) {
  return models
    .filter(m => OPENAI_CHAT.test(m.id))
    .sort((a, b) => (b.created || 0) - (a.created || 0))
    .map(m => ({ id: m.id, label: m.id }))
}

// claude-sonnet-5-5 rather than claude-sonnet-4-5-20250929 when the undated alias exists.
export function relevantAnthropicModels(models) {
  const ids = new Set(models.map(m => m.id))
  return models
    .filter(m => /^claude-/.test(m.id))
    .filter(m => !(/-\d{8}$/.test(m.id) && ids.has(m.id.replace(/-\d{8}$/, ''))))
    .map(m => ({ id: m.id, label: m.display_name ? `${m.display_name} (${m.id})` : m.id }))
}

// gemini-3.5-flash, gemini-3.1-pro-preview, gemini-2.5-flash-lite: no tts, image, live, transcribe,
// computer-use, robotics, custom-tools, "-latest" aliases or dated previews.
const GEMINI_CHAT = /^gemini-\d+(\.\d+)*-(pro|flash|flash-lite)(-preview)?$/
const GEMINI_TIER = { pro: 0, flash: 1, 'flash-lite': 2 }

export function relevantGeminiModels(models) {
  return models
    .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map(m => ({ id: m.name.replace(/^models\//, ''), label: m.displayName || m.name }))
    .filter(m => GEMINI_CHAT.test(m.id))
    .sort((a, b) => byVersionDesc(a, b)
      || GEMINI_TIER[a.id.match(/-(pro|flash-lite|flash)/)[1]] - GEMINI_TIER[b.id.match(/-(pro|flash-lite|flash)/)[1]]
      || Number(a.id.endsWith('-preview')) - Number(b.id.endsWith('-preview')))
}

/* ---------- OpenAI ---------- */

const OPENAI = 'https://api.openai.com/v1'
const openaiHeaders = key => ({ Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' })

const openai = {
  id: 'openai',
  label: 'OpenAI (ChatGPT)',
  keyUrl: 'https://platform.openai.com/api-keys',
  keyPlaceholder: 'sk-…',

  async listModels(key, signal) {
    const data = await call('OpenAI', `${OPENAI}/models`, { headers: openaiHeaders(key), signal })
    return relevantOpenAiModels(data.data || [])
  },

  async complete({ key, model, system, user, signal, onRetry }) {
    const data = await call('OpenAI', `${OPENAI}/chat/completions`, {
      method: 'POST',
      headers: openaiHeaders(key),
      // No temperature / max_tokens: reasoning models reject non-default values for them.
      body: {
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        response_format: { type: 'json_object' },
      },
      signal, onRetry,
    })
    const choice = data.choices?.[0]
    if (choice?.message?.refusal) throw new AiError(t('ai.errors.openaiDeclined', { reason: choice.message.refusal }), 'blocked')
    if (choice?.finish_reason === 'length') throw new AiError(t('ai.errors.cutoff'), 'cutoff')
    return choice?.message?.content || ''
  },
}

/* ---------- Anthropic ---------- */

const ANTHROPIC = 'https://api.anthropic.com/v1'
const anthropicHeaders = key => ({
  'x-api-key': key,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
  'Content-Type': 'application/json',
})

const anthropic = {
  id: 'anthropic',
  label: 'Anthropic (Claude)',
  keyUrl: 'https://console.anthropic.com/settings/keys',
  keyPlaceholder: 'sk-ant-…',

  async listModels(key, signal) {
    const data = await call('Anthropic', `${ANTHROPIC}/models?limit=1000`, { headers: anthropicHeaders(key), signal })
    return relevantAnthropicModels(data.data || [])
  },

  async complete({ key, model, system, user, signal, onRetry }) {
    const data = await call('Anthropic', `${ANTHROPIC}/messages`, {
      method: 'POST',
      headers: anthropicHeaders(key),
      body: { model, max_tokens: 16000, system, messages: [{ role: 'user', content: user }] },
      signal, onRetry,
    })
    if (data.stop_reason === 'max_tokens') throw new AiError(t('ai.errors.cutoff'), 'cutoff')
    if (data.stop_reason === 'refusal') throw new AiError(t('ai.errors.claudeDeclined'), 'blocked')
    return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
  },
}

/* ---------- Google Gemini ---------- */

const GEMINI = 'https://generativelanguage.googleapis.com/v1beta'
const geminiHeaders = key => ({ 'x-goog-api-key': key, 'Content-Type': 'application/json' })
const geminiModelPath = id => `models/${encodeURIComponent(String(id).replace(/^models\//, ''))}`

const gemini = {
  id: 'gemini',
  label: 'Google (Gemini)',
  keyUrl: 'https://aistudio.google.com/apikey',
  keyPlaceholder: 'AIza…',

  async listModels(key, signal) {
    const data = await call('Gemini', `${GEMINI}/models?pageSize=1000`, { headers: geminiHeaders(key), signal })
    return relevantGeminiModels(data.models || [])
  },

  async complete({ key, model, system, user, signal, onRetry }) {
    const data = await call('Gemini', `${GEMINI}/${geminiModelPath(model)}:generateContent`, {
      method: 'POST',
      headers: geminiHeaders(key),
      body: {
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { responseMimeType: 'application/json' },
      },
      signal, onRetry,
    })
    if (data.promptFeedback?.blockReason) {
      throw new AiError(t('ai.errors.geminiBlocked', { reason: data.promptFeedback.blockReason }), 'blocked')
    }
    const candidate = data.candidates?.[0]
    if (candidate?.finishReason === 'MAX_TOKENS') throw new AiError(t('ai.errors.cutoff'), 'cutoff')
    if (candidate?.finishReason && !['STOP', 'FINISH_REASON_UNSPECIFIED'].includes(candidate.finishReason)) {
      throw new AiError(t('ai.errors.geminiStopped', { reason: candidate.finishReason }), 'blocked')
    }
    return (candidate?.content?.parts || []).filter(p => p.text && !p.thought).map(p => p.text).join('')
  },
}

export const PROVIDERS = { openai, anthropic, gemini }
export const PROVIDER_IDS = Object.keys(PROVIDERS)

/* ---------- model picking ---------- */

const versionOf = id => (id.match(/\d+(?:\.\d+)*/)?.[0] || '0').split('.').map(Number)
const byVersionDesc = (a, b) => {
  const [x, y] = [versionOf(a.id), versionOf(b.id)]
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((y[i] || 0) !== (x[i] || 0)) return (y[i] || 0) - (x[i] || 0)
  }
  return 0
}

/** A sensible starting model from a provider's list; the user can always change it. */
export function pickDefaultModel(providerId, models) {
  if (!models.length) return ''
  const find = re => models.filter(m => re.test(m.id)).sort(byVersionDesc)[0]
  const pick =
    providerId === 'anthropic' ? models.find(m => m.id === 'claude-sonnet-5-5') || find(/sonnet/) :
    providerId === 'openai'    ? find(/^gpt-\d+(\.\d+)*$/) :
    providerId === 'gemini'    ? find(/^gemini-[\d.]+-flash$/) :
    null
  return (pick || models[0]).id
}
