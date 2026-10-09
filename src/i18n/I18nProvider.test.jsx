import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { I18nProvider, useI18n, LANGUAGE_STORAGE_KEY } from './I18nProvider'
import { t as coreT, getLanguage, setLanguage } from './core'

function Probe() {
  const { lang, setLang, t } = useI18n()
  return (
    <div>
      <p data-testid="lang">{lang}</p>
      <p data-testid="text">{t('menu.saveBackup')}</p>
      <p data-testid="core">{coreT('menu.saveBackup')}</p>
      <button onClick={() => setLang('pl')}>to-pl</button>
      <button onClick={() => setLang('en')}>to-en</button>
    </div>
  )
}

const show = props => render(<I18nProvider {...props}><Probe /></I18nProvider>)

function browserLanguages(languages) {
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages)
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(languages[0])
}

describe('I18nProvider', () => {
  beforeEach(() => browserLanguages(['en-US']))
  afterEach(() => {
    vi.restoreAllMocks()
    setLanguage('en')
    document.documentElement.lang = ''
  })

  it('opens in English for an English browser', () => {
    show()
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    expect(screen.getByTestId('text')).toHaveTextContent('Save backup')
  })

  it('opens in Polish for a Polish browser', () => {
    browserLanguages(['pl-PL', 'en'])
    show()
    expect(screen.getByTestId('lang')).toHaveTextContent('pl')
    expect(screen.getByTestId('text')).toHaveTextContent('Zapisz kopię zapasową')
  })

  it('falls back to English for a browser language we do not have', () => {
    browserLanguages(['de-DE', 'fr'])
    show()
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('a saved choice beats the browser language', () => {
    browserLanguages(['pl-PL'])
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')
    show()
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('ignores a damaged saved value', () => {
    browserLanguages(['pl'])
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'klingon')
    show()
    expect(screen.getByTestId('lang')).toHaveTextContent('pl')
  })

  it('switches the language and remembers the choice', () => {
    show()
    fireEvent.click(screen.getByText('to-pl'))
    expect(screen.getByTestId('text')).toHaveTextContent('Zapisz kopię zapasową')
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pl')
    fireEvent.click(screen.getByText('to-en'))
    expect(screen.getByTestId('text')).toHaveTextContent('Save backup')
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })

  it('saves nothing until the user chooses, so the browser language keeps being followed', () => {
    show()
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull()
  })

  it('keeps the page language attribute in step', () => {
    show()
    expect(document.documentElement.lang).toBe('en')
    fireEvent.click(screen.getByText('to-pl'))
    expect(document.documentElement.lang).toBe('pl')
  })

  it('keeps the tab title and the page description in the language of the app', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
    try {
      show()
      expect(document.title).toBe('CV Maker — Harvard Style')
      expect(meta.getAttribute('content')).toMatch(/^Create a Harvard-style CV online/)
      fireEvent.click(screen.getByText('to-pl'))
      expect(document.title).toBe('CV Maker — styl Harvard')
      expect(meta.getAttribute('content')).toMatch(/^Stwórz CV w stylu Harvard online/)
    } finally {
      meta.remove()
    }
  })

  it('does not fail when the page has no description tag', () => {
    expect(() => show()).not.toThrow()
  })

  it('plain helper functions outside React switch language together with the app', () => {
    show()
    expect(screen.getByTestId('core')).toHaveTextContent('Save backup')
    fireEvent.click(screen.getByText('to-pl'))
    expect(getLanguage()).toBe('pl')
    expect(screen.getByTestId('core')).toHaveTextContent('Zapisz kopię zapasową')
  })

  it('can be told which language to start in', () => {
    browserLanguages(['en'])
    show({ initial: 'pl' })
    expect(screen.getByTestId('lang')).toHaveTextContent('pl')
  })

  it('still switches when storage is blocked', () => {
    const original = window.localStorage
    Object.defineProperty(window, 'localStorage', {
      value: { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } },
      configurable: true,
    })
    try {
      show()
      expect(screen.getByTestId('lang')).toHaveTextContent('en')
      act(() => { fireEvent.click(screen.getByText('to-pl')) })
      expect(screen.getByTestId('lang')).toHaveTextContent('pl')
    } finally {
      Object.defineProperty(window, 'localStorage', { value: original, configurable: true })
    }
  })

  it('works without a provider, in English', () => {
    render(<Probe />)
    expect(screen.getByTestId('text')).toHaveTextContent('Save backup')
  })
})
