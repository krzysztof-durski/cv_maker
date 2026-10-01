import PageShell from '../components/PageShell'

export default function TermsPage() {
  return (
    <PageShell title="Terms of Service" updated="October 2026">
      <section>
        <h2>1. About This Service</h2>
        <p>
          CV Maker is a free, browser-based tool that lets you create Harvard-style CVs.
          There are no accounts, no subscriptions, and no servers of ours involved — everything runs in your browser.
          An optional AI assistant can call an AI provider of your choice directly from your browser (see section 3).
        </p>
      </section>

      <section>
        <h2>2. Your Data</h2>
        <p>
          All CV data you enter is stored exclusively in your browser's <code>localStorage</code>.
          We never receive it, store it in any database, or share it with any third party.
          The only way any of it leaves your browser is if you choose to use the optional AI assistant.
          Clearing your browser data or storage will permanently delete your CV.
        </p>
      </section>

      <section>
        <h2>3. Optional AI Assistant</h2>
        <p>
          The AI assistant works only with an API key that you provide from OpenAI, Anthropic, or Google.
          When you use it, your browser sends the relevant parts of your CV and anything you attach straight to that
          provider. By using it you agree that:
        </p>
        <ul>
          <li>you are responsible for your API key, for any charges on your provider account, and for following that provider's terms;</li>
          <li>AI output can be wrong, invented, or badly worded — you must review every suggestion before you apply it and before you send your CV to anyone;</li>
          <li>you will not use it to invent qualifications, employers, dates, or any other facts about yourself;</li>
          <li>you will not send other people's personal information unless you have the right to do so;</li>
          <li>we do not control, and are not responsible for, how the provider handles the data you send.</li>
        </ul>
      </section>

      <section>
        <h2>4. No Warranty</h2>
        <p>
          This tool is provided "as is", without warranty of any kind. We make no guarantees that the
          service will be uninterrupted, error-free, or that your stored data will be preserved across
          browser updates or device changes. Always keep a copy of your CV data elsewhere.
        </p>
      </section>

      <section>
        <h2>5. Acceptable Use</h2>
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
        <h2>6. Intellectual Property</h2>
        <p>
          The CV content you create is entirely yours. We claim no ownership over anything you write.
          The CV Maker application code and design are &copy; {new Date().getFullYear()} Krzysztof Durski, all rights reserved.
        </p>
      </section>

      <section>
        <h2>7. Changes to Terms</h2>
        <p>
          We may update these terms occasionally. Continued use of the service after changes
          constitutes acceptance of the updated terms.
        </p>
      </section>
    </PageShell>
  )
}
