"use client"

import { Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { useSettings } from "../lib/content"
import { track } from "../lib/track"
import { useStrings } from "../lib/strings"

const FALLBACK_EMAIL = "info@allisonsilvacorp.com"
const FALLBACK_PHONE = "+505 8767-3463"

const linkClass =
  "rounded text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
const headingClass = "text-xs font-semibold uppercase tracking-[0.18em] text-taupe"

export function Footer() {
  const { data: settings } = useSettings()
  const { t } = useStrings()
  const email = settings?.email || FALLBACK_EMAIL
  const phone = settings?.phone || FALLBACK_PHONE
  const phoneHref = "tel:" + phone.replace(/[^\d+]/g, "")
  const hours = settings?.hours
  const address = settings?.address
  const gbpUrl = settings?.gbp_url

  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <span aria-hidden="true" className="block h-px w-10 bg-taupe" />
            <h3 className="font-serif text-2xl font-medium text-white">Allison Silva</h3>
            <p className="text-sm leading-relaxed text-white/70">Te ayudamos a organizar y optimizar las finanzas de tu negocio, para que tomes decisiones con claridad y crezcas con confianza.</p>
            <div className="flex">
              <a
                href="https://www.linkedin.com/in/allison-silva-2ab71a210/?originalSubdomain=ni"
                target="_blank"
                className={`${linkClass} -ml-3 flex h-11 w-11 items-center justify-center`}
                aria-label="Ir a LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className={headingClass}>Servicios</h4>
            <ul className="space-y-1 text-sm">
              {["Contabilidad mensual", "Implementación de QuickBooks", "Control fiscal y cumplimiento", "Reportes financieros mensuales"].map((label) => (
                <li key={label}>
                  <a href="/#services" className={`${linkClass} inline-flex min-h-11 items-center`} aria-label="Ver servicios">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className={headingClass}>Contacto</h4>
            <div className="space-y-1 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-taupe" aria-hidden="true" />
                <a href={phoneHref} onClick={() => track("phone_click")} className={`${linkClass} inline-flex min-h-11 items-center underline`} aria-label="Llamar por teléfono">{phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-taupe" aria-hidden="true" />
                <a href={`mailto:${email}`} className={`${linkClass} inline-flex min-h-11 items-center break-all underline`} aria-label="Enviar correo">{email}</a>
              </div>
              {address && (
                <div className="flex items-center gap-3 py-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-taupe" aria-hidden="true" />
                  <span>{address}</span>
                </div>
              )}
              {gbpUrl && (
                <div>
                  <a href={gbpUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex min-h-11 items-center underline`}>
                    Encuéntranos en Google
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Business Hours */}
          {hours && (
            <div className="space-y-4">
              <h4 className={headingClass}>Horario de atención</h4>
              <div className="text-sm text-white/70">
                <p>{hours}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-white/60">© {new Date().getFullYear()} Allison Silva Taxes & Accounting. {t.derechos}</p>
            <div className="flex flex-wrap justify-center gap-x-6 text-sm">
              <Link to="/privacidad" className={`${linkClass} inline-flex min-h-11 items-center`}>
                {t.privacidad}
              </Link>
              <Link to="/terminos" className={`${linkClass} inline-flex min-h-11 items-center`}>
                {t.terminos}
              </Link>
              <button type="button" onClick={() => window.dispatchEvent(new Event("cookie-preferences"))} className={`${linkClass} inline-flex min-h-11 items-center`}>
                {t.preferenciasCookies}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
