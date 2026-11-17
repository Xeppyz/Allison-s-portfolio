import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/playfair-display/wght.css'
import './index.css'
import './styles/article.css'

// IMPORTANTE: createBrowserRouter y RouterProvider se importan de react-router-dom
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Layout y páginas
import Home from './pages/Home.tsx'
import BlogIndex from './pages/BlogPageIndex.tsx'
import SiteLayout from './components/SiteLayout.tsx'
import BlogPostPage from './pages/BlogPost.tsx'
import ServicePage from './pages/ServicePage.tsx'
import LegalPage from './pages/LegalPage.tsx'
import NotFound from './pages/NotFound.tsx'
import ContactPage from './pages/ContactPage.tsx'

const Admin = lazy(() => import('./admin/Admin.tsx'))

const router = createBrowserRouter([
  {
    path: "/admin/*",
    element: (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ),
  },
  {
    element: <SiteLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/planes", element: <ServicePage slug="planes" /> },
      { path: "/privacidad", element: <LegalPage /> },
      { path: "/terminos", element: <LegalPage /> },
      { path: "/contacto", element: <ContactPage /> },
      // Índice del blog (listado)
      {
        path: "/blog",
        element: <BlogIndex />,
      },
      // Detalle del blog
      {
        path: "/blog/:slug",
        element: <BlogPostPage />,
      },
      { path: "/en/:slug", element: <ServicePage /> },
      { path: "/:slug", element: <ServicePage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
