import { SectionHeader, EntryHeader, Italic, EntryBlock, KeepTogether, dateRange } from './previewShared'

export default function PreviewCustom({ custom }) {
  const visible = custom.entries.filter(e => e.title || e.subtitle || e.bullets.some(Boolean))
  if (!custom.title && !visible.length) return null

  return (
    <div>
      {visible.length === 0 && <KeepTogether><SectionHeader title={custom.title || 'Custom Section'} /></KeepTogether>}
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title={custom.title || 'Custom Section'} /> : null}
          lead={(
            <>
              {(e.title || (e.startDate || e.endDate)) && (
                <EntryHeader left={e.title} right={dateRange(e.startDate, e.endDate)} />
              )}
              {e.subtitle && <Italic>{e.subtitle}</Italic>}
            </>
          )}
          bullets={e.bullets}
        />
      ))}
    </div>
  )
}
