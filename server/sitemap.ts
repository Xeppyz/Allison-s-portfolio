// Función edge: sitemap.xml dinámico a partir de las tablas `pages` y `posts`.
import { absoluteUrl, escapeHtml, pagePath } from '../src/lib/seo-head.ts'

export const config = { runtime: 'edge' }

declare const process: { env: Record<string, string | undefined> }

type Row = { slug: string; lang: string | null; noindex: boolean | null; alt_slug: string | null }
type Entry = { loc: string; lastmod?: string; alternates?: { hreflang: string; href: string }[] }
type PostRow = { slug: string; updated_at: string | null }

function xml(entries: Entry[], maxAge: number): Response {
  const body = entries
    .map((e) => {
      const links = (e.alternates ?? [])
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}" />`)
        .join('\n')
      const lastmod = e.lastmod ? `\n    <lastmod>${escapeHtml(e.lastmod.slice(0, 10))}</lastmod>` : ''
      return `  <url>\n    <loc>${escapeHtml(e.loc)}</loc>${lastmod}${links ? '\n' + links : ''}\n  </url>`
    })
    .join('\n')
  const doc =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    body +
    '\n</urlset>\n'
  return new Response(doc, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': maxAge ? `public, s-maxage=${maxAge}` : 'no-store',
    },
  })
}

export default async function handler(): Promise<Response> {
  const home: Entry = { loc: absoluteUrl('/') }
  const fixed: Entry[] = [{ loc: absoluteUrl('/contacto') }, { loc: absoluteUrl('/blog') }]

  const base = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!base || !key) return xml([home, ...fixed], 0)

  const get = async <T,>(query: string): Promise<T> => {
    const res = await fetch(`${base}/rest/v1/${query}`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) throw new Error(String(res.status))
    return (await res.json()) as T
  }

  const [pagesRes, postsRes] = await Promise.allSettled([
    get<Row[]>('pages?active=eq.true&select=slug,lang,noindex,alt_slug'),
    get<PostRow[]>('posts?published=eq.true&select=slug,updated_at&order=published_at.desc'),
  ])
  const posts: Entry[] =
    postsRes.status === 'fulfilled'
      ? postsRes.value.map((p) => ({ loc: absoluteUrl(`/blog/${p.slug}`), lastmod: p.updated_at ?? undefined }))
      : []
  const tail = [...fixed, ...posts]
  // Si algo falló: lo que se pudo leer, sin caché para recuperarse pronto.
  if (pagesRes.status === 'rejected') return xml([home, ...tail], 0)
  const rows = pagesRes.value
  const maxAge = postsRes.status === 'fulfilled' ? 3600 : 0

  const indexable = rows.filter((r) => !r.noindex)
  const bySlug = new Map(indexable.map((r) => [r.slug, r]))
  const lang = (r: Row) => (r.lang === 'en' ? 'en' : 'es')
  const urlOf = (r: Row) => absoluteUrl(pagePath(r.slug, lang(r)))

  const entryFor = (r: Row): Entry => {
    const alt = r.alt_slug ? bySlug.get(r.alt_slug) : undefined
    // Solo se declara el alterno si existe, es indexable y está en el otro idioma.
    if (!alt || lang(alt) === lang(r)) return { loc: urlOf(r) }
    const es = lang(r) === 'es' ? r : alt
    const en = lang(r) === 'en' ? r : alt
    return {
      loc: urlOf(r),
      alternates: [
        { hreflang: 'es', href: urlOf(es) },
        { hreflang: 'en', href: urlOf(en) },
        { hreflang: 'x-default', href: urlOf(es) },
      ],
    }
  }

  const homeRow = bySlug.get('inicio')
  const pages = indexable.filter((r) => r.slug !== 'inicio').map(entryFor)
  return xml([homeRow ? entryFor(homeRow) : home, ...pages, ...tail], maxAge)
}
