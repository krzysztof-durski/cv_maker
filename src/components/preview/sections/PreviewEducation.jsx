import { SectionHeader, EntryHeader, Italic, Bullets, dateRange } from './previewShared'

export default function PreviewEducation({ entries }) {
  const visible = entries.filter(e => e.school || e.degree || e.field)
  if (!visible.length) return null

  return (
    <div>
      <SectionHeader title="Education" />
      {visible.map(e => (
        <div key={e.id}>
          <EntryHeader
            left={e.school}
            right={dateRange(e.startDate, e.endDate)}
          />
          {e.location && <div style={{ fontSize: '10pt', color: '#333' }}>{e.location}</div>}
          {(e.degree || e.field) && (
            <Italic>{[e.degree, e.field].filter(Boolean).join(' in ')}</Italic>
          )}
          <Bullets bullets={e.bullets} />
        </div>
      ))}
    </div>
  )
}
