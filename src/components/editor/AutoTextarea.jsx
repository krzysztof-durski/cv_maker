import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { fitTextHeight } from '../../utils/layout'
import { inputClass } from './styles'

const toSingleLine = text => text.replace(/\s*[\r\n]+\s*/g, ' ')

/**
 * A text box that is always exactly as tall as its text, so nothing is hidden behind a scrollbar.
 * `rows` is the minimum height. `maxHeight` (px) makes it scroll past that point instead of growing.
 * `singleLine` makes it behave like a one-line field that wraps: Enter does nothing, pasted line breaks become spaces.
 * `onChange` receives the new text, not the event.
 */
const AutoTextarea = forwardRef(function AutoTextarea({ value, onChange, rows = 1, maxHeight, singleLine = false, className = '', ...rest }, forwardedRef) {
  const ref = useRef(null)
  useImperativeHandle(forwardedRef, () => ref.current)

  const fit = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    if (!el.scrollHeight) { // not on screen (a hidden tab), so there is nothing to measure yet
      el.style.height = ''
      return
    }
    const borders = el.offsetHeight - el.clientHeight
    const { height, scrolls } = fitTextHeight(el.scrollHeight + borders, maxHeight)
    el.style.height = `${height}px`
    el.style.overflowY = scrolls ? 'auto' : 'hidden'
  }, [maxHeight])

  useLayoutEffect(fit, [value, fit])

  // Lines wrap differently when the box gets wider or narrower (the editor panel is resizable),
  // and a box in a hidden tab can only be measured once it is shown.
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    let width = el.clientWidth
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return // our own height change; only react to width
      width = el.clientWidth
      fit()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [fit])

  const handleChange = e => onChange(singleLine ? toSingleLine(e.target.value) : e.target.value)
  const handleKeyDown = e => {
    if (singleLine && e.key === 'Enter') e.preventDefault()
    rest.onKeyDown?.(e)
  }

  return (
    <textarea
      {...rest}
      ref={ref}
      rows={rows}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={`${inputClass} resize-none overflow-hidden ${className}`}
    />
  )
})

export default AutoTextarea
