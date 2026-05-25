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
    <div className="no-print w-1/2 overflow-y-auto p-4 border-r border-gray-200 bg-gray-50">
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
