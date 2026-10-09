import test from 'node:test'
import assert from 'node:assert/strict'
import { contactParts, shortenUrl, toHref } from './contactParts.js'

test('contact details come in the order phone, email, links, location', () => {
  const parts = contactParts({
    phone: '+48 1', email: 'a@b.c', location: 'Kraków',
    links: [{ type: 'github', url: 'github.com/ada', label: 'ada' }],
  })
  assert.deepEqual(parts, [
    { kind: 'text', value: '+48 1' },
    { kind: 'email', value: 'a@b.c' },
    { kind: 'link', type: 'github', value: 'github.com/ada', label: 'ada' },
    { kind: 'text', value: 'Kraków' },
  ])
})

test('empty details and links without a URL are left out', () => {
  assert.deepEqual(contactParts({ phone: '', email: '', location: '', links: [{ type: 'other', url: '' }] }), [])
  assert.deepEqual(contactParts({}), [])
  assert.deepEqual(contactParts(), [])
})

test('urls are shortened for display and given a scheme for linking', () => {
  assert.equal(shortenUrl('https://www.linkedin.com/in/ada/'), 'linkedin.com/in/ada')
  assert.equal(shortenUrl('http://ada.dev'), 'ada.dev')
  assert.equal(toHref('ada.dev'), 'https://ada.dev')
  assert.equal(toHref('http://ada.dev'), 'http://ada.dev')
})
