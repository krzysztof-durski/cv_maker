import test from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import { cvDataToDocxBlob, docxFileName } from './exportDocx.js'
import { DEFAULT_DATA } from './defaultData.js'

// A real 1x1 PNG, so the document builder can read its type and bytes.
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

const cv = (overrides = {}, personal = {}) => ({
  ...DEFAULT_DATA,
  personal: { ...DEFAULT_DATA.personal, name: 'Ada Lovelace', jobTitle: 'Engineer', email: 'ada@x.com', ...personal },
  experience: [{ id: 'e1', title: 'Analyst', company: 'Babbage Ltd', location: '', startDate: '2020', endDate: 'Present', bullets: ['Wrote the first program'] }],
  education: [{ id: 'd1', school: 'Home School', degree: 'BSc', field: 'Maths', location: '', startDate: '', endDate: '', bullets: [] }],
  projects: [{ id: 'p1', name: 'Difference Machine', technologies: '', startDate: '', endDate: '', link: '', description: '', bullets: [] }],
  ...overrides,
})

async function open(data, lang) {
  const zip = await JSZip.loadAsync(await (await cvDataToDocxBlob(data, lang)).arrayBuffer())
  return { zip, xml: await zip.file('word/document.xml').async('string'), styles: await zip.file('word/styles.xml').async('string'), media: Object.keys(zip.files).filter(n => n.startsWith('word/media/') && !zip.files[n].dir) }
}

test('the classic template has no table and no picture, even if a photo is stored', async () => {
  const { xml, media } = await open(cv({ template: 'classic' }, { photo: PNG }))
  assert.equal(media.length, 0)
  assert.doesNotMatch(xml, /<w:tbl>/)
  assert.match(xml, /Ada Lovelace/)
  assert.match(xml, /<w:jc w:val="center"\/>/)
})

test('the photo template puts the picture beside the name in a table', async () => {
  const { xml, media } = await open(cv({ template: 'photo' }, { photo: PNG }))
  assert.equal(media.length, 1)
  assert.match(media[0], /\.png$/)
  assert.match(xml, /<w:tbl>/)
  assert.ok(xml.indexOf('<w:drawing>') < xml.indexOf('Ada Lovelace'), 'the photo comes before the name')
})

test('the photo is the one the user uploaded', async () => {
  const { zip, media } = await open(cv({ template: 'photo' }, { photo: PNG }))
  const stored = await zip.file(media[0]).async('uint8array')
  assert.deepEqual([...stored], [...Buffer.from(PNG.split(',')[1], 'base64')])
})

test('the photo template without a photo still builds, with left-aligned text and no table', async () => {
  const { xml, media } = await open(cv({ template: 'photo' }, { photo: '' }))
  assert.equal(media.length, 0)
  assert.doesNotMatch(xml, /<w:tbl>/)
  assert.match(xml, /<w:jc w:val="left"\/>/)
})

test('a stored photo that is not a usable image is skipped rather than breaking the export', async () => {
  for (const photo of ['not a data url', 'data:image/svg+xml;base64,PHN2Zy8+', 'data:image/jpeg;base64,']) {
    const { media } = await open(cv({ template: 'photo' }, { photo }))
    assert.equal(media.length, 0, photo)
  }
})

test('contact details are still in the document beside the photo', async () => {
  const { xml } = await open(cv({ template: 'photo' }, { photo: PNG }))
  assert.match(xml, /ada@x\.com/)
  assert.match(xml, /Engineer/)
})

test('sections follow the CV order: education comes after experience and projects by default', async () => {
  const { xml } = await open(cv())
  const at = text => xml.indexOf(text)
  assert.ok(at('Babbage Ltd') < at('Difference Machine'))
  assert.ok(at('Difference Machine') < at('Home School'))
})

test('the Word file name is built from the name and today\'s date', () => {
  assert.match(docxFileName({ name: 'Ada Lovelace' }), /^ada-lovelace-cv-codepapa-\d{2}-\d{2}-\d{4}\.docx$/)
  assert.match(docxFileName({}), /^my-cv-cv-codepapa-/)
})

/* ---------- the language of the CV's own wording ---------- */

test('an English CV has English headings and "Present"', async () => {
  const { xml, styles } = await open(cv({ experience: [{ id: 'e1', title: 'Analyst', company: 'Babbage Ltd', location: '', startDate: '2020', endDate: 'Present', bullets: [] }] }), 'en')
  assert.match(xml, /EXPERIENCE/)
  assert.match(xml, /EDUCATION/)
  assert.match(xml, /2020 – Present/)
  assert.match(xml, /BSc in Maths/)
  assert.match(styles, /w:lang w:val="en-GB"/)
})

test('a Polish CV has Polish headings, "Obecnie" and the Polish degree wording', async () => {
  const { xml, styles } = await open(cv({ experience: [{ id: 'e1', title: 'Analityk', company: 'Babbage Ltd', location: '', startDate: '2020', endDate: 'Present', bullets: [] }] }), 'pl')
  assert.match(xml, /DOŚWIADCZENIE/)
  assert.match(xml, /WYKSZTAŁCENIE/)
  assert.match(xml, /PROJEKTY/)
  assert.match(xml, /2020 – Obecnie/)
  assert.match(xml, /BSc, Maths/)
  assert.doesNotMatch(xml, /EXPERIENCE|Present/)
  assert.match(styles, /w:lang w:val="pl-PL"/)
})

test('the Polish export keeps Polish letters intact', async () => {
  const { xml } = await open(cv({}, { name: 'Żaneta Łukasiewicz-Wójcik' }), 'pl')
  assert.match(xml, /Żaneta Łukasiewicz-Wójcik/)
})

test('the custom section keeps its own title, and falls back to a translated one', async () => {
  const withTitle = await open(cv({ sectionOrder: [{ id: 'custom', enabled: true }], custom: { title: 'Publikacje', entries: [{ id: 'c1', title: 'Artykuł', subtitle: '', startDate: '', endDate: '', bullets: [] }] } }), 'pl')
  assert.match(withTitle.xml, /PUBLIKACJE/)
  const without = await open(cv({ sectionOrder: [{ id: 'custom', enabled: true }], custom: { title: '', entries: [{ id: 'c1', title: 'Artykuł', subtitle: '', startDate: '', endDate: '', bullets: [] }] } }), 'pl')
  assert.match(without.xml, /SEKCJA WŁASNA/)
})

test('the language defaults to English when none is given', async () => {
  const { xml } = await open(cv())
  assert.match(xml, /EXPERIENCE/)
})
