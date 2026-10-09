import { Field, SectionShell, EntryCard, newId, moveItem } from './shared'
import { useI18n } from '../../../i18n/I18nProvider'

export default function CertificationsEditor({ entries, onChange, onReset }) {
  const { t } = useI18n()
  const add = () => onChange([...entries, { id: newId(), name: '', issuer: '', date: '', description: '' }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title={t('sections.certifications')} onAdd={add} addLabel={t('fields.certifications.add')} onReset={onReset} helpId="certifications">
      {entries.map((e, i) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label={t('fields.certifications.name')} value={e.name} onChange={v => update(e.id, 'name', v)} placeholder={t('fields.certifications.namePlaceholder')} className="col-span-2" />
          <Field label={t('fields.certifications.issuer')} value={e.issuer} onChange={v => update(e.id, 'issuer', v)} placeholder={t('fields.certifications.issuerPlaceholder')} />
          <Field label={t('fields.certifications.date')} value={e.date} onChange={v => update(e.id, 'date', v)} placeholder={t('fields.certifications.datePlaceholder')} />
          <Field label={t('fields.certifications.description')} value={e.description} onChange={v => update(e.id, 'description', v)} placeholder={t('fields.certifications.descriptionPlaceholder')} className="col-span-2" />
        </EntryCard>
      ))}
    </SectionShell>
  )
}
