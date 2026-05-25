import { useState, useEffect } from 'react'
import { mergeWithDefaults } from '../utils/defaultData'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? mergeWithDefaults(JSON.parse(item)) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Storage quota or private-browsing block — fail silently
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
