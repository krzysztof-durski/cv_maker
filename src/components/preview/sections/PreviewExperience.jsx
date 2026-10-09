import { useCvText } from '../CvLanguage'
import { SectionHeader, EntryHeader, Italic, EntryBlock } from './previewShared'

export default function PreviewExperience({ entries }) {
  const text = useCvText()
  const visible = entries.filter(e => e.title || e.company)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title={text.heading('experience')} /> : null}
          lead={(
            <>
              <EntryHeader
                left={e.company}
                right={[e.location, text.dateRange(e.startDate, e.endDate)].filter(Boolean).join(' · ')}
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
