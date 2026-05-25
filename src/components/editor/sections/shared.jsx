export function Field({ label, value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-500 mb-0.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 bg-white"
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
        <label className="block text-xs font-medium text-gray-500 mb-0.5">End Date</label>
        <input
          type="text"
          value={isPresent ? '' : endDate}
          onChange={e => onEndChange(e.target.value)}
          disabled={isPresent}
          placeholder="Jun 2026"
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 bg-white disabled:bg-gray-100 disabled:text-gray-400"
        />
        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={isPresent}
            onChange={e => onEndChange(e.target.checked ? 'Present' : '')}
            className="h-3.5 w-3.5 accent-gray-700"
          />
          <span className="text-xs text-gray-500">Currently ongoing</span>
        </label>
      </div>
    </div>
  )
}

export function BulletList({ bullets, onAdd, onUpdate, onRemove }) {
  return (
    <div className="col-span-2">
      <label className="block text-xs font-medium text-gray-500 mb-1">Bullet Points</label>
      {bullets.map((b, i) => (
        <div key={i} className="flex items-start gap-1 mb-1">
          <span className="text-gray-400 text-sm mt-1.5 shrink-0">•</span>
          <textarea
            value={b}
            onChange={e => onUpdate(i, e.target.value)}
            placeholder="Describe your achievement or responsibility..."
            rows={2}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 bg-white resize-none"
          />
          <button
            onClick={() => onRemove(i)}
            className="shrink-0 text-gray-300 hover:text-red-400 text-lg leading-none mt-1"
            title="Remove bullet"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-xs text-gray-500 hover:text-gray-700 mt-1"
      >
        + Add bullet
      </button>
    </div>
  )
}

export function EntryCard({ children, onRemove, canRemove }) {
  return (
    <div className="border border-gray-200 rounded p-3 mb-3 bg-gray-50 relative">
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-gray-300 hover:text-red-400 text-xl leading-none"
          title="Remove entry"
        >
          ×
        </button>
      )}
      <div className="grid grid-cols-2 gap-2">
        {children}
      </div>
    </div>
  )
}

export function SectionShell({ title, children, onAdd, addLabel = '+ Add entry', onReset }) {
  const handleReset = () => {
    if (window.confirm(`Reset the "${title}" section? All entries will be cleared.`)) {
      onReset()
    }
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        {onReset && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors ml-2"
            title={`Reset ${title}`}
          >
            ↺ Reset
          </button>
        )}
      </div>
      <div className="p-3">
        {children}
        <button
          onClick={onAdd}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded px-3 py-1.5 w-full hover:border-gray-400 transition-colors"
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
