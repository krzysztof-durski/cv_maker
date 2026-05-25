import { useRef, useState, useEffect } from 'react'
import PreviewHeader from './sections/PreviewHeader'
import PreviewEducation from './sections/PreviewEducation'
import PreviewExperience from './sections/PreviewExperience'
import PreviewProjects from './sections/PreviewProjects'
import PreviewSkills from './sections/PreviewSkills'
import PreviewLanguages from './sections/PreviewLanguages'
import PreviewCertifications from './sections/PreviewCertifications'
import PreviewVolunteer from './sections/PreviewVolunteer'
import PreviewCustom from './sections/PreviewCustom'

const A4_W = 794
const A4_H = 1123

function PreviewSection({ sectionId, cvData }) {
  switch (sectionId) {
    case 'education':      return <PreviewEducation      entries={cvData.education} />
    case 'experience':     return <PreviewExperience     entries={cvData.experience} />
    case 'projects':       return <PreviewProjects       entries={cvData.projects} />
    case 'skills':         return <PreviewSkills         entries={cvData.skills} />
    case 'languages':      return <PreviewLanguages      entries={cvData.languages} />
    case 'certifications': return <PreviewCertifications entries={cvData.certifications} />
    case 'volunteer':      return <PreviewVolunteer      entries={cvData.volunteer} />
    case 'custom':         return <PreviewCustom         custom={cvData.custom} />
    default:               return null
  }
}

export default function CVPreview({ cvData }) {
  const outerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      const available = el.clientWidth - 48
      setScale(Math.min(1, available / A4_W))
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const scaledW = Math.round(A4_W * scale)

  return (
    <div ref={outerRef} className="flex-1 overflow-auto bg-gray-400" style={{ padding: '24px' }} id="cv-preview-outer">
      <div style={{ width: scaledW, margin: '0 auto', transformOrigin: 'top left' }}>
        <div
          id="cv-page"
          style={{
            width: A4_W,
            minHeight: A4_H,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '11pt',
            lineHeight: '1.35',
            color: '#000',
            backgroundColor: '#fff',
            boxSizing: 'border-box',
            padding: '96px 72px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          <PreviewHeader personal={cvData.personal} />
          {cvData.sectionOrder
            .filter(s => s.enabled)
            .map(s => (
              <PreviewSection key={s.id} sectionId={s.id} cvData={cvData} />
            ))
          }
        </div>
      </div>
    </div>
  )
}
