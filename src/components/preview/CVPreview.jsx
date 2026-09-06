import { useRef, useState, useEffect, useCallback } from 'react'
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
const ZOOM_MIN = 0.4
const ZOOM_MAX = 2
const ZOOM_STEP = 0.1

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
  const scrollRef = useRef(null)
  const pageRef = useRef(null)
  const [fit, setFit] = useState(1)          // scale that fits the page width into the pane
  const [zoom, setZoom] = useState(1)        // user multiplier on top of the fit scale
  const [pageHeight, setPageHeight] = useState(A4_H)

  // Fit the A4 width to the available pane width
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      const available = el.clientWidth - 48
      setFit(Math.min(1, Math.max(0.1, available / A4_W)))
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Track the real rendered height of the CV (can be multiple pages)
  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    const obs = new ResizeObserver(() => setPageHeight(el.offsetHeight))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const scale = fit * zoom
  const scaledW = Math.round(A4_W * scale)
  // never let the scaled wrapper collapse below a single page, even if a
  // transient measurement of pageHeight comes back short
  const scaledH = Math.round(Math.max(A4_H, pageHeight) * scale)

  const zoomBy = useCallback((delta) => {
    setZoom(z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + delta) * 100) / 100)))
  }, [])

  const btn = 'grid h-8 w-8 place-items-center rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'

  return (
    <>
      <div
        id="cv-preview-outer"
        className="preview-backdrop flex min-w-0 flex-1 flex-col"
      >
        <div id="cv-preview-scroll" ref={scrollRef} className="thin-scroll flex-1 overflow-auto">
          <div id="cv-preview-inner" className="flex min-h-full justify-center p-6">
            <div
              id="cv-preview-scale"
              style={{ width: scaledW, height: scaledH, flex: 'none' }}
            >
              <div
                id="cv-page"
                ref={pageRef}
                style={{
                  width: A4_W,
                  minHeight: A4_H,
                  transformOrigin: 'top left',
                  transform: `scale(${scale})`,
                  fontFamily: '"Times New Roman", Times, serif',
                  fontSize: '11pt',
                  lineHeight: '1.25',
                  color: '#000',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box',
                  padding: '48px 56px',
                  boxShadow: '0 10px 40px -12px rgba(0,0,0,0.35)',
                  borderRadius: '2px',
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
        </div>
      </div>

      {/* Zoom controls */}
      <div className="no-print absolute bottom-4 right-4 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white/95 p-1 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
        <button className={btn} onClick={() => zoomBy(-ZOOM_STEP)} disabled={zoom <= ZOOM_MIN} title="Zoom out" aria-label="Zoom out">−</button>
        <button
          className="min-w-[3rem] rounded-md px-1 py-1 text-center text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => setZoom(1)}
          title="Reset zoom"
        >
          {Math.round(scale * 100)}%
        </button>
        <button className={btn} onClick={() => zoomBy(ZOOM_STEP)} disabled={zoom >= ZOOM_MAX} title="Zoom in" aria-label="Zoom in">+</button>
      </div>
    </>
  )
}
