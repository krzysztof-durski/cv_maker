import { useState } from 'react'

export default function HowToUse() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          ? How to use
        </span>
        <span className="text-gray-400 dark:text-gray-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="p-3 space-y-2 text-xs text-gray-600 dark:text-gray-300">
          <p className="font-semibold text-gray-700 dark:text-gray-200">Getting started</p>
          <ol className="space-y-1.5 list-decimal pl-4">
            <li>Fill in your <span className="font-medium">Personal Info</span> — name, email, phone, LinkedIn, GitHub, and location.</li>
            <li>Use the <span className="font-medium">Sections</span> panel to toggle sections on/off and drag to reorder them.</li>
            <li>Fill in each enabled section. Use bullet points to describe achievements with numbers and impact.</li>
            <li>The live preview on the right updates instantly as you type.</li>
          </ol>
          <p className="font-semibold text-gray-700 dark:text-gray-200 pt-1">Saving your work</p>
          <ul className="space-y-1 list-disc pl-4">
            <li>Your CV is <span className="font-medium">auto-saved</span> in this browser — it survives page reloads.</li>
            <li>Click <span className="font-medium">Save Backup</span> to download a <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.json</code> file you can store safely or use on another device.</li>
            <li>Click <span className="font-medium">Restore Backup</span> to reload a previously saved file.</li>
          </ul>
          <p className="font-semibold text-gray-700 dark:text-gray-200 pt-1">Exporting as PDF</p>
          <ul className="space-y-1 list-disc pl-4">
            <li>Click <span className="font-medium">Print / Save as PDF</span> in the header.</li>
            <li>In the print dialog, choose <span className="font-medium">Save as PDF</span> as the destination.</li>
            <li>Set margins to <span className="font-medium">None</span> — the app handles its own margins.</li>
          </ul>
          <p className="font-semibold text-gray-700 dark:text-gray-200 pt-1">Tips</p>
          <ul className="space-y-1 list-disc pl-4">
            <li>Each section has a <span className="font-medium">↺ Reset</span> button to clear it individually.</li>
            <li>Use the <span className="font-medium">☾ Dark</span> button to switch to dark mode.</li>
            <li>Date fields accept any text — e.g. "Present", "Expected Jun 2027".</li>
          </ul>
        </div>
      )}
    </div>
  )
}
