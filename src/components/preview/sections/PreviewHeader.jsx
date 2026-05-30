function shorten(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

const ICON_MAP = {
  linkedin:  '/LinkedIn.svg',
  github:    '/GitHub.svg',
}

function LinkItem({ type, url, label }) {
  if (!url) return null
  const display = label || shorten(url)
  const href = url.startsWith('http') ? url : `https://${url}`
  const icon = ICON_MAP[type] || '/Link.svg'

  return (
    <a href={href} style={{ color: '#000', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      <img src={icon} alt="" style={{ width: '14px', height: '14px', display: 'inline' }} />
      {display}
    </a>
  )
}

export default function PreviewHeader({ personal }) {
  const { name, phone, email, location, links = [] } = personal

  const parts = [
    phone    ? { kind: 'text',  value: phone }    : null,
    email    ? { kind: 'email', value: email }    : null,
    ...links.filter(l => l.url).map(l => ({ kind: 'link', type: l.type, value: l.url, label: l.label })),
    location ? { kind: 'text',  value: location } : null,
  ].filter(Boolean)

  return (
    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
      {name && (
        <div style={{ fontSize: '24pt', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '4px' }}>
          {name}
        </div>
      )}
      {parts.length > 0 && (
        <div style={{ fontSize: '10pt', color: '#000', lineHeight: '1.3', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 4px', alignItems: 'center' }}>
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
