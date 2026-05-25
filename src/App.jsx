import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EditorPage from './pages/EditorPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import AboutPage from './pages/AboutPage'
import HelpPage from './pages/HelpPage'

const router = createBrowserRouter([
  { path: '/', element: <EditorPage /> },
  { path: '/help', element: <HelpPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
