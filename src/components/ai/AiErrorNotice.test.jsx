import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AiErrorNotice from './AiErrorNotice'

describe('AiErrorNotice', () => {
  it('shows nothing without a message', () => {
    const { container } = render(<AiErrorNotice message="" kind="unavailable" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the message as an alert', () => {
    render(<AiErrorNotice message="Gemini rejected your API key" kind="auth" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Gemini rejected your API key')
  })

  it('adds the busy advice when the provider is overloaded', () => {
    render(<AiErrorNotice message="Gemini is having trouble right now (503)" kind="unavailable" />)
    const advice = screen.getByTestId('busy-advice')
    expect(advice).toHaveTextContent('Switch to another model')
    expect(advice).toHaveTextContent('Cancel the request and send it again')
    expect(advice).toHaveTextContent('Wait a minute')
  })

  it.each(['auth', 'quota', 'network', 'cutoff', ''])('gives no busy advice for a %s error', kind => {
    render(<AiErrorNotice message="Something failed" kind={kind} />)
    expect(screen.queryByTestId('busy-advice')).toBeNull()
  })
})
