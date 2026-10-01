import { CloseIcon } from './icons'

export default function UndoBar({ message, onUndo, onDismiss }) {
  return (
    <div
      role="status"
      className="no-print fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-gray-700 bg-gray-900 py-2 pl-4 pr-2 text-sm text-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
    >
      <span className="min-w-0 truncate">{message}</span>
      <button
        onClick={onUndo}
        className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold transition-colors hover:bg-white/20"
      >
        Undo
      </button>
      <button
        onClick={onDismiss}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-gray-300 transition-colors hover:bg-white/10"
        title="Dismiss"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
