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

// Print page breaks. Chrome does not reliably honour "break-after: avoid", so what must stay together is
// physically grouped in one block that is never split: a section heading is never the last thing on a
// page, an entry's title line is never separated from its first bullet, and no bullet is cut in two.
const KEEP_TOGETHER = { breakInside: 'avoid', pageBreakInside: 'avoid' }

export function KeepTogether({ children }) {
  return <div style={KEEP_TOGETHER}>{children}</div>
}

function Bullet({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', fontSize: '10pt', lineHeight: '1.3', ...KEEP_TOGETHER }}>
      <span style={{ minWidth: '14px', paddingLeft: '6px', flexShrink: 0 }}>•</span>
      <span>{text}</span>
    </div>
  )
}

export function Bullets({ bullets }) {
  const filled = bullets.filter(Boolean)
  if (!filled.length) return null
  return (
    <div style={{ marginTop: '2px' }}>
      {filled.map((b, i) => <Bullet key={i} text={b} />)}
    </div>
  )
}

/**
 * One entry. `heading` (the section title, for the first entry only) and `lead` (the entry's title
 * lines) are kept on the same page as the entry's first bullet; the other bullets flow on freely.
 */
export function EntryBlock({ heading, lead, bullets = [] }) {
  const [first, ...rest] = bullets.filter(Boolean)
  return (
    <div>
      <KeepTogether>
        {heading}
        {lead}
        {first && <div style={{ marginTop: '2px' }}><Bullet text={first} /></div>}
      </KeepTogether>
      {rest.length > 0 && <Bullets bullets={rest} />}
    </div>
  )
}

export function dateRange(start, end) {
  if (!start && !end) return ''
  if (!end) return start
  return `${start} – ${end}`
}
