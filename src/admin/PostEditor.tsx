import { useMemo, useState } from 'react'
import { ArrowLeft, ExternalLink, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Post } from '../lib/content'
import { slugify } from '../lib/seo-score'
import { POST_TITLE_SUFFIX } from '../lib/seo-head'
import RichEditor from './RichEditor'
import { postSeoInput } from './scores'
import SeoPanel from './SeoPanel'
import { Counter, ImageInput, Toggle } from './FieldInput'
import { btn, card, eyebrow, helpCls, inputCls, labelCls, textareaCls } from './ui'
import { confirmDiscard, useUnsavedWarning } from './useDirty'

type Form = {
  title: string
  slug: string
  seo_title: string
  excerpt: string
  focus_keyword: string
  content_html: string
  cover_url: string
  cover_alt: string
  tags: string
  published: boolean
  published_at: string
}

const today = () => new Date().toISOString().slice(0, 10)

function toForm(p: Post | null): Form {
  return {
    title: p?.title ?? '',
    slug: p?.slug ?? '',
    seo_title: p?.seo_title ?? '',
    excerpt: p?.excerpt ?? '',
    focus_keyword: p?.focus_keyword ?? '',
    content_html: p?.content_html ?? '',
    cover_url: p?.cover_url ?? '',
    cover_alt: p?.cover_alt ?? '',
    tags: (p?.tags ?? []).join(', '),
    published: p?.published ?? false,
    published_at: p?.published_at ?? today(),
  }
}

const nul = (s: string) => (s.trim() === '' ? null : s.trim())

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`${card} space-y-4 p-5`}>
      <h2 className={eyebrow} style={{ fontFamily: 'inherit', letterSpacing: '0.18em' }}>{title}</h2>
      {children}
    </section>
  )
}

export default function PostEditor({ post, onBack, onSaved }: {
  post: Post | null
  onBack: () => void
  onSaved: (p: Post) => void
}) {
  const [current, setCurrent] = useState<Post | null>(post)
  const [form, setForm] = useState<Form>(() => toForm(post))
  const [saved, setSaved] = useState<Form>(() => toForm(post))
  const [slugTouched, setSlugTouched] = useState(!!post)
  const [saving, setSaving] = useState(false)
  const [uploads, setUploads] = useState(0)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  useUnsavedWarning(dirty)

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => {
      const next = { ...f, [k]: v }
      if (k === 'title' && !slugTouched) next.slug = slugify(String(v))
      return next
    })

  const seoInput = useMemo(() => postSeoInput(form), [form])

  async function save(publish?: boolean) {
    if (!supabase) return
    setError('')
    const sent = form
    const f = publish === undefined ? form : { ...form, published: publish }
    // Al publicar por primera vez, la fecha es hoy salvo que se haya elegido otra.
    if (publish === true && !current?.published && f.published_at === saved.published_at) f.published_at = today()
    if (!f.title.trim()) return setError('Escribe un título.')
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) return setError('La dirección solo puede tener minúsculas, números y guiones.')
    if (f.published && !f.content_html.trim()) return setError('No se puede publicar un artículo vacío.')
    setSaving(true)
    const payload = {
      title: f.title.trim(),
      slug: f.slug,
      seo_title: nul(f.seo_title),
      excerpt: nul(f.excerpt),
      focus_keyword: nul(f.focus_keyword),
      content_html: f.content_html,
      cover_url: nul(f.cover_url),
      cover_alt: nul(f.cover_alt),
      tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean),
      published: f.published,
      published_at: f.published_at || today(),
    }
    const res = current
      ? await supabase.from('posts').update(payload).eq('id', current.id).select().single<Post>()
      : await supabase.from('posts').insert(payload).select().single<Post>()
    setSaving(false)
    if (res.error) {
      return setError(res.error.code === '23505' ? 'Ya existe un artículo con esa dirección. Cambia la dirección.' : res.error.message)
    }
    const next = toForm(res.data)
    setCurrent(res.data)
    // Si se siguió escribiendo durante el guardado, no se pisa: queda como cambio pendiente.
    setForm((prev) => (prev === sent ? next : { ...prev, slug: next.slug, published: next.published, published_at: next.published_at }))
    setSaved(next)
    setSlugTouched(true)
    onSaved(res.data)
    setToast(publish === true ? 'Publicado' : publish === false ? 'Pasado a borrador' : 'Guardado')
    window.setTimeout(() => setToast(''), 2500)
  }

  const slugChangedWhilePublished = !!current?.published && current.slug !== form.slug

  return (
    <div className="pb-28">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" className={btn.ghost} onClick={() => confirmDiscard(dirty) && onBack()}>
          <ArrowLeft className="h-4 w-4" /> Artículos
        </button>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${form.published ? 'bg-emerald-50 text-emerald-700' : 'bg-sand text-taupe-deep'}`}>
          {saved.published ? 'Publicado' : 'Borrador'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-4">
          <label htmlFor="post-title" className="sr-only">Título del artículo</label>
          <textarea
            id="post-title" rows={1} value={form.title} placeholder="Título del artículo"
            onChange={(e) => set('title', e.target.value.replace(/\n/g, ' '))}
            className="field-sizing-content w-full resize-none border-0 bg-transparent font-serif text-3xl leading-tight text-navy placeholder:text-navy/30 focus:outline-none sm:text-4xl"
          />
          <RichEditor label="Contenido del artículo" value={form.content_html}
            onChange={(html) => set('content_html', html)} onBusy={(b) => setUploads((n) => n + (b ? 1 : -1))} />
        </div>

        <aside className="space-y-5">
          <Section title="Publicación">
            <Toggle id="post-published" checked={form.published} onChange={(v) => set('published', v)}
              label="Publicado" help="Si está apagado, es un borrador: solo tú lo ves." />
            <div className="space-y-1.5">
              <label htmlFor="post-date" className={labelCls}>Fecha</label>
              <input id="post-date" type="date" className={inputCls} value={form.published_at}
                onChange={(e) => set('published_at', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="post-slug" className={labelCls}>Dirección</label>
              <div className="flex items-center rounded-xl border border-navy/15 bg-ivory pl-3 focus-within:border-navy">
                <span className="shrink-0 text-sm text-navy/50">/blog/</span>
                <input id="post-slug" value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    const raw = e.target.value
                    const slug = slugify(raw)
                    set('slug', slug && /[-\s_]$/.test(raw) ? `${slug}-` : slug)
                  }}
                  onBlur={() => set('slug', slugify(form.slug))}
                  className="h-11 min-w-0 flex-1 bg-transparent pr-3 text-base text-navy focus:outline-none" />
              </div>
              {slugChangedWhilePublished && (
                <p className="text-xs text-amber-700">Cambiar la dirección de un artículo publicado rompe los enlaces que ya existan.</p>
              )}
            </div>
          </Section>

          <Section title="Portada">
            <ImageInput id="post-cover" wide value={form.cover_url} onChange={(v) => set('cover_url', v)}
              onBusy={(b) => setUploads((n) => n + (b ? 1 : -1))} />
            <div className="space-y-1.5">
              <label htmlFor="post-cover-alt" className={labelCls}>Texto alternativo</label>
              <input id="post-cover-alt" className={inputCls} value={form.cover_alt} placeholder="Qué muestra la imagen"
                onChange={(e) => set('cover_alt', e.target.value)} />
            </div>
            <p className={helpCls}>Se usa también al compartir en WhatsApp, Facebook y LinkedIn.</p>
          </Section>

          <Section title="SEO">
            <div className="space-y-1.5">
              <label htmlFor="post-kw" className={labelCls}>Palabra clave principal</label>
              <input id="post-kw" className={inputCls} value={form.focus_keyword} placeholder="Ej.: QuickBooks Online"
                onChange={(e) => set('focus_keyword', e.target.value)} />
              <p className={helpCls}>La búsqueda por la que quieres aparecer en Google.</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="post-seo-title" className={labelCls}>Título para Google</label>
                <Counter n={(form.seo_title || form.title).length + POST_TITLE_SUFFIX.length} min={30} max={60} />
              </div>
              <input id="post-seo-title" className={inputCls} value={form.seo_title} placeholder={form.title || 'Si se deja vacío, se usa el título'}
                onChange={(e) => set('seo_title', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="post-excerpt" className={labelCls}>Descripción</label>
                <Counter n={form.excerpt.length} min={120} max={160} />
              </div>
              <textarea id="post-excerpt" rows={3} className={textareaCls} value={form.excerpt}
                placeholder="Resumen que aparece en Google y en la tarjeta del blog"
                onChange={(e) => set('excerpt', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="post-tags" className={labelCls}>Etiquetas</label>
              <input id="post-tags" className={inputCls} value={form.tags} placeholder="DGI, RUC, Nicaragua"
                onChange={(e) => set('tags', e.target.value)} />
            </div>
            <div className="border-t border-navy/10 pt-5">
              <SeoPanel input={seoInput} path={`/blog/${form.slug}`} />
            </div>
          </Section>
        </aside>
      </div>

      {/* Barra de guardar fija */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <p className="mr-auto text-sm" role="status" aria-live="polite">
            {toast ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700"><Check className="h-4 w-4" />{toast}</span>
            ) : error ? (
              <span className="text-red-700">{error}</span>
            ) : dirty ? (
              <span className="text-amber-700">Cambios sin guardar</span>
            ) : (
              <span className="text-navy/50">Todo guardado</span>
            )}
          </p>
          {current && (
            <a href={`/blog/${current.slug}`} target="_blank" rel="noopener" className={btn.ghost}>
              <ExternalLink className="h-4 w-4" /> {current.published ? 'Ver' : 'Vista previa'}
            </a>
          )}
          <button type="button" className={btn.secondary} disabled={saving || uploads > 0} onClick={() => void save()}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          {!saved.published && (
            <button type="button" className={btn.primary} disabled={saving || uploads > 0} onClick={() => void save(true)}>
              Publicar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
