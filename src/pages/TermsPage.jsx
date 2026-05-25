import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 mb-8 inline-block">
          ← Back to CV Maker
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: May 2026</p>

        <div className="prose prose-sm text-gray-700 space-y-6">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. About This Service</h2>
            <p>
              CV Maker is a free, browser-based tool that lets you create Harvard-style CVs.
              There are no accounts, no subscriptions, and no servers — everything runs entirely in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. Your Data</h2>
            <p>
              All CV data you enter is stored exclusively in your browser's <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code>.
              Nothing you type is ever transmitted to any server, stored in any database, or shared with any third party.
              Clearing your browser data or storage will permanently delete your CV.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. No Warranty</h2>
            <p>
              This tool is provided "as is", without warranty of any kind. We make no guarantees that the
              service will be uninterrupted, error-free, or that your stored data will be preserved across
              browser updates or device changes. Always keep a copy of your CV data elsewhere.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Acceptable Use</h2>
            <p>
              You may use CV Maker to create and export your own CV for personal, academic, or professional purposes.
              You must not use this tool to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Fabricate or misrepresent your qualifications, credentials, or experience</li>
              <li>Create fraudulent documents intended to deceive employers or institutions</li>
              <li>Impersonate another person</li>
            </ul>
            <p className="mt-2">
              You are solely responsible for the accuracy and legality of the content you produce.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Intellectual Property</h2>
            <p>
              The CV content you create is entirely yours. We claim no ownership over anything you write.
              The CV Maker application code and design are protected by copyright.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Changes to Terms</h2>
            <p>
              We may update these terms occasionally. Continued use of the service after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 text-xs text-gray-400">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <Link to="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
