import { SectionHeader } from './previewShared'

export default function PreviewLanguages({ entries }) {
  const visible = entries.filter(e => e.language)
  if (!visible.length) return null

  return (
    <div>
      <SectionHeader title="Languages" />
      <div style={{ marginTop: '3px' }}>
        {visible.map((e, i) => (
          <span key={e.id} style={{ fontSize: '11pt' }}>
            {e.language}{e.proficiency ? ` (${e.proficiency})` : ''}
            {i < visible.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    </div>
  )
}
