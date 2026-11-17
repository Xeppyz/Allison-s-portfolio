import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/playfair-display/wght.css'
import './index.css'
import './styles/article.css'

// IMPORTANTE: createBrowserRouter y RouterProvider se importan de react-router-dom
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// El inicio va en el paquete principal; el resto de páginas se descarga al visitarlas.
import Home from './pages/Home.tsx'
import SiteLayout from './components/SiteLayout.tsx'

const Admin = lazy(() => import('./admin/Admin.tsx'))

const service = (slug?: string) => async () => {
  const { default: ServicePage } = await import('./pages/ServicePage.tsx')
  return { Component: () => <ServicePage slug={slug} /> }
}
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default })

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
      { path: "/", element: <Home /> },
      { path: "/planes", lazy: service("planes") },
      { path: "/privacidad", lazy: page(() => import('./pages/LegalPage.tsx')) },
      { path: "/terminos", lazy: page(() => import('./pages/LegalPage.tsx')) },
      { path: "/contacto", lazy: page(() => import('./pages/ContactPage.tsx')) },
      { path: "/blog", lazy: page(() => import('./pages/BlogPageIndex.tsx')) },
      { path: "/blog/:slug", lazy: page(() => import('./pages/BlogPost.tsx')) },
      { path: "/en/:slug", lazy: service() },
      { path: "/:slug", lazy: service() },
      { path: "*", lazy: page(() => import('./pages/NotFound.tsx')) },
    ],
  },
])

// Se monta cuando la página de la URL ya está descargada: así el HTML del servidor
// sigue visible mientras tanto, sin parpadeo ni pantalla en blanco.
function mount() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
if (router.state.initialized) mount()
else {
  const stop = router.subscribe((s) => {
    if (s.initialized) {
      stop()
      mount()
    }
  })
}
