import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  AlignmentType,
  BorderStyle,
  TabStopType,
  TabStopPosition,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
} from 'docx'
import { contactParts, shortenUrl, toHref } from './contactParts.js'
import { parseImageDataUrl } from './photo.js'
import { dateRange, degreeLine, sectionHeading as headingText } from './cvText.js'

/* ---------- shared constants (mirrors the Times New Roman / 11pt print styles) ---------- */
const FONT = 'Times New Roman'
const DOC_LANGUAGE = { en: 'en-GB', pl: 'pl-PL' } // so Word spell-checks the CV in the right language
const SIZE = 22       // 11pt  (docx sizes are in half-points)
const SIZE_SM = 20    // 10pt
const SIZE_NAME = 48  // 24pt
const GRAY = '999999'
const BLACK = '000000'


/* ---------- header ---------- */
const PHOTO_PX = 104                 // matches the preview
const PHOTO_CELL_WIDTH = 1700        // twips: the photo plus some air
const PHOTO_IMAGE_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif' }
const NO_BORDERS = Object.fromEntries(
  ['top', 'bottom', 'left', 'right'].map(side => [side, { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }])
)

/** Name, job title and contact line as paragraphs, centred (classic) or left-aligned (beside a photo). */
function buildHeaderText(personal, alignment) {
  const { name, jobTitle } = personal
  const paragraphs = []

  if (name) {
    paragraphs.push(new Paragraph({
      alignment,
      spacing: { after: jobTitle ? 20 : 60 },
      children: [new TextRun({ text: name, bold: true, size: SIZE_NAME, font: FONT })],
    }))
  }

  if (jobTitle) {
    paragraphs.push(new Paragraph({
      alignment,
      spacing: { after: 60 },
      children: [new TextRun({ text: jobTitle, size: 26, font: FONT, color: '333333' })],
    }))
  }

  const parts = contactParts(personal)
  if (parts.length) {
    const children = []
    parts.forEach((part, i) => {
      if (part.kind === 'email') {
        children.push(new ExternalHyperlink({
          link: `mailto:${part.value}`,
          children: [new TextRun({ text: part.value, size: SIZE_SM, font: FONT, color: BLACK })],
        }))
      } else if (part.kind === 'link') {
        children.push(new ExternalHyperlink({
          link: toHref(part.value),
          children: [new TextRun({ text: part.label || shortenUrl(part.value), size: SIZE_SM, font: FONT, color: BLACK })],
        }))
      } else {
        children.push(new TextRun({ text: part.value, size: SIZE_SM, font: FONT }))
      }
      if (i < parts.length - 1) {
        children.push(new TextRun({ text: '  |  ', size: SIZE_SM, font: FONT, color: GRAY }))
      }
    })
    paragraphs.push(new Paragraph({ alignment, spacing: { after: 200 }, children }))
  }

  return paragraphs
}

/** The photo template's header: a borderless two-cell table, photo on the left and the text beside it. */
function buildPhotoHeader(personal, image) {
  const cell = (width, children) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: NO_BORDERS,
    verticalAlign: VerticalAlign.CENTER,
    children,
  })
  const picture = new Paragraph({
    children: [new ImageRun({ type: PHOTO_IMAGE_TYPE[image.type], data: image.bytes, transformation: { width: PHOTO_PX, height: PHOTO_PX } })],
  })
  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { ...NO_BORDERS, insideHorizontal: NO_BORDERS.top, insideVertical: NO_BORDERS.left },
    rows: [new TableRow({
      cantSplit: true,
      children: [
        cell(PHOTO_CELL_WIDTH, [picture]),
        cell(9000 - PHOTO_CELL_WIDTH, buildHeaderText(personal, AlignmentType.LEFT)),
      ],
    })],
  })]
}

function buildHeader(personal, template) {
  const image = template === 'photo' ? parseImageDataUrl(personal.photo) : null
  // Without a usable picture the photo template still left-aligns the text, as in the preview.
  if (image && PHOTO_IMAGE_TYPE[image.type]) return buildPhotoHeader(personal, image)
  return buildHeaderText(personal, template === 'photo' ? AlignmentType.LEFT : AlignmentType.CENTER)
}

/* ---------- shared section building blocks ---------- */
function sectionHeading(title) {
  return new Paragraph({
    spacing: { before: 220, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLACK, space: 1 } },
    children: [new TextRun({ text: title.toUpperCase(), bold: true, size: SIZE, font: FONT })],
  })
}

function entryHeader(left, right) {
  if (!left && !right) return null
  return new Paragraph({
    spacing: { before: 80 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: left || '', bold: true, size: SIZE, font: FONT }),
      new TextRun({ text: `\t${right || ''}`, size: SIZE_SM, font: FONT }),
    ],
  })
}

function italicLine(text) {
  if (!text) return null
  return new Paragraph({ children: [new TextRun({ text, italics: true, size: SIZE, font: FONT })] })
}

function plainLine(text, { size = SIZE, spacingBefore = 20 } = {}) {
  if (!text) return null
  return new Paragraph({ spacing: { before: spacingBefore }, children: [new TextRun({ text, size, font: FONT })] })
}

function bulletLines(bullets) {
  return (bullets || []).filter(Boolean).map(b => new Paragraph({
    spacing: { before: 20 },
    indent: { left: 260, hanging: 260 },
    children: [new TextRun({ text: `•\t${b}`, size: SIZE_SM, font: FONT })],
  }))
}

/* ---------- per-section builders — mirror the src/components/preview/sections/*.jsx components ---------- */
function section(title, entries, render) {
  const paragraphs = entries.flatMap(render).filter(Boolean)
  if (!paragraphs.length) return []
  return [sectionHeading(title), ...paragraphs]
}

function buildProfile(profile, lang) {
  const text = profile?.text?.trim()
  if (!text) return []
  const lines = text.split(/\n+/).filter(Boolean)
  return [
    sectionHeading(headingText('profile', lang)),
    ...lines.map((line, i) => plainLine(line, { spacingBefore: i === 0 ? 20 : 60 })),
  ]
}

function buildEducation(entries, lang) {
  const visible = (entries || []).filter(e => e.school || e.degree || e.field)
  return section(headingText('education', lang), visible, e => [
    entryHeader(e.school, dateRange(e.startDate, e.endDate, lang)),
    e.location ? plainLine(e.location, { size: SIZE_SM, spacingBefore: 0 }) : null,
    italicLine(degreeLine(e.degree, e.field, lang)),
    ...bulletLines(e.bullets),
  ])
}

function buildExperience(entries, lang) {
  const visible = (entries || []).filter(e => e.title || e.company)
  return section(headingText('experience', lang), visible, e => [
    entryHeader(e.company, [e.location, dateRange(e.startDate, e.endDate, lang)].filter(Boolean).join(' · ')),
    italicLine(e.title),
    ...bulletLines(e.bullets),
  ])
}

function buildProjects(entries, lang) {
  const visible = (entries || []).filter(e => e.name || e.technologies)
  return section(headingText('projects', lang), visible, e => [
    entryHeader([e.name, e.technologies ? `| ${e.technologies}` : ''].filter(Boolean).join(' '), dateRange(e.startDate, e.endDate, lang)),
    italicLine(e.description),
    ...bulletLines(e.bullets),
  ])
}

function buildSkills(entries, lang) {
  const visible = (entries || []).filter(e => e.category || e.items)
  if (!visible.length) return []
  return [
    sectionHeading(headingText('skills', lang)),
    ...visible.map(e => new Paragraph({
      spacing: { before: 20 },
      children: [
        ...(e.category ? [new TextRun({ text: `${e.category}: `, bold: true, size: SIZE, font: FONT })] : []),
        new TextRun({ text: e.items || '', size: SIZE, font: FONT }),
      ],
    })),
  ]
}

function buildLanguages(entries, lang) {
  const visible = (entries || []).filter(e => e.language)
  if (!visible.length) return []
  const text = visible.map(e => `${e.language}${e.proficiency ? ` (${e.proficiency})` : ''}`).join(', ')
  return [sectionHeading(headingText('languages', lang)), plainLine(text, { spacingBefore: 40 })]
}

function buildCertifications(entries, lang) {
  const visible = (entries || []).filter(e => e.name)
  return section(headingText('certifications', lang), visible, e => [
    entryHeader(e.name, e.date),
    italicLine(e.issuer),
    plainLine(e.description, { spacingBefore: 20 }),
  ])
}

function buildVolunteer(entries, lang) {
  const visible = (entries || []).filter(e => e.role || e.org)
  return section(headingText('volunteer', lang), visible, e => [
    entryHeader(e.org, [e.location, dateRange(e.startDate, e.endDate, lang)].filter(Boolean).join(' · ')),
    italicLine(e.role),
    ...bulletLines(e.bullets),
  ])
}

function buildCustom(custom, lang) {
  const visible = (custom?.entries || []).filter(e => e.title || e.subtitle || (e.bullets || []).some(Boolean))
  if (!custom?.title && !visible.length) return []
  const paragraphs = visible.flatMap(e => [
    (e.title || e.startDate || e.endDate) ? entryHeader(e.title, dateRange(e.startDate, e.endDate, lang)) : null,
    italicLine(e.subtitle),
    ...bulletLines(e.bullets),
  ]).filter(Boolean)
  return [sectionHeading(custom.title || headingText('custom', lang)), ...paragraphs]
}

const SECTION_BUILDERS = {
  profile: (data, lang) => buildProfile(data.profile, lang),
  education: (data, lang) => buildEducation(data.education, lang),
  experience: (data, lang) => buildExperience(data.experience, lang),
  projects: (data, lang) => buildProjects(data.projects, lang),
  skills: (data, lang) => buildSkills(data.skills, lang),
  languages: (data, lang) => buildLanguages(data.languages, lang),
  certifications: (data, lang) => buildCertifications(data.certifications, lang),
  volunteer: (data, lang) => buildVolunteer(data.volunteer, lang),
  custom: (data, lang) => buildCustom(data.custom, lang),
}

/* ---------- document assembly ---------- */
/** @param lang the language of the CV's own wording (headings, "Present"): 'en' or 'pl' */
export async function cvDataToDocxBlob(cvData, lang = 'en') {
  const children = [
    ...buildHeader(cvData.personal, cvData.template),
    ...cvData.sectionOrder
      .filter(s => s.enabled)
      .flatMap(s => SECTION_BUILDERS[s.id]?.(cvData, lang) || []),
  ]

  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONT, size: SIZE, language: { value: DOC_LANGUAGE[lang] || DOC_LANGUAGE.en } } } },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4 in twips
          margin: { top: 720, bottom: 720, left: 864, right: 864 }, // 0.5in / 0.6in, matches the print CSS
        },
      },
      children,
    }],
  })

  return Packer.toBlob(doc)
}

export function docxFileName(personal) {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const slug = (personal?.name || 'my-cv')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-cv'
  return `${slug}-cv-codepapa-${dd}-${mm}-${yyyy}.docx`
}
