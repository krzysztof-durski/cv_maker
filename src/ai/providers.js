// Thin fetch adapters for the three providers. Everything runs in the user's browser with
// the user's own key; there is no backend. No SDKs, so nothing here adds to the bundle.
//
// CORS notes (checked against the live endpoints):
//   - OpenAI only allows the `authorization` and `content-type` request headers, so don't add others.
//   - Anthropic requires `anthropic-dangerous-direct-browser-access: true` for browser calls.
//   - Gemini accepts the key in `x-goog-api-key`, which keeps it out of URLs and logs.

import { CUT_OFF_MESSAGE } from './parseResponse.js'

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
export const retryPolicy = { delaysMs: [2000, 5000, 10000] }
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
    throw new AiError(
      `Couldn't reach ${label}. Check your internet connection and that no browser extension or network filter is blocking it. A wrong API key can also cause this, so try "Test key" in AI settings.`,
      'network'
    )
  }
  if (res.ok) return res.json()

  const detail = await readError(res)
  const suffix = detail ? `: ${detail}` : ''
  // Gemini reports a bad key as 400 rather than 401.
  const badKey = res.status === 400 && /api key (is )?(not valid|invalid)|invalid api key/i.test(detail)
  if (res.status === 401 || res.status === 403 || badKey) {
    throw new AiError(`${label} rejected your API key${suffix}`, 'auth')
  }
  if (res.status === 429) {
    throw new AiError(`${label} says you've hit a rate limit or are out of quota${suffix}`, 'quota')
  }
  if (res.status >= 500) {
    throw new AiError(`${label} is having trouble right now (${res.status}${suffix})`, 'unavailable', {
      retryable: RETRYABLE_STATUS.has(res.status),
    })
  }
  throw new AiError(`${label} returned an error (${res.status})${suffix}`)
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
        const tried = attempt > 0 ? ` I tried ${attempt + 1} times.` : ''
        err.message += `${tried} Wait a minute and try again, or choose a different model in AI settings.`
        throw err
      }
      options.onRetry?.({ attempt: attempt + 1, total: retryPolicy.delaysMs.length })
      await wait(delay, options.signal)
    }
  }
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
    const chat = /^(gpt-|chatgpt-|o\d)/
    const other = /(audio|realtime|transcribe|tts|image|embedding|moderation|search|instruct|codex|whisper|dall)/
    return (data.data || [])
      .filter(m => chat.test(m.id) && !other.test(m.id))
      .sort((a, b) => (b.created || 0) - (a.created || 0))
      .map(m => ({ id: m.id, label: m.id }))
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
    if (choice?.message?.refusal) throw new AiError(`OpenAI declined the request: ${choice.message.refusal}`, 'blocked')
    if (choice?.finish_reason === 'length') throw new AiError(CUT_OFF_MESSAGE, 'cutoff')
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
    return (data.data || []).map(m => ({ id: m.id, label: m.display_name ? `${m.display_name} (${m.id})` : m.id }))
  },

  async complete({ key, model, system, user, signal, onRetry }) {
    const data = await call('Anthropic', `${ANTHROPIC}/messages`, {
      method: 'POST',
      headers: anthropicHeaders(key),
      body: { model, max_tokens: 16000, system, messages: [{ role: 'user', content: user }] },
      signal, onRetry,
    })
    if (data.stop_reason === 'max_tokens') throw new AiError(CUT_OFF_MESSAGE, 'cutoff')
    if (data.stop_reason === 'refusal') throw new AiError('Claude declined this request.', 'blocked')
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
    const skip = /(embedding|imagen|veo|tts|image|audio|live|aqa)/
    return (data.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
      .map(m => ({ id: m.name.replace(/^models\//, ''), label: m.displayName || m.name }))
      .filter(m => !skip.test(m.id))
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
      throw new AiError(`Gemini blocked the request (${data.promptFeedback.blockReason}).`, 'blocked')
    }
    const candidate = data.candidates?.[0]
    if (candidate?.finishReason === 'MAX_TOKENS') throw new AiError(CUT_OFF_MESSAGE, 'cutoff')
    if (candidate?.finishReason && !['STOP', 'FINISH_REASON_UNSPECIFIED'].includes(candidate.finishReason)) {
      throw new AiError(`Gemini stopped early (${candidate.finishReason}).`, 'blocked')
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
