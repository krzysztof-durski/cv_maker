import { LANGUAGES, LANGUAGE_CODES } from '../i18n/core'
import { useI18n } from '../i18n/I18nProvider'

/** EN / PL. The current language is highlighted; the other one is one click away. */
export default function LanguageSwitch({ className = '' }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className={`inline-flex rounded-lg border border-gray-200 bg-gray-100 p-0.5 dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {LANGUAGE_CODES.map(code => {
        const active = code === lang
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            title={LANGUAGES[code].name}
            onClick={() => setLang(code)}
            className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
              active
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {LANGUAGES[code].short}
          </button>
        )
      })}
    </div>
  )
}
