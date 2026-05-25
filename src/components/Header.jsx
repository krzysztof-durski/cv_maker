import { Link } from 'react-router-dom'

export default function Header({ onReset, onPrint }) {
  return (
    <header className="no-print flex items-center justify-between px-4 py-2 bg-gray-900 text-white shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm tracking-wide">CV Maker</span>
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
          onClick={onPrint}
          className="ml-2 px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
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
