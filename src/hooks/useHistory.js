import { useCallback, useEffect, useRef, useState } from 'react'

const LIMIT = 100
// Edits made within this many ms of the previous one are one step, so typing a sentence is one undo, not one per letter.
const GROUP_MS = 800

/**
 * Undo/redo around a state value. `set` works like a normal setter (value or updater function)
 * and records what was replaced. History lives in memory only, so it ends with the page.
 */
export function useHistory(value, setValue) {
  const current = useRef(value)
  const past = useRef([])
  const future = useRef([])
  const lastEdit = useRef(0)
  const [, rerender] = useState(0)
  current.current = value

  const set = useCallback(update => {
    const before = current.current
    const after = typeof update === 'function' ? update(before) : update
    if (after === before) return
    const now = Date.now()
    if (now - lastEdit.current > GROUP_MS) past.current = [...past.current.slice(-(LIMIT - 1)), before]
    lastEdit.current = now
    future.current = []
    current.current = after // so several updates in one event build on each other
    setValue(after)
    rerender(n => n + 1)
  }, [setValue])

  const undo = useCallback(() => {
    if (!past.current.length) return
    const target = past.current.at(-1)
    past.current = past.current.slice(0, -1)
    future.current = [current.current, ...future.current].slice(0, LIMIT)
    current.current = target
    lastEdit.current = 0
    setValue(target)
    rerender(n => n + 1)
  }, [setValue])

  const redo = useCallback(() => {
    if (!future.current.length) return
    const [target, ...rest] = future.current
    future.current = rest
    past.current = [...past.current.slice(-(LIMIT - 1)), current.current]
    current.current = target
    lastEdit.current = 0
    setValue(target)
    rerender(n => n + 1)
  }, [setValue])

  const clear = useCallback(() => {
    past.current = []
    future.current = []
    rerender(n => n + 1)
  }, [])

  // Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl+Y, except while typing in a field (which has its own undo) or in a dialog.
  useEffect(() => {
    const onKey = e => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return
      const key = e.key.toLowerCase()
      if (key !== 'z' && key !== 'y') return
      const el = e.target
      if (el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return
      if (document.querySelector('[role=dialog]')) return
      e.preventDefault()
      if (key === 'y' || e.shiftKey) redo()
      else undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  return { set, undo, redo, clear, canUndo: past.current.length > 0, canRedo: future.current.length > 0 }
}
