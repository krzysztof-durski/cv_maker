import { useState } from 'react'
import { Field, DateFields, BulletList, EntryCard, newId, moveItem } from './shared'
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
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Custom Section</p>
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
        </div>
        {onReset && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors ml-2"
            title="Reset Custom Section"
          >
            ↺ Reset
          </button>
        )}
      </div>
      {showHelp && (
        <div className="mx-3 mt-3 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-3">
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
      )}
      <div className="p-3">
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">Section Title</label>
          <input
            type="text"
            value={custom.title}
            onChange={e => updateTitle(e.target.value)}
            placeholder="e.g. Publications, Research, Awards..."
            className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-semibold"
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
          className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-dashed border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 w-full hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          + Add entry
        </button>
      </div>
    </div>
  )
}
