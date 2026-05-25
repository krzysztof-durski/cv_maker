import { Field, SectionShell, EntryCard, newId } from './shared'

export default function LanguagesEditor({ entries, onChange, onReset }) {
  const add = () => onChange([...entries, { id: newId(), language: '', proficiency: '' }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))

  return (
    <SectionShell title="Languages" onAdd={add} addLabel="+ Add language" onReset={onReset}>
      {entries.map(e => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}>
          <Field
            label="Language"
            value={e.language}
            onChange={v => update(e.id, 'language', v)}
            placeholder="English"
          />
          <Field
            label="Proficiency"
            value={e.proficiency}
            onChange={v => update(e.id, 'proficiency', v)}
            placeholder="Advanced (C1/C2)"
          />
        </EntryCard>
      ))}
    </SectionShell>
  )
}
