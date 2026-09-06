import { useState } from 'react'
import { SECTION_HELP } from '../../../utils/sectionHelp'
import { LINK_TYPES } from '../../../utils/defaultData'
import { inputClass, labelClass } from './shared'

let _id = 0
const newLinkId = () => `link-${Date.now()}-${_id++}`

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

const QUICK_ADD = ['linkedin', 'github', 'portfolio']

export default function PersonalInfoEditor({ personal, onChange, onReset }) {
  const [showHelp, setShowHelp] = useState(false)
  const help = SECTION_HELP.personal
  const links = personal.links || []

  const update = (field, value) => onChange({ ...personal, [field]: value })

  const addLink = (type) => {
    onChange({ ...personal, links: [...links, { id: newLinkId(), type, url: '', label: '' }] })
  }

  const updateLink = (id, field, value) => {
    onChange({ ...personal, links: links.map(l => l.id === id ? { ...l, [field]: value } : l) })
  }

  const removeLink = (id) => {
    onChange({ ...personal, links: links.filter(l => l.id !== id) })
  }

  const handleReset = () => {
    if (window.confirm('Reset personal info? All fields will be cleared.')) onReset()
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-750">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Personal Info</p>
          <button
            onClick={() => setShowHelp(v => !v)}
            title="Show tips"
            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors
              ${showHelp ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-blue-400 hover:text-white dark:bg-gray-600 dark:text-gray-300'}`}
          >?</button>
        </div>
        {onReset && (
          <button onClick={handleReset} className="ml-2 text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500">
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
                <span className="mt-0.5 shrink-0">·</span><span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="col-span-2">
          <Field label="Full Name" value={personal.name} onChange={v => update('name', v)} placeholder="Jane Smith" />
        </div>
        <Field label="Phone" value={personal.phone} onChange={v => update('phone', v)} placeholder="+48 000 000 000" />
        <Field label="Email" value={personal.email} onChange={v => update('email', v)} placeholder="you@email.com" type="email" />
        <div className="col-span-2">
          <Field label="Location" value={personal.location} onChange={v => update('location', v)} placeholder="New York, USA" />
        </div>

        {/* Links */}
        <div className="col-span-2 mt-1">
          <label className={labelClass}>Links</label>

          {links.map(link => (
            <div key={link.id} className="mb-2 rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-1.5 flex items-center gap-1.5">
                <select
                  value={link.type}
                  onChange={e => updateLink(link.id, 'type', e.target.value)}
                  className="shrink-0 rounded-lg border border-gray-200 bg-white px-1.5 py-2 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                >
                  {Object.entries(LINK_TYPES).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={link.url}
                  onChange={e => updateLink(link.id, 'url', e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
                <button
                  onClick={() => removeLink(link.id)}
                  className="shrink-0 text-xl leading-none text-gray-300 transition-colors hover:text-red-500 dark:text-gray-600"
                  title="Remove link"
                >×</button>
              </div>
              <input
                type="text"
                value={link.label || ''}
                onChange={e => updateLink(link.id, 'label', e.target.value)}
                placeholder="Display text (optional — defaults to shortened URL)"
                className={`${inputClass} text-xs`}
              />
            </div>
          ))}

          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK_ADD.map(type => {
              const alreadyAdded = links.some(l => l.type === type)
              return (
                <button
                  key={type}
                  onClick={() => addLink(type)}
                  className={`rounded-lg border px-2 py-1 text-xs transition-colors
                    ${alreadyAdded
                      ? 'border-gray-200 text-gray-400 hover:border-gray-300 dark:border-gray-600 dark:text-gray-500'
                      : 'border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:text-indigo-400'}`}
                >
                  + {LINK_TYPES[type]}
                </button>
              )
            })}
            <button
              onClick={() => addLink('other')}
              className="rounded-lg border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              + Other
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
