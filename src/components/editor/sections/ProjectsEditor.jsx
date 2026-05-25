import { Field, DateFields, BulletList, EntryCard, SectionShell, newId } from './shared'

export default function ProjectsEditor({ entries, onChange, onReset }) {
  const add = () => onChange([...entries, { id: newId(), name: '', technologies: '', startDate: '', endDate: '', link: '', description: '', bullets: [] }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const addBullet = (id) => onChange(entries.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e))
  const updateBullet = (id, i, v) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e))
  const removeBullet = (id, i) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e))

  return (
    <SectionShell title="Projects" onAdd={add} addLabel="+ Add project" onReset={onReset}>
      {entries.map(e => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}>
          <Field label="Project Name" value={e.name} onChange={v => update(e.id, 'name', v)} placeholder="My Project" />
          <Field label="Technologies" value={e.technologies} onChange={v => update(e.id, 'technologies', v)} placeholder="React, Node.js, Supabase" />
          <Field label="Subtitle / Description" value={e.description} onChange={v => update(e.id, 'description', v)} placeholder="A short description of the project" className="col-span-2" />
          <Field label="Link (optional)" value={e.link} onChange={v => update(e.id, 'link', v)} placeholder="https://..." className="col-span-2" />
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
