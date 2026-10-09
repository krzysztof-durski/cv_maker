import { useCvText } from '../CvLanguage'
import { SectionHeader, EntryHeader, Italic, EntryBlock } from './previewShared'

export default function PreviewVolunteer({ entries }) {
  const text = useCvText()
  const visible = entries.filter(e => e.role || e.org)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title={text.heading('volunteer')} /> : null}
          lead={(
            <>
              <EntryHeader
                left={e.org}
                right={[e.location, text.dateRange(e.startDate, e.endDate)].filter(Boolean).join(' · ')}
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
