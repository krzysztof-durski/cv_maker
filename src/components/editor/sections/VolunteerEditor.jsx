import { Field, DateFields, BulletList, EntryCard, SectionShell, newId } from './shared'

export default function VolunteerEditor({ entries, onChange, onReset }) {
  const add = () => onChange([...entries, { id: newId(), role: '', org: '', location: '', startDate: '', endDate: '', bullets: [] }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const addBullet = (id) => onChange(entries.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e))
  const updateBullet = (id, i, v) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e))
  const removeBullet = (id, i) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e))

  return (
    <SectionShell title="Volunteer & Extracurriculars" onAdd={add} addLabel="+ Add entry" onReset={onReset}>
      {entries.map(e => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}>
          <Field label="Role / Position" value={e.role} onChange={v => update(e.id, 'role', v)} placeholder="Club President" className="col-span-2" />
          <Field label="Organization" value={e.org} onChange={v => update(e.id, 'org', v)} placeholder="Coding Club" />
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
