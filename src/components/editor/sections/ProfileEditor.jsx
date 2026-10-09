import { useState } from 'react'
import { sectionHelp } from '../../../utils/sectionHelp'
import { useI18n } from '../../../i18n/I18nProvider'
import AutoTextarea from '../AutoTextarea'
import { HelpPanel } from './shared'
import AiButton from '../../ai/AiButton'

export default function ProfileEditor({ profile, onChange, onReset }) {
  const { t } = useI18n()
  const [showHelp, setShowHelp] = useState(false)
  const text = profile?.text || ''

  const handleReset = () => {
    if (window.confirm(t('profile.resetConfirm'))) onReset()
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('sections.profile')}</p>
          <button
            onClick={() => setShowHelp(v => !v)}
            title={t('shell.showTips')}
            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors
              ${showHelp ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-blue-400 hover:text-white dark:bg-gray-600 dark:text-gray-300'}`}
          >
            ?
          </button>
          <AiButton section="profile" label={t('sections.profile')} />
        </div>
        {onReset && (
          <button
            onClick={handleReset}
            className="ml-2 text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500"
            title={t('profile.resetTitle')}
          >
            {t('shell.reset')}
          </button>
        )}
      </div>

      {showHelp && <HelpPanel help={sectionHelp('profile')} />}

      <div className="p-3">
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">{t('profile.bio')}</label>
        <AutoTextarea
          value={text}
          onChange={v => onChange({ ...profile, text: v })}
          placeholder={t('profile.placeholder')}
          rows={4}
          aria-label={t('profile.bio')}
        />
        <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">{t('profile.characters', { count: text.length })}</p>
      </div>
    </div>
  )
}
