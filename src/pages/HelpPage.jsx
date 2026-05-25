import { Link } from 'react-router-dom'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 inline-block">
          ← Back to CV Maker
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Help & How to Use</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Everything you need to know to build a great CV.</p>

        <div className="space-y-8 text-sm text-gray-700 dark:text-gray-300">

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Getting started</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li>Fill in your <strong>Personal Info</strong> — name, email, phone, LinkedIn, GitHub, and location.</li>
              <li>Use the <strong>Sections</strong> panel to toggle sections on/off and drag to reorder them.</li>
              <li>Fill in each enabled section. Click the <strong>?</strong> button on any section header for specific tips.</li>
              <li>The live preview on the right updates instantly as you type.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Saving your work</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Your CV is <strong>auto-saved</strong> in this browser — it survives page reloads and browser restarts.</li>
              <li>Click <strong>Save Backup</strong> in the header to download a <code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded text-xs">.json</code> file you can keep safely or move to another device.</li>
              <li>Click <strong>Restore Backup</strong> to reload a previously saved file — useful when switching devices or browsers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Exporting as PDF</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li>Click <strong>Print / Save as PDF</strong> in the header.</li>
              <li>In the print dialog, set the destination to <strong>Save as PDF</strong>.</li>
              <li>Set margins to <strong>None</strong> — the app handles its own margins internally.</li>
              <li>Click Save. The result is a clean, properly formatted A4 PDF.</li>
            </ol>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-xs">
              Tip: use Chrome or Edge for best PDF output. Safari may render fonts slightly differently.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Section tips</h2>
            <p>
              Each section in the editor has a small <strong>?</strong> button in its header. Click it to see section-specific
              advice — what to include, how to phrase things, and what recruiters actually look for.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Other features</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>↺ Reset</strong> on any section header clears that section only, with a confirmation prompt.</li>
              <li><strong>Reset All</strong> in the header clears your entire CV after confirmation — irreversible.</li>
              <li><strong>☾ Dark / ☀ Light</strong> toggles dark mode. Your preference is remembered.</li>
              <li>Date fields accept any text — try "Present", "Expected Jun 2027", or just "2023".</li>
              <li>The <strong>Custom</strong> section can be renamed — useful for Publications, Research, Awards, etc.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Writing great bullet points</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Start with a strong past-tense action verb: <em>Built, Reduced, Led, Shipped, Designed, Grew.</em></li>
              <li>Follow the formula: <strong>Action + what + result</strong>. E.g. "Reduced API latency by 40% by caching frequently queried endpoints."</li>
              <li>Quantify everything you can — percentages, user counts, time saved, revenue generated.</li>
              <li>Aim for 2–4 bullets per role or project. Quality beats quantity.</li>
              <li>Avoid vague filler like "was responsible for" or "assisted with".</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Still need help?</h2>
            <p className="text-gray-600 dark:text-gray-400">
              If something is not working or you have a suggestion, reach out at{' '}
              <a
                href="mailto:contact@codepapa.xyz"
                className="underline text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                contact@codepapa.xyz
              </a>
              . I read every message.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-4 text-xs text-gray-400 dark:text-gray-500">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-600 dark:hover:text-gray-300">About</Link>
          <Link to="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">Terms</Link>
          <Link to="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">Privacy</Link>
        </div>
      </div>
    </div>
  )
}
