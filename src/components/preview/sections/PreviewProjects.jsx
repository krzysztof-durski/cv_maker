import { SectionHeader, EntryHeader, Italic, Bullets, dateRange } from './previewShared'

export default function PreviewProjects({ entries }) {
  const visible = entries.filter(e => e.name || e.technologies)
  if (!visible.length) return null

  return (
    <div>
      <SectionHeader title="Projects" />
      {visible.map(e => (
        <div key={e.id}>
          <EntryHeader
            left={[e.name, e.technologies ? `| ${e.technologies}` : ''].filter(Boolean).join(' ')}
            right={dateRange(e.startDate, e.endDate)}
          />
          {e.description && <Italic>{e.description}</Italic>}
          <Bullets bullets={e.bullets} />
        </div>
      ))}
    </div>
  )
}
