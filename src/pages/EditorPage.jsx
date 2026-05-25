import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_DATA } from '../utils/defaultData'
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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header onReset={handleReset} onPrint={handlePrint} />
      <div className="flex flex-1 overflow-hidden">
        <EditorPanel cvData={cvData} setCvData={setCvData} />
        <CVPreview cvData={cvData} />
      </div>
    </div>
  )
}
