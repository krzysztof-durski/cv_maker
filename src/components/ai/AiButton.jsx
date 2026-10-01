import { useAi } from './aiContext'
import { SparkleIcon } from './icons'
import { entryScope } from '../../ai/sections'

/**
 * "AI" button. With `entryId` it edits just that entry (one job, one project…) and is shown as a
 * small icon so it fits among the entry card's controls; otherwise it edits the whole section.
 * Renders nothing outside an AiProvider.
 */
export default function AiButton({ section, entryId, label }) {
  const ai = useAi()
  if (!ai) return null

  if (entryId) {
    const title = 'Improve this entry with AI'
    return (
      <button
        onClick={() => ai.openAssistant(entryScope(section, entryId))}
        title={title}
        aria-label={title}
        className="grid h-5 w-5 place-items-center rounded text-indigo-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
      >
        <SparkleIcon className="h-3.5 w-3.5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => ai.openAssistant(section)}
      title={`Improve ${label} with AI`}
      className="ml-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
    >
      <SparkleIcon className="h-3.5 w-3.5" />
      AI
    </button>
  )
}
