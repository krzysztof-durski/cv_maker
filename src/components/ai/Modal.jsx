import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './icons'
import { useI18n } from '../../i18n/I18nProvider'

const openModals = []

// Full-screen on phones, centred dialog from `sm:` up. `no-print` keeps it out of the PDF.
export default function Modal({ title, subtitle, onClose, children, footer, size = 'lg' }) {
  const { t } = useI18n()
  const panelRef = useRef(null)
  // Callers pass inline functions; a ref keeps the effect below from re-running (and re-focusing) every render.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const token = {}
    openModals.push(token)
    // Only the topmost modal reacts to Escape (settings can open on top of the assistant).
    const onKey = e => { if (e.key === 'Escape' && openModals.at(-1) === token) onCloseRef.current() }
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      openModals.splice(openModals.indexOf(token), 1)
      document.body.style.overflow = overflow
    }
  }, [])

  const width = size === 'md' ? 'sm:max-w-lg' : size === 'xl' ? 'sm:max-w-5xl' : 'sm:max-w-2xl'

  return createPortal(
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-gray-950/50 backdrop-blur-sm" onMouseDown={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl outline-none dark:bg-gray-900 sm:h-auto sm:max-h-[90dvh] sm:rounded-2xl sm:border sm:border-gray-200 sm:dark:border-gray-700 ${width}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            title={t('common.close')}
            aria-label={t('common.close')}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/60">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export const primaryBtn =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'

export const secondaryBtn =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
