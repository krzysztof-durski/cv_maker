import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EditorPage from './EditorPage'
import { mockTextLayout } from '../testing/layoutMocks'
import { PANEL } from '../utils/layout'

const PHOTO = 'data:image/jpeg;base64,AAAA'

// A saved CV without a section order, like one from before the order was saved: it gets the default.
const savedCv = (extra = {}) => ({
  personal: { name: 'Ada Lovelace', jobTitle: 'Engineer', phone: '', email: '', location: '', links: [], photo: PHOTO },
  experience: [{ id: 'e1', title: 'Analyst', company: 'Babbage Ltd', location: '', startDate: '2020', endDate: 'Present', bullets: ['Wrote the first program'] }],
  projects: [{ id: 'p1', name: 'Difference Machine', technologies: '', startDate: '', endDate: '', link: '', description: '', bullets: [] }],
  education: [{ id: 'd1', school: 'Home School', degree: 'BSc', field: '', location: '', startDate: '', endDate: '', bullets: [] }],
  ...extra,
})

function renderPage(saved) {
  if (saved) window.localStorage.setItem('cv_maker_data', JSON.stringify(saved))
  return render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><EditorPage /></MemoryRouter>)
}

const preview = () => document.getElementById('cv-page')
const editorPanel = () => screen.getByRole('separator', { name: 'Resize editor panel' }).previousElementSibling
const headingsInPreview = () =>
  ['Experience', 'Projects', 'Education'].map(title => ({ title, at: preview().textContent.toUpperCase().indexOf(title.toUpperCase()) }))

beforeEach(() => {
  window.innerWidth = 1600 // a wide desktop window; jsdom's default is too narrow to leave room for a wide panel
  mockTextLayout()
})
afterEach(() => vi.restoreAllMocks())

describe('EditorPage: section order', () => {
  it('lists education after experience and projects in the section manager of a new CV', () => {
    renderPage()
    const manager = screen.getByText('Toggle on/off · Drag to reorder').parentElement.parentElement
    const labels = within(manager).getAllByText(/^(Profile|Experience|Projects|Education|Skills)$/).map(el => el.textContent)
    expect(labels).toEqual(['Profile', 'Experience', 'Projects', 'Education', 'Skills'])
  })

  it('shows education after experience and projects in the preview', () => {
    renderPage(savedCv())
    const [experience, projects, education] = headingsInPreview().map(h => h.at)
    expect(experience).toBeGreaterThan(-1)
    expect(experience).toBeLessThan(projects)
    expect(projects).toBeLessThan(education)
  })

  it('keeps the order of a CV whose owner already chose one', () => {
    renderPage(savedCv({ sectionOrder: [{ id: 'education', enabled: true }, { id: 'experience', enabled: true }, { id: 'projects', enabled: true }] }))
    const [experience, projects, education] = headingsInPreview().map(h => h.at)
    expect(education).toBeLessThan(experience)
    expect(experience).toBeLessThan(projects)
  })
})

describe('EditorPage: resizable editor panel', () => {
  it('starts at the default width', () => {
    renderPage()
    expect(editorPanel().style.getPropertyValue('--editor-width')).toBe(`${PANEL.default}px`)
  })

  it('is wider after the handle is nudged right, and narrower after left', () => {
    renderPage()
    const handle = screen.getByRole('separator', { name: 'Resize editor panel' })
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(editorPanel().style.getPropertyValue('--editor-width')).toBe(`${PANEL.default + PANEL.step}px`)
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    expect(editorPanel().style.getPropertyValue('--editor-width')).toBe(`${PANEL.default - PANEL.step}px`)
  })

  it('follows a drag and restores the default on double-click', () => {
    renderPage()
    const handle = screen.getByRole('separator', { name: 'Resize editor panel' })
    fireEvent.pointerDown(handle, { clientX: 480, pointerId: 1, button: 0 })
    fireEvent.pointerMove(handle, { clientX: 600, pointerId: 1 })
    fireEvent.pointerUp(handle, { pointerId: 1 })
    expect(editorPanel().style.getPropertyValue('--editor-width')).toBe('600px')
    fireEvent.doubleClick(handle)
    expect(editorPanel().style.getPropertyValue('--editor-width')).toBe(`${PANEL.default}px`)
  })

  it('only applies the chosen width on desktop; the phone layout stays full width', () => {
    renderPage()
    expect(editorPanel()).toHaveClass('w-full', 'lg:w-[var(--editor-width)]')
    expect(screen.getByRole('separator', { name: 'Resize editor panel' })).toHaveClass('hidden', 'lg:block')
  })

  it('remembers the width for next time', () => {
    const { unmount } = renderPage()
    fireEvent.keyDown(screen.getByRole('separator', { name: 'Resize editor panel' }), { key: 'End' })
    unmount()
    renderPage()
    expect(editorPanel().style.getPropertyValue('--editor-width')).toBe(`${PANEL.max}px`)
  })
})

describe('EditorPage: template and photo', () => {
  const photoInPreview = () => within(preview()).queryByRole('img', { name: /photo of/i })

  it('shows the classic header by default, without the photo', () => {
    renderPage(savedCv())
    expect(photoInPreview()).toBeNull()
  })

  it('switches the preview to the photo layout and back', () => {
    renderPage(savedCv())
    fireEvent.click(screen.getByRole('radio', { name: /With photo/ }))
    expect(photoInPreview()).toHaveAttribute('src', PHOTO)
    fireEvent.click(screen.getByRole('radio', { name: /Classic/ }))
    expect(photoInPreview()).toBeNull()
  })

  it('keeps the chosen template after a reload', () => {
    const { unmount } = renderPage(savedCv())
    fireEvent.click(screen.getByRole('radio', { name: /With photo/ }))
    unmount()
    renderPage()
    expect(screen.getByRole('radio', { name: /With photo/ })).toHaveAttribute('aria-checked', 'true')
    expect(photoInPreview()).toHaveAttribute('src', PHOTO)
  })

  it('removing the photo clears it from the preview and from the saved CV', () => {
    renderPage(savedCv({ template: 'photo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(photoInPreview()).toBeNull()
    expect(JSON.parse(window.localStorage.getItem('cv_maker_data')).personal.photo).toBe('')
  })

  it('undo brings a removed photo back', () => {
    renderPage(savedCv({ template: 'photo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    fireEvent.click(screen.getByRole('button', { name: /undo/i }))
    expect(photoInPreview()).toHaveAttribute('src', PHOTO)
  })
})

describe('EditorPage: text boxes fit their text', () => {
  it('grows a bullet box with a long, multi-line bullet', () => {
    renderPage(savedCv({ experience: [{ id: 'e1', title: 'Analyst', company: 'Babbage Ltd', location: '', startDate: '', endDate: '', bullets: ['a\nb\nc\nd\ne'] }] }))
    expect(screen.getByLabelText('Bullet point 1').style.height).toBe('102px') // 5 lines x 20 + 2
  })

  it('grows as bullet text is typed', () => {
    renderPage(savedCv())
    const bullet = screen.getByLabelText('Bullet point 1')
    const before = parseInt(bullet.style.height, 10)
    fireEvent.change(bullet, { target: { value: 'one\ntwo\nthree\nfour\nfive\nsix' } })
    expect(parseInt(bullet.style.height, 10)).toBeGreaterThan(before)
  })

  it('keeps single-line fields on one logical line', () => {
    renderPage(savedCv())
    const company = screen.getByDisplayValue('Babbage Ltd')
    fireEvent.change(company, { target: { value: 'Babbage\nLtd' } })
    expect(company).toHaveValue('Babbage Ltd')
  })
})

describe('EditorPage: gender forms', () => {
  it('are chosen on the Template card and survive a reload', () => {
    const { unmount } = renderPage(savedCv())
    fireEvent.change(screen.getByLabelText('Gender forms in Polish text'), { target: { value: 'feminine' } })
    expect(JSON.parse(window.localStorage.getItem('cv_maker_data')).gender).toBe('feminine')
    unmount()
    renderPage()
    expect(screen.getByLabelText('Gender forms in Polish text')).toHaveValue('feminine')
  })
})
