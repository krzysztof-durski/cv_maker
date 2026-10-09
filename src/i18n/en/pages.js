// English text of the standalone pages. Each page is a list of sections; a section is a title and blocks.
// A block has exactly one key: p (paragraph), note (small grey text), lead (emphasised paragraph),
// ol / ul (lists), or component. Inline markup: **bold**, *italic*, `code`, [text](link).

export default {
  pages: {
    updatedLabel: 'Last updated',
    help: {
      title: 'Help & How to Use',
      subtitle: 'Everything you need to know to build a great CV.',
      sections: [
        { title: 'Getting started', blocks: [{ ol: [
          'Fill in your **Personal Info** — name, email, phone, LinkedIn, GitHub, and location.',
          'Use the **Sections** panel to toggle sections on/off and drag to reorder them.',
          'Fill in each enabled section. Click the **?** button on any section header for specific tips.',
          'On desktop the live preview updates beside the editor; on a phone, switch to the **Preview** tab to see it.',
        ] }] },
        { title: 'Language', blocks: [
          { p: 'Use the **EN / PL** switch in the header to change the language of the app. The first time you visit, the app follows your browser\'s language.' },
          { p: 'The **CV language** setting in the Template card is separate: it sets the language of the headings printed on the CV (Experience, Education, "Present"…) in the preview, the PDF and the Word file. By default it follows the app, but you can use the app in Polish and still print an English CV, or the other way round.' },
          { note: 'The text you write is never translated automatically. To translate it, use the **Translate** quick prompt in the AI assistant.' },
          { p: 'When the AI writes or translates into Polish, it describes your work in the first person ("Founded and developed X" becomes "Założyłem i rozwijałem X"). Polish verbs change with gender, so choose **Gender forms in Polish text** in the Template card: masculine ("założyłem"), feminine ("założyłam"), or *Detect from my text*, which takes the forms from what you already wrote and never guesses from your name.' },
        ] },
        { title: 'Saving your work', blocks: [{ ul: [
          'Your CV is **auto-saved** in this browser — it survives page reloads and browser restarts.',
          'Open the **⋯ menu** in the header and choose **Save backup** to download a `.json` file you can keep safely or move to another device.',
          'Choose **Restore backup** to reload a previously saved file — useful when switching devices or browsers.',
        ] }] },
        { title: 'Undo and redo', blocks: [{ p: 'Use the **back and forward arrows** in the header (or **Ctrl/Cmd+Z** and **Ctrl/Cmd+Shift+Z** when you are not typing in a field) to step through your changes, including AI changes, restoring a backup and loading your default CV. Typing is grouped, so one step undoes a burst of typing rather than a single letter. The history lasts until you close or reload the page.' }] },
        { title: 'A default CV for tailored versions', blocks: [
          { p: 'Keep one complete, general CV and tailor a copy for each job. Open the **⋯ menu** and choose **Save as default CV** to store the CV you are editing as your default. Whenever you start a new application, choose **Load default CV** to bring it back, then tailor it by hand or with the AI assistant. Tailoring never changes the saved default; saving again replaces it.' },
          { note: 'Like everything else it is stored only in this browser. Use **Save backup** to keep a copy of the current CV as a file; the default is not included in backups.' },
        ] },
        { title: 'Exporting as PDF', blocks: [
          { ol: [
            'Click **Save PDF** in the header.',
            'In the print dialog, set the destination to **Save as PDF**.',
            'Set margins to **None** — the app handles its own margins internally.',
            'Click Save. The result is a clean, properly formatted A4 PDF.',
          ] },
          { note: 'Tip: use Chrome or Edge for best PDF output. Safari may render fonts slightly differently.' },
        ] },
        { title: 'Exporting as Word (.docx)', blocks: [{ p: 'Prefer to edit in Microsoft Word or Google Docs? Open the ⋯ menu and choose **Export as Word (.docx)**. It builds a Harvard-style `.docx` file with the same layout, fonts, and sections as the preview — open it directly in Word, or upload it to Google Drive and open with Google Docs. Generated entirely in your browser, just like the PDF.' }] },
        { title: 'Section tips', blocks: [{ p: 'Each section in the editor has a small **?** button in its header. Click it to see section-specific advice — what to include, how to phrase things, and what recruiters actually look for.' }] },
        { title: 'Using AI to tailor and edit your CV (optional)', blocks: [
          { p: 'You can use your own OpenAI (ChatGPT), Anthropic (Claude), or Google (Gemini) account to rewrite parts of your CV or tailor it to a specific job. It is entirely optional and does nothing until you add a key.' },
          { ol: [
            'Click **AI** in the header, the **AI** button on a section, or the small **✨** button on a single job, project or other entry, and choose **Add API key**.',
            'Pick a provider, paste your key from that provider\'s dashboard, and press **Test key & load models**. Choose a model.',
            'Choose what the AI should work on (the whole CV, one section, or one job or project), then pick a **quick prompt** such as "Tailor to this job", or write your own instruction. You can paste a job description or attach one as a PDF, Word, text, or HTML file.',
            'Press **Get suggestions**, then tick the changes you want. Nothing changes until you press **Apply**, and an **Undo** button appears afterwards.',
          ] },
          { ul: [
            'Your key stays in your browser and is sent only to the provider you picked. By default it is forgotten when you close the tab; tick **Remember my key on this device** to keep it (not on shared computers).',
            'The provider charges usage to your own account. A full-CV request is usually small, but check your provider\'s pricing.',
            'The AI can rewrite and reorder text, **remove duplicate entries**, and **move an entry to the right section**. It cannot change your contact details, or the employer, school, dates or links of an existing entry. Anything new it adds is flagged for you to check.',
            'When you tailor to a job, your **job title becomes the role\'s exact title** from the job description (or from what you wrote). The AI can\'t invent a different one.',
            'Each change has its own checkbox, so you can accept a rewrite but decline a removal. A move between sections is accepted or declined as a whole.',
            'After the first answer you can **keep chatting**: ask why something changed, or tell it what to adjust (for example "shorten the Initech bullets"). Your suggestions stay on screen, you can close the window and come back, and a failed message never loses them. Changes you untick are dropped when you send your next message.',
            'Numbers or employers that the AI introduces and that aren\'t in your CV or what you provided are flagged with a warning. Always check the wording is true before you apply it.',
            'The AI replies to you in the language of the app, and keeps your CV text in the language you wrote it in.',
          ] },
        ] },
        { title: 'If the AI says it is busy or having trouble', blocks: [
          { p: 'Messages such as *"Google is busy right now"* or *"The model is overloaded"* mean the provider cannot take your request at that moment. It is not a problem with your key or your CV.' },
          { component: 'busyAdvice' },
          { note: 'Errors about your **key** or **quota** are different: those need a new key or more credit in your provider\'s dashboard, and retrying will not help.' },
        ] },
        { title: 'Templates and a photo', blocks: [
          { p: 'The **Template** card at the top of the editor switches the header layout. **Classic** is the plain centred header. **With photo** puts your picture on the left with your name and contact details beside it; choose **Upload photo** and the picture is cropped to a square from its middle. The same layout is used for the PDF and the Word export.' },
          { note: 'The photo stays in this browser, is included in your backup file, and is never sent to an AI provider. Many employers (and ATS software) prefer CVs without a photo, so check what is usual for the country and role.' },
        ] },
        { title: 'Making room to type', blocks: [{ p: 'On a desktop screen, drag the thin bar between the editor and the preview to make the editor wider (double-click it to restore the default). With the bar focused you can also use the left and right arrow keys. Text boxes grow as you type, so you always see everything you have written.' }] },
        { title: 'Other features', blocks: [{ ul: [
          '**↺ Reset** on any section header clears that section only, with a confirmation prompt.',
          '**Reset all data** in the ⋯ menu clears your entire CV after confirmation — irreversible.',
          'The **sun / moon** button toggles dark mode. Your preference is remembered.',
          'Use the zoom controls in the preview\'s bottom-right corner to inspect details or fit more on screen.',
          'Date fields accept any text — try "Present", "Expected Jun 2027", or just "2023".',
          'The **Custom** section can be renamed — useful for Publications, Research, Awards, etc.',
        ] }] },
        { title: 'Writing great bullet points', blocks: [{ ul: [
          'Start with a strong past-tense action verb: *Built, Reduced, Led, Shipped, Designed, Grew.*',
          'Follow the formula: **Action + what + result**. E.g. "Reduced API latency by 40% by caching frequently queried endpoints."',
          'Quantify everything you can — percentages, user counts, time saved, revenue generated.',
          'Aim for 2–4 bullets per role or project. Quality beats quantity.',
          'Avoid vague filler like "was responsible for" or "assisted with".',
        ] }] },
        { title: 'Still need help?', divider: true, blocks: [{ p: 'If something is not working or you have a suggestion, reach out at [contact@codepapa.xyz](mailto:contact@codepapa.xyz). I read every message.' }] },
      ],
    },

    about: {
      title: 'About this project',
      subtitle: 'Built out of frustration. Kept free out of principle.',
      sections: [
        { title: 'The problem', blocks: [
          { p: 'You\'ve probably been there. You spend 45 minutes carefully filling out your CV on one of those "free" CV builder sites — formatting it, tweaking bullet points, picking the right layout. It looks great. You hit **Download**.' },
          { p: 'And then: *"Upgrade to Premium to export your CV — from $9.99/month."*' },
          { p: 'Your data is held hostage. The whole thing was a funnel. I\'ve been there more than once, and every time it felt like a bait-and-switch. You wasted your time, and now you either pay up or start over somewhere else.' },
        ] },
        { title: 'Why I built this', blocks: [
          { p: 'I\'m [Krzysztof Durski](https://codepapa.xyz), and I built CV Maker because I was tired of it. A CV builder is not a complicated product. It doesn\'t need a backend. It doesn\'t need an account. It doesn\'t need your credit card.' },
          { p: 'So I made one that runs entirely in your browser, saves your data locally, and lets you export to PDF for free — always — using the print function that\'s already built into every browser on the planet.' },
          { p: 'No accounts. No subscriptions. No "premium" tier. No tricks.' },
        ] },
        { title: 'What makes it different', blocks: [{ ul: [
          '**Truly free.** Export to PDF as many times as you want. No paywall, ever.',
          '**Your data stays yours.** Everything is stored in your browser\'s localStorage. Nothing is sent to any server of ours.',
          '**Bring your own AI.** Optionally tailor and edit your CV with your own OpenAI, Claude, or Gemini key. It talks directly from your browser to the provider you choose, and you review every change before it\'s applied.',
          '**No account required.** Open the page and start typing.',
          '**Harvard style.** Clean, professional, widely accepted format used by top universities and employers.',
          '**English and Polish.** Switch the app between the two, and print your CV with English or Polish headings.',
          '**Backup and restore.** Download your CV data as a JSON file and restore it on any device or browser.',
          '**Open and honest.** No dark patterns, no hidden charges, no upsells.',
        ] }] },
        { title: 'The tech', blocks: [{ p: 'Built with React, Vite, and Tailwind CSS. Hosted on Cloudflare Pages. The PDF export uses your browser\'s native print dialog — no third-party libraries, no server-side rendering, no watermarks.' }] },
        { divider: true, blocks: [{ note: 'If this saved you from yet another paywall, I\'m glad. If you want to see more projects like this, visit [codepapa.xyz](https://codepapa.xyz).' }] },
      ],
    },

    terms: {
      title: 'Terms of Service',
      updated: 'October 2026',
      sections: [
        { title: '1. About This Service', blocks: [{ p: 'CV Maker is a free, browser-based tool that lets you create Harvard-style CVs. There are no accounts, no subscriptions, and no servers of ours involved — everything runs in your browser. An optional AI assistant can call an AI provider of your choice directly from your browser (see section 3).' }] },
        { title: '2. Your Data', blocks: [{ p: 'All CV data you enter is stored exclusively in your browser\'s `localStorage`. We never receive it, store it in any database, or share it with any third party. The only way any of it leaves your browser is if you choose to use the optional AI assistant. Clearing your browser data or storage will permanently delete your CV.' }] },
        { title: '3. Optional AI Assistant', blocks: [
          { p: 'The AI assistant works only with an API key that you provide from OpenAI, Anthropic, or Google. When you use it, your browser sends the relevant parts of your CV and anything you attach straight to that provider. By using it you agree that:' },
          { ul: [
            'you are responsible for your API key, for any charges on your provider account, and for following that provider\'s terms;',
            'AI output can be wrong, invented, or badly worded — you must review every suggestion before you apply it and before you send your CV to anyone;',
            'you will not use it to invent qualifications, employers, dates, or any other facts about yourself;',
            'you will not send other people\'s personal information unless you have the right to do so;',
            'we do not control, and are not responsible for, how the provider handles the data you send.',
          ] },
        ] },
        { title: '4. No Warranty', blocks: [{ p: 'This tool is provided "as is", without warranty of any kind. We make no guarantees that the service will be uninterrupted, error-free, or that your stored data will be preserved across browser updates or device changes. Always keep a copy of your CV data elsewhere.' }] },
        { title: '5. Acceptable Use', blocks: [
          { p: 'You may use CV Maker to create and export your own CV for personal, academic, or professional purposes. You must not use this tool to:' },
          { ul: [
            'Fabricate or misrepresent your qualifications, credentials, or experience',
            'Create fraudulent documents intended to deceive employers or institutions',
            'Impersonate another person',
          ] },
          { p: 'You are solely responsible for the accuracy and legality of the content you produce.' },
        ] },
        { title: '6. Intellectual Property', blocks: [{ p: 'The CV content you create is entirely yours. We claim no ownership over anything you write. The CV Maker application code and design are © {year} Krzysztof Durski, all rights reserved.' }] },
        { title: '7. Changes to Terms', blocks: [{ p: 'We may update these terms occasionally. Continued use of the service after changes constitutes acceptance of the updated terms.' }] },
      ],
    },

    privacy: {
      title: 'Privacy Policy',
      updated: 'October 2026',
      sections: [
        { title: 'The Short Version', blocks: [{ lead: 'We collect absolutely nothing. Your data stays in your browser — unless you choose to use the optional AI assistant, in which case the text you send goes straight from your browser to the AI provider you picked, never through us.' }] },
        { title: '1. No Data Collection', blocks: [{ p: 'CV Maker does not collect, store, transmit, or process any personal data. There are no analytics scripts, no tracking pixels, no error reporting services, and no third-party integrations on our side. The app is a static site with no backend. The only exception is the optional AI assistant, which you control and which is described in section 5.' }] },
        { title: '2. Local Storage', blocks: [
          { p: 'Your CV data is saved in your browser\'s `localStorage` under the key `cv_maker_data`. This storage is local to your device and browser — it is not a cookie, it is not synced, and it cannot be read by anyone other than you on your device.' },
          { p: 'If you add a photo, a small square copy of it is stored inside your CV data, so it is part of your backup file too. It is never uploaded anywhere and never sent to an AI provider. The width you give the editor panel is kept under `cv_maker_editor_width`, and your language choice under `cv_maker_language`.' },
          { p: 'If you save a default CV, a copy is kept in the same way under `cv_maker_master`.' },
          { p: 'If you use the AI assistant, your chosen provider, model and API key are kept under separate keys starting with `cv_maker_ai_`. By default the key lives in `sessionStorage` and is forgotten when you close the tab; it is saved in `localStorage` only if you tick "Remember my key on this device". These settings are never included in backup files.' },
        ] },
        { title: '3. No Cookies', blocks: [{ p: 'We do not set any cookies. `localStorage` is not a cookie — it is a browser storage mechanism that persists until you clear it. It does not expire automatically and is not sent to any server with requests.' }] },
        { title: '4. Analytics', blocks: [{ p: 'This site uses **Cloudflare Web Analytics** to count page visits and understand general usage (e.g. number of visitors, countries, device types). Cloudflare Web Analytics is cookieless and does not track individuals, build profiles, or share data with advertisers. No personal information is collected. See [Cloudflare\'s privacy policy](https://www.cloudflare.com/privacypolicy/) for details.' }] },
        { title: '5. Optional AI Assistant', blocks: [
          { p: 'The AI assistant is off until you add your own API key from OpenAI, Anthropic, or Google. When you ask it for suggestions, your browser sends the following directly to the provider you selected, using your key:' },
          { ul: [
            'the CV sections relevant to your request (your contact details and photo are not included),',
            'your instruction (and, in a longer conversation, your earlier messages and the AI\'s replies), and',
            'any job description or file text you pasted or attached.',
          ] },
          { p: 'This traffic does not pass through any server of ours; we never see your key, your CV, or the AI\'s answer. The provider handles that data under its own terms and privacy policy ([OpenAI](https://openai.com/policies/privacy-policy), [Anthropic](https://www.anthropic.com/legal/privacy), [Google](https://policies.google.com/privacy)), and usage is billed to your own account. Attached files are read in your browser; only their text is sent. Don\'t use the assistant if you are not comfortable sharing that content with the provider.' },
        ] },
        { title: '6. How to Delete Your Data', blocks: [
          { p: 'You can delete all your CV data at any time in three ways:' },
          { ul: [
            '**Reset button:** Click "Reset all data" in the app header menu and confirm the dialog. This immediately clears all data, including any saved AI API key, and resets the form.',
            '**AI key only:** Open "AI settings & API key" in the header menu and choose "Remove key".',
            '**Browser DevTools:** Open DevTools → Application tab → Local Storage → select this site → delete the `cv_maker_data` and `cv_maker_master` keys and any keys starting with `cv_maker_ai_`.',
            '**Browser settings:** Clear site data for this domain in your browser\'s privacy/security settings.',
          ] },
        ] },
        { title: '7. Hosting', blocks: [{ p: 'This site is hosted on Cloudflare Pages. Cloudflare may log standard server access logs (IP address, request path, timestamps) as part of their infrastructure. We do not have access to or control over these logs. Please refer to Cloudflare\'s own privacy policy for details on their data handling.' }] },
      ],
    },
  },
}
