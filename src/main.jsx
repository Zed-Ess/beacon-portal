import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Website
import WebLayout  from './website/components/WebLayout'
import Home       from './website/pages/Home'
import Catalogue  from './website/pages/Catalogue'
import About      from './website/pages/About'
import Events     from './website/pages/Events'
import ForSchools from './website/pages/ForSchools'
import Blog       from './website/pages/Blog'
import Contact    from './website/pages/Contact'

// Portal (lazy-loaded via a wrapper component)
import PortalShell from './PortalShell'

import './App.css'

const router = createBrowserRouter(
  [
    {
      element: <WebLayout />,
      children: [
        { index: true,           element: <Home /> },
        { path: 'catalogue',     element: <Catalogue /> },
        { path: 'about',         element: <About /> },
        { path: 'events',        element: <Events /> },
        { path: 'schools',       element: <ForSchools /> },
        { path: 'blog',          element: <Blog /> },
        { path: 'contact',       element: <Contact /> },
      ],
    },
    {
      path: 'portal/*',
      element: <PortalShell />,
    },
    {
      path: '*',
      element: <Home />,
    },
  ],
  { basename: '/beacon-portal' }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
