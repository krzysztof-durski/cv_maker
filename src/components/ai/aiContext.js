import { createContext, useContext } from 'react'

// Kept separate from AiProvider so small components (like the per-section AI button) can
// read it without importing the modals, which would create an import cycle with shared.jsx.
export const AiContext = createContext(null)

/** `null` when rendered outside an AiProvider; callers should hide their AI UI in that case. */
export const useAi = () => useContext(AiContext)
