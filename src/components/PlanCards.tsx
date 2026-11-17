import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import WhatsAppButton from './WhatsAppButton'
import { usePlans, useSettings, type Plan } from '../lib/content'
import { track } from '../lib/track'
import { useStrings, type Strings } from '../lib/strings'

const GROUPS: { key: NonNullable<Plan['group']>; title: keyof Strings }[] = [
  { key: 'empresa', title: 'grupoEmpresa' },
  { key: 'llc', title: 'grupoLlc' },
  { key: 'personal', title: 'grupoPersonal' },
  { key: 'certificacion', title: 'grupoCertificacion' },
  { key: 'addon', title: 'grupoAddon' },
]

const linkClass =
  'inline-flex w-full items-center justify-center rounded-full border border-navy/25 px-5 py-3 font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white'

type WaState = 'loading' | 'yes' | 'no'

function PlanCard({ plan, wa, onPlanesPage }: { plan: Plan; wa: WaState; onPlanesPage: boolean }) {
  const { t, lang } = useStrings()
  const en = lang === 'en'
  const name = (en && plan.name_en) || plan.name
  const priceText = (en && plan.price_text_en) || plan.price_text
  const description = (en && plan.description_en) || plan.description
  // Sin acción mientras carga la configuración, para que no cambie después.
  const whatsappOrContact = (label: string, fallback: string) =>
    wa === 'yes' ? (
      <WhatsAppButton label={label} />
    ) : wa === 'no' ? (
      <Link to="/contacto" className={linkClass}>{fallback}</Link>
    ) : null
  let action: ReactNode = null
  if (plan.cta === 'whatsapp') {
    action = whatsappOrContact(t.cotizarWa, t.cotizar)
  } else if (plan.cta === 'planes') {
    action = onPlanesPage ? (
      whatsappOrContact(t.consultarWa, t.consultar)
    ) : (
      <Link to="/planes" onClick={() => track('ver_planes_click')} className={linkClass}>{t.verPlanes}</Link>
    )
  }
  const features = (plan.features ?? []).filter((f): f is string => typeof f === 'string')

  return (
    <Card className="flex flex-col rounded-2xl border-navy/10 bg-ivory shadow-none transition hover:border-taupe/60">
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">{name}</CardTitle>
        {priceText && <p className="font-serif text-2xl font-medium leading-snug text-navy">{priceText}</p>}
        {description && (
          <CardDescription className="leading-relaxed text-navy/70">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-6">
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-taupe" aria-hidden="true" />
                <span className="text-navy/90">{f}</span>
              </li>
            ))}
          </ul>
        )}
        {action}
      </CardContent>
    </Card>
  )
}

function Grid({ plans, wa, onPlanesPage }: { plans: Plan[]; wa: WaState; onPlanesPage: boolean }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((p) => <PlanCard key={p.id} plan={p} wa={wa} onPlanesPage={onPlanesPage} />)}
    </div>
  )
}

export default function PlanCards({ pageSlug }: { pageSlug: string }) {
  const { t } = useStrings()
  const { data } = usePlans(pageSlug)
  const settings = useSettings()
  const plans = data ?? []
  if (plans.length === 0) return null

  const wa: WaState = settings.loading ? 'loading' : settings.data?.whatsapp_number ? 'yes' : 'no'

  return (
    <section className="border-y border-navy/10 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-medium text-navy lg:text-5xl">
          {pageSlug === 'planes' ? t.nuestrosPlanes : t.planes}
        </h2>
        {pageSlug === 'planes' ? (
          <div className="space-y-14">
            {[...GROUPS.map((g) => ({ key: g.key as Plan['group'], title: t[g.title] })), { key: null, title: t.otros }].map(({ key, title }) => {
              const group = plans.filter((p) =>
                key === null ? !GROUPS.some((g) => g.key === p.group) : p.group === key)
              if (group.length === 0) return null
              return (
                <div key={key ?? 'otros'} className="space-y-6">
                  <h3 className="text-2xl font-semibold text-navy">{title}</h3>
                  <Grid plans={group} wa={wa} onPlanesPage />
                </div>
              )
            })}
          </div>
        ) : (
          <Grid plans={plans} wa={wa} onPlanesPage={false} />
        )}
      </div>
    </section>
  )
}
