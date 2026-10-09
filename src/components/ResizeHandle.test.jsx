import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ResizeHandle from './ResizeHandle'

function setup(props = {}) {
  const onChange = vi.fn()
  const onReset = vi.fn()
  render(<ResizeHandle width={480} min={340} max={900} onChange={onChange} onReset={onReset} label="Resize editor panel" {...props} />)
  return { handle: screen.getByRole('separator', { name: 'Resize editor panel' }), onChange, onReset }
}

describe('ResizeHandle', () => {
  it('is an accessible vertical separator that reports its value and limits', () => {
    const { handle } = setup()
    expect(handle).toHaveAttribute('aria-orientation', 'vertical')
    expect(handle).toHaveAttribute('aria-valuenow', '480')
    expect(handle).toHaveAttribute('aria-valuemin', '340')
    expect(handle).toHaveAttribute('aria-valuemax', '900')
    expect(handle).toHaveAttribute('tabindex', '0')
  })

  it('is only shown on desktop and never printed', () => {
    const { handle } = setup()
    expect(handle).toHaveClass('hidden', 'lg:block', 'no-print')
  })

  it('follows the pointer while dragging', () => {
    const { handle, onChange } = setup()
    fireEvent.pointerDown(handle, { clientX: 500, pointerId: 1, button: 0 })
    fireEvent.pointerMove(handle, { clientX: 560, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(540)
    fireEvent.pointerMove(handle, { clientX: 450, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(430)
  })

  it('ignores pointer movement when not dragging', () => {
    const { handle, onChange } = setup()
    fireEvent.pointerMove(handle, { clientX: 700, pointerId: 1 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('stops following the pointer after it is released', () => {
    const { handle, onChange } = setup()
    fireEvent.pointerDown(handle, { clientX: 500, pointerId: 1, button: 0 })
    fireEvent.pointerUp(handle, { clientX: 500, pointerId: 1 })
    fireEvent.pointerMove(handle, { clientX: 600, pointerId: 1 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('stops following the pointer if the drag is cancelled', () => {
    const { handle, onChange } = setup()
    fireEvent.pointerDown(handle, { clientX: 500, pointerId: 1, button: 0 })
    fireEvent.pointerCancel(handle, { pointerId: 1 })
    fireEvent.pointerMove(handle, { clientX: 600, pointerId: 1 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not start dragging with the right mouse button', () => {
    const { handle, onChange } = setup()
    fireEvent.pointerDown(handle, { clientX: 500, pointerId: 1, button: 2 })
    fireEvent.pointerMove(handle, { clientX: 600, pointerId: 1 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('measures each drag from where the handle was when it was grabbed', () => {
    const { handle, onChange } = setup({ width: 600 })
    fireEvent.pointerDown(handle, { clientX: 100, pointerId: 1, button: 0 })
    fireEvent.pointerMove(handle, { clientX: 130, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(630)
  })

  it.each([
    ['ArrowRight', 504],
    ['ArrowLeft', 456],
    ['Home', 340],
    ['End', 900],
  ])('%s sets the width to %i', (key, expected) => {
    const { handle, onChange } = setup()
    fireEvent.keyDown(handle, { key })
    expect(onChange).toHaveBeenCalledWith(expected)
  })

  it('ignores other keys', () => {
    const { handle, onChange } = setup()
    fireEvent.keyDown(handle, { key: 'a' })
    fireEvent.keyDown(handle, { key: 'ArrowUp' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('resets on double-click', () => {
    const { handle, onReset } = setup()
    fireEvent.doubleClick(handle)
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
