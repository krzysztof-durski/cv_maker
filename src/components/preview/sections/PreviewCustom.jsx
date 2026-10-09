import { useCvText } from '../CvLanguage'
import { SectionHeader, EntryHeader, Italic, EntryBlock, KeepTogether } from './previewShared'

export default function PreviewCustom({ custom }) {
  const text = useCvText()
  const visible = custom.entries.filter(e => e.title || e.subtitle || e.bullets.some(Boolean))
  if (!custom.title && !visible.length) return null

  return (
    <div>
      {visible.length === 0 && <KeepTogether><SectionHeader title={custom.title || text.heading('custom')} /></KeepTogether>}
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title={custom.title || text.heading('custom')} /> : null}
          lead={(
            <>
              {(e.title || (e.startDate || e.endDate)) && (
                <EntryHeader left={e.title} right={text.dateRange(e.startDate, e.endDate)} />
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
