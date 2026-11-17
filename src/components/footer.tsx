"use client"

import { Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { useSettings } from "../lib/content"
import { track } from "../lib/track"

const FALLBACK_EMAIL = "info@allisonsilvacorp.com"
const FALLBACK_PHONE = "+505 8767-3463"

export function Footer() {
  const { data: settings } = useSettings()
  const email = settings?.email || FALLBACK_EMAIL
  const phone = settings?.phone || FALLBACK_PHONE
  const phoneHref = "tel:" + phone.replace(/[^\d+]/g, "")
  const hours = settings?.hours
  const address = settings?.address
  const gbpUrl = settings?.gbp_url

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Allison Silva</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Te ayudamos a organizar y optimizar las finanzas de tu negocio, para que tomes decisiones con claridad y crezcas con confianza.</p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/allison-silva-2ab71a210/?originalSubdomain=ni" target="_blank" className="text-gray-400 hover:text-white transition-colors" aria-label="Ir a LinkedIn" style={{ color: '#D1D5DB' }}>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/#services" className="hover:text-white transition-colors" aria-label="Ver servicios" style={{ color: '#D1D5DB' }}>
                  Contabilidad mensual
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors" aria-label="Ver servicios" style={{ color: '#D1D5DB' }}>
                  Implementación de QuickBooks
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors" aria-label="Ver servicios" style={{ color: '#D1D5DB' }}>
                  Control fiscal y cumplimiento
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-white transition-colors" aria-label="Ver servicios" style={{ color: '#D1D5DB' }}>
                  Reportes financieros mensuales
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contacto</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <a href={phoneHref} onClick={() => track("phone_click")} className="hover:text-white transition-colors underline" aria-label="Llamar por teléfono" style={{ color: '#D1D5DB' }}>{phone}</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors underline" aria-label="Enviar correo" style={{ color: '#D1D5DB' }}>{email}</a>
              </div>
              {address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4" />
                  <span>{address}</span>
                </div>
              )}
              {gbpUrl && (
                <div>
                  <a href={gbpUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline" style={{ color: '#D1D5DB' }}>
                    Encuéntranos en Google
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Business Hours */}
          {hours && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Horario de atención</h4>
              <div className="text-sm text-gray-300">
                <p>{hours}</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Allison Silva Taxes & Accounting. Todos los derechos reservados.</p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacidad" className="hover:text-white transition-colors" style={{ color: '#D1D5DB' }}>
                Privacidad
              </Link>
              <Link to="/terminos" className="hover:text-white transition-colors" style={{ color: '#D1D5DB' }}>
                Términos
              </Link>
              <button type="button" onClick={() => window.dispatchEvent(new Event("cookie-preferences"))} className="hover:text-white transition-colors" style={{ color: '#D1D5DB' }}>
                Preferencias de cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
