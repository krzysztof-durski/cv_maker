import { useState } from 'react'
import { SECTION_HELP } from '../../../utils/sectionHelp'

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  )
}

export default function PersonalInfoEditor({ personal, onChange, onReset }) {
  const [showHelp, setShowHelp] = useState(false)
  const help = SECTION_HELP.personal
  const update = (field, value) => onChange({ ...personal, [field]: value })

  const handleReset = () => {
    if (window.confirm('Reset personal info? All fields will be cleared.')) {
      onReset()
    }
  }

  return (
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Personal Info</p>
          <button
            onClick={() => setShowHelp(v => !v)}
            title="Show tips for this section"
            className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center transition-colors
              ${showHelp
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-blue-400 hover:text-white'}`}
          >
            ?
          </button>
        </div>
        {onReset && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors ml-2"
            title="Reset Personal Info"
          >
            ↺ Reset
          </button>
        )}
      </div>
      {showHelp && (
        <div className="mx-3 mt-3 rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-3">
          <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1.5">{help.intro}</p>
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
      <div className="p-3 grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Field label="Full Name" value={personal.name} onChange={v => update('name', v)} placeholder="Jane Smith" />
        </div>
        <Field label="Phone" value={personal.phone} onChange={v => update('phone', v)} placeholder="+48 000 000 000" />
        <Field label="Email" value={personal.email} onChange={v => update('email', v)} placeholder="you@email.com" type="email" />
        <Field label="LinkedIn URL" value={personal.linkedin} onChange={v => update('linkedin', v)} placeholder="linkedin.com/in/..." />
        <Field label="GitHub / Portfolio URL" value={personal.github} onChange={v => update('github', v)} placeholder="github.com/..." />
        <div className="col-span-2">
          <Field label="Location" value={personal.location} onChange={v => update('location', v)} placeholder="New York, USA" />
        </div>
      </div>
    </div>
  )
}
