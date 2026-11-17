import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Flag, Wallet, type LucideIcon } from 'lucide-react'
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

const FALLBACK_CREDENTIALS = ['CPA (CCPN, Nicaragua)', 'QuickBooks ProAdvisor', 'Máster en Finanzas', '11 años de experiencia']

const ENTRIES: { slug: string; title: string; text: string; Icon: LucideIcon }[] = [
  { slug: 'contabilidad-mensual', title: 'Tengo una empresa en Nicaragua', text: 'Contabilidad mensual y cumplimiento fiscal al día.', Icon: Building2 },
  { slug: 'llc-usa', title: 'Tengo una LLC en EE. UU.', text: 'Orden contable y obligaciones fiscales de tu LLC.', Icon: Flag },
  { slug: 'finanzas-personales', title: 'Quiero ordenar mis finanzas personales', text: 'Claridad sobre tus ingresos, gastos y obligaciones.', Icon: Wallet },
]

// Enlaza a la landing solo si esa página se puede leer (publicada); si no, a contacto.
function EntryCard({ slug, title, text, Icon }: (typeof ENTRIES)[number]) {
  const to = usePage(slug).data ? `/${slug}` : '/contacto'
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-2xl border border-navy/10 bg-white p-6 shadow-[0_12px_40px_-18px_rgba(30,58,95,0.35)] transition hover:-translate-y-1 hover:border-taupe/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-taupe/40 text-taupe">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="flex-1">
        <span className="block text-lg font-semibold text-navy">{title}</span>
        <span className="mt-1 block text-sm text-navy/70">{text}</span>
      </span>
      <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-navy/40 transition group-hover:translate-x-1 group-hover:text-taupe" aria-hidden="true" />
    </Link>
  )
}

function EntryCards() {
  return (
    <section className="relative z-10 -mt-16 pb-20">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {ENTRIES.map((e) => (
          <EntryCard key={e.slug} {...e} />
        ))}
      </div>
    </section>
  )
}

function FinalBlock() {
  return (
    <section className="bg-ivory py-24">
      <div className="mx-auto max-w-3xl space-y-7 px-4 text-center sm:px-6 lg:px-8">
        <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
        <h2 className="text-3xl font-medium text-navy lg:text-5xl">¿Listo para ordenar tus finanzas?</h2>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WhatsAppButton label="Diagnóstico gratis por WhatsApp" />
          <Link
            to="/contacto"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-7 py-3 font-semibold text-white transition hover:bg-navy-deep"
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
  const fromSettings = (settings?.credentials ?? []).filter((c): c is string => typeof c === 'string' && c !== '')
  const credentials = fromSettings.length > 0 ? fromSettings : FALLBACK_CREDENTIALS

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: 'Allison Silva Taxes & Accounting',
    url: 'https://www.allisonsilvacorp.com/',
    logo: 'https://www.allisonsilvacorp.com/qb-icon.svg',
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
      <Hero h1={page?.h1 || FALLBACK_H1} subheadline={page?.subheadline || FALLBACK_SUB} credentials={credentials} />
      <EntryCards />
      <About />
      <Services />
      {/* PlanCards ya trae su propio h2 "Planes" y un enlace "Ver planes" a /planes en cada tarjeta */}
      <PlanCards pageSlug="inicio" />
      <Testimonials />
      <Benefits />
      <Blog />
      <FaqList pageSlug="inicio" />
      <FinalBlock />
    </>
  )
}
