export const SECTION_LABELS = {
  education: 'Education',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  languages: 'Languages',
  certifications: 'Certifications & Awards',
  volunteer: 'Volunteer & Extracurriculars',
  custom: 'Custom Section',
}

export const DEFAULT_DATA = {
  personal: {
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    location: '',
  },
  sectionOrder: [
    { id: 'education', enabled: true },
    { id: 'experience', enabled: true },
    { id: 'projects', enabled: true },
    { id: 'skills', enabled: true },
    { id: 'languages', enabled: false },
    { id: 'certifications', enabled: false },
    { id: 'volunteer', enabled: false },
    { id: 'custom', enabled: false },
  ],
  education: [
    { id: 'edu-1', school: '', degree: '', field: '', location: '', startDate: '', endDate: '', bullets: [] },
  ],
  experience: [
    { id: 'exp-1', title: '', company: '', location: '', startDate: '', endDate: '', bullets: [] },
  ],
  projects: [
    { id: 'proj-1', name: '', technologies: '', startDate: '', endDate: '', link: '', description: '', bullets: [] },
  ],
  skills: [
    { id: 'skill-1', category: '', items: '' },
  ],
  languages: [
    { id: 'lang-1', language: '', proficiency: '' },
  ],
  certifications: [
    { id: 'cert-1', name: '', issuer: '', date: '', description: '' },
  ],
  volunteer: [
    { id: 'vol-1', role: '', org: '', location: '', startDate: '', endDate: '', bullets: [] },
  ],
  custom: {
    title: '',
    entries: [
      { id: 'cust-1', title: '', subtitle: '', startDate: '', endDate: '', bullets: [] },
    ],
  },
}

export function mergeWithDefaults(stored) {
  return {
    ...DEFAULT_DATA,
    ...stored,
    personal: { ...DEFAULT_DATA.personal, ...(stored.personal || {}) },
    sectionOrder: stored.sectionOrder || DEFAULT_DATA.sectionOrder,
    custom: {
      ...DEFAULT_DATA.custom,
      ...(stored.custom || {}),
      entries: stored.custom?.entries || DEFAULT_DATA.custom.entries,
    },
  }
}
