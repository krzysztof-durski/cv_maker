import { useCallback, useRef, useState } from 'react'

let serial = 0

/** A fresh conversation: its own scope, chat, and suggestions under review. */
function blank(scope = 'cv') {
  serial += 1
  return {
    id: serial,
    number: serial,
    scope,
    instruction: '',
    presetId: null,
    messages: [], // [{ role: 'user' | 'assistant' | 'error', text, snapshot?, model? }]
    sections: [], // change items from the latest answer
    declined: new Set(), // keys of changes the user unticked
    notes: [],
    busy: false,
    retryNote: '',
    error: '', // first request only; later failures appear in the chat
    errorKind: '', // AiError.kind of `error`, to decide what advice goes with it
    chatInput: '',
  }
}

/** The assistant's conversations (tabs). Each can be waiting on the AI independently. */
export function useConversations() {
  const [state, setState] = useState(() => {
    const first = blank()
    return { list: [first], activeId: first.id }
  })
  const aborts = useRef({})

  const patch = useCallback((id, changes) => {
    setState(prev => ({
      ...prev,
      list: prev.list.map(c => (c.id === id ? { ...c, ...(typeof changes === 'function' ? changes(c) : changes) } : c)),
    }))
  }, [])

  const activate = useCallback(id => setState(prev => ({ ...prev, activeId: id })), [])

  const add = useCallback((scope = 'cv') => {
    const created = blank(scope)
    setState(prev => ({ list: [...prev.list, created], activeId: created.id }))
    return created.id
  }, [])

  const setAbort = useCallback((id, controller) => { aborts.current[id] = controller }, [])
  const abort = useCallback(id => aborts.current[id]?.abort(), [])
  const isCurrent = useCallback((id, controller) => aborts.current[id] === controller, [])

  const remove = useCallback(id => {
    aborts.current[id]?.abort()
    setState(prev => {
      const list = prev.list.filter(c => c.id !== id)
      if (list.length === 0) {
        const fresh = blank()
        return { list: [fresh], activeId: fresh.id }
      }
      return { list, activeId: prev.activeId === id ? list[Math.max(0, prev.list.findIndex(c => c.id === id) - 1)].id : prev.activeId }
    })
  }, [])

  const reset = useCallback(id => {
    aborts.current[id]?.abort()
    patch(id, {
      instruction: '', presetId: null, messages: [], sections: [], declined: new Set(), notes: [],
      busy: false, retryNote: '', error: '', errorKind: '', chatInput: '',
    })
  }, [patch])

  const abortAll = useCallback(() => Object.values(aborts.current).forEach(c => c.abort()), [])

  return {
    conversations: state.list,
    active: state.list.find(c => c.id === state.activeId) || state.list[0],
    patch, activate, add, remove, reset, setAbort, abort, isCurrent, abortAll,
  }
}
