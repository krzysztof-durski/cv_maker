import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LanguageSwitch from './LanguageSwitch'
import { I18nProvider, LANGUAGE_STORAGE_KEY } from '../i18n/I18nProvider'
import { setLanguage } from '../i18n/core'

const show = (initial = 'en') => render(<I18nProvider initial={initial}><LanguageSwitch /></I18nProvider>)

describe('LanguageSwitch', () => {
  afterEach(() => setLanguage('en'))

  it('offers English and Polish as a labelled group', () => {
    show()
    const group = screen.getByRole('group', { name: 'Language' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'PL' })).toBeInTheDocument()
  })

  it('marks the current language as pressed', () => {
    show('en')
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'PL' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches to Polish and back, relabelling itself', () => {
    show('en')
    fireEvent.click(screen.getByRole('button', { name: 'PL' }))
    expect(screen.getByRole('group', { name: 'Język' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'PL' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument()
  })

  it('remembers the choice', () => {
    show('en')
    fireEvent.click(screen.getByRole('button', { name: 'PL' }))
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pl')
  })

  it('names each language in itself for screen readers and tooltips', () => {
    show()
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('title', 'English')
    expect(screen.getByRole('button', { name: 'PL' })).toHaveAttribute('title', 'Polski')
    expect(screen.getByRole('button', { name: 'PL' })).toHaveAttribute('lang', 'pl')
  })
})
