import { useRef, useState } from 'react'
import { TEMPLATE_IDS } from '../../utils/templates'
import { fileToPhotoDataUrl } from '../../utils/photo'
import { CV_LANGUAGE_SETTINGS, GENDER_FORMS, resolveCvLanguage } from '../../i18n/cvLanguage'
import { LANGUAGES, nameIn } from '../../i18n/core'
import { useI18n } from '../../i18n/I18nProvider'
import { inputClass, labelClass } from './styles'

const choiceClass = selected =>
  `flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${selected
    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20 dark:border-indigo-400 dark:bg-indigo-950/40'
    : 'border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-indigo-500'}`

const buttonClass =
  'rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-200 dark:hover:border-indigo-500 dark:hover:text-indigo-400'

function PhotoControls({ photo, onChange }) {
  const { t } = useI18n()
  const fileRef = useRef(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleFile = async e => {
    const file = e.target.files?.[0]
    e.target.value = '' // so choosing the same file again still fires
    if (!file) return
    setBusy(true)
    setError('')
    try {
      onChange(await fileToPhotoDataUrl(file))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-3 flex items-center gap-3">
      {photo ? (
        <img src={photo} alt={t('template.yourPhoto')} className="h-16 w-16 shrink-0 rounded-md border border-gray-200 object-cover dark:border-gray-600" />
      ) : (
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md border border-dashed border-gray-300 text-center text-[10px] text-gray-400 dark:border-gray-600">
          {t('template.noPhoto')}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className={buttonClass} disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? t('template.reading') : photo ? t('template.change') : t('template.upload')}
          </button>
          {photo && (
            <button type="button" className={`${buttonClass} hover:!border-red-300 hover:!text-red-600`} onClick={() => onChange('')}>
              {t('template.removePhoto')}
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} aria-label={t('template.photoFile')} />
        <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{t('template.photoNote')}</p>
        {error && <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  )
}

/** The language of the headings printed on the CV; "auto" follows the app. */
function CvLanguageSelect({ value, onChange }) {
  const { t, lang } = useI18n()
  const label = setting =>
    setting === 'auto'
      ? t('template.cvLanguageAuto', { language: nameIn(lang, resolveCvLanguage('auto', lang)) })
      : LANGUAGES[setting].name // each language written in itself: English, Polski

  return (
    <div className="mt-4">
      <label className={labelClass} htmlFor="cv-language">{t('template.cvLanguage')}</label>
      <select id="cv-language" value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
        {CV_LANGUAGE_SETTINGS.map(setting => <option key={setting} value={setting}>{label(setting)}</option>)}
      </select>
      <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{t('template.cvLanguageHint')}</p>
    </div>
  )
}

/** Which gendered forms Polish text uses, for the AI when it writes or translates into Polish. */
function GenderFormsSelect({ value, onChange }) {
  const { t } = useI18n()
  return (
    <div className="mt-4">
      <label className={labelClass} htmlFor="gender-forms">{t('template.gender')}</label>
      <select id="gender-forms" value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
        {GENDER_FORMS.map(form => <option key={form} value={form}>{t(`template.gender${form[0].toUpperCase()}${form.slice(1)}`)}</option>)}
      </select>
      <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{t('template.genderHint')}</p>
    </div>
  )
}

/** Chooses the CV's header layout, the picture for the photo layout, and the language of the CV's headings. */
export default function TemplatePicker({ template, photo, cvLanguage = 'auto', gender = 'auto', onTemplateChange, onPhotoChange, onCvLanguageChange, onGenderChange }) {
  const { t } = useI18n()
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('template.title')}</p>
      </div>
      <div className="p-3">
        <div role="radiogroup" aria-label={t('template.title')} className="flex gap-2">
          {TEMPLATE_IDS.map(id => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={template === id}
              onClick={() => onTemplateChange(id)}
              className={choiceClass(template === id)}
            >
              <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">{t(`template.${id}.label`)}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-gray-500 dark:text-gray-400">{t(`template.${id}.description`)}</span>
            </button>
          ))}
        </div>
        {template === 'photo' && <PhotoControls photo={photo} onChange={onPhotoChange} />}
        <CvLanguageSelect value={cvLanguage} onChange={onCvLanguageChange} />
        <GenderFormsSelect value={gender} onChange={onGenderChange} />
      </div>
    </div>
  )
}
