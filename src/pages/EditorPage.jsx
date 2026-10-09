import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useDarkMode } from '../hooks/useDarkMode'
import { DEFAULT_DATA, mergeWithDefaults } from '../utils/defaultData'
import Header from '../components/Header'
import EditorPanel from '../components/editor/EditorPanel'
import CVPreview from '../components/preview/CVPreview'
import { AiProvider } from '../components/ai/AiProvider'
import { useAiSettings } from '../components/ai/useAiSettings'
import { useMasterCv } from '../hooks/useMasterCv'
import { useHistory } from '../hooks/useHistory'
import { usePanelWidth } from '../hooks/usePanelWidth'
import ResizeHandle from '../components/ResizeHandle'
import { pdfFileName } from '../utils/pdfFileName'
import { useI18n } from '../i18n/I18nProvider'
import { resolveCvLanguage } from '../i18n/cvLanguage'

export default function EditorPage() {
  const [cvData, setStoredCv] = useLocalStorage('cv_maker_data', DEFAULT_DATA)
  const { set: setCvData, undo, redo, clear: clearHistory, canUndo, canRedo } = useHistory(cvData, setStoredCv)
  const aiSettings = useAiSettings()
  const { master, save: saveMaster, clear: clearMaster } = useMasterCv()
  const [isDark, toggleDark] = useDarkMode()
  const [mobileView, setMobileView] = useState('edit') // 'edit' | 'preview' — only used below lg
  const [exportingDocx, setExportingDocx] = useState(false)
  const { t, lang } = useI18n()
  const cvLanguage = resolveCvLanguage(cvData.language, lang)
  const panel = usePanelWidth() // desktop only: below lg the editor is full width

  const handleReset = () => {
    if (window.confirm(t('app.resetConfirm'))) {
      window.localStorage.removeItem('cv_maker_data')
      aiSettings.clearAll()
      clearMaster()
      setStoredCv(DEFAULT_DATA)
      clearHistory() // "permanently delete" means the history too
    }
  }

  // The browser names the saved PDF after the page title, so use "Role_Name_Surname_CV" while printing.
  const handlePrint = () => {
    const title = document.title
    const restore = () => { document.title = title; window.removeEventListener('afterprint', restore) }
    document.title = pdfFileName(cvData.personal)
    window.addEventListener('afterprint', restore)
    window.print()
    // Some browsers don't fire afterprint; print() blocks until the dialog closes, so restoring here is safe too.
    restore()
  }

  const handleSaveMaster = () => {
    if (master && !window.confirm(t('app.replaceDefaultConfirm'))) return
    if (!saveMaster(cvData)) alert(t('app.saveDefaultFailed'))
  }

  const handleLoadMaster = () => {
    if (!master) return
    if (window.confirm(t('app.loadDefaultConfirm'))) {
      setCvData(master.data)
    }
  }

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
        if (window.confirm(t('app.uploadConfirm'))) {
          setCvData(mergeWithDefaults(parsed))
        }
      } catch {
        alert(t('app.uploadInvalid'))
      }
    }
    reader.readAsText(file)
  }

  const handleExportDocx = async () => {
    if (exportingDocx) return
    setExportingDocx(true)
    try {
      const { cvDataToDocxBlob, docxFileName } = await import('../utils/exportDocx')
      const blob = await cvDataToDocxBlob(cvData, cvLanguage)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = docxFileName(cvData.personal)
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert(t('app.docxFailed'))
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
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          masterSavedAt={master?.savedAt || null}
          hasMaster={Boolean(master)}
          onSaveMaster={handleSaveMaster}
          onLoadMaster={handleLoadMaster}
          isDark={isDark}
          onToggleDark={toggleDark}
          mobileView={mobileView}
          onMobileViewChange={setMobileView}
        />

        <main id="app-main" className="flex flex-1 overflow-hidden">
          {/* Editor */}
          <div
            style={{ '--editor-width': `${panel.width}px` }}
            className={`${mobileView === 'edit' ? 'flex' : 'hidden'} thin-scroll no-print w-full shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 lg:flex lg:w-[var(--editor-width)]`}
          >
            <EditorPanel cvData={cvData} setCvData={setCvData} />
          </div>
          <ResizeHandle
            label={t('editor.resizeHandle')}
            width={panel.width}
            min={panel.min}
            max={panel.max}
            onChange={panel.setWidth}
            onReset={panel.resetWidth}
          />

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
