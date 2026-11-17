import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { serializeJsonLd } from '../lib/jsonld'

const ORIGIN = 'https://www.allisonsilvacorp.com'

export const DEFAULT_TITLE = 'Allison Silva Taxes & Accounting'
export const DEFAULT_DESCRIPTION =
  'Servicios profesionales de contabilidad, impuestos, reportes financieros y consultoría estratégica para emprendedores, pymes y corporaciones en Latinoamérica y EE.UU.'

interface Props {
  title: string
  description: string
  jsonLd?: object
  image?: string
  noindex?: boolean
  /** Rutas (o URLs absolutas) de la misma página en cada idioma. */
  alternates?: { es?: string; en?: string }
  lang?: 'es' | 'en'
}

const DEFAULT_IMAGE = `${ORIGIN}/og-image.jpg`

const toAbsolute = (u: string) => (/^https?:\/\//i.test(u) ? u : ORIGIN + (u.startsWith('/') ? u : `/${u}`))

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function Seo({ title, description, jsonLd, image, noindex, alternates, lang }: Props) {
  const { pathname } = useLocation()
  const effectiveLang = lang ?? (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es')
  const img = image ? toAbsolute(image) : DEFAULT_IMAGE
  const altEs = alternates?.es
  const altEn = alternates?.en

  useEffect(() => {
    // El servidor ya inyectó su JSON-LD en la primera carga; el cliente toma el relevo.
    document.querySelectorAll('script[type="application/ld+json"][data-ssr]').forEach((n) => n.remove())
  }, [])

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'
    const url = ORIGIN + path
    document.title = title
    document.documentElement.lang = effectiveLang
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', img)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((n) => n.remove())
    const alts = [
      ['es', altEs],
      ['en', altEn],
    ].filter((a): a is [string, string] => !!a[1])
    if (alts.length >= 2) {
      const add = (hreflang: string, href: string) => {
        const link = document.createElement('link')
        link.rel = 'alternate'
        link.hreflang = hreflang
        link.href = toAbsolute(href)
        document.head.appendChild(link)
      }
      for (const [l, href] of alts) add(l, href)
      add('x-default', altEs ?? altEn!)
    }
  }, [title, description, pathname, img, noindex, altEs, altEn, effectiveLang])

  return jsonLd ? <JsonLd data={jsonLd} /> : null
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
