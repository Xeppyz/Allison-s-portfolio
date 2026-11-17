import Seo from '../components/Seo'
import LeadForm from '../components/LeadForm'
import WhatsAppButton from '../components/WhatsAppButton'
import { useSettings } from '../lib/content'
import { track } from '../lib/track'

const FALLBACK_EMAIL = 'info@allisonsilvacorp.com'
const FALLBACK_PHONE = '+505 8767-3463'

export default function ContactPage() {
  const { data: settings } = useSettings()
  const email = settings?.email || FALLBACK_EMAIL
  const phone = settings?.phone || FALLBACK_PHONE
  const phoneHref = 'tel:' + phone.replace(/[^\d+]/g, '')
  const hours = settings?.hours
  const address = settings?.address
  const gbpUrl = settings?.gbp_url

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <Seo
        title="Contacto | Allison Silva Taxes & Accounting"
        description="Escríbenos por WhatsApp, correo o formulario. Diagnóstico financiero gratis de 30 minutos."
      />
      <h1 className="text-3xl font-bold text-[#1E3A5F] lg:text-4xl">Contacto</h1>
      <p className="mt-3 max-w-2xl text-[#1E3A5F]/80">
        Cuéntanos qué necesitas y te respondemos en menos de un día hábil.
      </p>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <LeadForm />
        <div className="space-y-4 text-[#1E3A5F]">
          <ul className="space-y-2">
            <li>
              Correo:{' '}
              <a href={`mailto:${email}`} className="font-semibold text-[#4285F4] underline">{email}</a>
            </li>
            <li>
              Teléfono:{' '}
              <a href={phoneHref} onClick={() => track('phone_click')} className="font-semibold text-[#4285F4] underline">{phone}</a>
            </li>
            {hours && <li>Horario: {hours}</li>}
            {address && <li>Dirección: {address}</li>}
          </ul>
          <WhatsAppButton label="Escribir por WhatsApp" />
          {gbpUrl && (
            <p>
              <a href={gbpUrl} target="_blank" rel="noopener" className="font-semibold text-[#4285F4] underline">
                Encuéntranos en Google
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
