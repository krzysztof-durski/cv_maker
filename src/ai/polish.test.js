// The AI's messages, labels and prompts in Polish, and what must stay English for the model.

import test from 'node:test'
import assert from 'node:assert/strict'

import { PROVIDERS, AiError, retryPolicy } from './providers.js'
import { parseAiJson } from './parseResponse.js'
import { extractText } from './extractText.js'
import { sanitizeChanges, computeWarnings } from './sanitize.js'
import { diffAll } from './diff.js'
import { buildRequest, presetsForScope, PRESETS } from './prompts.js'
import { scopeTitle, describeOthers } from './awareness.js'
import { AI_SECTIONS, FIELD_LABELS, sectionLabel } from './sections.js'
import { sectionHelp } from '../utils/sectionHelp.js'
import { fileToPhotoDataUrl, photoFileProblem } from '../utils/photo.js'
import { SECTION_LABELS, LINK_TYPES } from '../utils/defaultData.js'
import { setLanguage, nameIn } from '../i18n/core.js'

retryPolicy.delaysMs = retryPolicy.delaysMs.map(() => 0)

/** Runs `fn` with the app in Polish, then puts it back. */
async function inPolish(fn) {
  setLanguage('pl')
  try { return await fn() } finally { setLanguage('en') }
}

function stubFetch(t, ...responses) {
  const queue = responses.length ? responses : [{}]
  let calls = 0
  const original = globalThis.fetch
  globalThis.fetch = async () => {
    const { status = 200, body = {} } = queue[Math.min(calls++, queue.length - 1)]
    return { ok: status >= 200 && status < 300, status, json: async () => body }
  }
  t.after(() => { globalThis.fetch = original })
}

const args = { key: 'KEY', model: 'm1', system: 'SYS', user: 'USER' }

const cv = () => ({
  personal: { name: 'Ada', jobTitle: 'Engineer' },
  sectionOrder: [{ id: 'profile', enabled: true }, { id: 'experience', enabled: true }, { id: 'projects', enabled: true }],
  profile: { text: 'I build things.' },
  experience: [{ id: 'e1', title: 'Engineer', company: 'Acme', location: '', startDate: '2020', endDate: 'Present', bullets: ['Built billing'] }],
  projects: [{ id: 'p1', name: 'Side startup', technologies: '', startDate: '', endDate: '', link: '', description: '', bullets: [] }],
})

/* ---------- provider errors ---------- */

test('a rejected key is reported in Polish', async t => {
  stubFetch(t, { status: 401, body: { error: { message: 'bad key' } } })
  await inPolish(() => assert.rejects(PROVIDERS.openai.complete(args), err => {
    assert.equal(err.kind, 'auth')
    assert.equal(err.message, 'OpenAI odrzuciło Twój klucz API: bad key')
    return true
  }))
})

test('a quota error is reported in Polish', async t => {
  stubFetch(t, { status: 429, body: {} })
  await inPolish(() => assert.rejects(PROVIDERS.anthropic.complete(args), err => err.kind === 'quota' && /limit zapytań/.test(err.message)))
})

test('a busy provider is reported in Polish with the number of tries and what to do', async t => {
  stubFetch(t, { status: 503, body: { error: { message: 'The model is overloaded' } } })
  await inPolish(() => assert.rejects(PROVIDERS.gemini.complete(args), err => {
    assert.equal(err.kind, 'unavailable')
    assert.match(err.message, /Gemini ma teraz problemy \(503: The model is overloaded\)/)
    assert.match(err.message, /Próbowano 6 razy/)
    assert.match(err.message, /Spróbuj innego modelu/)
    return true
  }))
})

test('other errors and network failures are reported in Polish', async t => {
  stubFetch(t, { status: 400, body: { error: { message: 'bad request' } } })
  await inPolish(() => assert.rejects(PROVIDERS.openai.complete(args), err => /zwróciło błąd \(400\): bad request/.test(err.message)))
  const original = globalThis.fetch
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch') }
  t.after(() => { globalThis.fetch = original })
  await inPolish(() => assert.rejects(PROVIDERS.openai.complete(args), err => err.kind === 'network' && /Nie udało się połączyć z OpenAI/.test(err.message)))
})

test('a cut-off answer and a refusal are reported in Polish', async t => {
  stubFetch(t, { body: { content: [{ type: 'text', text: '{' }], stop_reason: 'max_tokens' } })
  await inPolish(() => assert.rejects(PROVIDERS.anthropic.complete(args), err => err.kind === 'cutoff' && /została ucięta/.test(err.message)))
  stubFetch(t, { body: { content: [], stop_reason: 'refusal' } })
  await inPolish(() => assert.rejects(PROVIDERS.anthropic.complete(args), err => err.kind === 'blocked' && /odmówił/.test(err.message)))
})

test('the same errors stay English when the app is in English', async t => {
  stubFetch(t, { status: 401, body: {} })
  await assert.rejects(PROVIDERS.openai.complete(args), err => err instanceof AiError && err.message === 'OpenAI rejected your API key')
})

test('unreadable model answers are explained in Polish', async () => {
  await inPolish(async () => {
    assert.throws(() => parseAiJson('{"changes": {'), /ucięta/)
    assert.throws(() => parseAiJson(''), /AI nic nie zwróciło/)
  })
})

/* ---------- attached files and photos ---------- */

test('file problems are explained in Polish', async () => {
  await inPolish(async () => {
    await assert.rejects(extractText({ name: 'big.pdf', size: 20 * 1024 * 1024 }), /ma ponad 10 MB/)
    await assert.rejects(extractText({ name: 'cv.xyz', size: 5, text: async () => 'x' }), /Nie można odczytać plików \.xyz/)
    await assert.rejects(extractText({ name: 'empty.txt', size: 1, text: async () => '   ' }), /Nie znaleziono czytelnego tekstu w pliku empty\.txt/)
  })
})

test('a file without an extension is described in Polish too', async () => {
  await inPolish(() => assert.rejects(extractText({ name: 'README', size: 5, text: async () => 'x' }), /Nie można odczytać plików \.nieznany/))
})

test('photo problems are explained in Polish', async () => {
  await inPolish(async () => {
    assert.match(photoFileProblem({ type: 'application/pdf', size: 5 }), /JPG, PNG, WebP lub GIF/)
    assert.match(photoFileProblem({ type: 'image/png', size: 99 * 1024 * 1024 }), /za duże/)
    await assert.rejects(fileToPhotoDataUrl({ type: 'text/plain', size: 1 }), /JPG, PNG/)
  })
})

/* ---------- notes about a suggestion ---------- */

test('a rejected job title is explained in Polish', async () => {
  await inPolish(() => {
    const { notes } = sanitizeChanges(cv(), { personal: { jobTitle: 'Ninja' } }, { newId: () => 'n', allowTitle: true, grounding: 'We hire engineers', targetJobTitle: 'Rockstar Ninja' })
    assert.match(notes[0], /AI zaproponowało stanowisko „Rockstar Ninja”/)
    assert.match(notes[0], /pozostało bez zmian/)
  })
})

test('warnings about invented numbers and employers are in Polish', async () => {
  await inPolish(() => {
    const original = cv()
    const draft = {
      ...original,
      experience: [
        { ...original.experience[0], bullets: ['Built billing and cut costs by 73%'] },
        { id: 'new1', title: 'Wizard', company: 'Hogwarts', location: '', startDate: '', endDate: '', bullets: [] },
      ],
    }
    const warnings = computeWarnings(original, draft).experience
    assert.ok(warnings.some(w => /Zawiera liczby, których nie ma w Twoim CV[^]*73/.test(w)))
    assert.ok(warnings.some(w => /Nowe wpisy wspominają o: [^]*Hogwarts/.test(w)))
  })
})

test('in English the warnings read as before', () => {
  const original = cv()
  const draft = { ...original, experience: [{ ...original.experience[0], bullets: ['Cut costs by 73%'] }] }
  assert.match(computeWarnings(original, draft).experience[0], /Contains numbers not found in your CV/)
})

/* ---------- labels on the review screen ---------- */

test('section and field names follow the language', async () => {
  assert.equal(AI_SECTIONS.experience.label, 'Experience')
  assert.equal(FIELD_LABELS.bullets, 'Bullets')
  await inPolish(() => {
    assert.equal(AI_SECTIONS.experience.label, 'Doświadczenie')
    assert.equal(AI_SECTIONS.personal.label, 'Stanowisko')
    assert.equal(FIELD_LABELS.bullets, 'Punkty')
    assert.equal(FIELD_LABELS.startDate, 'Początek')
    assert.equal(sectionLabel('projects'), 'Projekty')
    assert.equal(SECTION_LABELS.volunteer, 'Wolontariat i działalność dodatkowa')
    assert.equal(LINK_TYPES.other, 'Inny')
  })
  assert.equal(sectionLabel('projects'), 'Projects')
})

test('a section name can be asked for in a given language regardless of the current one', () => {
  assert.equal(sectionLabel('experience', 'pl'), 'Doświadczenie')
  assert.equal(sectionLabel('experience', 'en'), 'Experience')
})

test('change items are labelled in Polish, including moves between sections', async () => {
  const original = cv()
  const draft = {
    ...original,
    projects: [],
    experience: [...original.experience, { id: 'moved', title: 'Side startup', company: '', location: '', startDate: '', endDate: '', bullets: [] }],
  }
  await inPolish(() => {
    const sections = diffAll(original, draft)
    const removal = sections.find(s => s.id === 'projects').items.find(i => i.kind === 'remove')
    const addition = sections.find(s => s.id === 'experience').items.find(i => i.kind === 'add')
    assert.equal(removal.fieldLabel, 'Przeniesiono do: Doświadczenie')
    assert.equal(addition.fieldLabel, 'Przeniesiono z: Projekty')
  })
})

test('plain additions, removals and reorders are labelled in Polish', async () => {
  const original = cv()
  await inPolish(() => {
    const added = diffAll(original, { ...original, experience: [...original.experience, { id: 'x', title: 'New', company: 'Co', location: '', startDate: '', endDate: '', bullets: [] }] })
    assert.equal(added[0].items[0].fieldLabel, 'Nowy wpis')
    const removed = diffAll(original, { ...original, experience: [] })
    assert.equal(removed[0].items[0].fieldLabel, 'Usunięty wpis')
  })
})

test('what a conversation is about is named in the current language', async () => {
  const data = cv()
  assert.equal(scopeTitle('cv', data), 'Entire CV')
  await inPolish(() => {
    assert.equal(scopeTitle('cv', data), 'Całe CV')
    assert.equal(scopeTitle('experience', data), 'Doświadczenie')
    assert.equal(scopeTitle('experience#e1', data), 'Doświadczenie: Engineer — Acme')
  })
})

test('a name can be asked for in any language', () => {
  assert.equal(scopeTitle('cv', cv(), 'pl'), 'Całe CV')
  assert.equal(scopeTitle('experience', cv(), 'en'), 'Experience')
})

test('what other conversations tell the model stays in English even when the app is Polish', async () => {
  const conversation = {
    number: 2, scope: 'cv', declined: new Set(),
    messages: [{ role: 'user', text: 'x' }, { role: 'assistant', text: 'Gotowe' }],
    sections: diffAll(cv(), { ...cv(), profile: { text: 'I build reliable things.' } }),
  }
  const text = await inPolish(() => describeOthers(cv(), [conversation]))
  assert.match(text, /Conversation 2 \(Entire CV\), 1 pending suggestion/)
  assert.match(text, /Profile/)
  assert.doesNotMatch(text, /Całe CV|Profil\b|Opis/)
})

/* ---------- prompts ---------- */

test('the model is told which language to answer the user in', () => {
  const english = buildRequest({ cvData: cv(), scope: 'cv', instruction: 'Hi' })
  assert.match(english.system, /Write "summary" and "reply" in English/)
  const polish = buildRequest({ cvData: cv(), scope: 'cv', instruction: 'Cześć', language: 'pl' })
  assert.match(polish.system, /Write "summary" and "reply" in Polish/)
  assert.match(polish.system, /CV text itself stays in the language the person wrote it in/)
})

test('the instructions to the model stay in English whatever the app language', async () => {
  const request = await inPolish(() => buildRequest({ cvData: cv(), scope: 'cv', instruction: 'Cześć', language: 'pl' }))
  assert.match(request.system, /You are an expert CV editor/)
  assert.doesNotMatch(request.system, /Całe CV|Doświadczenie/)
})

test('an empty entry is reported in Polish', async () => {
  const data = cv()
  data.experience = [{ ...data.experience[0], id: 'blank', title: '', company: '', startDate: '', endDate: '', bullets: [] }]
  await inPolish(() => assert.throws(() => buildRequest({ cvData: data, scope: 'experience#blank', instruction: 'x' }), /Ten wpis jest pusty/))
})

/* ---------- quick prompts ---------- */

test('every quick prompt has a label and an instruction in both languages', async () => {
  for (const preset of PRESETS) {
    assert.ok(preset.label && !preset.label.startsWith('ai.'), preset.id)
    assert.ok(preset.instruction && !preset.instruction.startsWith('ai.'), preset.id)
  }
  await inPolish(() => {
    for (const preset of PRESETS) {
      assert.ok(preset.label && !preset.label.startsWith('ai.'), preset.id)
      assert.ok(preset.instruction.length > 20, preset.id)
    }
  })
})

test('quick prompts read differently in Polish', async () => {
  const suggest = scope => presetsForScope(scope).find(p => p.id === 'suggest')
  assert.equal(suggest('cv').label, 'Any suggestions?')
  await inPolish(() => {
    assert.equal(suggest('cv').label, 'Masz jakieś uwagi?')
    assert.match(suggest('cv').instruction, /Na razie niczego nie zmieniaj/)
  })
})

test('the translate prompt names the language to translate into, and is offered for the whole CV and its text sections', async () => {
  const translate = presetsForScope('cv').find(p => p.id === 'translate')
  assert.ok(translate)
  assert.equal(translate.labelFor({ language: nameIn('en', 'pl') }), 'Translate (Polish)')
  assert.match(translate.instructionFor({ language: 'Polish' }), /into Polish/)
  for (const scope of ['profile', 'experience', 'projects', 'skills']) {
    assert.ok(presetsForScope(scope).some(p => p.id === 'translate'), scope)
  }
  await inPolish(() => {
    assert.equal(translate.labelFor({ language: nameIn('pl', 'en') }), 'Przetłumacz (angielski)')
    assert.match(translate.instructionFor({ language: nameIn('pl', 'en') }), /na język angielski/)
  })
})

test('prompts that need no language ignore the extra value', () => {
  const tailor = PRESETS.find(p => p.id === 'tailor')
  assert.equal(tailor.labelFor({ language: 'Polish' }), tailor.label)
  assert.equal(tailor.needsReference, true)
})

/* ---------- tips ---------- */

test('section tips come back in the current language', async () => {
  assert.match(sectionHelp('experience').intro, /Your most impactful section/)
  await inPolish(() => {
    const help = sectionHelp('experience')
    assert.match(help.intro, /Twoja najważniejsza sekcja/)
    assert.ok(Array.isArray(help.tips) && help.tips.length >= 4)
  })
})

test('a file with no extension is described as unknown in English too', async () => {
  await assert.rejects(extractText({ name: 'README', size: 5, text: async () => 'x' }), /Can't read \.unknown files/)
})
