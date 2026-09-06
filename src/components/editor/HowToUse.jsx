import { useState } from 'react'

export default function HowToUse() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between bg-gray-50 px-3 py-2.5 transition-colors hover:bg-gray-100 dark:bg-gray-750 dark:hover:bg-gray-700"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          ? How to use
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="space-y-2 p-3 text-xs text-gray-600 dark:text-gray-300">
          <p className="font-semibold text-gray-700 dark:text-gray-200">Getting started</p>
          <ol className="list-decimal space-y-1.5 pl-4">
            <li>Fill in your <span className="font-medium">Personal Info</span> — name, email, phone, LinkedIn, GitHub, and location.</li>
            <li>Use the <span className="font-medium">Sections</span> panel to toggle sections on/off and drag to reorder them.</li>
            <li>Fill in each enabled section. Use bullet points to describe achievements with numbers and impact.</li>
            <li>On a phone, tap <span className="font-medium">Preview</span> in the header to check the result as you go.</li>
          </ol>
          <p className="pt-1 font-semibold text-gray-700 dark:text-gray-200">Saving your work</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Your CV is <span className="font-medium">auto-saved</span> in this browser — it survives page reloads.</li>
            <li>Open the <span className="font-medium">⋯ menu</span> and click <span className="font-medium">Save backup</span> to download a <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">.json</code> file you can store safely or use on another device.</li>
            <li>Click <span className="font-medium">Restore backup</span> to reload a previously saved file.</li>
          </ul>
          <p className="pt-1 font-semibold text-gray-700 dark:text-gray-200">Exporting as PDF</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Click <span className="font-medium">Save PDF</span> in the header.</li>
            <li>In the print dialog, choose <span className="font-medium">Save as PDF</span> as the destination.</li>
            <li>Set margins to <span className="font-medium">None</span> — the app handles its own margins.</li>
          </ul>
          <p className="pt-1 font-semibold text-gray-700 dark:text-gray-200">Tips</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Each section has a <span className="font-medium">↺ Reset</span> button to clear it individually.</li>
            <li>Use the sun / moon button to switch to dark mode.</li>
            <li>Date fields accept any text — e.g. "Present", "Expected Jun 2027".</li>
          </ul>
        </div>
      )}
    </div>
  )
}
