export const SECTION_HELP = {
  personal: {
    intro: 'Your contact header — the first thing a recruiter sees. Keep it clean and accurate.',
    tips: [
      'Use your full legal name as it appears on official documents.',
      'Include your country code in the phone number (e.g. +48 123 456 789).',
      'Add links using the quick-add buttons — LinkedIn, GitHub, Portfolio, etc.',
      'You can paste full URLs (https://...) or just the path — both work.',
      'Location is city and country only — never your full street address.',
      'Only include links that are up to date and professional.',
    ],
  },
  education: {
    intro: 'List your degrees in reverse chronological order (most recent first).',
    tips: [
      'Include GPA only if it is 3.5 / 4.0 or higher.',
      'Use bullets for relevant coursework, honours, thesis title, or academic achievements.',
      'If you have a degree, you do not need to list your high school.',
      'For ongoing studies, set the end date to "Present" using the checkbox.',
      'Field of study should match what appears on your transcript.',
    ],
  },
  experience: {
    intro: 'Your most impactful section. Focus on achievements, not duties.',
    tips: [
      'List roles in reverse chronological order (most recent first).',
      'Start every bullet with a strong past-tense action verb: Built, Designed, Reduced, Led, Shipped.',
      'Quantify impact wherever possible — percentages, dollar amounts, user counts, time saved.',
      'Avoid vague phrases like "assisted with" or "was responsible for".',
      'Aim for 2–4 bullets per role. Quality beats quantity.',
    ],
  },
  projects: {
    intro: 'Showcase side projects, open-source work, or academic projects that demonstrate real skills.',
    tips: [
      'Include a GitHub or live demo link if the project is public.',
      'List the main technologies in the Technologies field — recruiters scan these.',
      'Description is a one-liner that goes in the header (e.g. "Open-source grading platform used by 3 universities").',
      'Use bullets to explain what you built, why it was hard, and what the outcome was.',
      'Projects with real users, stars, or contributors stand out significantly.',
    ],
  },
  skills: {
    intro: 'A quick-scan section for technical skills. Recruiters and ATS systems both read this.',
    tips: [
      'Group skills into categories — e.g. Languages, Frameworks, Databases, Tools.',
      'Only list skills you could discuss confidently in an interview.',
      'Do not use rating bars or levels (Beginner / Expert) — they are subjective and waste space.',
      'List the most relevant skills first within each category.',
      'Keep it concise — 4–6 categories maximum.',
    ],
  },
  languages: {
    intro: 'Human languages you speak — not programming languages (those go in Skills).',
    tips: [
      'Use standard proficiency levels: Native, Fluent, Advanced (C1), Upper-Intermediate (B2), Intermediate (B1), Beginner (A1/A2).',
      'Only include languages you could actually use in a professional setting.',
      'Native language is usually obvious from context, but still worth listing.',
    ],
  },
  certifications: {
    intro: 'Formal certifications, licences, and notable awards or competition wins.',
    tips: [
      'Include the issuing organisation and the date obtained.',
      'For competition wins, add context in the description — number of participants, what you built.',
      'List only certifications that are current and relevant. Expired certs can be omitted.',
      'AWS, GCP, Azure certs are highly valued for engineering roles.',
      'You can use this section for hackathon placements, scholarships, or honours.',
    ],
  },
  volunteer: {
    intro: 'Volunteer work and community involvement. Treat it like experience — use action verbs and numbers.',
    tips: [
      'Especially valuable if you are a recent graduate with limited work experience.',
      'Quantify your impact: number of people taught, events organised, funds raised.',
      'Include the organisation name, your role, and the dates.',
      'Leadership roles (team lead, instructor, organiser) stand out most.',
    ],
  },
  custom: {
    intro: 'A fully flexible section — use it for publications, research, patents, exhibitions, or anything that does not fit elsewhere.',
    tips: [
      'Change the section title to something specific: "Publications", "Research", "Awards", "Conferences".',
      'The subtitle field is ideal for a journal name, conference, or co-authors.',
      'Keep bullet points concise — one strong sentence per point is usually enough.',
      'For academic CVs, list publications in a standard citation format in the subtitle.',
    ],
  },
}
