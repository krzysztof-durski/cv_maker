import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EditorPage from './EditorPage'
import { I18nProvider } from '../i18n/I18nProvider'
import { setLanguage } from '../i18n/core'
import { mockTextLayout } from '../testing/layoutMocks'

const savedCv = (extra = {}) => ({
  personal: { name: 'Ada Lovelace', jobTitle: 'Engineer', phone: '', email: '', location: '', links: [], photo: '' },
  experience: [{ id: 'e1', title: 'Analyst', company: 'Babbage Ltd', location: '', startDate: '2020', endDate: 'Present', bullets: ['Wrote the first program'] }],
  education: [{ id: 'd1', school: 'Home School', degree: 'BSc', field: 'Maths', location: '', startDate: '2015', endDate: '2019', bullets: [] }],
  projects: [{ id: 'p1', name: 'Difference Machine', technologies: '', startDate: '', endDate: '', link: '', description: '', bullets: [] }],
  ...extra,
})

function renderPage({ ui = 'en', saved } = {}) {
  if (saved) window.localStorage.setItem('cv_maker_data', JSON.stringify(saved))
  return render(
    <I18nProvider initial={ui}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><EditorPage /></MemoryRouter>
    </I18nProvider>
  )
}

const preview = () => document.getElementById('cv-page')
const previewText = () => preview().textContent
const switchTo = code => fireEvent.click(screen.getAllByRole('button', { name: code })[0])

beforeEach(() => {
  window.innerWidth = 1600
  mockTextLayout()
})
afterEach(() => {
  vi.restoreAllMocks()
  setLanguage('en')
})

describe('the app interface', () => {
  it('is in English by default', () => {
    renderPage({ saved: savedCv() })
    expect(screen.getByRole('heading', { name: 'Editor' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save PDF/ })).toBeInTheDocument()
    expect(screen.getByText('Personal Info')).toBeInTheDocument()
  })

  it('can start in Polish', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    expect(screen.getByRole('heading', { name: 'Edytor' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Zapisz PDF/ })).toBeInTheDocument()
    expect(screen.getByText('Dane osobowe')).toBeInTheDocument()
    expect(screen.getByText('Zapisywane automatycznie')).toBeInTheDocument()
  })

  it('switches between English and Polish without losing what was typed', () => {
    renderPage({ saved: savedCv() })
    fireEvent.change(screen.getByDisplayValue('Ada Lovelace'), { target: { value: 'Ada King' } })
    switchTo('PL')
    expect(screen.getByRole('heading', { name: 'Edytor' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Ada King')).toBeInTheDocument()
    switchTo('EN')
    expect(screen.getByRole('heading', { name: 'Editor' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Ada King')).toBeInTheDocument()
  })

  it('translates field labels, placeholders and buttons in the section editors', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    expect(screen.getByPlaceholderText('Acme Sp. z o.o.')).toBeInTheDocument()
    expect(screen.getAllByText('Data rozpoczęcia').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: '+ Dodaj doświadczenie' })).toBeInTheDocument()
    expect(screen.getByLabelText('Punkt 1')).toHaveValue('Wrote the first program') // the user's own text is never translated
  })

  it('names the sections in the section manager', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    const manager = screen.getByText('Sekcje').parentElement.parentElement
    const labels = within(manager).getAllByRole('checkbox').map(box => box.getAttribute('aria-label'))
    expect(labels.slice(0, 5)).toEqual(['Profil', 'Doświadczenie', 'Projekty', 'Wykształcenie', 'Umiejętności'])
  })

  it('asks for confirmation in the language of the app', () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderPage({ ui: 'pl', saved: savedCv() })
    fireEvent.click(screen.getByRole('button', { name: 'Więcej opcji' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Usuń wszystkie dane/ }))
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('trwale usunie wszystkie dane'))
  })

  it('shows section tips in Polish', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    fireEvent.click(screen.getAllByTitle('Pokaż wskazówki dla tej sekcji')[0])
    expect(screen.getByText('Krótki opis na górze CV — 2–4 zdania o tym, kim jesteś i co wnosisz.')).toBeInTheDocument()
  })

  it('counts characters with the right Polish word form', () => {
    renderPage({ ui: 'pl', saved: savedCv({ profile: { text: 'abcde' } }) })
    expect(screen.getByText(/5 znaków/)).toBeInTheDocument()
  })

  it('has the language switch in the header', () => {
    renderPage()
    expect(screen.getAllByRole('group', { name: 'Language' }).length).toBeGreaterThan(0)
  })
})

describe('the language of the CV itself', () => {
  it('follows the app by default: Polish app, Polish headings', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    const text = previewText()
    expect(text).toContain('Doświadczenie')
    expect(text).toContain('Wykształcenie')
    expect(text).toContain('Projekty')
  })

  it('prints "Obecnie" instead of "Present" on a Polish CV, and "Present" on an English one', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    expect(previewText()).toContain('2020 – Obecnie')
    expect(previewText()).not.toContain('Present')
  })

  it('writes the degree and field the Polish way', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    expect(previewText()).toContain('BSc, Maths')
  })

  it('writes the degree and field the English way', () => {
    renderPage({ ui: 'en', saved: savedCv() })
    expect(previewText()).toContain('BSc in Maths')
    expect(previewText()).toContain('2020 – Present')
  })

  it('can be English while the app is Polish', () => {
    renderPage({ ui: 'pl', saved: savedCv({ language: 'en' }) })
    expect(screen.getByRole('heading', { name: 'Edytor' })).toBeInTheDocument()
    expect(previewText()).toContain('Experience')
    expect(previewText()).toContain('2020 – Present')
    expect(previewText()).not.toContain('Doświadczenie')
  })

  it('can be Polish while the app is English', () => {
    renderPage({ ui: 'en', saved: savedCv({ language: 'pl' }) })
    expect(screen.getByRole('heading', { name: 'Editor' })).toBeInTheDocument()
    expect(previewText()).toContain('Doświadczenie')
  })

  it('is chosen on the Template card and survives a reload', () => {
    const { unmount } = renderPage({ ui: 'en', saved: savedCv() })
    expect(previewText()).toContain('Experience')
    fireEvent.change(screen.getByLabelText('CV language'), { target: { value: 'pl' } })
    expect(previewText()).toContain('Doświadczenie')
    expect(JSON.parse(window.localStorage.getItem('cv_maker_data')).language).toBe('pl')
    unmount()
    renderPage({ ui: 'en' })
    expect(previewText()).toContain('Doświadczenie')
    expect(screen.getByLabelText('CV language')).toHaveValue('pl')
  })

  it('the "same as the app" option names the language it would use', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    expect(screen.getByRole('option', { name: 'Jak w aplikacji (polski)' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Polski' })).toBeInTheDocument()
  })

  it('follows the app when it is switched, as long as it is on "same as the app"', () => {
    renderPage({ ui: 'en', saved: savedCv() })
    expect(previewText()).toContain('Experience')
    switchTo('PL')
    expect(previewText()).toContain('Doświadczenie')
  })

  it('stays put when the app is switched and a language was chosen', () => {
    renderPage({ ui: 'en', saved: savedCv({ language: 'en' }) })
    switchTo('PL')
    expect(previewText()).toContain('Experience')
  })

  it('the page itself is marked with the CV language for spell checkers and screen readers', () => {
    renderPage({ ui: 'en', saved: savedCv({ language: 'pl' }) })
    expect(preview()).toHaveAttribute('lang', 'pl')
  })

  it('a backup from before languages existed opens as "same as the app"', () => {
    renderPage({ ui: 'pl', saved: savedCv() })
    expect(screen.getByLabelText('Język CV')).toHaveValue('auto')
  })
})
