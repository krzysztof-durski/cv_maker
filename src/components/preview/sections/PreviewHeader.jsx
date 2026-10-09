import { useCvText } from '../CvLanguage'
import { contactParts, shortenUrl, toHref } from '../../../utils/contactParts'

const ICON_MAP = {
  linkedin:  '/LinkedIn.svg',
  github:    '/GitHub.svg',
}

const PHOTO_SIZE = 104 // px, about 2.7 cm on the printed page

function LinkItem({ type, url, label }) {
  if (!url) return null
  const display = label || shortenUrl(url)
  const icon = ICON_MAP[type] || '/Link.svg'

  return (
    <a href={toHref(url)} style={{ color: '#000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      <img src={icon} alt="" style={{ width: '14px', height: '14px', display: 'inline' }} />
      {display}
    </a>
  )
}

/** Name, job title and the contact line. `align` is 'center' for the classic header, 'left' beside a photo. */
function HeaderText({ personal, align }) {
  const { name, jobTitle } = personal
  const parts = contactParts(personal)

  return (
    <div style={{ textAlign: align, minWidth: 0, flex: 1 }}>
      {name && (
        <div style={{ fontSize: '24pt', fontWeight: 'bold', lineHeight: '1.2', marginBottom: jobTitle ? '2px' : '4px' }}>
          {name}
        </div>
      )}
      {jobTitle && (
        <div style={{ fontSize: '13pt', color: '#333', lineHeight: '1.2', marginBottom: '4px' }}>
          {jobTitle}
        </div>
      )}
      {parts.length > 0 && (
        <div style={{ fontSize: '10pt', color: '#000', lineHeight: '1.3', display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: '0 4px', alignItems: 'center' }}>
          {parts.map((part, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {part.kind === 'link'
                ? <LinkItem type={part.type} url={part.value} label={part.label} />
                : part.kind === 'email'
                ? <a href={`mailto:${part.value}`} style={{ color: '#000', textDecoration: 'none' }}>{part.value}</a>
                : <span>{part.value}</span>
              }
              {i < parts.length - 1 && <span style={{ marginLeft: '4px', color: '#9ca3af' }}>|</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PreviewHeader({ personal, template = 'classic' }) {
  const text = useCvText()
  if (template !== 'photo') {
    return (
      <div style={{ marginBottom: '8px' }}>
        <HeaderText personal={personal} align="center" />
      </div>
    )
  }

  const { photo, name } = personal
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px', breakInside: 'avoid' }}>
      {photo && (
        <img
          src={photo}
          alt={text.photoOf(name)}
          style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, objectFit: 'cover', flex: 'none', display: 'block' }}
        />
      )}
      <HeaderText personal={personal} align="left" />
    </div>
  )
}
