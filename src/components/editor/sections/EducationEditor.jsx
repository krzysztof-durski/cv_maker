import { Field, DateFields, BulletList, EntryCard, SectionShell, newId, moveItem } from './shared'
import { SECTION_HELP } from '../../../utils/sectionHelp'

export default function EducationEditor({ entries, onChange, onReset }) {
  const add = () => onChange([...entries, { id: newId(), school: '', degree: '', field: '', location: '', startDate: '', endDate: '', bullets: [] }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const addBullet = (id) => onChange(entries.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e))
  const updateBullet = (id, i, v) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e))
  const removeBullet = (id, i) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title="Education" onAdd={add} addLabel="+ Add education" onReset={onReset} help={SECTION_HELP.education}>
      {entries.map((e, i) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label="School / University" value={e.school} onChange={v => update(e.id, 'school', v)} placeholder="University of Example" className="col-span-2" />
          <Field label="Degree" value={e.degree} onChange={v => update(e.id, 'degree', v)} placeholder="Bachelor's" />
          <Field label="Field of Study" value={e.field} onChange={v => update(e.id, 'field', v)} placeholder="Software Engineering" />
          <Field label="Location" value={e.location} onChange={v => update(e.id, 'location', v)} placeholder="City, Country" className="col-span-2" />
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
