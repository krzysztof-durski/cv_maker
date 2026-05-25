import { Field, DateFields, BulletList, EntryCard, newId } from './shared'

export default function CustomSectionEditor({ custom, onChange, onReset }) {
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

  return (
    <div className="mb-4 border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Section</p>
        {onReset && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors ml-2"
            title="Reset Custom Section"
          >
            ↺ Reset
          </button>
        )}
      </div>
      <div className="p-3">
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-0.5">Section Title</label>
          <input
            type="text"
            value={custom.title}
            onChange={e => updateTitle(e.target.value)}
            placeholder="e.g. Publications, Research, Awards..."
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 bg-white font-semibold"
          />
        </div>
        {custom.entries.map(e => (
          <EntryCard key={e.id} onRemove={() => removeEntry(e.id)} canRemove={custom.entries.length > 1}>
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
          className="text-xs font-medium text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded px-3 py-1.5 w-full hover:border-gray-400 transition-colors"
        >
          + Add entry
        </button>
      </div>
    </div>
  )
}
