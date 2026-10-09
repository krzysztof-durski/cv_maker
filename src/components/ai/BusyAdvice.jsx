import { useI18n } from '../../i18n/I18nProvider'

/** The steps to try when a provider is overloaded. `compact` drops the title for use under an error. */
export default function BusyAdvice({ compact = false }) {
  const { t } = useI18n()
  return (
    <div data-testid="busy-advice">
      {!compact && <h3 className="mb-1 font-semibold">{t('ai.busy.title')}</h3>}
      <p>{t('ai.busy.intro')}</p>
      <ol className="mt-1.5 list-decimal space-y-1 pl-4">
        {t('ai.busy.steps').map(step => (
          <li key={step.title}><strong>{step.title}.</strong> {step.body}</li>
        ))}
      </ol>
    </div>
  )
}
