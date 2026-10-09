import test from 'node:test'
import assert from 'node:assert/strict'
import { needsBusyAdvice, retryMessage } from './troubleshooting.js'
import { translate, setLanguage } from '../i18n/core.js'

for (const lang of ['en', 'pl']) {
  test(`${lang}: the advice has a title, an intro and four steps, each with a title and a body`, () => {
    assert.ok(translate(lang, 'ai.busy.title'))
    assert.ok(translate(lang, 'ai.busy.intro'))
    const steps = translate(lang, 'ai.busy.steps')
    assert.equal(steps.length, 4)
    for (const step of steps) assert.ok(step.title && step.body)
  })
}

test('the English advice covers switching model, cancelling and retrying, waiting and another provider', () => {
  const text = translate('en', 'ai.busy.steps').map(s => `${s.title} ${s.body}`).join(' ').toLowerCase()
  for (const topic of ['another model', 'cancel', 'wait a minute', 'another provider']) {
    assert.ok(text.includes(topic), `missing: ${topic}`)
  }
})

test('the intro matches the real retry count in both languages', () => {
  assert.ok(translate('en', 'ai.busy.intro').includes('5 times'))
  assert.ok(translate('pl', 'ai.busy.intro').includes('5 razy'))
})

test('only provider overloads get the busy advice', () => {
  assert.equal(needsBusyAdvice('unavailable'), true)
  for (const kind of ['auth', 'quota', 'network', 'cutoff', 'blocked', 'api', '', undefined]) {
    assert.equal(needsBusyAdvice(kind), false, String(kind))
  }
})

test('the retry line names the provider and the attempt', () => {
  assert.equal(retryMessage('Google', { attempt: 1, total: 5 }), 'Google is busy right now. Retrying (1 of 5)…')
})

test('from the third retry on, the line tells the user how to stop waiting', () => {
  assert.doesNotMatch(retryMessage('Google', { attempt: 2, total: 5 }), /cancel/i)
  assert.match(retryMessage('Google', { attempt: 3, total: 5 }), /cancel and try again, or switch to another model/)
})

test('the retry line follows the language of the app', () => {
  setLanguage('pl')
  try {
    assert.equal(retryMessage('Google', { attempt: 2, total: 5 }), 'Google jest teraz zajęte. Ponawiam próbę (2 z 5)…')
    assert.match(retryMessage('Google', { attempt: 4, total: 5 }), /anulować/)
  } finally {
    setLanguage('en')
  }
})
