// What to do when a provider says it is busy ("Google is busy", 503, 529 overloaded…).
// The advice itself is in the dictionary (ai.busy), so the Help page and the AI window say the same thing.

import { t } from '../i18n/core.js'

/** Errors worth showing the advice for: the provider is up but overloaded or failing. */
export const needsBusyAdvice = kind => kind === 'unavailable'

/** The line shown while a busy provider is being retried. From the third try on it says how to stop waiting. */
export function retryMessage(providerName, { attempt, total }) {
  const base = t('ai.busy.retry', { provider: providerName, attempt, total })
  return attempt >= 3 ? `${base}${t('ai.busy.retryHint')}` : base
}
