import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  LayoutDashboard, PenSquare, FileText, Briefcase, Tags, MessageSquareQuote, CircleHelp, Inbox, Settings, LogOut,
  ExternalLink, Menu, X,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import Login from './Login'
import Crud from './Crud'
import Leads from './Leads'
import Posts from './Posts'
import Dashboard from './Dashboard'
import { btn } from './ui'

type Item = { key: string; label: string; desc: string; icon: typeof Inbox }
const groups: { title: string; items: Item[] }[] = [
  { title: '', items: [{ key: 'dashboard', label: 'Resumen', desc: 'Cómo va la web y qué falta para la campaña.', icon: LayoutDashboard }] },
  {
    title: 'Contenido',
    items: [
      { key: 'posts', label: 'Blog', desc: 'Escribe y publica artículos. El puntaje SEO te guía mientras escribes.', icon: PenSquare },
      { key: 'pages', label: 'Páginas', desc: 'Textos, SEO y estado de cada página del sitio.', icon: FileText },
      { key: 'services', label: 'Servicios', desc: 'Tarjetas de la sección de servicios del inicio.', icon: Briefcase },
      { key: 'plans', label: 'Planes', desc: 'Precios y lo que incluye cada plan.', icon: Tags },
      { key: 'testimonials', label: 'Testimonios', desc: 'Solo se muestran los autorizados por escrito.', icon: MessageSquareQuote },
      { key: 'faqs', label: 'Preguntas frecuentes', desc: 'Preguntas por página. También ayudan en Google.', icon: CircleHelp },
    ],
  },
  { title: 'Clientes', items: [{ key: 'leads', label: 'Contactos', desc: 'Quién escribió desde el formulario y de qué anuncio llegó.', icon: Inbox }] },
  { title: 'Configuración', items: [{ key: 'site_settings', label: 'Datos del sitio', desc: 'WhatsApp, teléfono, correo, horario y medición.', icon: Settings }] },
]
const all = groups.flatMap((g) => g.items)

const fromHash = () => {
  const k = window.location.hash.slice(1)
  return all.some((i) => i.key === k) ? k : 'dashboard'
}

function Shell({ email, children }: { email: string; children: (nav: { section: string; open?: string; go: (s: string, open?: string) => void }) => React.ReactNode }) {
  const [nav, setNav] = useState<{ section: string; open?: string; n: number }>({ section: fromHash(), n: 0 })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setNav((v) => ({ section: fromHash(), n: v.n + 1 }))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (section: string, open?: string) => {
    setNav((v) => ({ section, open, n: v.n + 1 }))
    setMenuOpen(false)
    if (window.location.hash.slice(1) !== section) history.replaceState(null, '', `#${section}`)
    window.scrollTo({ top: 0 })
  }
  const current = all.find((i) => i.key === nav.section)!

  const navList = (
    <nav aria-label="Secciones del panel" className="space-y-6">
      {groups.map((g) => (
        <div key={g.title || 'main'}>
          {g.title && <p className="mb-2 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/40">{g.title}</p>}
          <ul className="space-y-0.5">
            {g.items.map((i) => {
              const active = i.key === nav.section
              const Icon = i.icon
              return (
                <li key={i.key}>
                  <a
                    href={`#${i.key}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={(e) => { e.preventDefault(); go(i.key) }}
                    className={`flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      active ? 'bg-white text-navy font-semibold' : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-taupe-deep' : ''}`} aria-hidden="true" />
                    {i.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  const footer = (
    <div className="space-y-2 border-t border-white/10 pt-4 text-sm">
      <a href="/" target="_blank" rel="noopener" className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white">
        <ExternalLink className="h-4 w-4" aria-hidden="true" /> Ver el sitio
      </a>
      <p className="truncate px-3 text-xs text-white/40" title={email}>{email}</p>
      <button type="button" onClick={() => void supabase!.auth.signOut()}
        className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white">
        <LogOut className="h-4 w-4" aria-hidden="true" /> Cerrar sesión
      </button>
    </div>
  )

  const brand = (
    <div>
      <p className="font-serif text-xl leading-tight text-white">Allison Silva</p>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-taupe">Panel</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-ivory text-navy">
      {/* Lateral (escritorio) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between gap-6 overflow-y-auto bg-navy px-4 py-6 lg:flex">
        <div className="space-y-8">
          <div className="px-3">{brand}</div>
          {navList}
        </div>
        {footer}
      </aside>

      {/* Barra superior (móvil) */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-navy px-4 py-3 lg:hidden">
        {brand}
        <button type="button" aria-expanded={menuOpen} aria-controls="admin-menu" onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
        </button>
      </header>
      {menuOpen && (
        <div id="admin-menu" className="fixed inset-x-0 bottom-0 top-[68px] z-40 space-y-6 overflow-y-auto bg-navy px-4 pb-8 lg:hidden">
          {navList}
          {footer}
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
          <header className="mb-8">
            <span aria-hidden="true" className="mb-4 block h-px w-12 bg-taupe" />
            <h1 className="text-3xl font-medium text-navy lg:text-4xl">{current.label}</h1>
            <p className="mt-2 text-navy/60">{current.desc}</p>
          </header>
          <div key={nav.n}>{children({ section: nav.section, open: nav.open, go })}</div>
        </div>
      </main>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    document.title = 'Panel | Allison Silva'
    return () => meta.remove()
  }, [])

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setReady(true)
      }
    })
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      // Solo un cierre de sesión explícito saca al usuario; así no se pierde lo que está escribiendo.
      if (event === 'SIGNED_OUT') setSession(null)
      else if (s) setSession(s)
      setReady(true)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user.id
  useEffect(() => {
    if (!supabase || !userId) {
      setIsAdmin(null)
      return
    }
    let active = true
    setIsAdmin(null)
    void supabase.rpc('is_admin').then(({ data, error }) => {
      if (active) setIsAdmin(!error && data === true)
    })
    return () => {
      active = false
    }
  }, [userId])

  const loadingScreen = (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <p className="animate-pulse font-serif text-xl text-navy/60">Cargando…</p>
    </div>
  )

  if (!supabase) return <p className="p-6">Falta configurar Supabase.</p>
  if (!ready) return loadingScreen
  if (!session) return <Login />
  if (isAdmin === null) return loadingScreen
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory p-6 text-navy">
        <div className="max-w-sm space-y-4 text-center">
          <p className="font-serif text-2xl">Sin permisos</p>
          <p className="text-navy/70">Tu cuenta no tiene permisos de administración.</p>
          <button type="button" onClick={() => void supabase!.auth.signOut()} className={btn.primary}>Cerrar sesión</button>
        </div>
      </div>
    )
  }

  return (
    <Shell email={session.user.email ?? ''}>
      {({ section, open, go }) =>
        section === 'dashboard' ? <Dashboard go={go} />
          : section === 'posts' ? <Posts initial={open} />
            : section === 'leads' ? <Leads />
              : <Crud table={section} initial={open} />
      }
    </Shell>
  )
}
