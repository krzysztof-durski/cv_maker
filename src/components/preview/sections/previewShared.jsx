export function SectionHeader({ title }) {
  return (
    <div style={{ marginTop: '10px', marginBottom: '3px' }}>
      <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11pt', letterSpacing: '0.05em' }}>
        {title}
      </div>
      <hr style={{ borderTop: '1.5px solid #000', margin: '2px 0 0 0', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }} />
    </div>
  )
}

export function EntryHeader({ left, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px', gap: '8px' }}>
      <strong style={{ fontSize: '11pt', minWidth: 0, overflowWrap: 'break-word' }}>{left}</strong>
      <span style={{ fontSize: '10pt', whiteSpace: 'nowrap', flexShrink: 0 }}>{right}</span>
    </div>
  )
}

export function Italic({ children }) {
  return <div style={{ fontStyle: 'italic', fontSize: '11pt' }}>{children}</div>
}

export function Bullets({ bullets }) {
  const filled = bullets.filter(Boolean)
  if (!filled.length) return null
  return (
    <div style={{ marginTop: '2px' }}>
      {filled.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '10pt', lineHeight: '1.3' }}>
          <span style={{ minWidth: '14px', paddingLeft: '6px', flexShrink: 0 }}>•</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  )
}

export function dateRange(start, end) {
  if (!start && !end) return ''
  if (!end) return start
  return `${start} – ${end}`
}
