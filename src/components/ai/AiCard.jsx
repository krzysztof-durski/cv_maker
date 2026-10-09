import { useAi } from './aiContext'
import { SparkleIcon } from './icons'
import { useI18n } from '../../i18n/I18nProvider'

/** Slim call-to-action at the top of the editor. Renders nothing outside an AiProvider. */
export default function AiCard() {
  const ai = useAi()
  const { t } = useI18n()
  if (!ai) return null
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900 dark:bg-indigo-950/40">
      <div className="flex min-w-0 items-start gap-2.5">
        <SparkleIcon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">{t('ai.card.title')}</p>
          <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80">
            {t('ai.card.text')}
          </p>
        </div>
      </div>
      <button
        onClick={() => ai.openAssistant('cv')}
        className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        {t('ai.card.open')}
      </button>
    </div>
  )
}
