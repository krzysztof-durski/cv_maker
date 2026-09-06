import { Link } from 'react-router-dom'

/**
 * Shared chrome for the standalone info pages (Help, About, Terms, Privacy).
 * Provides a sticky brand bar, a constrained readable column, and a footer nav.
 */
export default function PageShell({ title, subtitle, updated, children }) {
  return (
    <div className="min-h-dvh bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/85 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/85">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gray-900 text-[11px] font-bold text-white dark:bg-white dark:text-gray-900">
              CV
            </span>
            <span className="text-sm font-semibold">CV Maker</span>
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back to editor
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{subtitle}</p>}
        {updated && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Last updated: {updated}</p>
        )}

        <div
          className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300
            [&_a]:font-medium [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-indigo-500 dark:[&_a]:text-indigo-400
            [&_code]:rounded [&_code]:bg-gray-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px] dark:[&_code]:bg-gray-800
            [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-gray-100
            [&_li]:my-1
            [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5
            [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5"
        >
          {children}
        </div>

        <footer className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200 pt-6 text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
          <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">Home</Link>
          <Link to="/help" className="hover:text-gray-700 dark:hover:text-gray-300">Help</Link>
          <Link to="/about" className="hover:text-gray-700 dark:hover:text-gray-300">About</Link>
          <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</Link>
          <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</Link>
        </footer>
      </main>
    </div>
  )
}
