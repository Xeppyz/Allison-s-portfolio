import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { renderHead, metaForPath, type HeadMeta } from './seo-head.ts'

const shell = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length

const base: HeadMeta = {
  title: 'Planes | Allison Silva',
  description: 'Descripción de planes.',
  canonical: 'https://www.allisonsilvacorp.com/planes',
  lang: 'es',
  image: 'https://www.allisonsilvacorp.com/og-image.jpg',
}

test('renderHead reemplaza title, description, canonical y og:url sin duplicar', () => {
  const out = renderHead(shell, base)
  assert.equal(count(out, /<title>/g), 1)
  assert.match(out, /<title>Planes \| Allison Silva<\/title>/)
  assert.equal(count(out, /rel="canonical"/g), 1)
  assert.match(out, /<link rel="canonical" href="https:\/\/www\.allisonsilvacorp\.com\/planes"/)
  assert.match(out, /property="og:url" content="https:\/\/www\.allisonsilvacorp\.com\/planes"/)
  assert.match(out, /name="description" content="Descripción de planes\."/)
  assert.equal(count(out, /name="description"/g), 1)
  assert.equal(count(out, /property="og:title"/g), 1)
  assert.match(out, /name="robots" content="index,follow"/)
  assert.match(out, /property="og:locale" content="es_NI"/)
  assert.match(out, /<html lang="es"/)
})

test('renderHead tolera orden de atributos y etiquetas multilínea; inserta las que faltan', () => {
  const odd = `<!doctype html><html lang="es"><head>
<title>x</title>
<meta
  content="viejo"
  name="description"
/>
</head><body></body></html>`
  const out = renderHead(odd, { ...base, lang: 'en' })
  assert.equal(count(out, /name="description"/g), 1)
  assert.match(out, /content="Descripción de planes\."/)
  assert.doesNotMatch(out, /viejo/)
  assert.equal(count(out, /rel="canonical"/g), 1)
  assert.match(out, /<html lang="en"/)
  assert.match(out, /property="og:locale" content="en_US"/)
  assert.ok(out.indexOf('og:title') < out.indexOf('</head>'))
})

test('escapa comillas y <script> en el título', () => {
  const out = renderHead(shell, { ...base, title: 'Hola "mundo" <script>alert(1)</script> & co' })
  assert.doesNotMatch(out, /<script>alert/)
  assert.match(out, /content="Hola &quot;mundo&quot; &lt;script&gt;alert\(1\)&lt;\/script&gt; &amp; co"/)
  assert.match(out, /<title>Hola &quot;mundo&quot; &lt;script&gt;/)
})

test('hreflang solo con alternates (>= 2) y se eliminan los previos', () => {
  const without = renderHead(shell, base)
  assert.equal(count(without, /hreflang/g), 0)
  const one = renderHead(shell, { ...base, alternates: { es: base.canonical } })
  assert.equal(count(one, /hreflang/g), 0)
  const withOld = shell.replace('</head>', '<link rel="alternate" hreflang="fr" href="https://x.test/"></head>')
  const out = renderHead(withOld, {
    ...base,
    alternates: { es: 'https://www.allisonsilvacorp.com/planes', en: 'https://www.allisonsilvacorp.com/en/plans' },
  })
  assert.equal(count(out, /hreflang="/g), 3)
  assert.doesNotMatch(out, /hreflang="fr"/)
  assert.match(out, /hreflang="x-default" href="https:\/\/www\.allisonsilvacorp\.com\/planes"/)
  assert.match(out, /hreflang="en" href="https:\/\/www\.allisonsilvacorp\.com\/en\/plans"/)
})

test('noindex cambia robots', () => {
  assert.match(renderHead(shell, { ...base, noindex: true }), /name="robots" content="noindex,nofollow"/)
})

test('una respuesta de FAQ con </script> no cierra el JSON-LD', () => {
  const out = renderHead(shell, {
    ...base,
    jsonLd: [{ '@type': 'FAQPage', answer: 'x</script><script>alert(1)</script>' }],
  })
  assert.equal(count(out, /data-ssr="1"/g), 1)
  assert.doesNotMatch(out, /<script>alert/)
  assert.match(out, /\\u003c\/script>/)
})

const page = (o: Record<string, unknown> = {}) => ({
  slug: 'planes',
  lang: 'es' as const,
  kind: 'service' as const,
  meta_title: 'Planes de contabilidad',
  meta_description: 'Elige tu plan.',
  h1: 'Planes',
  subheadline: 'Sub',
  active: true,
  noindex: false,
  og_image_url: null,
  alt_slug: null,
  ...o,
})

test('metaForPath /en/llc-bookkeeping', () => {
  const m = metaForPath('/en/llc-bookkeeping', {
    page: page({ slug: 'llc-bookkeeping', lang: 'en', alt_slug: 'contabilidad-mensual' }),
  })
  assert.ok(m)
  assert.equal(m.canonical, 'https://www.allisonsilvacorp.com/en/llc-bookkeeping')
  assert.equal(m.lang, 'en')
  assert.deepEqual(m.alternates, {
    en: 'https://www.allisonsilvacorp.com/en/llc-bookkeeping',
    es: 'https://www.allisonsilvacorp.com/contabilidad-mensual',
  })
  assert.equal(m.image, 'https://www.allisonsilvacorp.com/og-image.jpg')
})

test('metaForPath desconocido o inactivo devuelve null', () => {
  assert.equal(metaForPath('/no-existe', { page: null }), null)
  assert.equal(metaForPath('/no-existe', {}), null)
  assert.equal(metaForPath('/planes', { page: page({ active: false }) }), null)
})

test('metaForPath / tiene canonical exacto, AccountingService y FAQPage', () => {
  const m = metaForPath('/', {
    page: page({ slug: 'inicio', kind: 'home', meta_title: null, h1: 'Hola' }),
    settings: { phone: '+505 1', email: 'a@b.c', address: null, hours: null },
    faqs: [{ page_slug: 'inicio', question: 'Q?', answer: 'A', active: true, sort: 1 }],
  })
  assert.ok(m)
  assert.equal(m.canonical, 'https://www.allisonsilvacorp.com/')
  assert.equal(m.title, 'Hola')
  const types = (m.jsonLd ?? []).map((j) => (j as { '@type': string })['@type'])
  assert.deepEqual(types, ['AccountingService', 'FAQPage'])
  const org = m.jsonLd![0] as Record<string, unknown>
  assert.equal(org['@id'], 'https://www.allisonsilvacorp.com/#organizacion')
  assert.equal(org.telephone, '+505 1')
})

test('metaForPath servicio: Service + BreadcrumbList; og_image_url y noindex', () => {
  const m = metaForPath('/planes', { page: page({ og_image_url: 'https://cdn.test/a.jpg', noindex: true }) })
  assert.ok(m)
  assert.equal(m.image, 'https://cdn.test/a.jpg')
  assert.equal(m.noindex, true)
  const types = (m.jsonLd ?? []).map((j) => (j as { '@type': string })['@type'])
  assert.deepEqual(types, ['Service', 'BreadcrumbList'])
})

test('metaForPath rutas fijas, blog y admin', () => {
  assert.equal(metaForPath('/contacto', {})!.title, 'Contacto | Allison Silva Taxes & Accounting')
  assert.equal(metaForPath('/blog', {})!.title, 'Blog | Allison Silva Taxes & Accounting')
  assert.equal(metaForPath('/blog/', {})!.canonical, 'https://www.allisonsilvacorp.com/blog')
  assert.equal(metaForPath('/blog/x', { post: null }), null)
  const p = metaForPath('/blog/x', { post: { slug: 'x', title: 'T', excerpt: 'E', date: '2024-02-01' } })!
  assert.equal(p.title, 'T | Allison Silva')
  assert.equal(p.type, 'article')
  assert.equal((p.jsonLd![0] as { '@type': string })['@type'], 'BlogPosting')
  assert.equal(metaForPath('/admin/pages', {})!.noindex, true)
})
