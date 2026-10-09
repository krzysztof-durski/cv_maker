// Reads an attached file (job description, notes, an old CV…) into plain text, entirely in
// the browser. The PDF and Word readers are large, so they are only loaded when needed.

import { MAX_REFERENCE_CHARS } from './prompts.js'
import { t } from '../i18n/core.js'

export const ACCEPT = '.txt,.md,.markdown,.html,.htm,.pdf,.docx'

const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_PDF_PAGES = 30

// A file type we do not handle: its message is already safe to show, unlike a failure inside a reader.
class UnreadableError extends Error {}

const extensionOf = name => (name.includes('.') ? name.split('.').pop().toLowerCase() : '')

function htmlToText(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style, noscript, svg').forEach(node => node.remove())
  // textContent ignores layout, so mark block boundaries ourselves.
  doc.querySelectorAll('p, div, li, tr, br, h1, h2, h3, h4, h5, h6').forEach(node => node.append('\n'))
  return doc.body?.textContent || ''
}

async function pdfToText(buffer) {
  // The "legacy" build runs on older browsers (e.g. older Safari) that the modern build does not.
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const { default: workerUrl } = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

  // isEvalSupported: false keeps pdf.js working under a CSP that forbids eval.
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false })
  try {
    const pdf = await task.promise
    const pages = []
    for (let i = 1; i <= Math.min(pdf.numPages, MAX_PDF_PAGES); i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      pages.push(content.items.map(item => item.str + (item.hasEOL ? '\n' : ' ')).join(''))
    }
    return pages.join('\n\n')
  } finally {
    // Releases the worker; the loading task (not the document) owns destroy() in pdf.js.
    task.destroy().catch(() => {})
  }
}

async function docxToText(buffer) {
  const mod = await import('mammoth/mammoth.browser.js')
  const mammoth = mod.default || mod
  const { value } = await mammoth.extractRawText({ arrayBuffer: buffer })
  return value
}

const tidy = text =>
  text.replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim()

/**
 * @returns {Promise<{ name: string, text: string, truncated: boolean }>}
 * @throws Error with a message that is safe to show to the user
 */
export async function extractText(file) {
  const kind = extensionOf(file.name)
  if (file.size > MAX_FILE_BYTES) throw new Error(t('ai.extract.tooLarge', { name: file.name }))

  let raw
  try {
    if (['txt', 'md', 'markdown'].includes(kind)) raw = await file.text()
    else if (['html', 'htm'].includes(kind)) raw = htmlToText(await file.text())
    else if (kind === 'pdf') raw = await pdfToText(await file.arrayBuffer())
    else if (kind === 'docx') raw = await docxToText(await file.arrayBuffer())
    else {
      throw new UnreadableError(t('ai.extract.cantRead', { kind: kind || t('ai.extract.unknownKind') }))
    }
  } catch (err) {
    if (err instanceof UnreadableError) throw err
    console.error(err)
    throw new Error(t('ai.extract.couldntRead', { name: file.name }))
  }

  const text = tidy(raw)
  if (!text) {
    throw new Error(t('ai.extract.noText', { name: file.name }))
  }
  const truncated = text.length > MAX_REFERENCE_CHARS
  return { name: file.name, text: truncated ? text.slice(0, MAX_REFERENCE_CHARS) : text, truncated }
}
