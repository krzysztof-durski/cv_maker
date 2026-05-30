import { SectionHeader } from './previewShared'

export default function PreviewSkills({ entries }) {
  const visible = entries.filter(e => e.category || e.items)
  if (!visible.length) return null

  return (
    <div>
      <SectionHeader title="Technical Skills" />
      {visible.map(e => (
        <div key={e.id} style={{ fontSize: '11pt', lineHeight: '1.2', marginTop: '1px' }}>
          {e.category && <strong>{e.category}: </strong>}
          {e.items}
        </div>
      ))}
    </div>
  )
}
