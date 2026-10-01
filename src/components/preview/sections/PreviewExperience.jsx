import { SectionHeader, EntryHeader, Italic, EntryBlock, dateRange } from './previewShared'

export default function PreviewExperience({ entries }) {
  const visible = entries.filter(e => e.title || e.company)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title="Experience" /> : null}
          lead={(
            <>
              <EntryHeader
                left={e.company}
                right={[e.location, dateRange(e.startDate, e.endDate)].filter(Boolean).join(' · ')}
              />
              {e.title && <Italic>{e.title}</Italic>}
            </>
          )}
          bullets={e.bullets}
        />
      ))}
    </div>
  )
}
