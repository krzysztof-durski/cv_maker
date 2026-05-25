import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EditorPage from './pages/EditorPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'

const router = createBrowserRouter([
  { path: '/', element: <EditorPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
