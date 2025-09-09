import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// IMPORTANTE: createBrowserRouter y RouterProvider se importan de react-router-dom
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Páginas
import { Services } from './components/services.tsx'
import BlogPostPage from './pages/BlogPost.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <Services />,
  },
  // Índice del blog (listado)
  {
    path: "/blog",
    element: <App />,
  },
  // Detalle del blog
  {
    path: "/blog/:slug",
    element: <BlogPostPage />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)