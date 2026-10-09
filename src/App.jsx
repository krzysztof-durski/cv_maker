import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EditorPage from './pages/EditorPage'
import InfoPage from './components/InfoPage'

const router = createBrowserRouter([
  { path: '/', element: <EditorPage /> },
  { path: '/help', element: <InfoPage page="help" /> },
  { path: '/about', element: <InfoPage page="about" /> },
  { path: '/terms', element: <InfoPage page="terms" /> },
  { path: '/privacy', element: <InfoPage page="privacy" /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
