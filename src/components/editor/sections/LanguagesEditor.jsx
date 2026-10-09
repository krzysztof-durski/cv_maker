import { Field, SectionShell, EntryCard, newId, moveItem } from './shared'
import { useI18n } from '../../../i18n/I18nProvider'

export default function LanguagesEditor({ entries, onChange, onReset }) {
  const { t } = useI18n()
  const add = () => onChange([...entries, { id: newId(), language: '', proficiency: '' }])
  const remove = (id) => onChange(entries.filter(e => e.id !== id))
  const update = (id, field, value) => onChange(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  const move = (id, dir) => onChange(moveItem(entries, entries.findIndex(e => e.id === id), dir))

  return (
    <SectionShell title={t('sections.languages')} onAdd={add} addLabel={t('fields.languages.add')} onReset={onReset} helpId="languages">
      {entries.map((e, i) => (
        <EntryCard key={e.id} onRemove={() => remove(e.id)} canRemove={entries.length > 1}
          onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
          isFirst={i === 0} isLast={i === entries.length - 1}>
          <Field label={t('fields.languages.language')} value={e.language} onChange={v => update(e.id, 'language', v)} placeholder={t('fields.languages.languagePlaceholder')} />
          <Field label={t('fields.languages.proficiency')} value={e.proficiency} onChange={v => update(e.id, 'proficiency', v)} placeholder={t('fields.languages.proficiencyPlaceholder')} />
        </EntryCard>
      ))}
    </SectionShell>
  )
}
