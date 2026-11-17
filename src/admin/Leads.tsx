import { useCallback, useEffect, useMemo, useState } from 'react'
import { Mail, MessageCircle, Search, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { campaignCode, type Utm } from '../lib/whatsapp'
import type { Lead } from '../lib/content'
import { leadOrigin } from './origin'
import { btn, card, inputCls } from './ui'

function ContactValue({ value }: { value: string | null }) {
  const v = (value ?? '').trim()
  if (v.includes('@')) {
    return <a href={`mailto:${v}`} className="inline-flex items-center gap-1.5 font-medium text-navy underline decoration-taupe underline-offset-4"><Mail className="h-4 w-4 text-taupe" />{v}</a>
  }
  const digits = v.replace(/\D/g, '')
  if (digits.length >= 8) {
    return (
      <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener"
        className="inline-flex items-center gap-1.5 font-medium text-navy underline decoration-taupe underline-offset-4">
        <MessageCircle className="h-4 w-4 text-[#25D366]" />{v}
      </a>
    )
  }
  return <>{v}</>
}

const initials = (name: string | null) =>
  (name ?? '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?'

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('leads').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else {
      setError('')
      setLeads((data ?? []) as Lead[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase()
    if (!n) return leads
    return leads.filter((l) =>
      [l.name, l.contact, l.company, l.service, l.country, l.message].some((v) => (v ?? '').toLowerCase().includes(n)),
    )
  }, [leads, q])

  async function remove(lead: Lead) {
    if (!window.confirm(`¿Borrar “${lead.name ?? ''}”? No se puede deshacer.`)) return
    const { error } = await supabase!.from('leads').delete().eq('id', lead.id)
    if (error) setError(error.message)
    else await load()
  }

  if (loading) {
    return <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-sand" />)}</div>
  }

  return (
    <div className="space-y-5">
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" aria-hidden="true" />
        <label htmlFor="leads-q" className="sr-only">Buscar contactos</label>
        <input id="leads-q" type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, servicio, empresa…" className={`${inputCls} pl-10`} />
      </div>
      {leads.length === 0 && !error && (
        <p className={`${card} px-6 py-12 text-center text-navy/60`}>Aún no hay contactos. Aparecerán aquí cuando alguien llene el formulario.</p>
      )}
      <ul className="space-y-3">
        {shown.map((l) => {
          const utm = (l.utm ?? {}) as Utm
          const campaign = campaignCode(utm)
          const origin = leadOrigin(utm)
          return (
            <li key={l.id} className={`${card} p-5`}>
              <div className="flex flex-wrap items-start gap-4">
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand font-serif text-navy">
                  {initials(l.name)}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-serif text-lg text-navy">{l.name}</span>
                    <time className="text-xs text-navy/50">
                      {l.created_at ? new Date(l.created_at).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                    </time>
                  </div>
                  <ContactValue value={l.contact} />
                </div>
                <button type="button" aria-label={`Borrar ${l.name ?? 'contacto'}`} title="Borrar"
                  className={`${btn.ghost} hover:bg-red-50 hover:text-red-700`} onClick={() => void remove(l)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {([['Servicio', l.service], ['Empresa', l.company], ['País', l.country], ['Página', l.page]] as const).map(([k, v]) =>
                  v ? (
                    <div key={k}>
                      <dt className="text-xs text-navy/50">{k}</dt>
                      <dd className="break-words text-navy">{v}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
              {l.message && <p className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-ivory p-3 text-sm text-navy/80">{l.message}</p>}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-sand px-2.5 py-1 font-semibold text-taupe-deep">{origin}</span>
                {campaign && <span className="rounded-full border border-navy/15 px-2.5 py-1 font-mono text-navy/70">{campaign}</span>}
              </div>
            </li>
          )
        })}
      </ul>
      {q && shown.length === 0 && <p className="text-navy/60">Sin resultados para “{q}”.</p>}
    </div>
  )
}
