import { useState } from 'react'
import { sectionHelp } from '../../../utils/sectionHelp'
import { useI18n } from '../../../i18n/I18nProvider'
import { LINK_TYPES } from '../../../utils/defaultData'
import { Field, HelpPanel, labelClass } from './shared'
import AutoTextarea from '../AutoTextarea'

let _id = 0
const newLinkId = () => `link-${Date.now()}-${_id++}`

const QUICK_ADD = ['linkedin', 'github', 'portfolio']

export default function PersonalInfoEditor({ personal, onChange, onReset }) {
  const { t } = useI18n()
  const [showHelp, setShowHelp] = useState(false)
  const links = personal.links || []

  const update = (field, value) => onChange({ ...personal, [field]: value })

  const addLink = (type) => {
    onChange({ ...personal, links: [...links, { id: newLinkId(), type, url: '', label: '' }] })
  }

  const updateLink = (id, field, value) => {
    onChange({ ...personal, links: links.map(l => l.id === id ? { ...l, [field]: value } : l) })
  }

  const removeLink = (id) => {
    onChange({ ...personal, links: links.filter(l => l.id !== id) })
  }

  const handleReset = () => {
    if (window.confirm(t('personal.resetConfirm'))) onReset()
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('personal.title')}</p>
          <button
            onClick={() => setShowHelp(v => !v)}
            title={t('shell.showTipsShort')}
            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors
              ${showHelp ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-blue-400 hover:text-white dark:bg-gray-600 dark:text-gray-300'}`}
          >?</button>
        </div>
        {onReset && (
          <button onClick={handleReset} className="ml-2 text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500">
            {t('shell.reset')}
          </button>
        )}
      </div>

      {showHelp && <HelpPanel help={sectionHelp('personal')} />}

      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="col-span-2">
          <Field label={t('personal.fullName')} value={personal.name} onChange={v => update('name', v)} placeholder={t('personal.fullNamePlaceholder')} />
        </div>
        <div className="col-span-2">
          <Field label={t('personal.jobTitle')} value={personal.jobTitle} onChange={v => update('jobTitle', v)} placeholder={t('personal.jobTitlePlaceholder')} />
        </div>
        <Field label={t('personal.phone')} value={personal.phone} onChange={v => update('phone', v)} placeholder={t('personal.phonePlaceholder')} />
        <Field label={t('personal.email')} value={personal.email} onChange={v => update('email', v)} placeholder={t('personal.emailPlaceholder')} type="email" />
        <div className="col-span-2">
          <Field label={t('personal.location')} value={personal.location} onChange={v => update('location', v)} placeholder={t('personal.locationPlaceholder')} />
        </div>

        {/* Links */}
        <div className="col-span-2 mt-1">
          <label className={labelClass}>{t('personal.links')}</label>

          {links.map(link => (
            <div key={link.id} className="mb-2 rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-1.5 flex items-center gap-1.5">
                <select
                  value={link.type}
                  onChange={e => updateLink(link.id, 'type', e.target.value)}
                  className="shrink-0 rounded-lg border border-gray-200 bg-white px-1.5 py-2 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                >
                  {Object.entries(LINK_TYPES).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <AutoTextarea
                  singleLine
                  value={link.url}
                  onChange={v => updateLink(link.id, 'url', v)}
                  placeholder={t('personal.linkUrlPlaceholder')}
                  aria-label={t('personal.linkUrl')}
                />
                <button
                  onClick={() => removeLink(link.id)}
                  className="shrink-0 text-xl leading-none text-gray-300 transition-colors hover:text-red-500 dark:text-gray-600"
                  title={t('personal.removeLink')}
                  aria-label={t('personal.removeLink')}
                >×</button>
              </div>
              <AutoTextarea
                singleLine
                value={link.label || ''}
                onChange={v => updateLink(link.id, 'label', v)}
                placeholder={t('personal.linkLabelPlaceholder')}
                aria-label={t('personal.linkLabel')}
                className="text-xs"
              />
            </div>
          ))}

          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK_ADD.map(type => {
              const alreadyAdded = links.some(l => l.type === type)
              return (
                <button
                  key={type}
                  onClick={() => addLink(type)}
                  className={`rounded-lg border px-2 py-1 text-xs transition-colors
                    ${alreadyAdded
                      ? 'border-gray-200 text-gray-400 hover:border-gray-300 dark:border-gray-600 dark:text-gray-500'
                      : 'border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:text-indigo-400'}`}
                >
                  {t('personal.addLink', { type: LINK_TYPES[type] })}
                </button>
              )
            })}
            <button
              onClick={() => addLink('other')}
              className="rounded-lg border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              {t('personal.addLink', { type: LINK_TYPES.other })}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
