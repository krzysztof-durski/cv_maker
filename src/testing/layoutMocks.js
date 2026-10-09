import { vi } from 'vitest'

/**
 * jsdom does no layout, so every size is 0. This pretends a text box is `lineHeight` tall per line of text
 * (a line break starts a new line), which is all the auto-grow code needs.
 */
export function mockTextLayout({ lineHeight = 20 } = {}) {
  const lines = el => Math.max(el.rows || 1, String(el.value ?? '').split('\n').length)
  vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(function () { return lines(this) * lineHeight })
  vi.spyOn(HTMLTextAreaElement.prototype, 'offsetHeight', 'get').mockImplementation(function () { return lines(this) * lineHeight + 2 })
  vi.spyOn(HTMLTextAreaElement.prototype, 'clientHeight', 'get').mockImplementation(function () { return lines(this) * lineHeight })
}
