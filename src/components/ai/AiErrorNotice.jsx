import BusyAdvice from './BusyAdvice'
import { needsBusyAdvice } from '../../ai/troubleshooting'

/** An AI failure in red, with what to try next when the provider is just overloaded. */
export default function AiErrorNotice({ message, kind }) {
  if (!message) return null
  return (
    <div role="alert" className="space-y-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/40 dark:text-red-300">
      <p>{message}</p>
      {needsBusyAdvice(kind) && <BusyAdvice compact />}
    </div>
  )
}
