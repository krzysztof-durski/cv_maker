import { Field, DateFields, BulletList, EntryCard, SectionShell, newId, moveItem } from './shared'
import { useI18n } from '../../../i18n/I18nProvider'

export default function EducationEditor({ entries, onChange, onReset }) {
  const { t } = useI18n()
  const add = () => onChange([...entries, { id: newId(), school: '', degree: '', field: '', location: '', startDate: '', endDate: '', bullets: [] }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const addBullet = (id) => onChange(entries.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e))
  const updateBullet = (id, i, v) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e))
  const removeBullet = (id, i) => onChange(entries.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title={t('sections.education')} aiSection="education" onAdd={add} addLabel={t('fields.education.add')} onReset={onReset} helpId="education">
      {entries.map((e, i) => (
        <EntryCard key={e.id} aiSection="education" aiEntryId={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label={t('fields.education.school')} value={e.school} onChange={v => update(e.id, 'school', v)} placeholder={t('fields.education.schoolPlaceholder')} className="col-span-2" />
          <Field label={t('fields.education.degree')} value={e.degree} onChange={v => update(e.id, 'degree', v)} placeholder={t('fields.education.degreePlaceholder')} />
          <Field label={t('fields.education.field')} value={e.field} onChange={v => update(e.id, 'field', v)} placeholder={t('fields.education.fieldPlaceholder')} />
          <Field label={t('fields.location')} value={e.location} onChange={v => update(e.id, 'location', v)} placeholder={t('fields.locationPlaceholder')} className="col-span-2" />
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
