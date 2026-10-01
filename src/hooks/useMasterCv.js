import { useState, useCallback } from 'react'
import { mergeWithDefaults } from '../utils/defaultData'

// The user's default ("master") CV: a saved copy to start each tailored version from.
// It has its own key, so editing or tailoring the working CV never changes it, and it is
// not part of backup files.
export const MASTER_KEY = 'cv_maker_master'

function load() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(MASTER_KEY))
    return saved?.data ? { data: mergeWithDefaults(saved.data), savedAt: saved.savedAt || null } : null
  } catch {
    return null
  }
}

export function useMasterCv() {
  const [master, setMaster] = useState(load)

  const save = useCallback(cv => {
    const next = { data: cv, savedAt: new Date().toISOString() }
    try {
      window.localStorage.setItem(MASTER_KEY, JSON.stringify(next))
    } catch {
      return false // storage full or blocked
    }
    setMaster(next)
    return true
  }, [])

  const clear = useCallback(() => {
    try { window.localStorage.removeItem(MASTER_KEY) } catch { /* ignore */ }
    setMaster(null)
  }, [])

  return { master, save, clear }
}
