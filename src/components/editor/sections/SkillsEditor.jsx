import { Field, SectionShell, EntryCard, newId, moveItem } from './shared'
import { useI18n } from '../../../i18n/I18nProvider'

export default function SkillsEditor({ entries, onChange, onReset }) {
  const { t } = useI18n()
  const add = () => onChange([...entries, { id: newId(), category: '', items: '' }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title={t('sections.skills')} aiSection="skills" onAdd={add} addLabel={t('fields.skills.add')} onReset={onReset} helpId="skills">
      {entries.map((e, i) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label={t('fields.skills.category')} value={e.category} onChange={v => update(e.id, 'category', v)} placeholder={t('fields.skills.categoryPlaceholder')} />
          <Field label={t('fields.skills.items')} value={e.items} onChange={v => update(e.id, 'items', v)} placeholder={t('fields.skills.itemsPlaceholder')} />
        </EntryCard>
      ))}
    </SectionShell>
  )
}
