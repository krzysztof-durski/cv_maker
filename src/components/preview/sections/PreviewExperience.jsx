import { SectionHeader, EntryHeader, Italic, Bullets, dateRange } from './previewShared'

export default function PreviewExperience({ entries }) {
  const visible = entries.filter(e => e.title || e.company)
  if (!visible.length) return null

  return (
    <div>
      <SectionHeader title="Experience" />
      {visible.map(e => (
        <div key={e.id}>
          <EntryHeader
            left={e.company}
            right={[e.location, dateRange(e.startDate, e.endDate)].filter(Boolean).join(' · ')}
          />
          {e.title && <Italic>{e.title}</Italic>}
          <Bullets bullets={e.bullets} />
        </div>
      ))}
    </div>
  )
}
