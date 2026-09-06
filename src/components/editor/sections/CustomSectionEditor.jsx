import { useState } from 'react'
import { Field, DateFields, BulletList, EntryCard, newId, moveItem, inputClass, labelClass } from './shared'
import { SECTION_HELP } from '../../../utils/sectionHelp'

export default function CustomSectionEditor({ custom, onChange, onReset }) {
  const [showHelp, setShowHelp] = useState(false)
  const help = SECTION_HELP.custom

  const handleReset = () => {
    if (window.confirm('Reset the "Custom Section"? All entries will be cleared.')) {
      onReset()
    }
  }
  const updateTitle = (v) => onChange({ ...custom, title: v })

  const addEntry = () => onChange({
    ...custom,
    entries: [...custom.entries, { id: newId(), title: '', subtitle: '', startDate: '', endDate: '', bullets: [] }]
  })

  const removeEntry = (id) => onChange({ ...custom, entries: custom.entries.filter(e => e.id !== id) })

  const update = (id, field, value) => onChange({
    ...custom,
    entries: custom.entries.map(e => e.id === id ? { ...e, [field]: value } : e)
  })

  const addBullet = (id) => onChange({
    ...custom,
    entries: custom.entries.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e)
  })

  const updateBullet = (id, i, v) => onChange({
    ...custom,
    entries: custom.entries.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e)
  })

  const removeBullet = (id, i) => onChange({
    ...custom,
    entries: custom.entries.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e)
  })
  const move = (id, dir) => onChange({
    ...custom,
    entries: moveItem(custom.entries, custom.entries.findIndex(e => e.id === id), dir)
  })

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Custom Section</p>
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
        </div>
        {onReset && (
          <button
            onClick={handleReset}
            className="ml-2 text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500"
            title="Reset Custom Section"
          >
            ↺ Reset
          </button>
        )}
      </div>
      {showHelp && (
        <div className="mx-3 mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
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
      )}
      <div className="p-3">
        <div className="mb-3">
          <label className={labelClass}>Section Title</label>
          <input
            type="text"
            value={custom.title}
            onChange={e => updateTitle(e.target.value)}
            placeholder="e.g. Publications, Research, Awards..."
            className={`${inputClass} font-semibold`}
          />
        </div>
        {custom.entries.map((e, i) => (
          <EntryCard key={e.id} onRemove={() => removeEntry(e.id)} canRemove={custom.entries.length > 1}
            onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
            isFirst={i === 0} isLast={i === custom.entries.length - 1}>
            <Field label="Title" value={e.title} onChange={v => update(e.id, 'title', v)} placeholder="Entry title" className="col-span-2" />
            <Field label="Subtitle (optional)" value={e.subtitle} onChange={v => update(e.id, 'subtitle', v)} placeholder="Italic subtitle" className="col-span-2" />
            <DateFields
              startDate={e.startDate} endDate={e.endDate}
              onStartChange={v => update(e.id, 'startDate', v)}
              onEndChange={v => update(e.id, 'endDate', v)}
            />
            <BulletList
              bullets={e.bullets}
              onAdd={() => addBullet(e.id)}
              onUpdate={(i, v) => updateBullet(e.id, i, v)}
              onRemove={i => removeBullet(e.id, i)}
            />
          </EntryCard>
        ))}
        <button
          onClick={addEntry}
          className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
        >
          + Add entry
        </button>
      </div>
    </div>
  )
}
