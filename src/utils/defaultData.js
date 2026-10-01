export const SECTION_LABELS = {
  profile: 'Profile',
  education: 'Education',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
  languages: 'Languages',
  certifications: 'Certifications & Awards',
  volunteer: 'Volunteer & Extracurriculars',
  custom: 'Custom Section',
}

export const LINK_TYPES = {
  linkedin:  'LinkedIn',
  github:    'GitHub',
  portfolio: 'Portfolio',
  other:     'Other',
}

export const DEFAULT_DATA = {
  personal: {
    name: '',
    jobTitle: '',
    phone: '',
    email: '',
    location: '',
    links: [],
  },
  sectionOrder: [
    { id: 'profile', enabled: true },
    { id: 'education', enabled: true },
    { id: 'experience', enabled: true },
    { id: 'projects', enabled: true },
    { id: 'skills', enabled: true },
    { id: 'languages', enabled: false },
    { id: 'certifications', enabled: false },
    { id: 'volunteer', enabled: false },
    { id: 'custom', enabled: false },
  ],
  profile: {
    text: '',
  },
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

function migratePersonal(p = {}) {
  if (Array.isArray(p.links)) {
    return { ...DEFAULT_DATA.personal, ...p }
  }
  // migrate old linkedin/github string fields → links array
  const links = []
  if (p.linkedin) links.push({ id: 'link-li', type: 'linkedin', url: p.linkedin })
  if (p.github)   links.push({ id: 'link-gh', type: 'github',   url: p.github })
  return {
    name:     p.name     || '',
    jobTitle: p.jobTitle || '',
    phone:    p.phone    || '',
    email:    p.email    || '',
    location: p.location || '',
    links,
  }
}

function migrateSectionOrder(stored) {
  const order = stored || DEFAULT_DATA.sectionOrder
  const known = new Set(order.map(s => s.id))
  // append any section types introduced after this CV was first saved (e.g. "profile")
  const missing = DEFAULT_DATA.sectionOrder.filter(s => !known.has(s.id))
  return [...order, ...missing]
}

export function mergeWithDefaults(stored) {
  return {
    ...DEFAULT_DATA,
    ...stored,
    personal: migratePersonal(stored.personal),
    profile: { ...DEFAULT_DATA.profile, ...(stored.profile || {}) },
    sectionOrder: migrateSectionOrder(stored.sectionOrder),
    custom: {
      ...DEFAULT_DATA.custom,
      ...(stored.custom || {}),
      entries: stored.custom?.entries || DEFAULT_DATA.custom.entries,
    },
  }
}
