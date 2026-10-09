import { useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import Rich from '../../i18n/Rich'

const CODE_CLASS = 'rounded bg-gray-100 px-1 dark:bg-gray-700'

export default function HowToUse() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const blocks = t('howTo.blocks')

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between bg-gray-50 px-3 py-2.5 transition-colors hover:bg-gray-100 dark:bg-gray-750 dark:hover:bg-gray-700"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {t('howTo.title')}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="space-y-2 p-3 text-xs text-gray-600 dark:text-gray-300">
          {blocks.map((block, i) => {
            const List = block.ol ? 'ol' : 'ul'
            const items = block.ol || block.ul
            return (
              <div key={i}>
                <p className={`${i > 0 ? 'pt-1 ' : ''}font-semibold text-gray-700 dark:text-gray-200`}>{block.heading}</p>
                <List className={`${block.ol ? 'list-decimal' : 'list-disc'} mt-2 space-y-1.5 pl-4`}>
                  {items.map((item, j) => <li key={j}><Rich text={item} codeClassName={CODE_CLASS} /></li>)}
                </List>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
