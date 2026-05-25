import { SectionHeader, EntryHeader, Italic } from './previewShared'

export default function PreviewCertifications({ entries }) {
  const visible = entries.filter(e => e.name)
  if (!visible.length) return null

  return (
    <div>
      <SectionHeader title="Certifications & Awards" />
      {visible.map(e => (
        <div key={e.id}>
          <EntryHeader left={e.name} right={e.date} />
          {e.issuer && <Italic>{e.issuer}</Italic>}
          {e.description && <div style={{ fontSize: '11pt', marginTop: '2px' }}>{e.description}</div>}
        </div>
      ))}
    </div>
  )
}
