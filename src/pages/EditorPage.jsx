import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useDarkMode } from '../hooks/useDarkMode'
import { DEFAULT_DATA, mergeWithDefaults } from '../utils/defaultData'
import Header from '../components/Header'
import EditorPanel from '../components/editor/EditorPanel'
import CVPreview from '../components/preview/CVPreview'
import { AiProvider } from '../components/ai/AiProvider'
import { useAiSettings } from '../components/ai/useAiSettings'

export default function EditorPage() {
  const [cvData, setCvData] = useLocalStorage('cv_maker_data', DEFAULT_DATA)
  const aiSettings = useAiSettings()
  const [isDark, toggleDark] = useDarkMode()
  const [mobileView, setMobileView] = useState('edit') // 'edit' | 'preview' — only used below lg
  const [exportingDocx, setExportingDocx] = useState(false)

  const handleReset = () => {
    if (window.confirm(
      'This will permanently delete all your CV data and any saved AI API key, and cannot be undone. Are you sure?'
    )) {
      window.localStorage.removeItem('cv_maker_data')
      aiSettings.clearAll()
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

  const handleExportDocx = async () => {
    if (exportingDocx) return
    setExportingDocx(true)
    try {
      const { cvDataToDocxBlob, docxFileName } = await import('../utils/exportDocx')
      const blob = await cvDataToDocxBlob(cvData)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = docxFileName(cvData.personal)
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Could not generate the Word document. Please try again.')
    } finally {
      setExportingDocx(false)
    }
  }

  return (
    <AiProvider cvData={cvData} setCvData={setCvData} settings={aiSettings}>
      <div id="app-shell" className="flex h-dvh flex-col overflow-hidden bg-gray-100 dark:bg-gray-950">
        <Header
          onReset={handleReset}
          onPrint={handlePrint}
          onDownload={handleDownload}
          onUpload={handleUpload}
          onExportDocx={handleExportDocx}
          exportingDocx={exportingDocx}
          isDark={isDark}
          onToggleDark={toggleDark}
          mobileView={mobileView}
          onMobileViewChange={setMobileView}
        />

        <main id="app-main" className="flex flex-1 overflow-hidden">
          {/* Editor */}
          <div
            className={`${mobileView === 'edit' ? 'flex' : 'hidden'} thin-scroll no-print w-full shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 lg:flex lg:w-[440px] xl:w-[480px]`}
          >
            <EditorPanel cvData={cvData} setCvData={setCvData} />
          </div>

          {/* Live preview */}
          <div
            id="cv-preview-pane"
            className={`${mobileView === 'preview' ? 'flex' : 'hidden'} relative min-w-0 flex-1 lg:flex`}
          >
            <CVPreview cvData={cvData} />
          </div>
        </main>
      </div>
    </AiProvider>
  )
}
