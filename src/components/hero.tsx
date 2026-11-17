import { Calculator, TrendingUp, Shield, User } from "lucide-react"
import { Link } from "react-router-dom"
import WhatsAppButton from "./WhatsAppButton"
import { track } from "../lib/track"

interface HeroProps {
  h1: string
  subheadline: string
}

export function Hero({ h1, subheadline }: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-white pt-8 pb-20 lg:pt-12 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="!text-lg md:!text-xl lg:!text-4xl font-bold text-gray-900 leading-tight font-serif">
                {h1}
              </h1>
              <p className="text-base lg:text-lg text-gray-700">{subheadline}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <WhatsAppButton floating={false} label="Diagnóstico gratis por WhatsApp" />
              <Link
                to="/planes"
                onClick={() => track("ver_planes_click")}
                className="inline-flex items-center justify-center rounded-full border border-[#4285F4] px-5 py-3 font-semibold text-[#4285F4] hover:bg-[#4285F4]/10"
              >
                Ver planes
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-serif">Contabilidad</h3>
                  <p className="text-gray-600 text-sm">Registros claros y precisos para tu negocio.</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-serif">Reportes financieros</h3>
                  <p className="text-gray-600 text-sm">Análisis detallado para la toma de decisiones.</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-serif">Cumplimiento fiscal</h3>
                  <p className="text-gray-600 text-sm">Cumple con tus obligaciones tributarias sin estrés.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-serif">Capacitación en Sistemas y Normas Contables</h3>
                  <p className="text-gray-600 text-sm">Formación práctica en QuickBooks Online y Xero, y entrenamiento en principios contables y US GAAP para tu equipo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
