import { useState } from 'react'
import { Field, DateFields, BulletList, EntryCard, HelpPanel, newId, moveItem, inputClass, labelClass } from './shared'
import { sectionHelp } from '../../../utils/sectionHelp'
import { useI18n } from '../../../i18n/I18nProvider'
import AiButton from '../../ai/AiButton'

export default function CustomSectionEditor({ custom, onChange, onReset }) {
  const { t } = useI18n()
  const [showHelp, setShowHelp] = useState(false)

  const handleReset = () => {
    if (window.confirm(t('fields.custom.resetConfirm'))) {
      onReset()
    }
  }
  const updateTitle = (v) => onChange({ ...custom, title: v })

  const addEntry = () => onChange({
    ...custom,
    entries: [...custom.entries, { id: newId(), title: '', subtitle: '', startDate: '', endDate: '', bullets: [] }]
  })

  const removeEntry = (id) => onChange({ ...custom, entries: custom.entries.filter(e => e.id !== id) })

  const update = (id, field, value) => onChange({
    ...custom,
    entries: custom.entries.map(e => e.id === id ? { ...e, [field]: value } : e)
  })

  const addBullet = (id) => onChange({
    ...custom,
    entries: custom.entries.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e)
  })

  const updateBullet = (id, i, v) => onChange({
    ...custom,
    entries: custom.entries.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e)
  })

  const removeBullet = (id, i) => onChange({
    ...custom,
    entries: custom.entries.map(e => e.id === id ? { ...e, bullets: e.bullets.filter((_, j) => j !== i) } : e)
  })
  const move = (id, dir) => onChange({
    ...custom,
    entries: moveItem(custom.entries, custom.entries.findIndex(e => e.id === id), dir)
  })

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('sections.custom')}</p>
          <button
            onClick={() => setShowHelp(v => !v)}
            title={t('shell.showTips')}
            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors
              ${showHelp
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-500 hover:bg-blue-400 hover:text-white dark:bg-gray-600 dark:text-gray-300'}`}
          >
            ?
          </button>
          <AiButton section="custom" label={t('sections.custom')} />
        </div>
        {onReset && (
          <button
            onClick={handleReset}
            className="ml-2 text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500"
            title={t('fields.custom.resetTitle')}
          >
            {t('shell.reset')}
          </button>
        )}
      </div>
      {showHelp && <HelpPanel help={sectionHelp('custom')} />}
      <div className="p-3">
        <div className="mb-3">
          <label className={labelClass}>{t('fields.custom.sectionTitle')}</label>
          <input
            type="text"
            value={custom.title}
            onChange={e => updateTitle(e.target.value)}
            placeholder={t('fields.custom.sectionTitlePlaceholder')}
            className={`${inputClass} font-semibold`}
          />
        </div>
        {custom.entries.map((e, i) => (
          <EntryCard key={e.id} aiSection="custom" aiEntryId={e.id} onRemove={() => removeEntry(e.id)} canRemove={custom.entries.length > 1}
            onMoveUp={() => move(e.id, -1)} onMoveDown={() => move(e.id, 1)}
            isFirst={i === 0} isLast={i === custom.entries.length - 1}>
            <Field label={t('fields.custom.title')} value={e.title} onChange={v => update(e.id, 'title', v)} placeholder={t('fields.custom.titlePlaceholder')} className="col-span-2" />
            <Field label={t('fields.custom.subtitle')} value={e.subtitle} onChange={v => update(e.id, 'subtitle', v)} placeholder={t('fields.custom.subtitlePlaceholder')} className="col-span-2" />
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
        <button
          onClick={addEntry}
          className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
        >
          {t('fields.custom.add')}
        </button>
      </div>
    </div>
  )
}
