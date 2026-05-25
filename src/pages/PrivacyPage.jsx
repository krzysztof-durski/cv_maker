import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 inline-block">
          ← Back to CV Maker
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: May 2026</p>

        <div className="prose prose-sm text-gray-700 dark:text-gray-300 space-y-6">
          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">The Short Version</h2>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              We collect absolutely nothing. Your data never leaves your browser.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">1. No Data Collection</h2>
            <p>
              CV Maker does not collect, store, transmit, or process any personal data.
              There are no analytics scripts, no tracking pixels, no error reporting services,
              and no third-party integrations of any kind. The app is a static site with no backend.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">2. Local Storage</h2>
            <p>
              Your CV data is saved in your browser's <code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded text-xs">localStorage</code>
              under the key <code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded text-xs">cv_maker_data</code>.
              This storage is local to your device and browser — it is not a cookie, it is not synced,
              and it cannot be read by anyone other than you on your device.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">3. No Cookies</h2>
            <p>
              We do not set any cookies. <code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded text-xs">localStorage</code> is
              not a cookie — it is a browser storage mechanism that persists until you clear it.
              It does not expire automatically and is not sent to any server with requests.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">4. Analytics</h2>
            <p>
              This site uses <strong>Cloudflare Web Analytics</strong> to count page visits and
              understand general usage (e.g. number of visitors, countries, device types).
              Cloudflare Web Analytics is cookieless and does not track individuals, build
              profiles, or share data with advertisers. No personal information is collected.
              See <a href="https://www.cloudflare.com/privacypolicy/" className="underline hover:text-gray-900 dark:hover:text-gray-100" target="_blank" rel="noopener noreferrer">Cloudflare's privacy policy</a> for details.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">5. How to Delete Your Data</h2>
            <p>You can delete all your CV data at any time in two ways:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Reset button:</strong> Click "Reset All" in the app header and confirm the dialog.
                This immediately clears all data and resets the form.
              </li>
              <li>
                <strong>Browser DevTools:</strong> Open DevTools → Application tab → Local Storage →
                select this site → delete the <code className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-1 rounded text-xs">cv_maker_data</code> key.
              </li>
              <li>
                <strong>Browser settings:</strong> Clear site data for this domain in your browser's
                privacy/security settings.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">6. Hosting</h2>
            <p>
              This site is hosted on Cloudflare Pages. Cloudflare may log standard server access
              logs (IP address, request path, timestamps) as part of their infrastructure.
              We do not have access to or control over these logs. Please refer to
              Cloudflare's own privacy policy for details on their data handling.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-4 text-xs text-gray-400 dark:text-gray-500">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <Link to="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}
