// Pure sizing rules for the resizable editor panel and the auto-growing text boxes.

export const PANEL = { min: 340, max: 900, default: 480, step: 24, minPreview: 420 }

/** Keeps the panel width between its limits, leaving the preview at least `minPreview` wide. */
export function clampPanelWidth(width, viewportWidth, limits = PANEL) {
  const max = Math.max(limits.min, Math.min(limits.max, viewportWidth - limits.minPreview))
  const value = Number.isFinite(width) ? width : limits.default
  return Math.round(Math.min(max, Math.max(limits.min, value)))
}

/** A saved width from localStorage, or the default when it is missing or damaged. */
export function parseStoredWidth(raw, fallback = PANEL.default) {
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}

/**
 * Height for a text box whose content is `scrollHeight` tall. Grows with the content,
 * and past `maxHeight` stops growing and scrolls instead.
 */
export function fitTextHeight(scrollHeight, maxHeight = Infinity) {
  const height = Math.min(scrollHeight, maxHeight)
  return { height, scrolls: scrollHeight > maxHeight }
}
