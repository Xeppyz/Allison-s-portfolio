// Función edge: sitemap.xml dinámico a partir de la tabla `pages` y del blog.
import { absoluteUrl, escapeHtml, pagePath } from '../src/lib/seo-head.ts'
import { blogPosts } from '../src/data/BlogPost.tsx'

export const config = { runtime: 'edge' }

declare const process: { env: Record<string, string | undefined> }

type Row = { slug: string; lang: string | null; noindex: boolean | null; alt_slug: string | null }
type Entry = { loc: string; alternates?: { hreflang: string; href: string }[] }

function xml(entries: Entry[], maxAge: number): Response {
  const body = entries
    .map((e) => {
      const links = (e.alternates ?? [])
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}" />`)
        .join('\n')
      return `  <url>\n    <loc>${escapeHtml(e.loc)}</loc>${links ? '\n' + links : ''}\n  </url>`
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
  const tail: Entry[] = [
    { loc: absoluteUrl('/contacto') },
    { loc: absoluteUrl('/blog') },
    ...blogPosts.map((b) => ({ loc: absoluteUrl(`/blog/${b.slug}`) })),
  ]
  const home: Entry = { loc: absoluteUrl('/') }

  const base = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!base || !key) return xml([home, ...tail], 0)

  let rows: Row[]
  try {
    const res = await fetch(`${base}/rest/v1/pages?active=eq.true&select=slug,lang,noindex,alt_slug`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) throw new Error(String(res.status))
    rows = (await res.json()) as Row[]
  } catch {
    return xml([home, ...tail], 0) // solo rutas estáticas, sin caché para recuperarse pronto
  }

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
  return xml([homeRow ? entryFor(homeRow) : home, ...pages, ...tail], 3600)
}
