import test from 'node:test'
import assert from 'node:assert/strict'

import { PROVIDERS, AiError, retryPolicy, relevantGeminiModels, relevantOpenAiModels, relevantAnthropicModels } from './providers.js'

// Retries back off for seconds in the app; tests must not wait.
retryPolicy.delaysMs = [0, 0, 0]

// Replace fetch with a stub that records each request. With several responses they are returned
// in order, and the last one repeats.
function stubFetch(t, ...responses) {
  const queue = responses.length ? responses : [{}]
  const calls = []
  const original = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init, body: init?.body ? JSON.parse(init.body) : undefined })
    const { status = 200, body = {} } = queue[Math.min(calls.length - 1, queue.length - 1)]
    return { ok: status >= 200 && status < 300, status, json: async () => body }
  }
  t.after(() => { globalThis.fetch = original })
  return calls
}

const args = { key: 'KEY', model: 'm1', system: 'SYS', user: 'USER' }

/* ---------- OpenAI ---------- */

test('openai sends only the headers its CORS preflight allows', async t => {
  const calls = stubFetch(t, { body: { choices: [{ message: { content: '{"ok":1}' }, finish_reason: 'stop' }] } })
  const text = await PROVIDERS.openai.complete(args)
  assert.equal(text, '{"ok":1}')
  assert.equal(calls[0].url, 'https://api.openai.com/v1/chat/completions')
  assert.deepEqual(Object.keys(calls[0].init.headers).map(h => h.toLowerCase()).sort(), ['authorization', 'content-type'])
  assert.equal(calls[0].init.headers.Authorization, 'Bearer KEY')
  assert.deepEqual(calls[0].body.messages, [{ role: 'system', content: 'SYS' }, { role: 'user', content: 'USER' }])
  assert.deepEqual(calls[0].body.response_format, { type: 'json_object' })
  assert.equal('temperature' in calls[0].body, false)
  assert.equal('max_tokens' in calls[0].body, false)
})

test('openai reports truncated answers', async t => {
  stubFetch(t, { body: { choices: [{ message: { content: '{"a"' }, finish_reason: 'length' }] } })
  await assert.rejects(PROVIDERS.openai.complete(args), err => err instanceof AiError && err.kind === 'cutoff')
})

test('openai lists only chat models, newest first', async t => {
  stubFetch(t, {
    body: {
      data: [
        { id: 'text-embedding-3-small', created: 5 },
        { id: 'gpt-4o', created: 10 },
        { id: 'gpt-4o-audio-preview', created: 11 },
        { id: 'gpt-5', created: 20 },
        { id: 'whisper-1', created: 1 },
        { id: 'o3', created: 15 },
      ],
    },
  })
  const models = await PROVIDERS.openai.listModels('KEY')
  assert.deepEqual(models.map(m => m.id), ['gpt-5', 'o3', 'gpt-4o'])
})

/* ---------- Anthropic ---------- */

test('anthropic opts in to browser access and joins text blocks', async t => {
  const calls = stubFetch(t, {
    body: { stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: 'hmm' }, { type: 'text', text: '{"a":' }, { type: 'text', text: '1}' }] },
  })
  const text = await PROVIDERS.anthropic.complete(args)
  assert.equal(text, '{"a":1}')
  const { url, init, body } = calls[0]
  assert.equal(url, 'https://api.anthropic.com/v1/messages')
  assert.equal(init.headers['x-api-key'], 'KEY')
  assert.equal(init.headers['anthropic-version'], '2023-06-01')
  assert.equal(init.headers['anthropic-dangerous-direct-browser-access'], 'true')
  assert.equal(body.model, 'm1')
  assert.equal(body.system, 'SYS')
  assert.deepEqual(body.messages, [{ role: 'user', content: 'USER' }])
  assert.ok(body.max_tokens > 0)
})

test('anthropic reports truncated answers', async t => {
  stubFetch(t, { body: { stop_reason: 'max_tokens', content: [{ type: 'text', text: '{' }] } })
  await assert.rejects(PROVIDERS.anthropic.complete(args), err => err.kind === 'cutoff')
})

test('anthropic lists models with display names', async t => {
  stubFetch(t, { body: { data: [{ id: 'claude-sonnet-5-5', display_name: 'Claude Sonnet 5.5' }] } })
  const models = await PROVIDERS.anthropic.listModels('KEY')
  assert.deepEqual(models, [{ id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (claude-sonnet-5-5)' }])
})

/* ---------- Gemini ---------- */

test('gemini keeps the key in a header, not the URL', async t => {
  const calls = stubFetch(t, { body: { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: '{"a":1}' }] } }] } })
  const text = await PROVIDERS.gemini.complete({ ...args, model: 'models/gemini-x' })
  assert.equal(text, '{"a":1}')
  assert.equal(calls[0].url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-x:generateContent')
  assert.ok(!calls[0].url.includes('KEY'))
  assert.equal(calls[0].init.headers['x-goog-api-key'], 'KEY')
  assert.deepEqual(calls[0].body.systemInstruction, { parts: [{ text: 'SYS' }] })
  assert.deepEqual(calls[0].body.contents, [{ role: 'user', parts: [{ text: 'USER' }] }])
  assert.equal(calls[0].body.generationConfig.responseMimeType, 'application/json')
})

test('gemini surfaces blocked prompts and truncation', async t => {
  stubFetch(t, { body: { promptFeedback: { blockReason: 'SAFETY' } } })
  await assert.rejects(PROVIDERS.gemini.complete(args), err => err.kind === 'blocked' && /SAFETY/.test(err.message))
  stubFetch(t, { body: { candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: '{' }] } }] } })
  await assert.rejects(PROVIDERS.gemini.complete(args), err => err.kind === 'cutoff')
})

test('gemini lists only generateContent models', async t => {
  stubFetch(t, {
    body: {
      models: [
        { name: 'models/gemini-2.5-flash', displayName: 'Gemini 2.5 Flash', supportedGenerationMethods: ['generateContent'] },
        { name: 'models/text-embedding-004', supportedGenerationMethods: ['embedContent'] },
        { name: 'models/gemini-2.5-flash-image', supportedGenerationMethods: ['generateContent'] },
      ],
    },
  })
  const models = await PROVIDERS.gemini.listModels('KEY')
  assert.deepEqual(models, [{ id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' }])
})

/* ---------- error mapping ---------- */

test('HTTP errors become readable messages with a kind', async t => {
  stubFetch(t, { status: 401, body: { error: { message: 'Incorrect API key provided' } } })
  await assert.rejects(PROVIDERS.openai.complete(args), err => err.kind === 'auth' && /rejected your API key.*Incorrect API key/.test(err.message))

  stubFetch(t, { status: 429, body: { error: { message: 'You exceeded your quota' } } })
  await assert.rejects(PROVIDERS.anthropic.complete(args), err => err.kind === 'quota' && /quota/.test(err.message))

  stubFetch(t, { status: 503, body: {} })
  await assert.rejects(PROVIDERS.gemini.complete(args), err => /trouble/.test(err.message))

  stubFetch(t, { status: 400, body: { error: { message: 'model: not found' } } })
  await assert.rejects(PROVIDERS.openai.complete(args), err => err.kind === 'api' && /400/.test(err.message) && /not found/.test(err.message))
})

test('gemini reports a bad key (HTTP 400) as an auth error', async t => {
  stubFetch(t, { status: 400, body: { error: { message: 'API key not valid. Please pass a valid API key.' } } })
  await assert.rejects(PROVIDERS.gemini.listModels('fake'), err => err.kind === 'auth' && /rejected your API key/.test(err.message))
})

test('network failures are reported as such, aborts pass through', async t => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })

  globalThis.fetch = async () => { throw new TypeError('Failed to fetch') }
  await assert.rejects(PROVIDERS.openai.complete(args), err => err.kind === 'network')

  globalThis.fetch = async () => { throw Object.assign(new Error('aborted'), { name: 'AbortError' }) }
  await assert.rejects(PROVIDERS.openai.complete(args), err => err.name === 'AbortError')
})

/* ---------- retries ---------- */

const overloaded = { status: 503, body: { error: { code: 503, message: 'The model is overloaded. Please try again later.', status: 'UNAVAILABLE' } } }
const geminiOk = { body: { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: '{"a":1}' }] } }] } }

test('a transient 503 is retried and the request then succeeds', async t => {
  const calls = stubFetch(t, overloaded, overloaded, geminiOk)
  const retries = []
  const text = await PROVIDERS.gemini.complete({ ...args, onRetry: r => retries.push(r) })
  assert.equal(text, '{"a":1}')
  assert.equal(calls.length, 3)
  assert.deepEqual(retries, [{ attempt: 1, total: 3 }, { attempt: 2, total: 3 }])
})

test('retries stop after the policy is exhausted and the error keeps the provider message', async t => {
  const calls = stubFetch(t, overloaded)
  await assert.rejects(PROVIDERS.gemini.complete(args), err => {
    assert.equal(err.kind, 'unavailable')
    assert.match(err.message, /having trouble right now \(503: The model is overloaded/)
    assert.match(err.message, /I tried 4 times/)
    assert.match(err.message, /different model/)
    return true
  })
  assert.equal(calls.length, 4)
})

test("Anthropic's 529 overloaded status is retried too", async t => {
  const calls = stubFetch(t, { status: 529, body: { error: { message: 'Overloaded' } } }, { body: { stop_reason: 'end_turn', content: [{ type: 'text', text: '{}' }] } })
  assert.equal(await PROVIDERS.anthropic.complete(args), '{}')
  assert.equal(calls.length, 2)
})

test('auth, quota and bad-request errors are not retried', async t => {
  for (const status of [400, 401, 403, 404, 429]) {
    const calls = stubFetch(t, { status, body: { error: { message: 'nope' } } })
    await assert.rejects(PROVIDERS.openai.complete(args))
    assert.equal(calls.length, 1, `status ${status} should not be retried`)
  }
})

test('network failures are not retried', async t => {
  const original = globalThis.fetch
  let count = 0
  globalThis.fetch = async () => { count++; throw new TypeError('Failed to fetch') }
  t.after(() => { globalThis.fetch = original })
  await assert.rejects(PROVIDERS.openai.complete(args), err => err.kind === 'network')
  assert.equal(count, 1)
})

test('cancelling during the back-off wait aborts immediately', async t => {
  const previous = retryPolicy.delaysMs
  retryPolicy.delaysMs = [60_000]
  t.after(() => { retryPolicy.delaysMs = previous })

  const calls = stubFetch(t, overloaded)
  const controller = new AbortController()
  const started = Date.now()
  const pending = PROVIDERS.gemini.complete({ ...args, signal: controller.signal })
  setTimeout(() => controller.abort(), 20)
  await assert.rejects(pending, err => err.name === 'AbortError')
  assert.ok(Date.now() - started < 5000)
  assert.equal(calls.length, 1)
})

test('listing models also retries a transient failure', async t => {
  const calls = stubFetch(t, overloaded, { body: { data: [{ id: 'claude-sonnet-5-5' }] } })
  const models = await PROVIDERS.anthropic.listModels('KEY')
  assert.equal(models.length, 1)
  assert.equal(calls.length, 2)
})

/* ---------- only relevant models are offered ---------- */

test('Gemini: only current text chat models, newest first, with the noise removed', () => {
  const ids = [
    'gemma-4-31b-it', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-pro-latest', 'gemini-2.5-flash-lite',
    'gemini-3-flash-preview', 'gemini-3.1-pro-preview', 'gemini-3.1-pro-preview-customtools', 'gemini-3.1-flash-lite-preview',
    'gemini-3.1-flash-lite', 'nano-banana-pro-preview', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-omni-flash-preview',
    'gemini-omni-1.1-flash', 'gemini-3.5-transcribe', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.8-flash',
    'lyria-3-clip-preview', 'lyria-3-pro-preview', 'lyria-3.5', 'gemini-robotics-er-2-preview',
    'gemini-2.5-computer-use-preview-10-2025', 'antigravity-preview-05-2026', 'antigravity-preview-latest',
    'deep-research-max-preview-04-2026', 'deep-research-pro-preview-12-2025', 'gemini-2.5-pro', 'gemini-2.5-flash',
  ]
  const raw = ids.map(id => ({ name: `models/${id}`, supportedGenerationMethods: ['generateContent'] }))
  assert.deepEqual(relevantGeminiModels(raw).map(m => m.id), [
    'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash',
    'gemini-3.5-flash', 'gemini-3.5-flash-lite',
    'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-3.1-flash-lite-preview',
    'gemini-3-flash-preview',
    'gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite',
  ])
})

test('OpenAI: chat and reasoning models only, no dated snapshots, audio, image or search variants', () => {
  const ids = ['gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-5-pro', 'gpt-4.1', 'gpt-4o', 'gpt-4o-mini', 'o3', 'o4-mini', 'o3-pro',
    'gpt-4o-2024-08-06', 'gpt-5-2025-08-07', 'gpt-4o-audio-preview', 'gpt-4o-realtime-preview', 'gpt-image-1', 'gpt-4o-search-preview',
    'gpt-4o-transcribe', 'gpt-4o-mini-tts', 'text-embedding-3-large', 'whisper-1', 'dall-e-3', 'omni-moderation-latest',
    'gpt-3.5-turbo-instruct', 'codex-mini-latest', 'chatgpt-4o-latest', 'babbage-002']
  const found = relevantOpenAiModels(ids.map((id, i) => ({ id, created: 1000 - i }))).map(m => m.id)
  assert.deepEqual(found, ['gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-5-pro', 'gpt-4.1', 'gpt-4o', 'gpt-4o-mini', 'o3', 'o4-mini', 'o3-pro'])
})

test('Anthropic: Claude models only, preferring the undated name over its dated snapshot', () => {
  const found = relevantAnthropicModels([
    { id: 'claude-sonnet-5-5', display_name: 'Claude Sonnet 5.5' },
    { id: 'claude-sonnet-4-5', display_name: 'Claude Sonnet 4.5' },
    { id: 'claude-sonnet-4-5-20250929', display_name: 'Claude Sonnet 4.5' },
    { id: 'claude-3-haiku-20240307', display_name: 'Claude Haiku 3' }, // no alias: kept
    { id: 'something-else' },
  ])
  assert.deepEqual(found.map(m => m.id), ['claude-sonnet-5-5', 'claude-sonnet-4-5', 'claude-3-haiku-20240307'])
})
