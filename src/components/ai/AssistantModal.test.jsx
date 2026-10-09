import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AssistantModal from './AssistantModal'
import { I18nProvider } from '../../i18n/I18nProvider'
import { retryPolicy } from '../../ai/providers'
import { setLanguage } from '../../i18n/core'
import { mockTextLayout } from '../../testing/layoutMocks'

const REAL_DELAYS = retryPolicy.delaysMs

const cvData = (extra = {}) => ({
  template: 'classic',
  language: 'auto',
  personal: { name: 'Ada', jobTitle: 'Engineer', links: [] },
  sectionOrder: [{ id: 'profile', enabled: true }, { id: 'experience', enabled: true }],
  profile: { text: 'I build things.' },
  experience: [{ id: 'e1', title: 'Engineer', company: 'Acme', location: '', startDate: '2020', endDate: 'Present', bullets: ['Built billing'] }],
  ...extra,
})

const settings = (extra = {}) => ({
  ready: true, provider: 'gemini', model: 'gemini-3.5-flash', apiKey: 'AIzaKEY', keys: { gemini: 'AIzaKEY' },
  models: { gemini: 'gemini-3.5-flash' }, remember: false,
  setModel: vi.fn(), setProvider: vi.fn(), setKey: vi.fn(), setRemember: vi.fn(),
  ...extra,
})

function show({ ui = 'pl', data = cvData(), config = settings() } = {}) {
  return render(
    <I18nProvider initial={ui}>
      <AssistantModal open requestId={1} initialScope="cv" cvData={data} settings={config} onClose={vi.fn()} onOpenSettings={vi.fn()} onApply={vi.fn()} />
    </I18nProvider>
  )
}

/** Stands in for the network: the model list, then the answers to the requests that follow. */
function stubGemini(...answers) {
  const requests = []
  let n = 0
  vi.stubGlobal('fetch', vi.fn(async (url, init) => {
    if (String(url).includes(':generateContent')) {
      requests.push(JSON.parse(init.body))
      const { status = 200, body } = answers[Math.min(n++, answers.length - 1)]
      return { ok: status < 300, status, json: async () => body }
    }
    return { ok: true, status: 200, json: async () => ({ models: [] }) }
  }))
  return requests
}

const reply = obj => ({ body: { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(obj) }] } }] } })

beforeEach(() => {
  retryPolicy.delaysMs = REAL_DELAYS.map(() => 0)
  mockTextLayout()
})
afterEach(() => {
  retryPolicy.delaysMs = REAL_DELAYS
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  setLanguage('en')
})

describe('the assistant window in Polish', () => {
  it('speaks Polish before a request is made', () => {
    stubGemini()
    show()
    expect(screen.getByRole('dialog', { name: 'Asystent AI' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nad czym ma pracować AI?')).toBeInTheDocument()
    expect(screen.getByText('Gotowe polecenia')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pokaż propozycje' })).toBeDisabled()
    expect(screen.getByRole('option', { name: 'Całe CV' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Tylko: Doświadczenie' })).toBeInTheDocument()
  })

  it('offers the quick prompts in Polish and puts the Polish instruction in the box', () => {
    stubGemini()
    show()
    fireEvent.click(screen.getByRole('button', { name: 'Masz jakieś uwagi?' }))
    expect(screen.getByLabelText('Polecenie').value).toContain('Na razie niczego nie zmieniaj')
  })

  it('the same window in English is unchanged', () => {
    stubGemini()
    show({ ui: 'en' })
    expect(screen.getByRole('dialog', { name: 'AI assistant' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Any suggestions?' }))
    expect(screen.getByLabelText('Instruction').value).toContain('Do not change anything yet')
  })

  it('asks for the key in Polish when none is set', () => {
    stubGemini()
    show({ config: settings({ ready: false, apiKey: '', keys: {} }) })
    expect(screen.getByText(/Dodaj własny klucz API OpenAI, Claude lub Gemini/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dodaj klucz API' })).toBeInTheDocument()
  })

  it('"Translate" asks for the language of the CV, named the Polish way', () => {
    stubGemini()
    show({ data: cvData({ language: 'en' }) })
    fireEvent.click(screen.getByRole('button', { name: 'Przetłumacz (angielski)' }))
    expect(screen.getByLabelText('Polecenie').value).toContain('na język angielski')
  })

  it('"Translate" follows the CV language setting, which follows the app by default', () => {
    stubGemini()
    show({ data: cvData({ language: 'auto' }) })
    fireEvent.click(screen.getByRole('button', { name: 'Przetłumacz (polski)' }))
    expect(screen.getByLabelText('Polecenie').value).toContain('na język polski')
  })
})

describe('a conversation in Polish', () => {
  it('tells the model to answer in the language of the app, while the instructions stay English', async () => {
    const requests = stubGemini(reply({ summary: 'Gotowe.', reply: 'Oto odpowiedź.', changes: {} }))
    show()
    fireEvent.change(screen.getByLabelText('Polecenie'), { target: { value: 'Popraw mój opis' } })
    fireEvent.click(screen.getByRole('button', { name: 'Pokaż propozycje' }))
    await waitFor(() => expect(requests).toHaveLength(1))
    const system = requests[0].systemInstruction.parts[0].text
    expect(system).toMatch(/Write "summary" and "reply" in Polish/)
    expect(system).toMatch(/You are an expert CV editor/)
    expect(requests[0].contents[0].parts[0].text).toContain('Popraw mój opis')
    expect((await screen.findAllByText(/Oto odpowiedź/)).length).toBeGreaterThan(0)
  })

  it('shows what to do about a busy provider, in Polish, once all five retries are used', async () => {
    const requests = stubGemini({ status: 503, body: { error: { message: 'The model is overloaded.' } } })
    show()
    fireEvent.change(screen.getByLabelText('Polecenie'), { target: { value: 'Popraw mój opis' } })
    fireEvent.click(screen.getByRole('button', { name: 'Pokaż propozycje' }))
    const alert = await screen.findByRole('alert')
    expect(requests).toHaveLength(6)
    expect(alert).toHaveTextContent('Gemini ma teraz problemy (503: The model is overloaded.)')
    expect(alert).toHaveTextContent('Próbowano 6 razy')
    expect(screen.getByTestId('busy-advice')).toHaveTextContent('Przełącz się na inny model')
    expect(screen.getByTestId('busy-advice')).toHaveTextContent('Anuluj zapytanie i wyślij je ponownie')
  })

  it('a key problem gets no busy advice', async () => {
    stubGemini({ status: 403, body: { error: { message: 'no' } } })
    show()
    fireEvent.change(screen.getByLabelText('Polecenie'), { target: { value: 'Popraw mój opis' } })
    fireEvent.click(screen.getByRole('button', { name: 'Pokaż propozycje' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Gemini odrzuciło Twój klucz API: no')
    expect(screen.queryByTestId('busy-advice')).toBeNull()
  })

  it('labels the suggestions in Polish', async () => {
    stubGemini(reply({ summary: 'Zmieniono opis.', changes: { profile: { text: 'I build reliable things.' } } }))
    show()
    fireEvent.change(screen.getByLabelText('Polecenie'), { target: { value: 'Popraw mój opis' } })
    fireEvent.click(screen.getByRole('button', { name: 'Pokaż propozycje' }))
    expect(await screen.findByText(/Zaznacz zmiany, które chcesz wprowadzić/)).toBeInTheDocument()
    expect(screen.getByText('Przed')).toBeInTheDocument()
    expect(screen.getByText('Po')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zastosuj 1 zmianę' })).toBeEnabled()
    expect(screen.getByText('1 zmiana')).toBeInTheDocument()
  })
})
