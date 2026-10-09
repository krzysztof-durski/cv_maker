import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import InfoPage from './InfoPage'
import { I18nProvider } from '../i18n/I18nProvider'
import { DICTIONARIES, setLanguage } from '../i18n/core'

const PAGES = ['help', 'about', 'terms', 'privacy']

const show = (page, lang = 'en') => render(
  <I18nProvider initial={lang}>
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <InfoPage page={page} />
    </MemoryRouter>
  </I18nProvider>
)

afterEach(() => setLanguage('en'))

describe.each(['en', 'pl'])('information pages in %s', lang => {
  it.each(PAGES)('%s: shows its title and one heading per titled section', page => {
    show(page, lang)
    const content = DICTIONARIES[lang].pages[page]
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.title)
    const titled = content.sections.filter(s => s.title)
    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(headings).toEqual(titled.map(s => s.title))
  })

  it.each(PAGES)('%s: leaves no markup or placeholder behind', page => {
    const { container } = show(page, lang)
    expect(container.textContent).not.toMatch(/\*\*|\]\(|\{year\}|\{\w+\}/)
  })

  it('has the footer links and a language switch', () => {
    show('help', lang)
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getAllByRole('link')).toHaveLength(5)
    expect(screen.getByRole('group', { name: lang === 'pl' ? 'Język' : 'Language' })).toBeInTheDocument()
  })

  it('terms and privacy show when they were last updated', () => {
    show('terms', lang)
    expect(screen.getByText(new RegExp(DICTIONARIES[lang].pages.updatedLabel))).toHaveTextContent(DICTIONARIES[lang].pages.terms.updated)
  })

  it('terms show the current year in the copyright line', () => {
    show('terms', lang)
    expect(document.body.textContent).toContain(`© ${new Date().getFullYear()} Krzysztof Durski`)
  })

  it('help includes the advice for a busy AI provider', () => {
    show('help', lang)
    expect(screen.getByTestId('busy-advice')).toBeInTheDocument()
  })

  it('help has the contact address as a mail link', () => {
    show('help', lang)
    expect(screen.getByRole('link', { name: 'contact@codepapa.xyz' })).toHaveAttribute('href', 'mailto:contact@codepapa.xyz')
  })

  it('privacy links to the providers\' own policies in a new tab', () => {
    show('privacy', lang)
    for (const name of ['OpenAI', 'Anthropic', 'Google']) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('target', '_blank')
    }
  })
})

describe('information pages', () => {
  it('about has no subtitle line missing and terms have none extra', () => {
    show('terms')
    expect(document.querySelector('main > p.text-base')).toBeNull()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terms of Service')
  })

  it('the page changes language in place when the switch is used', () => {
    show('about', 'en')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About this project')
    fireEvent.click(screen.getByRole('button', { name: 'PL' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('O tym projekcie')
    expect(screen.getByRole('link', { name: '← Wróć do edytora' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About this project')
  })

  it('the English help page mentions every feature added with the Polish version', () => {
    show('help')
    expect(document.body.textContent).toMatch(/EN \/ PL/)
    expect(document.body.textContent).toMatch(/CV language/)
  })
})
