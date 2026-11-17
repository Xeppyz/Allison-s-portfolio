// Función edge: sirve el index.html de Vite con el <head> correcto de cada URL.
// Vercel reescribe cualquier ruta sin extensión (salvo /admin y /api) a
// /api/render?__p=/<ruta>. Solo Web APIs; el SEO vive en src/lib/seo-head.ts.
import {
  blogIndexBody, metaForPath, postBody, renderBody, renderHead, routeForPath, stripIdentity,
} from '../src/lib/seo-head.ts'
import type { FaqRow, PageRow, PostMeta, PostSummary, SettingsRow } from '../src/lib/seo-head.ts'

export const config = { runtime: 'edge' }

declare const process: { env: Record<string, string | undefined> }

const SHELL_TTL_MS = 60_000
const TIMEOUT_MS = 3_000
const REST_TIMEOUT_MS = 1_500
const DATA_TTL_MS = 60_000
let shellCache: { text: string; at: number } | null = null

type AltRow = { slug: string; lang: string | null; noindex: boolean | null }
type SlugData = { page: PageRow | null; faqs: FaqRow[]; settings: SettingsRow | null; alt: AltRow | null }
// Resultados de Supabase por slug: los clics de anuncios llevan query y no pasan por la caché del CDN.
const dataCache = new Map<string, { data: SlugData; at: number }>()
const blogCache = new Map<string, { data: PostMeta | PostSummary[] | null; at: number }>()

const POST_COLS = 'id,published,focus_keyword,slug,title,seo_title,excerpt,published_at,updated_at,cover_url,cover_alt,tags,content_html'

/** Artículo (slug) o lista del blog (''); null = no existe. Lanza si Supabase falla. */
async function blogData(base: string, key: string, slug: string): Promise<PostMeta | PostSummary[] | null> {
  const cached = blogCache.get(slug)
  if (cached && Date.now() - cached.at < DATA_TTL_MS) return cached.data
  const data = slug
    ? ((await rest<PostMeta[]>(base, key, `posts?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=${POST_COLS}&limit=1`))[0] ?? null)
    : await rest<PostSummary[]>(base, key, 'posts?published=eq.true&select=id,slug,title,excerpt,published_at,cover_url,cover_alt&order=published_at.desc&limit=100')
  // No se cachean los que no existen (un borrador recién publicado aparece enseguida) y el mapa tiene tope.
  if (data !== null) {
    if (blogCache.size > 200) blogCache.clear()
    blogCache.set(slug, { data, at: Date.now() })
  }
  return data
}

const HTML_HEADERS = { 'content-type': 'text/html; charset=utf-8' }

async function getShell(req: Request): Promise<string | null> {
  if (shellCache && Date.now() - shellCache.at < SHELL_TTL_MS) return shellCache.text
  try {
    // Se reenvía la cookie del visitante: las vistas previas protegidas de Vercel la exigen.
    const cookie = req.headers.get('cookie')
    const res = await fetch(new URL('/index.html', req.url), {
      headers: cookie ? { cookie } : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`shell ${res.status}`)
    const text = await res.text()
    shellCache = { text, at: Date.now() }
    return text
  } catch {
    return shellCache?.text ?? null // mejor un shell viejo que nada
  }
}

function validPath(p: string | null): p is string {
  return !!p && p.startsWith('/') && p.length <= 200 && !p.includes('//') && !p.includes('..')
}

async function rest<T>(base: string, key: string, query: string): Promise<T> {
  const res = await fetch(`${base}/rest/v1/${query}`, {
    headers: { apikey: key, authorization: `Bearer ${key}`, accept: 'application/json' },
    signal: AbortSignal.timeout(REST_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`supabase ${res.status}`)
  return (await res.json()) as T
}

const PAGE_COLS = 'slug,lang,kind,meta_title,meta_description,h1,subheadline,active,noindex,og_image_url,alt_slug'

function noindexShell(shell: string): string {
  const tag = '<meta name="robots" content="noindex,nofollow" />'
  const re = /<meta\b[^>]*?\bname\s*=\s*["']robots["'][^>]*>/i
  return re.test(shell) ? shell.replace(re, () => tag) : shell.replace(/<\/head\s*>/i, () => `${tag}</head>`)
}

export default async function handler(req: Request): Promise<Response> {
  const shell = await getShell(req)
  if (shell === null) {
    // Sin shell no hay nada que servir; es el único caso que no puede ser 200.
    return new Response('Servicio no disponible', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    })
  }

  const notFound = () =>
    new Response(noindexShell(shell), {
      status: 404,
      headers: { ...HTML_HEADERS, 'cache-control': 'public, s-maxage=60' },
    })
  const unmodified = () =>
    new Response(stripIdentity(shell), { status: 200, headers: { ...HTML_HEADERS, 'cache-control': 'no-store' } })

  const params = new URL(req.url).searchParams
  if (params.getAll('__p').length !== 1) return unmodified()
  const path = params.get('__p')
  if (!validPath(path)) return notFound()
  const route = routeForPath(path)
  if (!route) return notFound()

  let page: PageRow | null = null
  let faqs: FaqRow[] = []
  let settings: SettingsRow | null = null
  let alt: AltRow | null = null
  let degraded = false

  if (route.type === 'page') {
    const base = process.env.VITE_SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY
    if (!base || !key) return unmodified()
    const cached = dataCache.get(route.slug)
    if (cached && Date.now() - cached.at < DATA_TTL_MS) {
      ;({ page, faqs, settings, alt } = cached.data)
    } else {
      const slug = encodeURIComponent(route.slug)
      const [p, f, s] = await Promise.allSettled([
        rest<PageRow[]>(base, key, `pages?slug=eq.${slug}&select=${PAGE_COLS}&limit=1`),
        rest<FaqRow[]>(
          base,
          key,
          `faqs?page_slug=eq.${slug}&active=eq.true&select=page_slug,question,answer,active,sort&order=sort.asc`,
        ),
        rest<SettingsRow[]>(base, key, 'site_settings?select=phone,email,address,hours&limit=1'),
      ])
      if (p.status === 'rejected') return unmodified() // sin la fila no se puede decidir nada
      page = p.value[0] ?? null
      if (f.status === 'fulfilled') faqs = f.value
      else degraded = true
      if (s.status === 'fulfilled') settings = s.value[0] ?? null
      else degraded = true
      if (page?.alt_slug) {
        // RLS oculta las páginas inactivas: si no se lee, no hay hreflang.
        try {
          alt =
            (
              await rest<AltRow[]>(
                base,
                key,
                `pages?slug=eq.${encodeURIComponent(page.alt_slug)}&select=slug,lang,noindex&limit=1`,
              )
            )[0] ?? null
        } catch {
          degraded = true
        }
      }
      if (!degraded) dataCache.set(route.slug, { data: { page, faqs, settings, alt }, at: Date.now() })
    }
  }

  let post: PostMeta | null = null
  let body = ''
  if (route.type === 'post' || route.type === 'blog') {
    const base = process.env.VITE_SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY
    if (!base || !key) return unmodified()
    try {
      const data = await blogData(base, key, route.type === 'post' ? route.slug : '')
      if (route.type === 'post') {
        post = data as PostMeta | null
        if (post) body = postBody(post)
      } else body = blogIndexBody((data as PostSummary[] | null) ?? [])
    } catch {
      if (route.type === 'post') return unmodified() // sin la fila no se sabe si existe
      degraded = true // la lista es un extra: la cabecera de /blog no depende de ella
    }
  }

  const meta = metaForPath(path, { page, faqs, settings, post, alt })
  if (!meta) {
    // Un borrador recién publicado no debe quedar como 404 en la CDN.
    if (route.type === 'post') return new Response(noindexShell(shell), { status: 404, headers: { ...HTML_HEADERS, 'cache-control': 'no-store' } })
    return notFound()
  }

  const head = renderHead(shell, meta)
  return new Response(body ? renderBody(head, body) : head, {
    status: 200,
    headers: {
      ...HTML_HEADERS,
      // Si faltó algo secundario (FAQ/ajustes) no se cachea una cabecera incompleta.
      'cache-control': degraded
        ? 'no-store'
        : body // el blog cambia más seguido: despublicar se nota en un minuto
          ? 'public, s-maxage=60, stale-while-revalidate=300'
          : 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
