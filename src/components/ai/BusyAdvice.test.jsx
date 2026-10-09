import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BusyAdvice from './BusyAdvice'
import { I18nProvider } from '../../i18n/I18nProvider'
import { translate } from '../../i18n/core'

describe.each(['en', 'pl'])('BusyAdvice (%s)', lang => {
  const steps = translate(lang, 'ai.busy.steps')
  const show = props => render(<I18nProvider initial={lang}><BusyAdvice {...props} /></I18nProvider>)

  it('lists every step in order', () => {
    show()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(steps.length)
    steps.forEach((step, i) => expect(items[i]).toHaveTextContent(step.title))
  })

  it('has a heading unless compact', () => {
    const { unmount } = show()
    expect(screen.getByRole('heading', { name: translate(lang, 'ai.busy.title') })).toBeInTheDocument()
    unmount()
    show({ compact: true })
    expect(screen.queryByRole('heading')).toBeNull()
  })
})
