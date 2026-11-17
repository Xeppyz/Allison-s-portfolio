// SEO del lado del servidor: calcula y escribe el <head> de cada URL.
// Módulo puro (sin React, sin import.meta): lo importan la función edge
// api/render.ts, api/sitemap.ts, el cliente no, y los tests con node:test.
import { cleanHtml, formatDate } from './html.ts'

export const ORIGIN = 'https://www.allisonsilvacorp.com'
export const ORG_ID = `${ORIGIN}/#organizacion`
export const ORG_NAME = 'Allison Silva Taxes & Accounting'
export const DEFAULT_TITLE = ORG_NAME
export const DEFAULT_DESCRIPTION =
  'Servicios profesionales de contabilidad, impuestos, reportes financieros y consultoría estratégica para emprendedores, pymes y corporaciones en Latinoamérica y EE.UU.'
const DEFAULT_DESCRIPTION_EN =
  'Professional accounting, tax and financial reporting services for entrepreneurs, small businesses and corporations in Nicaragua and the U.S.'
export const DEFAULT_IMAGE = `${ORIGIN}/og-image.jpg`

export type Lang = 'es' | 'en'

export type HeadMeta = {
  title: string
  description: string
  canonical: string
  lang: Lang
  image: string
  noindex?: boolean
  alternates?: { es?: string; en?: string }
  jsonLd?: object[]
  type?: 'website' | 'article'
  /** Imagen principal que el navegador debe pedir antes de ejecutar el JS (LCP). */
  preloadImage?: { srcset: string; sizes: string; href: string }
}

/** Retrato del hero del inicio (public/img). Mismos valores que hero.tsx. */
export const HERO_IMAGE = {
  href: '/img/allison-800.webp',
  srcset: '/img/allison-480.webp 480w, /img/allison-800.webp 800w',
  sizes: '(min-width: 1024px) 424px, (min-width: 640px) 360px, calc(100vw - 56px)',
}

export type PageRow = {
  slug: string
  lang: Lang | string | null
  kind: 'home' | 'service' | 'legal' | string | null
  meta_title?: string | null
  meta_description?: string | null
  h1?: string | null
  subheadline?: string | null
  active?: boolean | null
  noindex?: boolean | null
  og_image_url?: string | null
  alt_slug?: string | null
}

export type FaqRow = {
  page_slug: string
  question: string
  answer: string
  active?: boolean | null
  sort?: number | null
}

export type SettingsRow = {
  phone?: string | null
  email?: string | null
  address?: string | null
  hours?: string | null
}

export type PostMeta = {
  id?: string
  published?: boolean
  slug: string
  title: string
  seo_title?: string | null
  excerpt: string | null
  published_at: string
  updated_at?: string | null
  cover_url?: string | null
  cover_alt?: string | null
  tags?: string[] | null
  content_html?: string | null
}

export type PostSummary = Pick<PostMeta, 'id' | 'slug' | 'title' | 'excerpt' | 'published_at' | 'cover_url' | 'cover_alt'>

/** Datos para que el cliente pinte sin volver a pedirlos (clave de caché de content.ts). */
const seed = (key: string, data: unknown) =>
  `<script type="application/json" id="__seed">${serializeJsonLd({ key, data })}</script>`

/** Sufijo de marca que se añade al título de los artículos. */
export const POST_TITLE_SUFFIX = ' | Allison Silva'

/** URL absoluta de una imagen (las de /public vienen relativas). */
export function absoluteImage(url: string | null | undefined): string {
  if (!url) return DEFAULT_IMAGE
  return url.startsWith('/') ? ORIGIN + url : url
}

/* ------------------------------ rutas ------------------------------ */

/** Ruta pública de una página según su idioma (espejo de strings.ts). */
export function pagePath(slug: string, lang: string | null | undefined): string {
  if (slug === 'inicio') return '/'
  return lang === 'en' ? `/en/${slug}` : `/${slug}`
}

export function absoluteUrl(path: string): string {
  return path === '/' ? `${ORIGIN}/` : ORIGIN + path
}

export type Route =
  | { type: 'page'; slug: string; lang: Lang }
  | { type: 'contact' }
  | { type: 'blog' }
  | { type: 'post'; slug: string }
  | { type: 'admin' }

/** Normaliza una ruta: sin query/hash ni barras finales. null si no es válida. */
export function normalizePath(pathname: string): string | null {
  if (typeof pathname !== 'string' || !pathname.startsWith('/')) return null
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, '')
  return clean === '' ? '/' : clean
}

/** Qué es una ruta: página de la tabla `pages`, ruta fija, blog, admin o nada. */
export function routeForPath(pathname: string): Route | null {
  const path = normalizePath(pathname)
  if (path === null) return null
  if (path === '/') return { type: 'page', slug: 'inicio', lang: 'es' }
  const parts = path.split('/').filter(Boolean)
  if (parts[0] === 'admin') return { type: 'admin' }
  if (parts[0] === 'en') {
    if (parts.length === 2) return { type: 'page', slug: parts[1], lang: 'en' }
    return null
  }
  if (parts[0] === 'contacto' && parts.length === 1) return { type: 'contact' }
  if (parts[0] === 'blog') {
    if (parts.length === 1) return { type: 'blog' }
    if (parts.length === 2) return { type: 'post', slug: parts[1] }
    return null
  }
  if (parts.length === 1) return { type: 'page', slug: parts[0], lang: 'es' }
  return null
}

/* ----------------------------- escapado ----------------------------- */

export function escapeHtml(value: string): string {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Igual que serializeJsonLd de jsonld.ts (se replica para no depender de rutas del cliente).
function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/* --------------------------- renderHead ---------------------------- */

const JSON_LD_SSR = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*\bdata-ssr\b[^>]*>[\s\S]*?<\/script\s*>\s*/gi

const HEAD_CLOSE = /<\/head\s*>/i

function insertBeforeHeadEnd(html: string, tag: string): string {
  const m = HEAD_CLOSE.exec(html)
  if (!m) return html
  return html.slice(0, m.index) + '  ' + tag + '\n' + html.slice(m.index)
}

/** Sustituye la primera coincidencia y elimina las demás; si no hay, inserta antes de </head>. */
function upsert(html: string, re: RegExp, tag: string): string {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
  let seen = false
  let found = false
  const out = html.replace(g, () => {
    found = true
    if (seen) return ''
    seen = true
    return tag
  })
  return found ? out : insertBeforeHeadEnd(html, tag)
}

function metaRe(attr: 'name' | 'property', key: string): RegExp {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`<meta\\b[^>]*?\\b${attr}\\s*=\\s*["']${k}["'][^>]*>`, 'i')
}

function setMeta(html: string, attr: 'name' | 'property', key: string, content: string): string {
  return upsert(html, metaRe(attr, key), `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`)
}

function removeMeta(html: string, attr: 'name' | 'property', key: string): string {
  const re = metaRe(attr, key)
  return html.replace(new RegExp(re.source, 'gi'), '')
}

const LOCALES: Record<Lang, string> = { es: 'es_NI', en: 'en_US' }

export function renderHead(html: string, meta: HeadMeta): string {
  let out = html

  // <html lang>
  if (/<html\b[^>]*?\blang\s*=/i.test(out)) {
    out = out.replace(/(<html\b[^>]*?\blang\s*=\s*)(["'])[^"']*\2/i, (_m, pre: string) => `${pre}"${meta.lang}"`)
  } else {
    out = out.replace(/<html\b/i, `<html lang="${meta.lang}"`)
  }

  out = upsert(out, /<title\b[^>]*>[\s\S]*?<\/title\s*>/i, `<title>${escapeHtml(meta.title)}</title>`)
  out = setMeta(out, 'name', 'description', meta.description)
  out = setMeta(out, 'name', 'robots', meta.noindex ? 'noindex,nofollow' : 'index,follow')
  out = upsert(
    out,
    /<link\b[^>]*?\brel\s*=\s*["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
  )

  out = setMeta(out, 'property', 'og:type', meta.type ?? 'website')
  out = setMeta(out, 'property', 'og:locale', LOCALES[meta.lang])
  out = setMeta(out, 'property', 'og:title', meta.title)
  out = setMeta(out, 'property', 'og:description', meta.description)
  out = setMeta(out, 'property', 'og:url', meta.canonical)
  out = setMeta(out, 'property', 'og:image', meta.image)
  out = setMeta(out, 'property', 'og:image:alt', meta.title)
  if (meta.image !== DEFAULT_IMAGE) {
    // Las medidas del shell son las de og-image.jpg; con otra imagen serían falsas.
    for (const k of ['og:image:width', 'og:image:height', 'og:image:type']) out = removeMeta(out, 'property', k)
  }
  out = setMeta(out, 'name', 'twitter:title', meta.title)
  out = setMeta(out, 'name', 'twitter:description', meta.description)
  out = setMeta(out, 'name', 'twitter:image', meta.image)

  // hreflang: se eliminan los existentes y se insertan solo si hay >= 2 idiomas
  out = out.replace(/<link\b[^>]*?\bhreflang\s*=[^>]*>\s*/gi, '')
  const alts = meta.alternates
  if (alts && Object.values(alts).filter(Boolean).length >= 2) {
    for (const l of ['es', 'en'] as const) {
      const href = alts[l]
      if (href) out = insertBeforeHeadEnd(out, `<link rel="alternate" hreflang="${l}" href="${escapeHtml(href)}" />`)
    }
    const def = alts.es ?? alts.en!
    out = insertBeforeHeadEnd(out, `<link rel="alternate" hreflang="x-default" href="${escapeHtml(def)}" />`)
  }

  out = out.replace(/<link\b[^>]*?\brel\s*=\s*["']preload["'][^>]*?\bas\s*=\s*["']image["'][^>]*>\s*/gi, '')
  if (meta.preloadImage) {
    const p = meta.preloadImage
    out = insertBeforeHeadEnd(
      out,
      `<link rel="preload" as="image" href="${escapeHtml(p.href)}" imagesrcset="${escapeHtml(p.srcset)}" imagesizes="${escapeHtml(p.sizes)}" fetchpriority="high" />`,
    )
  }

  // JSON-LD: se retiran los inyectados antes (data-ssr) y se añaden los nuevos
  out = out.replace(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*\bdata-ssr\b[^>]*>[\s\S]*?<\/script\s*>\s*/gi, '')
  for (const block of meta.jsonLd ?? []) {
    out = insertBeforeHeadEnd(out, `<script type="application/ld+json" data-ssr="1">${serializeJsonLd(block)}</script>`)
  }
  return out
}

/* --------------------------- cuerpo inicial --------------------------- */

/** Pone `inner` dentro de #root: lo leen los buscadores sin JS; React lo reemplaza al montar. */
export function renderBody(html: string, inner: string): string {
  return html.replace(/<div id="root">\s*<\/div>/, () => `<div id="root">${inner}</div>`)
}

export function postBody(post: PostMeta): string {
  const cover = post.cover_url
    ? `<img src="${escapeHtml(post.cover_url)}" alt="${escapeHtml(post.cover_alt || post.title)}" width="1200" height="675">`
    : ''
  return (
    `<main class="mx-auto max-w-3xl px-4 py-16"><article>` +
    `<nav aria-label="Migas de pan"><a href="/">Inicio</a> / <a href="/blog">Blog</a></nav>` +
    `<h1>${escapeHtml(post.title)}</h1>` +
    `<p><time datetime="${escapeHtml(post.published_at)}">${formatDate(post.published_at)}</time> · Allison Silva, CPA</p>` +
    cover +
    `<div class="article-content">${cleanHtml(post.content_html ?? '')}</div>` +
    `</article></main>` +
    seed(`post:${post.slug}`, { ...post, content_html: cleanHtml(post.content_html ?? '') })
  )
}

export function blogIndexBody(posts: PostSummary[]): string {
  const items = posts
    .map(
      (p) =>
        `<li><a href="/blog/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a>` +
        (p.excerpt ? `<p>${escapeHtml(p.excerpt)}</p>` : '') +
        `</li>`,
    )
    .join('')
  return `<main class="mx-auto max-w-3xl px-4 py-16"><h1>Blog: contabilidad, impuestos y QuickBooks</h1><ul>${items}</ul></main>` + seed('posts', posts)
}

/** Quita lo que identifica una URL concreta (canonical, og:url, JSON-LD del servidor): para respuestas de respaldo. */
export function stripIdentity(html: string): string {
  return removeMeta(html, 'property', 'og:url')
    .replace(/<link\b[^>]*?\brel\s*=\s*["']canonical["'][^>]*>\s*/gi, '')
    .replace(JSON_LD_SSR, '')
}

/* --------------------------- metaForPath --------------------------- */

type MetaData = {
  page?: PageRow | null
  faqs?: FaqRow[]
  settings?: SettingsRow | null
  post?: PostMeta | null
  /** Fila de la página enlazada por alt_slug (solo slug, lang y noindex). */
  alt?: { slug: string; lang: Lang | string | null; noindex?: boolean | null } | null
}

const other = (l: Lang): Lang => (l === 'es' ? 'en' : 'es')

function organization(settings?: SettingsRow | null, image = DEFAULT_IMAGE): object {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': ORG_ID,
    name: ORG_NAME,
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/qb-icon.svg`,
    image,
    areaServed: ['NI', 'US'],
    founder: { '@type': 'Person', name: 'Allison Silva', jobTitle: 'CPA' },
    priceRange: '$$',
  }
  if (settings?.email) org.email = settings.email
  if (settings?.phone) org.telephone = settings.phone
  return org
}

function faqBlock(faqs: FaqRow[] | undefined, slug: string): object | null {
  const list = (faqs ?? [])
    .filter((f) => f.active !== false && (!f.page_slug || f.page_slug === slug))
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  if (list.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function metaForPath(pathname: string, data: MetaData = {}): HeadMeta | null {
  const route = routeForPath(pathname)
  if (!route) return null
  const path = normalizePath(pathname)!

  if (route.type === 'admin') {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      canonical: absoluteUrl(path),
      lang: 'es',
      image: DEFAULT_IMAGE,
      noindex: true,
    }
  }

  if (route.type === 'contact') {
    return {
      title: `Contacto | ${ORG_NAME}`,
      description: 'Escríbenos por WhatsApp, correo o formulario. Diagnóstico financiero gratis de 30 minutos.',
      canonical: absoluteUrl('/contacto'),
      lang: 'es',
      image: DEFAULT_IMAGE,
    }
  }

  if (route.type === 'blog') {
    return {
      title: `Blog | ${ORG_NAME}`,
      description: 'Artículos sobre contabilidad, impuestos y QuickBooks para empresas en Nicaragua y EE. UU.',
      canonical: absoluteUrl('/blog'),
      lang: 'es',
      image: DEFAULT_IMAGE,
    }
  }

  if (route.type === 'post') {
    const post = data.post
    if (!post || post.slug !== route.slug) return null
    const canonical = absoluteUrl(`/blog/${post.slug}`)
    const image = absoluteImage(post.cover_url)
    const description = post.excerpt || DEFAULT_DESCRIPTION
    const posting: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description,
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      image,
      inLanguage: 'es',
      mainEntityOfPage: canonical,
      author: { '@type': 'Person', name: 'Allison Silva', jobTitle: 'CPA', url: `${ORIGIN}/` },
      publisher: { '@id': ORG_ID },
    }
    if (post.tags?.length) posting.keywords = post.tags.join(', ')
    return {
      title: (post.seo_title || post.title) + POST_TITLE_SUFFIX,
      description,
      canonical,
      lang: 'es',
      image,
      type: 'article',
      jsonLd: [
        posting,
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
            { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
          ],
        },
      ],
    }
  }

  // Página de la tabla `pages`
  const page = data.page
  if (!page || page.active === false || page.slug !== route.slug) return null
  const pageLang: Lang = page.lang === 'en' ? 'en' : 'es'
  if (pageLang !== route.lang) return null

  // El `kind` debe coincidir con lo que el cliente pinta en esta ruta; si no, sería un soft 404.
  const expectedKind =
    path === '/' ? 'home' : path === '/privacidad' || path === '/terminos' ? 'legal' : 'service'
  if (page.kind !== expectedKind) return null
  if (expectedKind === 'legal' && pageLang !== 'es') return null

  const canonicalPath = pagePath(page.slug, pageLang)
  const canonical = absoluteUrl(canonicalPath)
  const image = page.og_image_url || DEFAULT_IMAGE
  const title = page.meta_title || page.h1 || DEFAULT_TITLE
  const description =
    page.meta_description || page.subheadline || (pageLang === 'en' ? DEFAULT_DESCRIPTION_EN : DEFAULT_DESCRIPTION)

  const jsonLd: object[] = []
  if (page.kind === 'home') jsonLd.push(organization(data.settings, image))
  if (page.kind === 'service') {
    const name = page.h1 || title
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name,
      description,
      provider: { '@id': ORG_ID },
      areaServed: ['NI', 'US'],
      url: canonical,
    })
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: pageLang === 'en' ? 'Home' : 'Inicio', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name, item: canonical },
      ],
    })
  }
  const faq = faqBlock(data.faqs, page.slug)
  if (faq) jsonLd.push(faq)

  const meta: HeadMeta = { title, description, canonical, lang: pageLang, image, noindex: !!page.noindex, jsonLd }
  if (page.kind === 'home') meta.preloadImage = HERO_IMAGE
  const alt = data.alt
  const altLang: Lang | null = alt ? (alt.lang === 'en' ? 'en' : 'es') : null
  if (page.alt_slug && alt && alt.slug === page.alt_slug && !alt.noindex && altLang !== pageLang) {
    meta.alternates = {
      [pageLang]: canonical,
      [other(pageLang)]: absoluteUrl(pagePath(page.alt_slug, other(pageLang))),
    }
  }
  return meta
}
