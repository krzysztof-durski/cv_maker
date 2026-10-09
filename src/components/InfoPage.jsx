import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { fill, lookup } from '../i18n/core'
import Rich from '../i18n/Rich'
import LanguageSwitch from './LanguageSwitch'
import BusyAdvice from './ai/BusyAdvice'

const COMPONENTS = { busyAdvice: () => <BusyAdvice compact /> }

function Block({ block, params }) {
  const text = key => fill(block[key], params)
  if (block.p) return <p><Rich text={text('p')} /></p>
  if (block.lead) return <p className="font-medium text-gray-900 dark:text-gray-100"><Rich text={text('lead')} /></p>
  if (block.note) return <p className="text-xs text-gray-500 dark:text-gray-400"><Rich text={text('note')} /></p>
  if (block.ol || block.ul) {
    const List = block.ol ? 'ol' : 'ul'
    return <List>{(block.ol || block.ul).map((item, i) => <li key={i}><Rich text={fill(item, params)} /></li>)}</List>
  }
  if (block.component) return COMPONENTS[block.component]()
  return null
}

/**
 * Help, About, Terms and Privacy: a branded bar, a readable column and a footer, filled from the
 * dictionary (`pages.<page>`) in the current language.
 */
export default function InfoPage({ page }) {
  const { t } = useI18n()
  const params = { year: new Date().getFullYear() }
  const title = t(`pages.${page}.title`)
  const optional = field => (lookup('en', `pages.${page}.${field}`) === undefined ? '' : t(`pages.${page}.${field}`))
  const subtitle = optional('subtitle')
  const updated = optional('updated')
  const sections = t(`pages.${page}.sections`)

  return (
    <div className="min-h-dvh bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/85 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/85">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gray-900 text-[11px] font-bold text-white dark:bg-white dark:text-gray-900">
              CV
            </span>
            <span className="text-sm font-semibold">{t('header.brand')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <Link
              to="/"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {t('nav.backToEditor')}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{subtitle}</p>}
        {updated && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t('pages.updatedLabel')}: {updated}</p>
        )}

        <div
          className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300
            [&_a]:font-medium [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-indigo-500 dark:[&_a]:text-indigo-400
            [&_code]:rounded [&_code]:bg-gray-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px] dark:[&_code]:bg-gray-800
            [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-gray-100
            [&_li]:my-1
            [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5
            [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5"
        >
          {sections.map((section, i) => (
            <section key={i} className={section.divider ? 'border-t border-gray-200 pt-6 dark:border-gray-800' : undefined}>
              {section.title && <h2>{section.title}</h2>}
              <div className="space-y-3">
                {section.blocks.map((block, j) => <Block key={j} block={block} params={params} />)}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-200 pt-6 text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
          <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">{t('nav.home')}</Link>
          <Link to="/help" className="hover:text-gray-700 dark:hover:text-gray-300">{t('nav.helpShort')}</Link>
          <Link to="/about" className="hover:text-gray-700 dark:hover:text-gray-300">{t('nav.about')}</Link>
          <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">{t('nav.terms')}</Link>
          <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">{t('nav.privacy')}</Link>
        </footer>
      </main>
    </div>
  )
}
