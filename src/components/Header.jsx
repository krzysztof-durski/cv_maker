import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/* ---------- icons ---------- */
const Icon = ({ path, className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {path}
  </svg>
)
const DownloadIcon = (p) => <Icon {...p} path={<><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>} />
const MoonIcon = (p) => <Icon {...p} path={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />} />
const SunIcon = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>} />
const MenuIcon = (p) => <Icon {...p} path={<><circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" /></>} />
const SaveIcon = (p) => <Icon {...p} path={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>} />
const UploadIcon = (p) => <Icon {...p} path={<><path d="M12 21V9" /><path d="m7 14 5-5 5 5" /><path d="M5 3h14" /></>} />
const TrashIcon = (p) => <Icon {...p} path={<><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></>} />

/* ---------- overflow menu ---------- */
function OverflowMenu({ onDownload, onUpload, onReset }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  const item = 'flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
  const close = (fn) => () => { setOpen(false); fn?.() }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        title="More options"
      >
        <MenuIcon />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg animate-menu-in z-50"
        >
          <button role="menuitem" className={item} onClick={close(onDownload)}>
            <SaveIcon className="h-4 w-4 text-gray-400" /> Save backup
          </button>
          <button role="menuitem" className={item} onClick={close(() => fileInputRef.current?.click())}>
            <UploadIcon className="h-4 w-4 text-gray-400" /> Restore backup
          </button>

          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

          <Link role="menuitem" to="/help" className={item} onClick={() => setOpen(false)}>Help &amp; guide</Link>
          <Link role="menuitem" to="/about" className={item} onClick={() => setOpen(false)}>About</Link>
          <Link role="menuitem" to="/terms" className={item} onClick={() => setOpen(false)}>Terms</Link>
          <Link role="menuitem" to="/privacy" className={item} onClick={() => setOpen(false)}>Privacy</Link>

          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

          <button
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            onClick={close(onReset)}
          >
            <TrashIcon className="h-4 w-4" /> Reset all data
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={e => { onUpload(e.target.files[0]); e.target.value = '' }}
      />
    </div>
  )
}

/* ---------- header ---------- */
export default function Header({ onReset, onPrint, onDownload, onUpload, isDark, onToggleDark, mobileView, onMobileViewChange }) {
  const seg = (active) =>
    `px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
      active
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
    }`

  return (
    <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-gray-900/85 px-3 backdrop-blur-md sm:px-4">
      {/* Brand */}
      <Link to="/" className="flex shrink-0 items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gray-900 text-[11px] font-bold tracking-tight text-white dark:bg-white dark:text-gray-900">
          CV
        </span>
        <span className="hidden text-sm font-semibold text-gray-900 dark:text-gray-100 sm:block">CV Maker</span>
        <span className="hidden text-xs text-gray-400 dark:text-gray-500 md:block">Harvard style</span>
      </Link>

      {/* Mobile: Edit / Preview toggle */}
      <div className="flex flex-1 justify-center lg:hidden">
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-0.5 dark:border-gray-700 dark:bg-gray-800">
          <button onClick={() => onMobileViewChange('edit')} className={seg(mobileView === 'edit')}>Edit</button>
          <button onClick={() => onMobileViewChange('preview')} className={seg(mobileView === 'preview')}>Preview</button>
        </div>
      </div>

      {/* Desktop spacer */}
      <div className="hidden flex-1 lg:block" />

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          onClick={onPrint}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 sm:px-3.5"
          title="Print or save your CV as a PDF"
        >
          <DownloadIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Save PDF</span>
        </button>

        <button
          onClick={onToggleDark}
          className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        <OverflowMenu onDownload={onDownload} onUpload={onUpload} onReset={onReset} />
      </div>
    </header>
  )
}
