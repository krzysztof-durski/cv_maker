import HowToUse from './HowToUse'
import SectionManager from './SectionManager'
import PersonalInfoEditor from './sections/PersonalInfoEditor'
import EducationEditor from './sections/EducationEditor'
import ExperienceEditor from './sections/ExperienceEditor'
import ProjectsEditor from './sections/ProjectsEditor'
import SkillsEditor from './sections/SkillsEditor'
import LanguagesEditor from './sections/LanguagesEditor'
import CertificationsEditor from './sections/CertificationsEditor'
import VolunteerEditor from './sections/VolunteerEditor'
import CustomSectionEditor from './sections/CustomSectionEditor'
import { DEFAULT_DATA } from '../../utils/defaultData'

export default function EditorPanel({ cvData, setCvData }) {
  const update = (field) => (value) => setCvData(prev => ({ ...prev, [field]: value }))
  const reset = (field) => () => setCvData(prev => ({ ...prev, [field]: DEFAULT_DATA[field] }))

  const sectionEditors = {
    education:      <EducationEditor      entries={cvData.education}      onChange={update('education')}      onReset={reset('education')} />,
    experience:     <ExperienceEditor     entries={cvData.experience}     onChange={update('experience')}     onReset={reset('experience')} />,
    projects:       <ProjectsEditor       entries={cvData.projects}       onChange={update('projects')}       onReset={reset('projects')} />,
    skills:         <SkillsEditor         entries={cvData.skills}         onChange={update('skills')}         onReset={reset('skills')} />,
    languages:      <LanguagesEditor      entries={cvData.languages}      onChange={update('languages')}      onReset={reset('languages')} />,
    certifications: <CertificationsEditor entries={cvData.certifications} onChange={update('certifications')} onReset={reset('certifications')} />,
    volunteer:      <VolunteerEditor      entries={cvData.volunteer}      onChange={update('volunteer')}      onReset={reset('volunteer')} />,
    custom:         <CustomSectionEditor  custom={cvData.custom}          onChange={update('custom')}         onReset={reset('custom')} />,
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Editor
        </h1>
        <span className="text-xs text-gray-400 dark:text-gray-500">Auto-saved locally</span>
      </div>

      <HowToUse />
      <PersonalInfoEditor
        personal={cvData.personal}
        onChange={update('personal')}
        onReset={reset('personal')}
      />
      <SectionManager
        sectionOrder={cvData.sectionOrder}
        onChange={update('sectionOrder')}
      />
      {cvData.sectionOrder
        .filter(s => s.enabled)
        .map(s => (
          <div key={s.id}>{sectionEditors[s.id]}</div>
        ))
      }
    </div>
  )
}
