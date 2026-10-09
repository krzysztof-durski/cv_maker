import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PreviewHeader from './PreviewHeader'

const personal = {
  name: 'Ada Lovelace', jobTitle: 'Engineer', phone: '+44 1', email: 'ada@x.com', location: 'London',
  links: [{ id: 'l1', type: 'github', url: 'https://github.com/ada', label: '' }],
  photo: 'data:image/jpeg;base64,AAAA',
}

describe('PreviewHeader', () => {
  describe('classic template', () => {
    it('shows the name, job title and every contact detail', () => {
      render(<PreviewHeader personal={personal} template="classic" />)
      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
      expect(screen.getByText('Engineer')).toBeInTheDocument()
      expect(screen.getByText('+44 1')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'ada@x.com' })).toHaveAttribute('href', 'mailto:ada@x.com')
      expect(screen.getByRole('link', { name: /github\.com\/ada/ })).toHaveAttribute('href', 'https://github.com/ada')
      expect(screen.getByText('London')).toBeInTheDocument()
    })

    it('is centred and never shows the photo, even if one is stored', () => {
      render(<PreviewHeader personal={personal} template="classic" />)
      expect(screen.queryByRole('img', { name: /photo/i })).toBeNull()
      expect(screen.getByText('Ada Lovelace').parentElement).toHaveStyle({ textAlign: 'center' })
    })

    it('is the default template', () => {
      render(<PreviewHeader personal={personal} />)
      expect(screen.queryByRole('img', { name: /photo/i })).toBeNull()
      expect(screen.getByText('Ada Lovelace').parentElement).toHaveStyle({ textAlign: 'center' })
    })

    it('copes with an empty personal section', () => {
      const { container } = render(<PreviewHeader personal={{ name: '', jobTitle: '', links: [] }} />)
      expect(container.textContent).toBe('')
    })
  })

  describe('photo template', () => {
    it('shows the photo, described by the person\'s name', () => {
      render(<PreviewHeader personal={personal} template="photo" />)
      const photo = screen.getByRole('img', { name: 'Photo of Ada Lovelace' })
      expect(photo).toHaveAttribute('src', personal.photo)
    })

    it('puts the photo before the name and aligns the text to the left', () => {
      render(<PreviewHeader personal={personal} template="photo" />)
      const photo = screen.getByRole('img', { name: /photo of/i })
      const name = screen.getByText('Ada Lovelace')
      expect(photo.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(name.parentElement).toHaveStyle({ textAlign: 'left' })
    })

    it('keeps all the contact details', () => {
      render(<PreviewHeader personal={personal} template="photo" />)
      expect(screen.getByText('+44 1')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'ada@x.com' })).toBeInTheDocument()
      expect(screen.getByText('London')).toBeInTheDocument()
    })

    it('shows the text on its own when no photo has been uploaded yet', () => {
      render(<PreviewHeader personal={{ ...personal, photo: '' }} template="photo" />)
      expect(screen.queryByRole('img', { name: /photo/i })).toBeNull()
      expect(screen.getByText('Ada Lovelace').parentElement).toHaveStyle({ textAlign: 'left' })
    })

    it('uses a plain alt text when there is no name', () => {
      render(<PreviewHeader personal={{ ...personal, name: '' }} template="photo" />)
      expect(screen.getByRole('img', { name: 'Photo' })).toBeInTheDocument()
    })

    it('does not stretch or squash the picture', () => {
      render(<PreviewHeader personal={personal} template="photo" />)
      expect(screen.getByRole('img', { name: /photo of/i })).toHaveStyle({ objectFit: 'cover', width: '104px', height: '104px' })
    })
  })
})
