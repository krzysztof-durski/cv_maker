import { useState } from 'react'

export function moveItem(arr, index, direction) {
  const next = index + direction
  if (next < 0 || next >= arr.length) return arr
  const result = [...arr]
  ;[result[index], result[next]] = [result[next], result[index]]
  return result
}

/* Shared input styling — imported by the other section editors too */
export const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400'

export const labelClass = 'block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'

function HelpPanel({ help }) {
  return (
    <div className="mx-3 mb-3 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
      <p className="mb-1.5 text-xs font-medium text-blue-800 dark:text-blue-200">{help.intro}</p>
      <ul className="space-y-1">
        {help.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-blue-700 dark:text-blue-300">
            <span className="mt-0.5 shrink-0">·</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Field({ label, value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

export function DateFields({ startDate, endDate, onStartChange, onEndChange }) {
  const isPresent = endDate === 'Present'
  return (
    <div className="col-span-2 grid grid-cols-2 items-start gap-2">
      <Field
        label="Start Date"
        value={startDate}
        onChange={onStartChange}
        placeholder="Sep 2022"
      />
      <div>
        <label className={labelClass}>End Date</label>
        <input
          type="text"
          value={isPresent ? '' : endDate}
          onChange={e => onEndChange(e.target.value)}
          disabled={isPresent}
          placeholder="Jun 2026"
          className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-600 dark:disabled:text-gray-500`}
        />
        <label className="mt-1.5 flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={isPresent}
            onChange={e => onEndChange(e.target.checked ? 'Present' : '')}
            className="h-3.5 w-3.5 cursor-pointer accent-indigo-600"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">Currently ongoing</span>
        </label>
      </div>
    </div>
  )
}

export function BulletList({ bullets, onAdd, onUpdate, onRemove }) {
  return (
    <div className="col-span-2">
      <label className={labelClass}>Bullet Points</label>
      {bullets.map((b, i) => (
        <div key={i} className="mb-1.5 flex items-start gap-1.5">
          <span className="mt-2 shrink-0 text-sm text-gray-400 dark:text-gray-500">•</span>
          <textarea
            value={b}
            onChange={e => onUpdate(i, e.target.value)}
            placeholder="Describe your achievement or responsibility..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
          <button
            onClick={() => onRemove(i)}
            className="mt-1 shrink-0 text-lg leading-none text-gray-300 transition-colors hover:text-red-500 dark:text-gray-600"
            title="Remove bullet"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="mt-1 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400"
      >
        + Add bullet
      </button>
    </div>
  )
}

export function EntryCard({ children, onRemove, canRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="relative mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="absolute right-2 top-2 flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="px-0.5 text-xs leading-none text-gray-300 transition-colors hover:text-gray-500 disabled:cursor-default disabled:opacity-20 dark:text-gray-600 dark:hover:text-gray-400"
          title="Move up"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="px-0.5 text-xs leading-none text-gray-300 transition-colors hover:text-gray-500 disabled:cursor-default disabled:opacity-20 dark:text-gray-600 dark:hover:text-gray-400"
          title="Move down"
        >
          ▼
        </button>
        {canRemove && (
          <button
            onClick={onRemove}
            className="ml-0.5 text-xl leading-none text-gray-300 transition-colors hover:text-red-500 dark:text-gray-600"
            title="Remove entry"
          >
            ×
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 pr-16">
        {children}
      </div>
    </div>
  )
}

export function SectionShell({ title, children, onAdd, addLabel = '+ Add entry', onReset, help }) {
  const [showHelp, setShowHelp] = useState(false)

  const handleReset = () => {
    if (window.confirm(`Reset the "${title}" section? All entries will be cleared.`)) {
      onReset()
    }
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</p>
          {help && (
            <button
              onClick={() => setShowHelp(v => !v)}
              title="Show tips for this section"
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors
                ${showHelp
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500 hover:bg-blue-400 hover:text-white dark:bg-gray-600 dark:text-gray-300'}`}
            >
              ?
            </button>
          )}
        </div>
        {onReset && (
          <button
            onClick={handleReset}
            className="ml-2 text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500"
            title={`Reset ${title}`}
          >
            ↺ Reset
          </button>
        )}
      </div>
      {showHelp && help && <HelpPanel help={help} />}
      <div className="p-3">
        {children}
        <button
          onClick={onAdd}
          className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
        >
          {addLabel}
        </button>
      </div>
    </div>
  )
}

export function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)
}
