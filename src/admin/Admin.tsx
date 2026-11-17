import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Login from './Login'
import Crud from './Crud'
import Leads from './Leads'
import { tables } from './fields'

const sections = [
  ...Object.entries(tables).map(([key, t]) => ({ key, label: t.label })),
  { key: 'leads', label: 'Contactos' },
]

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [section, setSection] = useState(sections[0].key)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
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

  if (!supabase) return <p className="p-6">Falta configurar Supabase.</p>
  if (!ready) return <p className="p-6 text-slate-600">Cargando…</p>
  if (!session) return <Login />
  if (isAdmin === null) return <p className="p-6 text-slate-600">Cargando…</p>
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <p className="mb-4">Tu cuenta no tiene permisos de administración.</p>
        <button type="button" onClick={() => void supabase!.auth.signOut()}
          className="min-h-11 rounded-md bg-[#1E3A5F] px-4 text-sm font-medium text-white">
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-[#1E3A5F] px-4 py-3 text-white">
        <h1 className="text-lg font-semibold">Panel de administración</h1>
        <button type="button" onClick={() => void supabase!.auth.signOut()}
          className="min-h-11 rounded-md border border-white/60 px-4 text-sm font-medium hover:bg-white/10">
          Cerrar sesión
        </button>
      </header>
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <div>
          <label htmlFor="section" className="mb-1 block text-sm font-medium">Sección</label>
          <select id="section" value={section} onChange={(e) => setSection(e.target.value)}
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base">
            {sections.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        {section === 'leads' ? <Leads /> : <Crud key={section} table={section} />}
      </div>
    </div>
  )
}
