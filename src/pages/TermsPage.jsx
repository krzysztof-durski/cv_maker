import PageShell from '../components/PageShell'

export default function TermsPage() {
  return (
    <PageShell title="Terms of Service" updated="May 2026">
      <section>
        <h2>1. About This Service</h2>
        <p>
          CV Maker is a free, browser-based tool that lets you create Harvard-style CVs.
          There are no accounts, no subscriptions, and no servers — everything runs entirely in your browser.
        </p>
      </section>

      <section>
        <h2>2. Your Data</h2>
        <p>
          All CV data you enter is stored exclusively in your browser's <code>localStorage</code>.
          Nothing you type is ever transmitted to any server, stored in any database, or shared with any third party.
          Clearing your browser data or storage will permanently delete your CV.
        </p>
      </section>

      <section>
        <h2>3. No Warranty</h2>
        <p>
          This tool is provided "as is", without warranty of any kind. We make no guarantees that the
          service will be uninterrupted, error-free, or that your stored data will be preserved across
          browser updates or device changes. Always keep a copy of your CV data elsewhere.
        </p>
      </section>

      <section>
        <h2>4. Acceptable Use</h2>
        <p>
          You may use CV Maker to create and export your own CV for personal, academic, or professional purposes.
          You must not use this tool to:
        </p>
        <ul>
          <li>Fabricate or misrepresent your qualifications, credentials, or experience</li>
          <li>Create fraudulent documents intended to deceive employers or institutions</li>
          <li>Impersonate another person</li>
        </ul>
        <p className="mt-2">
          You are solely responsible for the accuracy and legality of the content you produce.
        </p>
      </section>

      <section>
        <h2>5. Intellectual Property</h2>
        <p>
          The CV content you create is entirely yours. We claim no ownership over anything you write.
          The CV Maker application code and design are &copy; {new Date().getFullYear()} Krzysztof Durski, all rights reserved.
        </p>
      </section>

      <section>
        <h2>6. Changes to Terms</h2>
        <p>
          We may update these terms occasionally. Continued use of the service after changes
          constitutes acceptance of the updated terms.
        </p>
      </section>
    </PageShell>
  )
}
