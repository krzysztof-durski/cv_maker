import { SectionHeader, EntryHeader, Italic, EntryBlock } from './previewShared'

export default function PreviewCertifications({ entries }) {
  const visible = entries.filter(e => e.name)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title="Certifications & Awards" /> : null}
          lead={(
            <>
              <EntryHeader left={e.name} right={e.date} />
              {e.issuer && <Italic>{e.issuer}</Italic>}
              {e.description && <div style={{ fontSize: '11pt', marginTop: '2px' }}>{e.description}</div>}
            </>
          )}
        />
      ))}
    </div>
  )
}
