// Función edge: sirve el index.html de Vite con el <head> correcto de cada URL.
// Vercel reescribe cualquier ruta sin extensión (salvo /admin y /api) a
// /api/render?path=/<ruta>. Solo Web APIs; el SEO vive en src/lib/seo-head.ts.
import { metaForPath, renderHead, routeForPath } from '../src/lib/seo-head.ts'
import type { FaqRow, PageRow, SettingsRow } from '../src/lib/seo-head.ts'
import { blogPosts } from '../src/data/BlogPost.tsx'

export const config = { runtime: 'edge' }

declare const process: { env: Record<string, string | undefined> }

const SHELL_TTL_MS = 60_000
const TIMEOUT_MS = 3_000
let shellCache: { text: string; at: number } | null = null

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
    signal: AbortSignal.timeout(TIMEOUT_MS),
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
    new Response(shell, { status: 200, headers: { ...HTML_HEADERS, 'cache-control': 'no-store' } })

  const path = new URL(req.url).searchParams.get('path')
  if (!validPath(path)) return notFound()
  const route = routeForPath(path)
  if (!route) return notFound()

  let page: PageRow | null = null
  let faqs: FaqRow[] = []
  let settings: SettingsRow | null = null
  let degraded = false

  if (route.type === 'page') {
    const base = process.env.VITE_SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY
    if (!base || !key) return unmodified()
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
  }

  const post = route.type === 'post' ? (blogPosts.find((b) => b.slug === route.slug) ?? null) : null
  const meta = metaForPath(path, { page, faqs, settings, post })
  if (!meta) return notFound()

  return new Response(renderHead(shell, meta), {
    status: 200,
    headers: {
      ...HTML_HEADERS,
      // Si faltó algo secundario (FAQ/ajustes) no se cachea una cabecera incompleta.
      'cache-control': degraded ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
