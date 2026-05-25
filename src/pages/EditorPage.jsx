import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_DATA, mergeWithDefaults } from '../utils/defaultData'
import Header from '../components/Header'
import EditorPanel from '../components/editor/EditorPanel'
import CVPreview from '../components/preview/CVPreview'

export default function EditorPage() {
  const [cvData, setCvData] = useLocalStorage('cv_maker_data', DEFAULT_DATA)

  const handleReset = () => {
    if (window.confirm(
      'This will permanently delete all your CV data and cannot be undone. Are you sure?'
    )) {
      window.localStorage.removeItem('cv_maker_data')
      setCvData(DEFAULT_DATA)
    }
  }

  const handlePrint = () => window.print()

  const handleDownload = () => {
    const now = new Date()
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const yyyy = now.getFullYear()
    const filename = `my-cv-backup-codepapa-${dd}-${mm}-${yyyy}.json`
    const blob = new Blob([JSON.stringify(cvData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (window.confirm('This will replace your current CV data with the uploaded file. Continue?')) {
          setCvData(mergeWithDefaults(parsed))
        }
      } catch {
        alert('Invalid file — please upload a CV Maker .json backup file.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header onReset={handleReset} onPrint={handlePrint} onDownload={handleDownload} onUpload={handleUpload} />
      <div className="flex flex-1 overflow-hidden">
        <EditorPanel cvData={cvData} setCvData={setCvData} />
        <CVPreview cvData={cvData} />
      </div>
    </div>
  )
}
