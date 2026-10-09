import { Field, DateFields, BulletList, EntryCard, SectionShell, newId, moveItem } from './shared'
import { useI18n } from '../../../i18n/I18nProvider'

export default function ProjectsEditor({ entries, onChange, onReset }) {
  const { t } = useI18n()
  const add = () => onChange([...entries, { id: newId(), name: '', technologies: '', startDate: '', endDate: '', link: '', description: '', bullets: [] }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const addBullet = (id) => onChange(entries.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e))
  const updateBullet = (id, i, v) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e))
  const removeBullet = (id, i) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title={t('sections.projects')} aiSection="projects" onAdd={add} addLabel={t('fields.projects.add')} onReset={onReset} helpId="projects">
      {entries.map((e, i) => (
        <EntryCard key={e.id} aiSection="projects" aiEntryId={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label={t('fields.projects.name')} value={e.name} onChange={v => update(e.id, 'name', v)} placeholder={t('fields.projects.namePlaceholder')} />
          <Field label={t('fields.projects.technologies')} value={e.technologies} onChange={v => update(e.id, 'technologies', v)} placeholder={t('fields.projects.technologiesPlaceholder')} />
          <Field label={t('fields.projects.description')} value={e.description} onChange={v => update(e.id, 'description', v)} placeholder={t('fields.projects.descriptionPlaceholder')} className="col-span-2" />
          <Field label={t('fields.projects.link')} value={e.link} onChange={v => update(e.id, 'link', v)} placeholder={t('fields.projects.linkPlaceholder')} className="col-span-2" />
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
