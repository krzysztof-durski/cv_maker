import { SectionHeader, KeepTogether } from './previewShared'

export default function PreviewProfile({ profile }) {
  const text = profile?.text?.trim()
  if (!text) return null

  return (
    <KeepTogether>
      <SectionHeader title="Profile" />
      <div style={{ fontSize: '11pt', lineHeight: '1.3', marginTop: '2px', whiteSpace: 'pre-wrap' }}>
        {text}
      </div>
    </KeepTogether>
  )
}
