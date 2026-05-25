import { useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Header({ onReset, onPrint, onDownload, onUpload }) {
  const fileInputRef = useRef(null)

  return (
    <header className="no-print flex items-center justify-between px-4 py-2 bg-gray-900 text-white shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm tracking-wide">CV Maker</span>
        <span className="text-gray-400 text-xs">
          by{' '}
          <a
            href="https://codepapa.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Krzysztof Durski
          </a>
        </span>
        <span className="text-gray-500 text-xs">Harvard Style</span>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/terms" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
          Terms
        </Link>
        <span className="text-gray-600 text-xs">·</span>
        <Link to="/privacy" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
          Privacy
        </Link>
        <span className="text-gray-600 text-xs ml-2">·</span>
        <button
          onClick={onDownload}
          className="ml-2 px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Download your CV data as a JSON backup"
        >
          Save Backup
        </button>
        <button
          onClick={() => fileInputRef.current.click()}
          className="px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          title="Restore CV data from a previously saved backup"
        >
          Restore Backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={e => { onUpload(e.target.files[0]); e.target.value = '' }}
        />
        <button
          onClick={onPrint}
          className="px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-medium bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
        >
          Reset All
        </button>
      </div>
    </header>
  )
}
