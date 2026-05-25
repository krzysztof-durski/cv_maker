import { Field, SectionShell, EntryCard, newId, moveItem } from './shared'
import { SECTION_HELP } from '../../../utils/sectionHelp'

export default function SkillsEditor({ entries, onChange, onReset }) {
  const add = () => onChange([...entries, { id: newId(), category: '', items: '' }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title="Skills" onAdd={add} addLabel="+ Add skill category" onReset={onReset} help={SECTION_HELP.skills}>
      {entries.map((e, i) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label="Category" value={e.category} onChange={v => update(e.id, 'category', v)} placeholder="Programming Languages" />
          <Field label="Items (comma-separated)" value={e.items} onChange={v => update(e.id, 'items', v)} placeholder="Python, JavaScript, SQL, Java" />
        </EntryCard>
      ))}
    </SectionShell>
  )
}
