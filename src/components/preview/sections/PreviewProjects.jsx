import { useCvText } from '../CvLanguage'
import { SectionHeader, EntryHeader, Italic, EntryBlock } from './previewShared'

export default function PreviewProjects({ entries }) {
  const text = useCvText()
  const visible = entries.filter(e => e.name || e.technologies)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title={text.heading('projects')} /> : null}
          lead={(
            <>
              <EntryHeader
                left={[e.name, e.technologies ? `| ${e.technologies}` : ''].filter(Boolean).join(' ')}
                right={text.dateRange(e.startDate, e.endDate)}
              />
              {e.description && <Italic>{e.description}</Italic>}
            </>
          )}
          bullets={e.bullets}
        />
      ))}
    </div>
  )
}
