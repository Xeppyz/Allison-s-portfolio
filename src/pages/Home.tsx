import { Link } from 'react-router-dom'
import { Building2, Flag, Wallet, type LucideIcon } from 'lucide-react'
import { Hero } from '../components/hero'
import { About } from '../components/about'
import { Services } from '../components/services'
import { Benefits } from '../components/benefits'
import { Testimonials } from '../components/testimonials'
import { Blog } from '../components/blog'
import PlanCards from '../components/PlanCards'
import FaqList from '../components/FaqList'
import WhatsAppButton from '../components/WhatsAppButton'
import Seo, { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../components/Seo'
import { usePage, useSettings } from '../lib/content'

const FALLBACK_H1 = 'Sabe cuánto gana tu negocio, cada mes, sin multas ni sorpresas.'
const FALLBACK_SUB =
  'CPA con 11 años de experiencia en Nicaragua y EE. UU., contabilidad mensual, QuickBooks y cumplimiento fiscal con respuesta rápida por WhatsApp.'

const ENTRIES: { title: string; text: string; to: string; Icon: LucideIcon }[] = [
  { title: 'Tengo una empresa en Nicaragua', text: 'Contabilidad mensual y cumplimiento fiscal al día.', to: '/contabilidad-mensual', Icon: Building2 },
  { title: 'Tengo una LLC en EE. UU.', text: 'Orden contable y obligaciones fiscales de tu LLC.', to: '/contacto', Icon: Flag },
  { title: 'Quiero ordenar mis finanzas personales', text: 'Claridad sobre tus ingresos, gastos y obligaciones.', to: '/contacto', Icon: Wallet },
]

function EntryCards() {
  return (
    <section className="py-12 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {ENTRIES.map(({ title, text, to, Icon }) => (
          <Link
            key={title}
            to={to}
            className="flex items-start gap-4 rounded-xl border bg-[#FBFCFF] p-6 shadow-sm transition-shadow hover:shadow-lg"
          >
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(66,133,244,0.10)' }}>
              <Icon className="h-6 w-6" style={{ color: '#4285F4' }} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-semibold" style={{ color: '#1E3A5F' }}>{title}</span>
              <span className="mt-1 block text-sm" style={{ color: '#1E3A5F', opacity: 0.7 }}>{text}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Credentials({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <section className="py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl font-semibold" style={{ color: '#1E3A5F' }}>Credenciales</h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {items.map((c) => (
            <li key={c} className="rounded-full border px-4 py-2 text-sm font-medium" style={{ color: '#1E3A5F', backgroundColor: '#FBFCFF' }}>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FinalBlock() {
  return (
    <section className="py-16" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold lg:text-4xl" style={{ color: '#1E3A5F' }}>¿Listo para ordenar tus finanzas?</h2>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <WhatsAppButton floating={false} label="Diagnóstico gratis por WhatsApp" />
          <Link
            to="/contacto"
            className="inline-flex items-center justify-center rounded-full border border-[#4285F4] px-5 py-3 font-semibold text-[#4285F4] hover:bg-[#4285F4]/10"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const page = usePage('inicio').data
  const settings = useSettings().data
  const credentials = (settings?.credentials ?? []).filter((c): c is string => typeof c === 'string' && c !== '')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: 'Allison Silva Taxes & Accounting',
    url: 'https://allisonsilvacorp.com/',
    logo: 'https://allisonsilvacorp.com/qb-icon.svg',
    email: settings?.email || 'info@allisonsilvacorp.com',
    ...(settings?.phone ? { telephone: settings.phone } : {}),
    areaServed: ['NI', 'US'],
    founder: { '@type': 'Person', name: 'Allison Silva' },
  }

  return (
    <>
      <Seo
        title={page?.meta_title || DEFAULT_TITLE}
        description={page?.meta_description || DEFAULT_DESCRIPTION}
        jsonLd={jsonLd}
      />
      <Hero h1={page?.h1 || FALLBACK_H1} subheadline={page?.subheadline || FALLBACK_SUB} />
      <EntryCards />
      <About />
      <Services />
      {/* PlanCards ya trae su propio h2 "Planes" y un enlace "Ver planes" a /planes en cada tarjeta */}
      <PlanCards pageSlug="inicio" />
      <Credentials items={credentials} />
      <Testimonials />
      <Benefits />
      <Blog />
      <FaqList pageSlug="inicio" />
      <FinalBlock />
    </>
  )
}
