import { SectionHeader, EntryHeader, Italic, EntryBlock, dateRange } from './previewShared'

export default function PreviewEducation({ entries }) {
  const visible = entries.filter(e => e.school || e.degree || e.field)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title="Education" /> : null}
          lead={(
            <>
              <EntryHeader
                left={e.school}
                right={dateRange(e.startDate, e.endDate)}
              />
              {e.location && <div style={{ fontSize: '10pt', color: '#333' }}>{e.location}</div>}
              {(e.degree || e.field) && (
                <Italic>{[e.degree, e.field].filter(Boolean).join(' in ')}</Italic>
              )}
            </>
          )}
          bullets={e.bullets}
        />
      ))}
    </div>
  )
}
