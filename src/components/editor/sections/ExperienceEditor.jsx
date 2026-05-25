import { Field, DateFields, BulletList, EntryCard, SectionShell, newId, moveItem } from './shared'
import { SECTION_HELP } from '../../../utils/sectionHelp'

export default function ExperienceEditor({ entries, onChange, onReset }) {
  const add = () => onChange([...entries, { id: newId(), title: '', company: '', location: '', startDate: '', endDate: '', bullets: [] }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const addBullet = (id) => onChange(entries.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e))
  const updateBullet = (id, i, v) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e))
  const removeBullet = (id, i) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title="Experience" onAdd={add} addLabel="+ Add experience" onReset={onReset} help={SECTION_HELP.experience}>
      {entries.map((e, i) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label="Job Title" value={e.title} onChange={v => update(e.id, 'title', v)} placeholder="Founder & CEO / Full Stack Engineer" className="col-span-2" />
          <Field label="Company" value={e.company} onChange={v => update(e.id, 'company', v)} placeholder="Acme Corp" />
          <Field label="Location" value={e.location} onChange={v => update(e.id, 'location', v)} placeholder="City, Country" />
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
    </SectionShell>
  )
}
