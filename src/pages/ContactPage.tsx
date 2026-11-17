import Seo from '../components/Seo'
import LeadForm from '../components/LeadForm'
import WhatsAppButton from '../components/WhatsAppButton'
import { useSettings } from '../lib/content'
import { track } from '../lib/track'

const FALLBACK_EMAIL = 'info@allisonsilvacorp.com'
const FALLBACK_PHONE = '+505 8767-3463'

const linkClass =
  'break-all rounded font-semibold text-[#4285F4] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4] focus-visible:ring-offset-2'

export default function ContactPage() {
  const { data: settings } = useSettings()
  const email = settings?.email || FALLBACK_EMAIL
  const phone = settings?.phone || FALLBACK_PHONE
  const phoneHref = 'tel:' + phone.replace(/[^\d+]/g, '')
  const hours = settings?.hours
  const address = settings?.address
  const gbpUrl = settings?.gbp_url

  return (
    <main>
      <Seo
        title="Contacto | Allison Silva Taxes & Accounting"
        description="Escríbenos por WhatsApp, correo o formulario. Diagnóstico financiero gratis de 30 minutos."
      />
      <section className="bg-ivory px-4 py-20 text-center sm:px-6 lg:py-24">
        <div className="hero-in mx-auto max-w-3xl space-y-6">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h1 className="text-4xl font-medium leading-tight text-navy lg:text-6xl">Contacto</h1>
          <p className="text-lg text-navy/70 lg:text-xl">
            Cuéntanos qué necesitas y te respondemos en menos de un día hábil.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="rounded-2xl border border-navy/10 bg-white p-6 sm:p-10">
            <LeadForm />
          </div>
          <div className="space-y-8 text-navy">
            <ul className="divide-y divide-navy/10 border-y border-navy/10">
              <li className="py-4">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">Correo</span>
                <span className="sr-only">: </span>
                <a href={`mailto:${email}`} className={`mt-1 inline-block min-h-6 ${linkClass}`}>{email}</a>
              </li>
              <li className="py-4">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">Teléfono</span>
                <span className="sr-only">: </span>
                <a href={phoneHref} onClick={() => track('phone_click')} className={`mt-1 inline-block min-h-6 ${linkClass}`}>{phone}</a>
              </li>
              {hours && (
                <li className="py-4">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">Horario</span>
                  <span className="sr-only">: </span>
                  <span className="mt-1 block text-navy/80">{hours}</span>
                </li>
              )}
              {address && (
                <li className="py-4">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">Dirección</span>
                  <span className="sr-only">: </span>
                  <span className="mt-1 block text-navy/80">{address}</span>
                </li>
              )}
            </ul>
            <WhatsAppButton label="Escribir por WhatsApp" />
            {gbpUrl && (
              <p>
                <a href={gbpUrl} target="_blank" rel="noopener" className={linkClass}>
                  Encuéntranos en Google
                </a>
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
