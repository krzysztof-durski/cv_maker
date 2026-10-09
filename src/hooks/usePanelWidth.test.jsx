import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePanelWidth } from './usePanelWidth'
import { PANEL } from '../utils/layout'

const KEY = 'cv_maker_editor_width'

function setViewport(width) {
  window.innerWidth = width
}

describe('usePanelWidth', () => {
  beforeEach(() => setViewport(1600))

  it('starts at the default width', () => {
    const { result } = renderHook(() => usePanelWidth())
    expect(result.current.width).toBe(PANEL.default)
    expect(result.current.min).toBe(PANEL.min)
    expect(result.current.max).toBe(PANEL.max)
  })

  it('restores the width saved on a previous visit', () => {
    window.localStorage.setItem(KEY, '620')
    const { result } = renderHook(() => usePanelWidth())
    expect(result.current.width).toBe(620)
  })

  it('ignores a damaged saved value', () => {
    window.localStorage.setItem(KEY, 'banana')
    const { result } = renderHook(() => usePanelWidth())
    expect(result.current.width).toBe(PANEL.default)
  })

  it('remembers a new width', () => {
    const { result } = renderHook(() => usePanelWidth())
    act(() => result.current.setWidth(700))
    expect(result.current.width).toBe(700)
    expect(window.localStorage.getItem(KEY)).toBe('700')
  })

  it('keeps the width within the limits', () => {
    const { result } = renderHook(() => usePanelWidth())
    act(() => result.current.setWidth(10))
    expect(result.current.width).toBe(PANEL.min)
    act(() => result.current.setWidth(99999))
    expect(result.current.width).toBe(PANEL.max)
  })

  it('goes back to the default on reset', () => {
    const { result } = renderHook(() => usePanelWidth())
    act(() => result.current.setWidth(700))
    act(() => result.current.resetWidth())
    expect(result.current.width).toBe(PANEL.default)
    expect(window.localStorage.getItem(KEY)).toBe(String(PANEL.default))
  })

  it('leaves room for the preview when the window shrinks, and gives the width back when it grows', () => {
    const { result } = renderHook(() => usePanelWidth())
    act(() => result.current.setWidth(800))
    act(() => { setViewport(1100); window.dispatchEvent(new Event('resize')) })
    expect(result.current.width).toBe(1100 - PANEL.minPreview)
    expect(result.current.max).toBe(1100 - PANEL.minPreview)
    act(() => { setViewport(1600); window.dispatchEvent(new Event('resize')) })
    expect(result.current.width).toBe(800)
  })

  it('still works when storage is blocked', () => {
    const original = window.localStorage
    const blocked = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
    Object.defineProperty(window, 'localStorage', { value: blocked, configurable: true })
    try {
      const { result } = renderHook(() => usePanelWidth())
      expect(result.current.width).toBe(PANEL.default)
      act(() => result.current.setWidth(600))
      expect(result.current.width).toBe(600)
    } finally {
      Object.defineProperty(window, 'localStorage', { value: original, configurable: true })
    }
  })
})
