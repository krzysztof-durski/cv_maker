import { useState } from 'react'

export function moveItem(arr, index, direction) {
  const next = index + direction
  if (next < 0 || next >= arr.length) return arr
  const result = [...arr]
  ;[result[index], result[next]] = [result[next], result[index]]
  return result
}

function HelpPanel({ help }) {
  return (
    <div className="mx-3 mb-3 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-3">
      <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1.5">{help.intro}</p>
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
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  )
}

export function DateFields({ startDate, endDate, onStartChange, onEndChange }) {
  const isPresent = endDate === 'Present'
  return (
    <div className="col-span-2 grid grid-cols-2 gap-2 items-end">
      <Field
        label="Start Date"
        value={startDate}
        onChange={onStartChange}
        placeholder="Sep 2022"
      />
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">End Date</label>
        <input
          type="text"
          value={isPresent ? '' : endDate}
          onChange={e => onEndChange(e.target.value)}
          disabled={isPresent}
          placeholder="Jun 2026"
          className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500"
        />
        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={isPresent}
            onChange={e => onEndChange(e.target.checked ? 'Present' : '')}
            className="h-3.5 w-3.5 accent-gray-700 cursor-pointer"
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
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Bullet Points</label>
      {bullets.map((b, i) => (
        <div key={i} className="flex items-start gap-1 mb-1">
          <span className="text-gray-400 dark:text-gray-500 text-sm mt-1.5 shrink-0">•</span>
          <textarea
            value={b}
            onChange={e => onUpdate(i, e.target.value)}
            placeholder="Describe your achievement or responsibility..."
            rows={2}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          />
          <button
            onClick={() => onRemove(i)}
            className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-red-400 text-lg leading-none mt-1"
            title="Remove bullet"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mt-1"
      >
        + Add bullet
      </button>
    </div>
  )
}

export function EntryCard({ children, onRemove, canRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3 bg-gray-50 dark:bg-gray-900 relative">
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 disabled:opacity-20 disabled:cursor-default text-xs leading-none px-0.5"
          title="Move up"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 disabled:opacity-20 disabled:cursor-default text-xs leading-none px-0.5"
          title="Move down"
        >
          ▼
        </button>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-gray-300 dark:text-gray-600 hover:text-red-400 text-xl leading-none ml-0.5"
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
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          {help && (
            <button
              onClick={() => setShowHelp(v => !v)}
              title="Show tips for this section"
              className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors
                ${showHelp
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-blue-400 hover:text-white'}`}
            >
              ?
            </button>
          )}
        </div>
        {onReset && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors ml-2"
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
          className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-dashed border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 w-full hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
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
