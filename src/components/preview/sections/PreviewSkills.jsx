import { SectionHeader, KeepTogether } from './previewShared'

export default function PreviewSkills({ entries }) {
  const visible = entries.filter(e => e.category || e.items)
  if (!visible.length) return null

  return (
    <div>
      {visible.map((e, i) => {
        const line = (
          <div key={e.id} style={{ fontSize: '11pt', lineHeight: '1.2', marginTop: '1px' }}>
            {e.category && <strong>{e.category}: </strong>}
            {e.items}
          </div>
        )
        return i === 0
          ? <KeepTogether key={e.id}><SectionHeader title="Technical Skills" />{line}</KeepTogether>
          : line
      })}
    </div>
  )
}
