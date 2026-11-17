import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, ArrowDownRight, CheckCircle2, Circle, PenLine } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Lead, Post, Settings } from '../lib/content'
import type { Utm } from '../lib/whatsapp'
import { scoreTone } from '../lib/seo-score'
import { ScoreBadge } from './SeoPanel'
import { pageLabel, pageScore, postScore } from './scores'
import { leadOrigin } from './origin'
import { btn, card, eyebrow, toneCls } from './ui'

type Row = Record<string, unknown>
type Go = (section: string, open?: string) => void
type Data = { leads: Lead[]; posts: Post[]; pages: Row[]; settings: Settings | null; authorized: number }

function Stat({ label, value, sub, children }: { label: string; value: React.ReactNode; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className={`${card} p-5`}>
      <p className={eyebrow}>{label}</p>
      <p className="mt-3 font-serif text-4xl text-navy">{value}</p>
      {sub && <p className="mt-1 text-sm text-navy/60">{sub}</p>}
      {children}
    </div>
  )
}

const monthStart = (offset = 0) => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() + offset, 1).getTime()
}

export default function Dashboard({ go }: { go: Go }) {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    void Promise.all([
      supabase.from('leads').select('id,name,service,utm,created_at').order('created_at', { ascending: false }),
      supabase.from('posts').select('*'),
      supabase.from('pages').select('*'),
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('authorized', true).eq('active', true),
    ]).then(([l, p, pg, s, t]) => {
      const err = l.error ?? p.error ?? pg.error ?? s.error ?? t.error
      if (err) return setError(err.message)
      setData({
        leads: (l.data ?? []) as Lead[],
        posts: (p.data ?? []) as Post[],
        pages: (pg.data ?? []) as Row[],
        settings: s.data as Settings | null,
        authorized: t.count ?? 0,
      })
    })
  }, [])

  if (error) return <p role="alert" className="text-red-700">{error}</p>
  if (!data) {
    return <div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-sand" />)}</div>
  }

  const at = (l: Lead) => (l.created_at ? new Date(l.created_at).getTime() : 0)
  const thisMonth = data.leads.filter((l) => at(l) >= monthStart(0))
  const lastMonth = data.leads.filter((l) => at(l) >= monthStart(-1) && at(l) < monthStart(0))
  const delta = thisMonth.length - lastMonth.length

  const origins = new Map<string, number>()
  for (const l of thisMonth) {
    const o = leadOrigin(l.utm as Utm)
    origins.set(o, (origins.get(o) ?? 0) + 1)
  }
  const originList = [...origins.entries()].sort((a, b) => b[1] - a[1])
  const maxOrigin = Math.max(1, ...originList.map(([, n]) => n))

  const scored = [
    ...data.posts.filter((p) => p.published).map((p) => ({ key: `post-${p.id}`, label: p.title, sub: `/blog/${p.slug}`, score: postScore(p), go: () => go('posts', p.id) })),
    ...data.pages.filter((p) => p.active !== false && p.kind !== 'legal').map((p) => ({ key: `page-${String(p.id)}`, label: pageLabel(p), sub: String(p.meta_title ?? ''), score: pageScore(p), go: () => go('pages', String(p.id)) })),
  ].sort((a, b) => a.score - b.score)
  const avg = scored.length ? Math.round(scored.reduce((n, x) => n + x.score, 0) / scored.length) : 0

  const drafts = data.posts.filter((p) => !p.published).length
  const s = data.settings
  const setup = [
    { done: !!s?.whatsapp_number, label: 'Número de WhatsApp', go: () => go('site_settings') },
    { done: !!s?.gtm_id, label: 'Google Tag Manager (medir anuncios)', go: () => go('site_settings') },
    { done: !!s?.gbp_url, label: 'Enlace de Google Business', go: () => go('site_settings') },
    { done: data.authorized > 0, label: 'Testimonios autorizados', go: () => go('testimonials') },
    { done: data.posts.some((p) => p.published && Date.now() - new Date(p.published_at).getTime() < 45 * 864e5), label: 'Un artículo nuevo este mes', go: () => go('posts', 'new') },
  ]
  const pendingSetup = setup.filter((x) => !x.done).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Contactos este mes"
          value={thisMonth.length}
          sub={
            <span className={`inline-flex items-center gap-1 ${delta > 0 ? 'text-emerald-700' : delta < 0 ? 'text-red-700' : ''}`}>
              {delta > 0 ? <ArrowUpRight className="h-4 w-4" /> : delta < 0 ? <ArrowDownRight className="h-4 w-4" /> : null}
              {delta === 0 ? 'Igual que' : `${Math.abs(delta)} ${delta > 0 ? 'más' : 'menos'} que`} el mes pasado ({lastMonth.length})
            </span>
          }
        />
        <Stat label="Contactos en total" value={data.leads.length} sub="Desde que se lanzó el formulario" />
        <Stat label="SEO promedio" value={<span className={toneCls[scoreTone(avg)].text}>{avg}</span>} sub={`${scored.length} páginas y artículos publicados`} />
        <Stat label="Artículos" value={data.posts.filter((p) => p.published).length} sub={drafts ? `${drafts} en borrador` : 'Ningún borrador pendiente'}>
          <button type="button" className={`${btn.secondary} mt-4 w-full`} onClick={() => go('posts', 'new')}>
            <PenLine className="h-4 w-4" /> Escribir artículo
          </button>
        </Stat>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className={`${card} p-5`}>
          <h2 className={eyebrow} style={{ fontFamily: 'inherit' }}>De dónde llegan este mes</h2>
          {originList.length === 0 ? (
            <p className="mt-4 text-sm text-navy/60">Todavía no hay contactos este mes.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {originList.map(([o, n]) => (
                <li key={o}>
                  <div className="flex justify-between text-sm"><span className="text-navy">{o}</span><span className="font-semibold tabular-nums text-navy">{n}</span></div>
                  <div className="mt-1.5 h-2 rounded-full bg-sand">
                    <div className="h-2 rounded-full bg-navy transition-[width] duration-700" style={{ width: `${(n / maxOrigin) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-navy/50">Se detecta con los parámetros del anuncio (gclid, fbclid, utm) al llegar a la web.</p>
        </section>

        <section className={`${card} p-5`}>
          <div className="flex items-baseline justify-between">
            <h2 className={eyebrow} style={{ fontFamily: 'inherit' }}>Listo para la campaña</h2>
            <span className="text-sm text-navy/60">{setup.length - pendingSetup} de {setup.length}</span>
          </div>
          <ul className="mt-3 divide-y divide-navy/10">
            {setup.map((x) => (
              <li key={x.label}>
                <button type="button" onClick={x.go} className="flex w-full items-center gap-3 py-2.5 text-left text-sm hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded">
                  {x.done ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Circle className="h-5 w-5 text-navy/25" />}
                  <span className={x.done ? 'text-navy/50 line-through' : 'text-navy'}>{x.label}</span>
                  {!x.done && <ArrowRight className="ml-auto h-4 w-4 text-navy/40" />}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className={`${card} p-5`}>
          <h2 className={eyebrow} style={{ fontFamily: 'inherit' }}>SEO por mejorar</h2>
          <ul className="mt-3 divide-y divide-navy/10">
            {scored.slice(0, 5).map((x) => (
              <li key={x.key}>
                <button type="button" onClick={x.go} className="flex w-full items-center gap-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-navy">{x.label}</span>
                    {x.sub && <span className="block truncate text-xs text-navy/50">{x.sub}</span>}
                  </span>
                  <ScoreBadge score={x.score} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${card} p-5`}>
          <div className="flex items-baseline justify-between">
            <h2 className={eyebrow} style={{ fontFamily: 'inherit' }}>Últimos contactos</h2>
            <button type="button" className="text-sm font-semibold text-navy underline decoration-taupe underline-offset-4" onClick={() => go('leads')}>Ver todos</button>
          </div>
          {data.leads.length === 0 ? (
            <p className="mt-4 text-sm text-navy/60">Aún no hay contactos.</p>
          ) : (
            <ul className="mt-3 divide-y divide-navy/10">
              {data.leads.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-navy">{l.name}</span>
                    <span className="block truncate text-xs text-navy/50">{l.service || '—'} · {leadOrigin(l.utm as Utm)}</span>
                  </span>
                  <time className="shrink-0 text-xs text-navy/50">
                    {l.created_at ? new Date(l.created_at).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : ''}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
