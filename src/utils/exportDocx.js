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
} from 'docx'

/* ---------- shared constants (mirrors the Times New Roman / 11pt print styles) ---------- */
const FONT = 'Times New Roman'
const SIZE = 22       // 11pt  (docx sizes are in half-points)
const SIZE_SM = 20    // 10pt
const SIZE_NAME = 48  // 24pt
const GRAY = '999999'
const BLACK = '000000'

const dateRange = (start, end) => {
  if (!start && !end) return ''
  if (!end) return start
  return `${start} – ${end}`
}

const shortenUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const toHref = (url) => (url.startsWith('http') ? url : `https://${url}`)

/* ---------- header ---------- */
function buildHeader(personal) {
  const { name, jobTitle, phone, email, location, links = [] } = personal
  const paragraphs = []

  if (name) {
    paragraphs.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: jobTitle ? 20 : 60 },
      children: [new TextRun({ text: name, bold: true, size: SIZE_NAME, font: FONT })],
    }))
  }

  if (jobTitle) {
    paragraphs.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: jobTitle, size: 26, font: FONT, color: '333333' })],
    }))
  }

  const parts = [
    phone ? { kind: 'text', value: phone } : null,
    email ? { kind: 'email', value: email } : null,
    ...links.filter(l => l.url).map(l => ({ kind: 'link', value: l.url, label: l.label })),
    location ? { kind: 'text', value: location } : null,
  ].filter(Boolean)

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
    paragraphs.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children }))
  }

  return paragraphs
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

function buildProfile(profile) {
  const text = profile?.text?.trim()
  if (!text) return []
  const lines = text.split(/\n+/).filter(Boolean)
  return [
    sectionHeading('Profile'),
    ...lines.map((line, i) => plainLine(line, { spacingBefore: i === 0 ? 20 : 60 })),
  ]
}

function buildEducation(entries) {
  const visible = (entries || []).filter(e => e.school || e.degree || e.field)
  return section('Education', visible, e => [
    entryHeader(e.school, dateRange(e.startDate, e.endDate)),
    e.location ? plainLine(e.location, { size: SIZE_SM, spacingBefore: 0 }) : null,
    italicLine([e.degree, e.field].filter(Boolean).join(' in ')),
    ...bulletLines(e.bullets),
  ])
}

function buildExperience(entries) {
  const visible = (entries || []).filter(e => e.title || e.company)
  return section('Experience', visible, e => [
    entryHeader(e.company, [e.location, dateRange(e.startDate, e.endDate)].filter(Boolean).join(' · ')),
    italicLine(e.title),
    ...bulletLines(e.bullets),
  ])
}

function buildProjects(entries) {
  const visible = (entries || []).filter(e => e.name || e.technologies)
  return section('Projects', visible, e => [
    entryHeader([e.name, e.technologies ? `| ${e.technologies}` : ''].filter(Boolean).join(' '), dateRange(e.startDate, e.endDate)),
    italicLine(e.description),
    ...bulletLines(e.bullets),
  ])
}

function buildSkills(entries) {
  const visible = (entries || []).filter(e => e.category || e.items)
  if (!visible.length) return []
  return [
    sectionHeading('Technical Skills'),
    ...visible.map(e => new Paragraph({
      spacing: { before: 20 },
      children: [
        ...(e.category ? [new TextRun({ text: `${e.category}: `, bold: true, size: SIZE, font: FONT })] : []),
        new TextRun({ text: e.items || '', size: SIZE, font: FONT }),
      ],
    })),
  ]
}

function buildLanguages(entries) {
  const visible = (entries || []).filter(e => e.language)
  if (!visible.length) return []
  const text = visible.map(e => `${e.language}${e.proficiency ? ` (${e.proficiency})` : ''}`).join(', ')
  return [sectionHeading('Languages'), plainLine(text, { spacingBefore: 40 })]
}

function buildCertifications(entries) {
  const visible = (entries || []).filter(e => e.name)
  return section('Certifications & Awards', visible, e => [
    entryHeader(e.name, e.date),
    italicLine(e.issuer),
    plainLine(e.description, { spacingBefore: 20 }),
  ])
}

function buildVolunteer(entries) {
  const visible = (entries || []).filter(e => e.role || e.org)
  return section('Volunteer & Extracurriculars', visible, e => [
    entryHeader(e.org, [e.location, dateRange(e.startDate, e.endDate)].filter(Boolean).join(' · ')),
    italicLine(e.role),
    ...bulletLines(e.bullets),
  ])
}

function buildCustom(custom) {
  const visible = (custom?.entries || []).filter(e => e.title || e.subtitle || (e.bullets || []).some(Boolean))
  if (!custom?.title && !visible.length) return []
  const paragraphs = visible.flatMap(e => [
    (e.title || e.startDate || e.endDate) ? entryHeader(e.title, dateRange(e.startDate, e.endDate)) : null,
    italicLine(e.subtitle),
    ...bulletLines(e.bullets),
  ]).filter(Boolean)
  return [sectionHeading(custom.title || 'Custom Section'), ...paragraphs]
}

const SECTION_BUILDERS = {
  profile: (data) => buildProfile(data.profile),
  education: (data) => buildEducation(data.education),
  experience: (data) => buildExperience(data.experience),
  projects: (data) => buildProjects(data.projects),
  skills: (data) => buildSkills(data.skills),
  languages: (data) => buildLanguages(data.languages),
  certifications: (data) => buildCertifications(data.certifications),
  volunteer: (data) => buildVolunteer(data.volunteer),
  custom: (data) => buildCustom(data.custom),
}

/* ---------- document assembly ---------- */
export async function cvDataToDocxBlob(cvData) {
  const children = [
    ...buildHeader(cvData.personal),
    ...cvData.sectionOrder
      .filter(s => s.enabled)
      .flatMap(s => SECTION_BUILDERS[s.id]?.(cvData) || []),
  ]

  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONT, size: SIZE } } },
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
