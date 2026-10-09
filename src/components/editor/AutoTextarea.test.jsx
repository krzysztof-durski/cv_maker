import { useState } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AutoTextarea from './AutoTextarea'
import { mockTextLayout } from '../../testing/layoutMocks'

function Harness({ initial = '', ...props }) {
  const [value, setValue] = useState(initial)
  return <AutoTextarea aria-label="box" value={value} onChange={setValue} {...props} />
}

const box = () => screen.getByLabelText('box')

describe('AutoTextarea', () => {
  beforeEach(() => mockTextLayout({ lineHeight: 20 }))
  afterEach(() => vi.restoreAllMocks())

  it('is as tall as its text, borders included', () => {
    render(<Harness initial={'one\ntwo\nthree'} />)
    expect(box().style.height).toBe('62px') // 3 lines x 20 + 2px borders
  })

  it('grows as the user types more lines', async () => {
    const user = userEvent.setup()
    render(<Harness initial="one" rows={1} />)
    expect(box().style.height).toBe('22px')
    await user.type(box(), '{Enter}two{Enter}three')
    expect(box().style.height).toBe('62px')
  })

  it('shrinks again when text is removed', async () => {
    const user = userEvent.setup()
    render(<Harness initial={'a\nb\nc'} />)
    await user.clear(box())
    expect(box().style.height).toBe('22px')
  })

  it('never goes below the requested number of rows', () => {
    render(<Harness initial="" rows={4} />)
    expect(box().style.height).toBe('82px')
  })

  it('stops growing at maxHeight and scrolls instead', () => {
    render(<Harness initial={'1\n2\n3\n4\n5\n6\n7\n8\n9\n10'} maxHeight={100} />)
    expect(box().style.height).toBe('100px')
    expect(box().style.overflowY).toBe('auto')
  })

  it('does not scroll while the text fits', () => {
    render(<Harness initial="short" maxHeight={100} />)
    expect(box().style.overflowY).toBe('hidden')
  })

  it('leaves its height alone while it is not on screen', () => {
    vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(0) // like display:none
    render(<Harness initial="hidden text" />)
    expect(box().style.height).toBe('')
  })

  it('reports the new text, not the event', () => {
    const onChange = vi.fn()
    render(<AutoTextarea aria-label="box" value="" onChange={onChange} />)
    fireEvent.change(box(), { target: { value: 'hello' } })
    expect(onChange).toHaveBeenCalledWith('hello')
  })

  it('lets a normal box take line breaks', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.type(box(), 'a{Enter}b')
    expect(box()).toHaveValue('a\nb')
  })

  describe('as a single-line field', () => {
    it('ignores Enter', async () => {
      const user = userEvent.setup()
      render(<Harness singleLine />)
      await user.type(box(), 'a{Enter}b')
      expect(box()).toHaveValue('ab')
    })

    it('turns pasted line breaks into spaces', () => {
      render(<Harness singleLine />)
      fireEvent.change(box(), { target: { value: 'Python,\r\n  Go\nRust' } })
      expect(box()).toHaveValue('Python, Go Rust')
    })

    it('still calls a caller-supplied onKeyDown', async () => {
      const onKeyDown = vi.fn()
      const user = userEvent.setup()
      render(<Harness singleLine onKeyDown={onKeyDown} />)
      await user.type(box(), 'a')
      expect(onKeyDown).toHaveBeenCalled()
    })
  })

  it('passes the ref to the textarea', () => {
    const ref = { current: null }
    render(<AutoTextarea ref={ref} aria-label="box" value="" onChange={() => {}} />)
    expect(ref.current).toBe(box())
  })

  it('measures again when it becomes wider or narrower', () => {
    let notify
    const observe = vi.fn()
    vi.stubGlobal('ResizeObserver', class { constructor(cb) { notify = cb } observe = observe; disconnect() {} })
    let width = 300
    vi.spyOn(HTMLTextAreaElement.prototype, 'clientWidth', 'get').mockImplementation(() => width)

    render(<Harness initial="x" />)
    expect(observe).toHaveBeenCalled()
    const before = box().style.height

    // Narrower box: the same text wraps onto more lines.
    vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(100)
    width = 150
    notify()
    expect(box().style.height).not.toBe(before)
    expect(box().style.height).toBe('102px')
    vi.unstubAllGlobals()
  })

  it('ignores resize notifications that only come from its own height change', () => {
    let notify
    vi.stubGlobal('ResizeObserver', class { constructor(cb) { notify = cb } observe() {} disconnect() {} })
    vi.spyOn(HTMLTextAreaElement.prototype, 'clientWidth', 'get').mockReturnValue(300)
    render(<Harness initial="x" />)
    box().style.height = '999px'
    notify()
    expect(box().style.height).toBe('999px')
    vi.unstubAllGlobals()
  })
})
