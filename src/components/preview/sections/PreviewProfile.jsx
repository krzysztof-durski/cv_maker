import { useCvText } from '../CvLanguage'
import { SectionHeader, KeepTogether } from './previewShared'

export default function PreviewProfile({ profile }) {
  const cv = useCvText()
  const text = profile?.text?.trim()
  if (!text) return null

  return (
    <KeepTogether>
      <SectionHeader title={cv.heading('profile')} />
      <div style={{ fontSize: '11pt', lineHeight: '1.3', marginTop: '2px', whiteSpace: 'pre-wrap' }}>
        {text}
      </div>
    </KeepTogether>
  )
}
