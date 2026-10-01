import PageShell from '../components/PageShell'

export default function HelpPage() {
  return (
    <PageShell
      title="Help & How to Use"
      subtitle="Everything you need to know to build a great CV."
    >
      <section>
        <h2>Getting started</h2>
        <ol>
          <li>Fill in your <strong>Personal Info</strong> — name, email, phone, LinkedIn, GitHub, and location.</li>
          <li>Use the <strong>Sections</strong> panel to toggle sections on/off and drag to reorder them.</li>
          <li>Fill in each enabled section. Click the <strong>?</strong> button on any section header for specific tips.</li>
          <li>On desktop the live preview updates beside the editor; on a phone, switch to the <strong>Preview</strong> tab to see it.</li>
        </ol>
      </section>

      <section>
        <h2>Saving your work</h2>
        <ul>
          <li>Your CV is <strong>auto-saved</strong> in this browser — it survives page reloads and browser restarts.</li>
          <li>Open the <strong>⋯ menu</strong> in the header and choose <strong>Save backup</strong> to download a <code>.json</code> file you can keep safely or move to another device.</li>
          <li>Choose <strong>Restore backup</strong> to reload a previously saved file — useful when switching devices or browsers.</li>
        </ul>
      </section>

      <section>
        <h2>Undo and redo</h2>
        <p>
          Use the <strong>back and forward arrows</strong> in the header (or <strong>Ctrl/Cmd+Z</strong> and
          <strong> Ctrl/Cmd+Shift+Z</strong> when you are not typing in a field) to step through your changes, including
          AI changes, restoring a backup and loading your default CV. Typing is grouped, so one step undoes a burst of
          typing rather than a single letter. The history lasts until you close or reload the page.
        </p>
      </section>

      <section>
        <h2>A default CV for tailored versions</h2>
        <p>
          Keep one complete, general CV and tailor a copy for each job. Open the <strong>⋯ menu</strong> and choose
          <strong> Save as default CV</strong> to store the CV you are editing as your default. Whenever you start a new
          application, choose <strong>Load default CV</strong> to bring it back, then tailor it by hand or with the AI
          assistant. Tailoring never changes the saved default; saving again replaces it.
        </p>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Like everything else it is stored only in this browser. Use <strong>Save backup</strong> to keep a copy of the current
          CV as a file; the default is not included in backups.
        </p>
      </section>

      <section>
        <h2>Exporting as PDF</h2>
        <ol>
          <li>Click <strong>Save PDF</strong> in the header.</li>
          <li>In the print dialog, set the destination to <strong>Save as PDF</strong>.</li>
          <li>Set margins to <strong>None</strong> — the app handles its own margins internally.</li>
          <li>Click Save. The result is a clean, properly formatted A4 PDF.</li>
        </ol>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Tip: use Chrome or Edge for best PDF output. Safari may render fonts slightly differently.
        </p>
      </section>

      <section>
        <h2>Exporting as Word (.docx)</h2>
        <p>
          Prefer to edit in Microsoft Word or Google Docs? Open the ⋯ menu and choose{' '}
          <strong>Export as Word (.docx)</strong>. It builds a Harvard-style <code>.docx</code> file with the same
          layout, fonts, and sections as the preview — open it directly in Word, or upload it to Google Drive and
          open with Google Docs. Generated entirely in your browser, just like the PDF.
        </p>
      </section>

      <section>
        <h2>Section tips</h2>
        <p>
          Each section in the editor has a small <strong>?</strong> button in its header. Click it to see section-specific
          advice — what to include, how to phrase things, and what recruiters actually look for.
        </p>
      </section>

      <section>
        <h2>Using AI to tailor and edit your CV (optional)</h2>
        <p>
          You can use your own OpenAI (ChatGPT), Anthropic (Claude), or Google (Gemini) account to rewrite parts of your
          CV or tailor it to a specific job. It is entirely optional and does nothing until you add a key.
        </p>
        <ol className="mt-3">
          <li>Click <strong>AI</strong> in the header, the <strong>AI</strong> button on a section, or the small <strong>✨</strong> button on a single job, project or other entry, and choose <strong>Add API key</strong>.</li>
          <li>Pick a provider, paste your key from that provider's dashboard, and press <strong>Test key &amp; load models</strong>. Choose a model.</li>
          <li>Choose what the AI should work on (the whole CV, one section, or one job or project), then pick a <strong>quick prompt</strong> such as "Tailor to this job", or write your own instruction. You can paste a job description or attach one as a PDF, Word, text, or HTML file.</li>
          <li>Press <strong>Get suggestions</strong>, then tick the changes you want. Nothing changes until you press <strong>Apply</strong>, and an <strong>Undo</strong> button appears afterwards.</li>
        </ol>
        <ul className="mt-3">
          <li>Your key stays in your browser and is sent only to the provider you picked. By default it is forgotten when you close the tab; tick <strong>Remember my key on this device</strong> to keep it (not on shared computers).</li>
          <li>The provider charges usage to your own account. A full-CV request is usually small, but check your provider's pricing.</li>
          <li>The AI can rewrite and reorder text, <strong>remove duplicate entries</strong>, and <strong>move an entry to the right section</strong>. It cannot change your contact details, or the employer, school, dates or links of an existing entry. Anything new it adds is flagged for you to check.</li>
          <li>When you tailor to a job, your <strong>job title becomes the role's exact title</strong> from the job description (or from what you wrote). The AI can't invent a different one.</li>
          <li>Each change has its own checkbox, so you can accept a rewrite but decline a removal. A move between sections is accepted or declined as a whole.</li>
          <li>After the first answer you can <strong>keep chatting</strong>: ask why something changed, or tell it what to adjust (for example "shorten the Initech bullets"). Your suggestions stay on screen, you can close the window and come back, and a failed message never loses them. Changes you untick are dropped when you send your next message.</li>
          <li>Numbers or employers that the AI introduces and that aren't in your CV or what you provided are flagged with a warning. Always check the wording is true before you apply it.</li>
        </ul>
      </section>

      <section>
        <h2>Other features</h2>
        <ul>
          <li><strong>↺ Reset</strong> on any section header clears that section only, with a confirmation prompt.</li>
          <li><strong>Reset all data</strong> in the ⋯ menu clears your entire CV after confirmation — irreversible.</li>
          <li>The <strong>sun / moon</strong> button toggles dark mode. Your preference is remembered.</li>
          <li>Use the zoom controls in the preview's bottom-right corner to inspect details or fit more on screen.</li>
          <li>Date fields accept any text — try "Present", "Expected Jun 2027", or just "2023".</li>
          <li>The <strong>Custom</strong> section can be renamed — useful for Publications, Research, Awards, etc.</li>
        </ul>
      </section>

      <section>
        <h2>Writing great bullet points</h2>
        <ul>
          <li>Start with a strong past-tense action verb: <em>Built, Reduced, Led, Shipped, Designed, Grew.</em></li>
          <li>Follow the formula: <strong>Action + what + result</strong>. E.g. "Reduced API latency by 40% by caching frequently queried endpoints."</li>
          <li>Quantify everything you can — percentages, user counts, time saved, revenue generated.</li>
          <li>Aim for 2–4 bullets per role or project. Quality beats quantity.</li>
          <li>Avoid vague filler like "was responsible for" or "assisted with".</li>
        </ul>
      </section>

      <section className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h2>Still need help?</h2>
        <p className="text-gray-600 dark:text-gray-400">
          If something is not working or you have a suggestion, reach out at{' '}
          <a href="mailto:contact@codepapa.xyz">contact@codepapa.xyz</a>. I read every message.
        </p>
      </section>
    </PageShell>
  )
}
