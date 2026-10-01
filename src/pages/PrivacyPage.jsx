import PageShell from '../components/PageShell'

export default function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy" updated="October 2026">
      <section>
        <h2>The Short Version</h2>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          We collect absolutely nothing. Your data stays in your browser — unless you choose to use the
          optional AI assistant, in which case the text you send goes straight from your browser to the AI
          provider you picked, never through us.
        </p>
      </section>

      <section>
        <h2>1. No Data Collection</h2>
        <p>
          CV Maker does not collect, store, transmit, or process any personal data.
          There are no analytics scripts, no tracking pixels, no error reporting services,
          and no third-party integrations on our side. The app is a static site with no backend.
          The only exception is the optional AI assistant, which you control and which is described in section 5.
        </p>
      </section>

      <section>
        <h2>2. Local Storage</h2>
        <p>
          Your CV data is saved in your browser's <code>localStorage</code> under the key <code>cv_maker_data</code>.
          This storage is local to your device and browser — it is not a cookie, it is not synced,
          and it cannot be read by anyone other than you on your device.
        </p>
        <p className="mt-2">
          If you use the AI assistant, your chosen provider, model and API key are kept under separate keys
          starting with <code>cv_maker_ai_</code>. By default the key lives in <code>sessionStorage</code> and is
          forgotten when you close the tab; it is saved in <code>localStorage</code> only if you tick
          "Remember my key on this device". These settings are never included in backup files.
        </p>
      </section>

      <section>
        <h2>3. No Cookies</h2>
        <p>
          We do not set any cookies. <code>localStorage</code> is not a cookie — it is a browser storage
          mechanism that persists until you clear it. It does not expire automatically and is not sent
          to any server with requests.
        </p>
      </section>

      <section>
        <h2>4. Analytics</h2>
        <p>
          This site uses <strong>Cloudflare Web Analytics</strong> to count page visits and
          understand general usage (e.g. number of visitors, countries, device types).
          Cloudflare Web Analytics is cookieless and does not track individuals, build
          profiles, or share data with advertisers. No personal information is collected.
          See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare's privacy policy</a> for details.
        </p>
      </section>

      <section>
        <h2>5. Optional AI Assistant</h2>
        <p>
          The AI assistant is off until you add your own API key from OpenAI, Anthropic, or Google.
          When you ask it for suggestions, your browser sends the following directly to the provider you
          selected, using your key:
        </p>
        <ul>
          <li>the CV sections relevant to your request (your contact details are not included),</li>
          <li>your instruction (and, in a longer conversation, your earlier messages and the AI's replies), and</li>
          <li>any job description or file text you pasted or attached.</li>
        </ul>
        <p className="mt-2">
          This traffic does not pass through any server of ours; we never see your key, your CV, or the AI's answer.
          The provider handles that data under its own terms and privacy policy
          (<a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">OpenAI</a>,{' '}
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">Anthropic</a>,{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google</a>),
          and usage is billed to your own account. Attached files are read in your browser; only their text is sent.
          Don't use the assistant if you are not comfortable sharing that content with the provider.
        </p>
      </section>

      <section>
        <h2>6. How to Delete Your Data</h2>
        <p>You can delete all your CV data at any time in three ways:</p>
        <ul>
          <li>
            <strong>Reset button:</strong> Click "Reset all data" in the app header menu and confirm the dialog.
            This immediately clears all data, including any saved AI API key, and resets the form.
          </li>
          <li>
            <strong>AI key only:</strong> Open "AI settings &amp; API key" in the header menu and choose "Remove key".
          </li>
          <li>
            <strong>Browser DevTools:</strong> Open DevTools → Application tab → Local Storage →
            select this site → delete the <code>cv_maker_data</code> key and any keys starting with <code>cv_maker_ai_</code>.
          </li>
          <li>
            <strong>Browser settings:</strong> Clear site data for this domain in your browser's
            privacy/security settings.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Hosting</h2>
        <p>
          This site is hosted on Cloudflare Pages. Cloudflare may log standard server access
          logs (IP address, request path, timestamps) as part of their infrastructure.
          We do not have access to or control over these logs. Please refer to
          Cloudflare's own privacy policy for details on their data handling.
        </p>
      </section>
    </PageShell>
  )
}
