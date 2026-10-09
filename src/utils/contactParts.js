// The pieces of the contact line under the name, in the order they are shown:
// phone, email, links, location. Empty ones are left out. Shared by the preview and the Word export.

export const shortenUrl = url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
export const toHref = url => (url.startsWith('http') ? url : `https://${url}`)

export function contactParts({ phone, email, location, links = [] } = {}) {
  return [
    phone ? { kind: 'text', value: phone } : null,
    email ? { kind: 'email', value: email } : null,
    ...links.filter(l => l.url).map(l => ({ kind: 'link', type: l.type, value: l.url, label: l.label })),
    location ? { kind: 'text', value: location } : null,
  ].filter(Boolean)
}
