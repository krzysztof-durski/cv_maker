import { useState } from 'react'
import { SECTION_HELP } from '../../../utils/sectionHelp'
import { inputClass } from './shared'
import AiButton from '../../ai/AiButton'

export default function ProfileEditor({ profile, onChange, onReset }) {
  const [showHelp, setShowHelp] = useState(false)
  const help = SECTION_HELP.profile
  const text = profile?.text || ''

  const handleReset = () => {
    if (window.confirm('Reset your profile bio? This will be cleared.')) onReset()
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Profile</p>
          <button
            onClick={() => setShowHelp(v => !v)}
            title="Show tips for this section"
            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors
              ${showHelp ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-blue-400 hover:text-white dark:bg-gray-600 dark:text-gray-300'}`}
          >
            ?
          </button>
          <AiButton section="profile" label="Profile" />
        </div>
        {onReset && (
          <button
            onClick={handleReset}
            className="ml-2 text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500"
            title="Reset Profile"
          >
            ↺ Reset
          </button>
        )}
      </div>

      {showHelp && (
        <div className="mx-3 mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
          <p className="mb-1.5 text-xs font-medium text-blue-800 dark:text-blue-200">{help.intro}</p>
          <ul className="space-y-1">
            {help.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-blue-700 dark:text-blue-300">
                <span className="mt-0.5 shrink-0">·</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-3">
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Bio</label>
        <textarea
          value={text}
          onChange={e => onChange({ ...profile, text: e.target.value })}
          placeholder="Backend engineer with 5 years building payment systems at scale. Focused on reliability, developer tooling, and shipping fast without breaking things."
          rows={4}
          className={`${inputClass} resize-y`}
        />
        <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">{text.length} characters · aim for 3–5 sentences</p>
      </div>
    </div>
  )
}
