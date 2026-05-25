import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 inline-block">
          ← Back to CV Maker
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">About this project</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Built out of frustration. Kept free out of principle.</p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">The problem</h2>
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
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">Why I built this</h2>
            <p>
              I'm <a href="https://codepapa.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900 dark:hover:text-gray-100">Krzysztof Durski</a>,
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
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">What makes it different</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Truly free.</strong> Export to PDF as many times as you want. No paywall, ever.</li>
              <li><strong>Your data stays yours.</strong> Everything is stored in your browser's localStorage. Nothing is sent to any server.</li>
              <li><strong>No account required.</strong> Open the page and start typing.</li>
              <li><strong>Harvard style.</strong> Clean, professional, widely accepted format used by top universities and employers.</li>
              <li><strong>Backup and restore.</strong> Download your CV data as a JSON file and restore it on any device or browser.</li>
              <li><strong>Open and honest.</strong> No dark patterns, no hidden charges, no upsells.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">The tech</h2>
            <p>
              Built with React, Vite, and Tailwind CSS. Hosted on Cloudflare Pages.
              The PDF export uses your browser's native print dialog — no third-party libraries,
              no server-side rendering, no watermarks.
            </p>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-gray-500 dark:text-gray-400">
              If this saved you from yet another paywall, I'm glad. If you want to see more projects like this,
              visit <a href="https://codepapa.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900 dark:hover:text-gray-100">codepapa.xyz</a>.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-4 text-xs text-gray-400 dark:text-gray-500">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
          <Link to="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
