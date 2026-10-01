import { useCallback, useEffect, useMemo, useState } from 'react'
import { AiContext } from './aiContext'
import AssistantModal from './AssistantModal'
import AiSettingsModal from './AiSettingsModal'
import UndoBar from './UndoBar'
import { applyItems } from '../../ai/diff'

/**
 * Owns the AI modals and the one-step undo. `settings` comes from useAiSettings() in the page,
 * so the page can also clear it on "Reset all data".
 *
 * The assistant is mounted the first time it is opened and then kept (hidden when closed), so a
 * conversation with suggestions under review is still there when it is opened again.
 */
export function AiProvider({ cvData, setCvData, settings, children }) {
  const [assistant, setAssistant] = useState({ mounted: false, open: false, scope: 'cv', requestId: 0 })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [undo, setUndo] = useState(null) // { snapshot, applied, count }

  const openAssistant = useCallback((scope = 'cv') => {
    setAssistant(prev => ({ mounted: true, open: true, scope, requestId: prev.requestId + 1 }))
  }, [])
  const closeAssistant = useCallback(() => setAssistant(prev => ({ ...prev, open: false })), [])
  const openSettings = useCallback(() => setSettingsOpen(true), [])

  // Once the user edits anything after an AI change, "Undo" would also wipe that edit, so retire it.
  useEffect(() => {
    if (undo && cvData !== undo.applied) setUndo(null)
  }, [cvData, undo])

  const apply = useCallback((sections, acceptedKeys, count) => {
    if (acceptedKeys.length === 0) return
    const applied = applyItems(cvData, sections, acceptedKeys)
    setCvData(applied)
    setUndo({ snapshot: cvData, applied, count })
  }, [cvData, setCvData])

  const value = useMemo(() => ({ openAssistant, openSettings }), [openAssistant, openSettings])

  return (
    <AiContext.Provider value={value}>
      {children}

      {assistant.mounted && (
        <AssistantModal
          open={assistant.open}
          requestId={assistant.requestId}
          initialScope={assistant.scope}
          cvData={cvData}
          settings={settings}
          onClose={closeAssistant}
          onOpenSettings={openSettings}
          onApply={apply}
        />
      )}

      {settingsOpen && <AiSettingsModal settings={settings} onClose={() => setSettingsOpen(false)} />}

      {undo && (
        <UndoBar
          message={`AI applied ${undo.count} change${undo.count === 1 ? '' : 's'}`}
          onUndo={() => { setCvData(undo.snapshot); setUndo(null) }}
          onDismiss={() => setUndo(null)}
        />
      )}
    </AiContext.Provider>
  )
}
