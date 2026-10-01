// The suggested changes, one checkbox per change. Nothing is applied until the user confirms.

function Block({ tone, label, text }) {
  const styles = tone === 'before'
    ? 'border-red-100 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200'
    : 'border-green-100 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-200'
  return (
    <div className={`rounded-lg border px-2.5 py-2 ${styles}`}>
      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="whitespace-pre-wrap break-words text-xs leading-relaxed">{text || '—'}</p>
    </div>
  )
}

const KIND_STYLE = {
  add: 'text-green-700 dark:text-green-400',
  remove: 'text-red-700 dark:text-red-400',
}

function Item({ item, checked, onToggle, onDiscuss }) {
  return (
    <div className={`p-3 transition-opacity ${checked ? '' : 'opacity-60'}`}>
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          data-item={item.key}
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-600"
          aria-label={`${item.fieldLabel}${item.label ? `: ${item.label}` : ''}`}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
              {item.label && <>{item.label} <span className="text-gray-400">·</span> </>}
              <span className={KIND_STYLE[item.kind] || 'text-gray-500 dark:text-gray-400'}>{item.fieldLabel}</span>
            </p>
            <button
              onClick={onDiscuss}
              className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
              title="Ask the AI about this change"
            >
              Discuss
            </button>
          </div>

          {item.kind === 'add' ? (
            <Block tone="after" label="New" text={item.after} />
          ) : item.kind === 'remove' ? (
            <Block tone="before" label="Removed" text={item.before} />
          ) : (
            <div className="grid gap-1.5 sm:grid-cols-2">
              <Block tone="before" label="Before" text={item.before} />
              <Block tone="after" label="After" text={item.after} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReviewChanges({ sections, warnings, notes, declined, onToggleItem, onToggleSection, onDiscuss }) {
  return (
    <div className="space-y-3">
      {notes.map((note, i) => (
        <p key={i} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          ⚠ {note}
        </p>
      ))}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Tick the changes you want. Nothing changes in your CV until you press Apply.
      </p>

      {sections.map(section => {
        const checkedCount = section.items.filter(i => !declined.has(i.key)).length
        const all = checkedCount === section.items.length
        const none = checkedCount === 0
        return (
          <div
            key={section.id}
            className={`overflow-hidden rounded-xl border ${none ? 'border-gray-200 dark:border-gray-700' : 'border-indigo-300 dark:border-indigo-700'}`}
          >
            <label className="flex cursor-pointer items-center gap-2.5 border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800">
              <input
                type="checkbox"
                data-section={section.id}
                checked={all}
                ref={el => { if (el) el.indeterminate = !all && !none }}
                onChange={() => onToggleSection(section.id)}
                className="h-4 w-4 accent-indigo-600"
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                {section.label}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {section.items.length} change{section.items.length === 1 ? '' : 's'}
              </span>
            </label>

            {warnings[section.id]?.map((w, i) => (
              <p key={i} className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                ⚠ {w}
              </p>
            ))}

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {section.items.map(item => (
                <Item
                  key={item.key}
                  item={item}
                  checked={!declined.has(item.key)}
                  onToggle={() => onToggleItem(item.key)}
                  onDiscuss={() => onDiscuss(item)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
