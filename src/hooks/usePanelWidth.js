import { useCallback, useEffect, useState } from 'react'
import { PANEL, clampPanelWidth, parseStoredWidth } from '../utils/layout'

const STORAGE_KEY = 'cv_maker_editor_width'

function readStored() {
  try {
    return parseStoredWidth(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return PANEL.default
  }
}

/**
 * The editor panel's width in px: remembered between visits and always kept within what the
 * current window allows (shrinking the window never leaves the preview squeezed out).
 */
export function usePanelWidth() {
  const [stored, setStored] = useState(readStored)
  const [viewport, setViewport] = useState(() => window.innerWidth)

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(stored))
    } catch {
      // Storage blocked or full: the width just isn't remembered
    }
  }, [stored])

  const setWidth = useCallback(next => setStored(clampPanelWidth(next, window.innerWidth)), [])
  const resetWidth = useCallback(() => setStored(PANEL.default), [])

  return {
    width: clampPanelWidth(stored, viewport),
    min: PANEL.min,
    max: clampPanelWidth(PANEL.max, viewport),
    setWidth,
    resetWidth,
  }
}
