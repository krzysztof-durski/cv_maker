import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TemplatePicker from './TemplatePicker'
import { stubImagePipeline } from '../../testing/imageMocks'

function setup(props = {}) {
  const handlers = { onTemplateChange: vi.fn(), onPhotoChange: vi.fn(), onCvLanguageChange: vi.fn(), onGenderChange: vi.fn() }
  render(<TemplatePicker template="classic" photo="" {...handlers} {...props} />)
  return handlers
}

const file = (name = 'me.png', type = 'image/png') => new File(['x'], name, { type })
const choose = f => fireEvent.change(screen.getByLabelText('Photo file'), { target: { files: [f] } })

describe('TemplatePicker: gender forms', () => {
  it('offers detect, masculine and feminine, starting on detect', () => {
    setup()
    expect(screen.getByLabelText('Gender forms in Polish text')).toHaveValue('auto')
    expect(screen.getByRole('option', { name: 'Detect from my text' })).toHaveValue('auto')
    expect(screen.getByRole('option', { name: 'Masculine (założyłem)' })).toHaveValue('masculine')
    expect(screen.getByRole('option', { name: 'Feminine (założyłam)' })).toHaveValue('feminine')
  })

  it('shows the saved choice and reports a new one', () => {
    const { onGenderChange } = setup({ gender: 'feminine' })
    expect(screen.getByLabelText('Gender forms in Polish text')).toHaveValue('feminine')
    fireEvent.change(screen.getByLabelText('Gender forms in Polish text'), { target: { value: 'masculine' } })
    expect(onGenderChange).toHaveBeenCalledWith('masculine')
  })

  it('says it never guesses from the name', () => {
    setup()
    expect(screen.getByText(/never guesses from your name/)).toBeInTheDocument()
  })
})

describe('TemplatePicker: language of the CV', () => {
  it('offers "same as the app", English and Polish, with the current choice selected', () => {
    setup({ cvLanguage: 'pl' })
    const select = screen.getByLabelText('CV language')
    expect(select).toHaveValue('pl')
    expect(screen.getByRole('option', { name: 'Same as the app (English)' })).toHaveValue('auto')
    expect(screen.getByRole('option', { name: 'English' })).toHaveValue('en')
    expect(screen.getByRole('option', { name: 'Polski' })).toHaveValue('pl')
  })

  it('starts on "same as the app" when nothing was chosen', () => {
    setup()
    expect(screen.getByLabelText('CV language')).toHaveValue('auto')
  })

  it('reports the language the user picks', () => {
    const { onCvLanguageChange } = setup()
    fireEvent.change(screen.getByLabelText('CV language'), { target: { value: 'pl' } })
    expect(onCvLanguageChange).toHaveBeenCalledWith('pl')
  })

  it('explains what it changes', () => {
    setup()
    expect(screen.getByText(/headings printed on the CV/)).toBeInTheDocument()
  })

  it('is available with either template', () => {
    setup({ template: 'photo' })
    expect(screen.getByLabelText('CV language')).toBeInTheDocument()
  })
})

describe('TemplatePicker', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('offers the classic and the photo template, with the current one selected', () => {
    setup({ template: 'photo' })
    expect(screen.getByRole('radio', { name: /Classic/ })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: /With photo/ })).toHaveAttribute('aria-checked', 'true')
  })

  it('reports the template the user picks', () => {
    const { onTemplateChange } = setup()
    fireEvent.click(screen.getByRole('radio', { name: /With photo/ }))
    expect(onTemplateChange).toHaveBeenCalledWith('photo')
  })

  it('has no photo controls for the classic template', () => {
    setup({ template: 'classic' })
    expect(screen.queryByRole('button', { name: /upload photo/i })).toBeNull()
  })

  it('offers an upload when the photo template has no picture yet', () => {
    setup({ template: 'photo' })
    expect(screen.getByRole('button', { name: 'Upload photo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
    expect(screen.getByText('No photo')).toBeInTheDocument()
  })

  it('shows the picture with change and remove buttons once there is one', () => {
    setup({ template: 'photo', photo: 'data:image/jpeg;base64,AAAA' })
    expect(screen.getByRole('img', { name: 'Your photo' })).toHaveAttribute('src', 'data:image/jpeg;base64,AAAA')
    expect(screen.getByRole('button', { name: 'Change photo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  it('saves the processed picture the user chooses', async () => {
    stubImagePipeline({ dataUrl: 'data:image/jpeg;base64,NEW' })
    const { onPhotoChange } = setup({ template: 'photo' })
    choose(file())
    await waitFor(() => expect(onPhotoChange).toHaveBeenCalledWith('data:image/jpeg;base64,NEW'))
  })

  it('explains why a picture could not be used, and keeps the old photo', async () => {
    const { onPhotoChange } = setup({ template: 'photo', photo: 'data:image/jpeg;base64,OLD' })
    choose(file('notes.pdf', 'application/pdf'))
    expect(await screen.findByRole('alert')).toHaveTextContent('Please choose a JPG, PNG, WebP or GIF picture.')
    expect(onPhotoChange).not.toHaveBeenCalled()
  })

  it('clears an old error after a successful upload', async () => {
    stubImagePipeline()
    setup({ template: 'photo' })
    choose(file('notes.pdf', 'application/pdf'))
    await screen.findByRole('alert')
    choose(file())
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
  })

  it('removes the photo', () => {
    const { onPhotoChange } = setup({ template: 'photo', photo: 'data:image/jpeg;base64,AAAA' })
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(onPhotoChange).toHaveBeenCalledWith('')
  })

  it('says the photo stays on the device and is not sent to the AI', () => {
    setup({ template: 'photo' })
    expect(screen.getByText(/never sent to the AI/)).toBeInTheDocument()
  })

  it('only accepts picture files', () => {
    setup({ template: 'photo' })
    expect(screen.getByLabelText('Photo file')).toHaveAttribute('accept', expect.stringContaining('image/jpeg'))
  })
})
