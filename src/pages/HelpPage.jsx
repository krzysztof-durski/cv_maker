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
        <h2>Section tips</h2>
        <p>
          Each section in the editor has a small <strong>?</strong> button in its header. Click it to see section-specific
          advice — what to include, how to phrase things, and what recruiters actually look for.
        </p>
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
