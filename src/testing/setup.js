import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Newer Node versions ship their own (file-backed) localStorage global that shadows jsdom's,
// so tests get a plain in-memory one instead.
function memoryStorage() {
  const data = new Map()
  return {
    getItem: key => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => { data.set(key, String(value)) },
    removeItem: key => { data.delete(key) },
    clear: () => data.clear(),
    key: index => [...data.keys()][index] ?? null,
    get length() { return data.size },
  }
}

for (const name of ['localStorage', 'sessionStorage']) {
  Object.defineProperty(window, name, { value: memoryStorage(), configurable: true })
}

// jsdom may lack PointerEvent; a MouseEvent with a pointerId is all the drag code reads.
if (!window.PointerEvent) {
  window.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type, init = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 1
    }
  }
}

// jsdom has no ResizeObserver; components that only use it to re-measure can live without it.
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  window.sessionStorage.clear()
})
