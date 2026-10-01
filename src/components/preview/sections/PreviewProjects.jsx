import { SectionHeader, EntryHeader, Italic, EntryBlock, dateRange } from './previewShared'

export default function PreviewProjects({ entries }) {
  const visible = entries.filter(e => e.name || e.technologies)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => (
        <EntryBlock
          key={e.id}
          heading={i === 0 ? <SectionHeader title="Projects" /> : null}
          lead={(
            <>
              <EntryHeader
                left={[e.name, e.technologies ? `| ${e.technologies}` : ''].filter(Boolean).join(' ')}
                right={dateRange(e.startDate, e.endDate)}
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
