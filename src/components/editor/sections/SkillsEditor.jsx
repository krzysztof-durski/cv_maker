import { Field, SectionShell, newId } from './shared'
import { EntryCard } from './shared'

export default function SkillsEditor({ entries, onChange, onReset }) {
  const add = () => onChange([...entries, { id: newId(), category: '', items: '' }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))

  return (
    <SectionShell title="Skills" onAdd={add} addLabel="+ Add skill category" onReset={onReset}>
      {entries.map(e => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}>
          <Field
            label="Category"
            value={e.category}
            onChange={v => update(e.id, 'category', v)}
            placeholder="Programming Languages"
          />
          <Field
            label="Items (comma-separated)"
            value={e.items}
            onChange={v => update(e.id, 'items', v)}
            placeholder="Python, JavaScript, SQL, Java"
          />
        </EntryCard>
      ))}
    </SectionShell>
  )
}
