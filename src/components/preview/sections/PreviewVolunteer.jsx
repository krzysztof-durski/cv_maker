import { SectionHeader, EntryHeader, Italic, Bullets, dateRange } from './previewShared'

export default function PreviewVolunteer({ entries }) {
  const visible = entries.filter(e => e.role || e.org)
  if (!visible.length) return null

  return (
    <div>
      <SectionHeader title="Volunteer & Extracurriculars" />
      {visible.map(e => (
        <div key={e.id}>
          <EntryHeader
            left={e.org}
            right={[e.location, dateRange(e.startDate, e.endDate)].filter(Boolean).join(' · ')}
          />
          {e.role && <Italic>{e.role}</Italic>}
          <Bullets bullets={e.bullets} />
        </div>
      ))}
    </div>
  )
}
