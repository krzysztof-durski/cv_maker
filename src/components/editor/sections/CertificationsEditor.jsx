import { Field, SectionShell, EntryCard, newId, moveItem } from './shared'
import { SECTION_HELP } from '../../../utils/sectionHelp'

export default function CertificationsEditor({ entries, onChange, onReset }) {
  const add = () => onChange([...entries, { id: newId(), name: '', issuer: '', date: '', description: '' }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title="Certifications & Awards" onAdd={add} addLabel="+ Add certification or award" onReset={onReset} help={SECTION_HELP.certifications}>
      {entries.map((e, i) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label="Name" value={e.name} onChange={v => update(e.id, 'name', v)} placeholder="AWS Certified Developer" className="col-span-2" />
          <Field label="Issuer / Organization" value={e.issuer} onChange={v => update(e.id, 'issuer', v)} placeholder="Amazon Web Services" />
          <Field label="Date" value={e.date} onChange={v => update(e.id, 'date', v)} placeholder="Jun 2024" />
          <Field label="Description (optional)" value={e.description} onChange={v => update(e.id, 'description', v)} placeholder="Brief description..." className="col-span-2" />
        </EntryCard>
      ))}
    </SectionShell>
  )
}
