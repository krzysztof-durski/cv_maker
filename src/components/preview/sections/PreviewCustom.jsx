import { SectionHeader, EntryHeader, Italic, Bullets, dateRange } from './previewShared'

export default function PreviewCustom({ custom }) {
  const visible = custom.entries.filter(e => e.title || e.subtitle || e.bullets.some(Boolean))
  if (!custom.title && !visible.length) return null

  return (
    <div>
      <SectionHeader title={custom.title || 'Custom Section'} />
      {visible.map(e => (
        <div key={e.id}>
          {(e.title || (e.startDate || e.endDate)) && (
            <EntryHeader left={e.title} right={dateRange(e.startDate, e.endDate)} />
          )}
          {e.subtitle && <Italic>{e.subtitle}</Italic>}
          <Bullets bullets={e.bullets} />
        </div>
      ))}
    </div>
  )
}
