import PageShell from '../components/PageShell'

export default function AboutPage() {
  return (
    <PageShell
      title="About this project"
      subtitle="Built out of frustration. Kept free out of principle."
    >
      <section>
        <h2>The problem</h2>
        <p>
          You've probably been there. You spend 45 minutes carefully filling out your CV on one of those
          "free" CV builder sites — formatting it, tweaking bullet points, picking the right layout.
          It looks great. You hit <strong>Download</strong>.
        </p>
        <p className="mt-2">
          And then: <em>"Upgrade to Premium to export your CV — from $9.99/month."</em>
        </p>
        <p className="mt-2">
          Your data is held hostage. The whole thing was a funnel. I've been there more than once,
          and every time it felt like a bait-and-switch. You wasted your time, and now you either
          pay up or start over somewhere else.
        </p>
      </section>

      <section>
        <h2>Why I built this</h2>
        <p>
          I'm <a href="https://codepapa.xyz" target="_blank" rel="noopener noreferrer">Krzysztof Durski</a>,
          and I built CV Maker because I was tired of it. A CV builder is not a complicated product.
          It doesn't need a backend. It doesn't need an account. It doesn't need your credit card.
        </p>
        <p className="mt-2">
          So I made one that runs entirely in your browser, saves your data locally, and lets you
          export to PDF for free — always — using the print function that's already built into
          every browser on the planet.
        </p>
        <p className="mt-2">
          No accounts. No subscriptions. No "premium" tier. No tricks.
        </p>
      </section>

      <section>
        <h2>What makes it different</h2>
        <ul>
          <li><strong>Truly free.</strong> Export to PDF as many times as you want. No paywall, ever.</li>
          <li><strong>Your data stays yours.</strong> Everything is stored in your browser's localStorage. Nothing is sent to any server.</li>
          <li><strong>No account required.</strong> Open the page and start typing.</li>
          <li><strong>Harvard style.</strong> Clean, professional, widely accepted format used by top universities and employers.</li>
          <li><strong>Backup and restore.</strong> Download your CV data as a JSON file and restore it on any device or browser.</li>
          <li><strong>Open and honest.</strong> No dark patterns, no hidden charges, no upsells.</li>
        </ul>
      </section>

      <section>
        <h2>The tech</h2>
        <p>
          Built with React, Vite, and Tailwind CSS. Hosted on Cloudflare Pages.
          The PDF export uses your browser's native print dialog — no third-party libraries,
          no server-side rendering, no watermarks.
        </p>
      </section>

      <section className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          If this saved you from yet another paywall, I'm glad. If you want to see more projects like this,
          visit <a href="https://codepapa.xyz" target="_blank" rel="noopener noreferrer">codepapa.xyz</a>.
        </p>
      </section>
    </PageShell>
  )
}
