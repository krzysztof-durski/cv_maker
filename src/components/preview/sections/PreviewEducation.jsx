import { useCvText } from '../CvLanguage'
import { SectionHeader, EntryHeader, Italic, EntryBlock } from './previewShared'

export default function PreviewEducation({ entries }) {
  const text = useCvText()
  const visible = entries.filter(e => e.school || e.degree || e.field)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title={text.heading('education')} /> : null}
          lead={(
            <>
              <EntryHeader
                left={e.school}
                right={text.dateRange(e.startDate, e.endDate)}
              />
              {e.location && <div style={{ fontSize: '10pt', color: '#333' }}>{e.location}</div>}
              {(e.degree || e.field) && (
                <Italic>{text.degreeLine(e.degree, e.field)}</Italic>
              )}
            </>
          )}
          bullets={e.bullets}
        />
      ))}
    </div>
  )
}
