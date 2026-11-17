import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { serializeJsonLd } from '../lib/jsonld'

const ORIGIN = 'https://allisonsilvacorp.com'

export const DEFAULT_TITLE = 'Allison Silva Taxes & Accounting'
export const DEFAULT_DESCRIPTION =
  'Servicios profesionales de contabilidad, impuestos, reportes financieros y consultoría estratégica para emprendedores, pymes y corporaciones en Latinoamérica y EE.UU.'

interface Props {
  title: string
  description: string
  jsonLd?: object
}

export default function Seo({ title, description, jsonLd }: Props) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', ORIGIN + path)
  }, [title, description, pathname])

  return jsonLd ? <JsonLd data={jsonLd} /> : null
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
