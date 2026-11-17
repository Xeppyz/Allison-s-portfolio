import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { campaignCode, type Utm } from '../lib/whatsapp'
import type { Lead } from '../lib/content'

function adNetwork(utm: Utm): string {
  if (utm.gclid || utm.gbraid || utm.wbraid) return 'Google Ads'
  if (utm.fbclid) return 'Meta Ads'
  if (utm.msclkid) return 'Microsoft Ads'
  return ''
}

function ContactValue({ value }: { value: string | null }) {
  const v = (value ?? '').trim()
  if (v.includes('@')) return <a href={`mailto:${v}`} className="underline">{v}</a>
  const digits = v.replace(/\D/g, '')
  if (digits.length >= 8) {
    return <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener" className="underline">{v}</a>
  }
  return <>{v}</>
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  async function remove(lead: Lead) {
    if (!window.confirm(`¿Borrar “${lead.name ?? ''}”? No se puede deshacer.`)) return
    const { error } = await supabase!.from('leads').delete().eq('id', lead.id)
    if (error) setError(error.message)
    else await load()
  }

  if (loading) return <p className="text-slate-600">Cargando…</p>

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {leads.length === 0 && !error && <p className="text-slate-600">Aún no hay contactos.</p>}
      <ul className="space-y-3">
        {leads.map((l) => {
          const utm = (l.utm ?? {}) as Utm
          const campaign = campaignCode(utm)
          const network = adNetwork(utm)
          return (
            <li key={l.id} className="space-y-1 rounded-md border border-slate-200 bg-white p-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold">{l.name}</span>
                <time className="text-slate-600">
                  {l.created_at ? new Date(l.created_at).toLocaleString('es') : ''}
                </time>
              </div>
              <p><span className="text-slate-600">Contacto:</span> <ContactValue value={l.contact} /></p>
              <p><span className="text-slate-600">Empresa:</span> {l.company}</p>
              <p><span className="text-slate-600">País:</span> {l.country}</p>
              <p><span className="text-slate-600">Servicio:</span> {l.service}</p>
              <p><span className="text-slate-600">Página:</span> {l.page}</p>
              {(campaign || network) && (
                <p>
                  <span className="text-slate-600">Campaña:</span> {campaign}
                  {network && <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{network}</span>}
                </p>
              )}
              {l.message && <p className="whitespace-pre-wrap break-words">{l.message}</p>}
              <button type="button" onClick={() => void remove(l)}
                className="min-h-11 rounded-md border border-red-300 px-3 font-medium text-red-700">
                Borrar
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
