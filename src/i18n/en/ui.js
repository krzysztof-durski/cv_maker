// English interface text: the app shell, the editor and the wording printed on the CV itself.

export default {
  meta: {
    title: 'CV Maker — Harvard Style',
    description: 'Create a Harvard-style CV online. Free, private, no account needed — your data stays in your browser, with optional AI help using your own API key.',
  },

  lang: {
    label: 'Language',
    names: { en: 'English', pl: 'Polish' }, // language names, written in this language of the interface
  },

  common: {
    close: 'Close',
    done: 'Done',
    show: 'Show',
    hide: 'Hide',
  },

  nav: {
    help: 'Help & guide',
    about: 'About',
    terms: 'Terms',
    privacy: 'Privacy',
    home: 'Home',
    helpShort: 'Help',
    backToEditor: '← Back to editor',
  },

  app: {
    resetConfirm: 'This will permanently delete all your CV data, your saved default CV and any saved AI API key, and cannot be undone. Are you sure?',
    replaceDefaultConfirm: 'Replace your saved default CV with the CV you are editing now?',
    saveDefaultFailed: 'Could not save the default CV: the browser storage is full or blocked.',
    loadDefaultConfirm: 'Replace the CV you are editing with your saved default CV? Your current edits will be lost unless you save a backup first.',
    uploadConfirm: 'This will replace your current CV data with the uploaded file. Continue?',
    uploadInvalid: 'Invalid file — please upload a CV Maker .json backup file.',
    docxFailed: 'Could not generate the Word document. Please try again.',
  },

  header: {
    brand: 'CV Maker',
    tagline: 'Harvard style',
    edit: 'Edit',
    preview: 'Preview',
    undo: 'Undo',
    redo: 'Redo',
    undoHint: 'Ctrl/Cmd+Z',
    redoHint: 'Ctrl/Cmd+Shift+Z',
    ai: 'AI',
    aiTitle: 'Tailor or edit your CV with AI',
    savePdf: 'Save PDF',
    savePdfTitle: 'Print or save your CV as a PDF',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    more: 'More options',
  },

  menu: {
    saveBackup: 'Save backup',
    restoreBackup: 'Restore backup',
    exportDocx: 'Export as Word (.docx)',
    exporting: 'Exporting…',
    aiSettings: 'AI settings & API key',
    saveDefault: 'Save as default CV',
    saveDefaultTitle: 'Keep a copy of this CV to start every tailored version from',
    loadDefault: 'Load default CV',
    savedOn: 'Saved {date}',
    noneSaved: 'None saved yet',
    resetAll: 'Reset all data',
  },

  sections: {
    personal: 'Job title',
    profile: 'Profile',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    languages: 'Languages',
    certifications: 'Certifications & Awards',
    volunteer: 'Volunteer & Extracurriculars',
    custom: 'Custom Section',
  },

  linkTypes: {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    other: 'Other',
  },

  // The wording printed on the CV itself, in the CV's language.
  cv: {
    headings: {
      profile: 'Profile',
      education: 'Education',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Technical Skills',
      languages: 'Languages',
      certifications: 'Certifications & Awards',
      volunteer: 'Volunteer & Extracurriculars',
      custom: 'Custom Section',
    },
    present: 'Present',
    degreeInField: '{degree} in {field}',
  },

  editor: {
    title: 'Editor',
    autoSaved: 'Auto-saved locally',
    resizeHandle: 'Resize editor panel',
    resizeHint: 'Drag to resize · double-click to reset',
  },

  shell: {
    reset: '↺ Reset',
    resetTitle: 'Reset {title}',
    resetConfirm: 'Reset the "{title}" section? All entries will be cleared.',
    showTips: 'Show tips for this section',
    showTipsShort: 'Show tips',
    addEntry: '+ Add entry',
  },

  entry: {
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove entry',
  },

  dates: {
    start: 'Start Date',
    end: 'End Date',
    startPlaceholder: 'Sep 2022',
    endPlaceholder: 'Jun 2026',
    ongoing: 'Currently ongoing',
  },

  bullets: {
    label: 'Bullet Points',
    placeholder: 'Describe your achievement or responsibility...',
    ariaLabel: 'Bullet point {n}',
    remove: 'Remove bullet',
    add: '+ Add bullet',
  },

  sectionManager: {
    title: 'Sections',
    hint: 'Toggle on/off · Drag to reorder',
    drag: 'Drag to reorder',
  },

  template: {
    title: 'Template',
    classic: { label: 'Classic', description: 'Centred name and contact line. Plain and ATS-friendly.' },
    photo: { label: 'With photo', description: 'Photo on the left, name and contact details beside it.' },
    upload: 'Upload photo',
    change: 'Change photo',
    removePhoto: 'Remove',
    reading: 'Reading…',
    noPhoto: 'No photo',
    yourPhoto: 'Your photo',
    photoFile: 'Photo file',
    photoNote: 'Cropped to a square from the middle. Stays in this browser and is never sent to the AI.',
    photoOf: 'Photo of {name}',
    photoAlt: 'Photo',
    cvLanguage: 'CV language',
    cvLanguageHint: 'The language of the headings printed on the CV (Experience, Education…). Your text stays as you wrote it.',
    cvLanguageAuto: 'Same as the app ({language})',
    gender: 'Gender forms in Polish text',
    genderHint: 'Polish verbs change with gender ("założyłem" or "założyłam"). This tells the AI which to use when it writes or translates into Polish. "Detect" takes it from your text and never guesses from your name.',
    genderAuto: 'Detect from my text',
    genderMasculine: 'Masculine (założyłem)',
    genderFeminine: 'Feminine (założyłam)',
  },

  photoErrors: {
    wrongType: 'Please choose a JPG, PNG, WebP or GIF picture.',
    tooLarge: 'That picture is too large. Please choose one under 15 MB.',
    unreadable: "That file couldn't be read as a picture. Try a different one.",
  },

  personal: {
    title: 'Personal Info',
    fullName: 'Full Name',
    fullNamePlaceholder: 'Jane Smith',
    jobTitle: 'Job Title',
    jobTitlePlaceholder: 'Senior Software Engineer',
    phone: 'Phone',
    phonePlaceholder: '+48 000 000 000',
    email: 'Email',
    emailPlaceholder: 'you@email.com',
    location: 'Location',
    locationPlaceholder: 'New York, USA',
    links: 'Links',
    linkUrl: 'Link URL',
    linkUrlPlaceholder: 'https://...',
    linkLabel: 'Link display text',
    linkLabelPlaceholder: 'Display text (optional — defaults to shortened URL)',
    removeLink: 'Remove link',
    addLink: '+ {type}',
    resetConfirm: 'Reset personal info? All fields will be cleared.',
  },

  profile: {
    bio: 'Bio',
    placeholder: 'Backend engineer with 5 years building payment systems at scale. Focused on reliability, developer tooling, and shipping fast without breaking things.',
    characters: { one: '{count} character · aim for 3–5 sentences', other: '{count} characters · aim for 3–5 sentences' },
    resetConfirm: 'Reset your profile bio? This will be cleared.',
    resetTitle: 'Reset Profile',
  },

  fields: {
    location: 'Location',
    locationPlaceholder: 'City, Country',
    education: {
      school: 'School / University',
      schoolPlaceholder: 'University of Example',
      degree: 'Degree',
      degreePlaceholder: "Bachelor's",
      field: 'Field of Study',
      fieldPlaceholder: 'Software Engineering',
      add: '+ Add education',
    },
    experience: {
      title: 'Job Title',
      titlePlaceholder: 'Founder & CEO / Full Stack Engineer',
      company: 'Company',
      companyPlaceholder: 'Acme Corp',
      add: '+ Add experience',
    },
    projects: {
      name: 'Project Name',
      namePlaceholder: 'My Project',
      technologies: 'Technologies',
      technologiesPlaceholder: 'React, Node.js, Supabase',
      description: 'Subtitle / Description',
      descriptionPlaceholder: 'A short description of the project',
      link: 'Link (optional)',
      linkPlaceholder: 'https://...',
      add: '+ Add project',
    },
    skills: {
      category: 'Category',
      categoryPlaceholder: 'Programming Languages',
      items: 'Items (comma-separated)',
      itemsPlaceholder: 'Python, JavaScript, SQL, Java',
      add: '+ Add skill category',
    },
    languages: {
      language: 'Language',
      languagePlaceholder: 'English',
      proficiency: 'Proficiency',
      proficiencyPlaceholder: 'Advanced (C1/C2)',
      add: '+ Add language',
    },
    certifications: {
      name: 'Name',
      namePlaceholder: 'AWS Certified Developer',
      issuer: 'Issuer / Organization',
      issuerPlaceholder: 'Amazon Web Services',
      date: 'Date',
      datePlaceholder: 'Jun 2024',
      description: 'Description (optional)',
      descriptionPlaceholder: 'Brief description...',
      add: '+ Add certification or award',
    },
    volunteer: {
      role: 'Role / Position',
      rolePlaceholder: 'Club President',
      org: 'Organization',
      orgPlaceholder: 'Coding Club',
      add: '+ Add entry',
    },
    custom: {
      sectionTitle: 'Section Title',
      sectionTitlePlaceholder: 'e.g. Publications, Research, Awards...',
      title: 'Title',
      titlePlaceholder: 'Entry title',
      subtitle: 'Subtitle (optional)',
      subtitlePlaceholder: 'Italic subtitle',
      add: '+ Add entry',
      resetConfirm: 'Reset the "Custom Section"? All entries will be cleared.',
      resetTitle: 'Reset Custom Section',
    },
  },

  howTo: {
    title: '? How to use',
    blocks: [
      { heading: 'Getting started', ol: [
        'Fill in your **Personal Info** — name, email, phone, LinkedIn, GitHub, and location.',
        'Use the **Sections** panel to toggle sections on/off and drag to reorder them.',
        'Fill in each enabled section. Use bullet points to describe achievements with numbers and impact.',
        'On a phone, tap **Preview** in the header to check the result as you go.',
      ] },
      { heading: 'Saving your work', ul: [
        'Your CV is **auto-saved** in this browser — it survives page reloads.',
        'Open the **⋯ menu** and click **Save backup** to download a `.json` file you can store safely or use on another device.',
        'Click **Restore backup** to reload a previously saved file.',
      ] },
      { heading: 'Using AI (optional)', ul: [
        'Click **AI** in the header, the **AI** button on a section, or the small ✨ on a single job or project, and add your own OpenAI, Claude or Gemini API key.',
        'Pick a quick prompt or write your own, and optionally paste or attach a job description.',
        'Review the suggested changes, choose what to apply, keep chatting to refine them, and use **Undo** if you change your mind.',
        'The AI can remove duplicates and move entries between sections, and your job title becomes the exact title of the job you tailor for. It never changes contact details, or the employers, schools and dates of existing entries. Always check its wording before you send your CV.',
        'If the AI says it is busy, switch to another model or cancel and send again. See Help for more.',
      ] },
      { heading: 'Exporting as PDF', ul: [
        'Click **Save PDF** in the header.',
        'In the print dialog, choose **Save as PDF** as the destination.',
        'Set margins to **None** — the app handles its own margins.',
      ] },
      { heading: 'Tips', ul: [
        'Each section has a **↺ Reset** button to clear it individually.',
        'Use the sun / moon button to switch to dark mode.',
        'On desktop, drag the bar between the editor and the preview to make the editor wider.',
        'The **Template** card switches to a header with your photo.',
        'Date fields accept any text — e.g. "Present", "Expected Jun 2027".',
        'The language switch (EN / PL) changes the app. The CV language setting changes the headings on the CV.',
      ] },
    ],
  },

  tips: {
    personal: {
      intro: 'Your contact header — the first thing a recruiter sees. Keep it clean and accurate.',
      items: [
        'Use your full legal name as it appears on official documents.',
        'Include your country code in the phone number (e.g. +48 123 456 789).',
        'Add links using the quick-add buttons — LinkedIn, GitHub, Portfolio, etc.',
        'You can paste full URLs (https://...) or just the path — both work.',
        'Location is city and country only — never your full street address.',
        'Only include links that are up to date and professional.',
      ],
    },
    profile: {
      intro: 'A short bio at the top of your CV — 2–4 sentences summarizing who you are and what you bring.',
      items: [
        'Lead with your role or field, then your strongest 1–2 achievements or areas of expertise.',
        'Write in the third person without a pronoun, or first person without "I" — e.g. "Backend engineer with 5 years building payment systems."',
        'Keep it to 3–5 sentences. This is a hook, not a cover letter.',
        'Tailor it to the role you are applying for — mention the domain or stack if relevant.',
        'Skip generic filler like "hard-working team player" — let the Experience section prove that instead.',
      ],
    },
    education: {
      intro: 'List your degrees in reverse chronological order (most recent first).',
      items: [
        'Include GPA only if it is 3.5 / 4.0 or higher.',
        'Use bullets for relevant coursework, honours, thesis title, or academic achievements.',
        'If you have a degree, you do not need to list your high school.',
        'For ongoing studies, set the end date to "Present" using the checkbox.',
        'Field of study should match what appears on your transcript.',
      ],
    },
    experience: {
      intro: 'Your most impactful section. Focus on achievements, not duties.',
      items: [
        'List roles in reverse chronological order (most recent first).',
        'Start every bullet with a strong past-tense action verb: Built, Designed, Reduced, Led, Shipped.',
        'Quantify impact wherever possible — percentages, dollar amounts, user counts, time saved.',
        'Avoid vague phrases like "assisted with" or "was responsible for".',
        'Aim for 2–4 bullets per role. Quality beats quantity.',
      ],
    },
    projects: {
      intro: 'Showcase side projects, open-source work, or academic projects that demonstrate real skills.',
      items: [
        'Include a GitHub or live demo link if the project is public.',
        'List the main technologies in the Technologies field — recruiters scan these.',
        'Description is a one-liner that goes in the header (e.g. "Open-source grading platform used by 3 universities").',
        'Use bullets to explain what you built, why it was hard, and what the outcome was.',
        'Projects with real users, stars, or contributors stand out significantly.',
      ],
    },
    skills: {
      intro: 'A quick-scan section for technical skills. Recruiters and ATS systems both read this.',
      items: [
        'Group skills into categories — e.g. Languages, Frameworks, Databases, Tools.',
        'Only list skills you could discuss confidently in an interview.',
        'Do not use rating bars or levels (Beginner / Expert) — they are subjective and waste space.',
        'List the most relevant skills first within each category.',
        'Keep it concise — 4–6 categories maximum.',
      ],
    },
    languages: {
      intro: 'Human languages you speak — not programming languages (those go in Skills).',
      items: [
        'Use standard proficiency levels: Native, Fluent, Advanced (C1), Upper-Intermediate (B2), Intermediate (B1), Beginner (A1/A2).',
        'Only include languages you could actually use in a professional setting.',
        'Native language is usually obvious from context, but still worth listing.',
      ],
    },
    certifications: {
      intro: 'Formal certifications, licences, and notable awards or competition wins.',
      items: [
        'Include the issuing organisation and the date obtained.',
        'For competition wins, add context in the description — number of participants, what you built.',
        'List only certifications that are current and relevant. Expired certs can be omitted.',
        'AWS, GCP, Azure certs are highly valued for engineering roles.',
        'You can use this section for hackathon placements, scholarships, or honours.',
      ],
    },
    volunteer: {
      intro: 'Volunteer work and community involvement. Treat it like experience — use action verbs and numbers.',
      items: [
        'Especially valuable if you are a recent graduate with limited work experience.',
        'Quantify your impact: number of people taught, events organised, funds raised.',
        'Include the organisation name, your role, and the dates.',
        'Leadership roles (team lead, instructor, organiser) stand out most.',
      ],
    },
    custom: {
      intro: 'A fully flexible section — use it for publications, research, patents, exhibitions, or anything that does not fit elsewhere.',
      items: [
        'Change the section title to something specific: "Publications", "Research", "Awards", "Conferences".',
        'The subtitle field is ideal for a journal name, conference, or co-authors.',
        'Keep bullet points concise — one strong sentence per point is usually enough.',
        'For academic CVs, list publications in a standard citation format in the subtitle.',
      ],
    },
  },

  zoom: { out: 'Zoom out', in: 'Zoom in', reset: 'Reset zoom' },
}
