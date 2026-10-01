import { SectionHeader, EntryHeader, Italic, EntryBlock, dateRange } from './previewShared'

export default function PreviewVolunteer({ entries }) {
  const visible = entries.filter(e => e.role || e.org)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title="Volunteer & Extracurriculars" /> : null}
          lead={(
            <>
              <EntryHeader
                left={e.org}
                right={[e.location, dateRange(e.startDate, e.endDate)].filter(Boolean).join(' · ')}
              />
              {e.role && <Italic>{e.role}</Italic>}
            </>
          )}
          bullets={e.bullets}
        />
      ))}
    </div>
  )
}
