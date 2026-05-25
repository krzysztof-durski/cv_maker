function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-0.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400 bg-white"
      />
    </div>
  )
}

export default function PersonalInfoEditor({ personal, onChange, onReset }) {
  const update = (field, value) => onChange({ ...personal, [field]: value })

  const handleReset = () => {
    if (window.confirm('Reset personal info? All fields will be cleared.')) {
      onReset()
    }
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personal Info</p>
        {onReset && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors ml-2"
            title="Reset Personal Info"
          >
            ↺ Reset
          </button>
        )}
      </div>
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
