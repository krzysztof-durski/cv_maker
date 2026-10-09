import { useRef } from 'react'
import { PANEL } from '../utils/layout'
import { useI18n } from '../i18n/I18nProvider'

/**
 * A draggable divider for the panel on its left. Drag with mouse, finger or pen; or focus it and use
 * Left/Right (Home/End for the extremes). Double-click restores the default width.
 */
export default function ResizeHandle({ width, min, max, onChange, onReset, label }) {
  const { t } = useI18n()
  const drag = useRef(null)

  const handlePointerDown = e => {
    if (e.button !== undefined && e.button !== 0) return
    e.preventDefault() // no text selection while dragging
    e.currentTarget.setPointerCapture?.(e.pointerId)
    drag.current = { startX: e.clientX, startWidth: width }
  }

  const handlePointerMove = e => {
    if (drag.current) onChange(drag.current.startWidth + e.clientX - drag.current.startX)
  }

  const endDrag = e => {
    drag.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const handleKeyDown = e => {
    const target = {
      ArrowLeft: width - PANEL.step,
      ArrowRight: width + PANEL.step,
      Home: min,
      End: max,
    }[e.key]
    if (target === undefined) return
    e.preventDefault()
    onChange(target)
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label || t('editor.resizeHandle')}
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      title={t('editor.resizeHint')}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      onDoubleClick={onReset}
      className="no-print group relative z-10 hidden w-1.5 shrink-0 cursor-col-resize touch-none select-none outline-none lg:block"
    >
      <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-transparent transition-colors group-hover:bg-indigo-400 group-focus-visible:bg-indigo-500 group-active:bg-indigo-500" />
    </div>
  )
}
