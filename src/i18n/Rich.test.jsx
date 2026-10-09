import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Rich from './Rich'

const show = text => render(<MemoryRouter><p data-testid="p"><Rich text={text} codeClassName="code-style" /></p></MemoryRouter>)

describe('Rich', () => {
  it('renders plain text as it is', () => {
    show('Just text')
    expect(screen.getByTestId('p')).toHaveTextContent('Just text')
  })

  it('makes bold, italic and code', () => {
    show('Press **Save** and *wait* for `a.json`')
    expect(screen.getByText('Save').tagName).toBe('STRONG')
    expect(screen.getByText('wait').tagName).toBe('EM')
    const code = screen.getByText('a.json')
    expect(code.tagName).toBe('CODE')
    expect(code).toHaveClass('code-style')
    expect(screen.getByTestId('p')).toHaveTextContent('Press Save and wait for a.json')
  })

  it('opens web links in a new tab, safely', () => {
    show('See [the docs](https://example.com/x)')
    const link = screen.getByRole('link', { name: 'the docs' })
    expect(link).toHaveAttribute('href', 'https://example.com/x')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('leaves mailto links in the same tab', () => {
    show('Write to [me](mailto:a@b.c)')
    const link = screen.getByRole('link', { name: 'me' })
    expect(link).toHaveAttribute('href', 'mailto:a@b.c')
    expect(link).not.toHaveAttribute('target')
  })

  it('uses the router for links inside the app', () => {
    show('Open the [help page](/help)')
    expect(screen.getByRole('link', { name: 'help page' })).toHaveAttribute('href', '/help')
  })
})
