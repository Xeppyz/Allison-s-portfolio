"use client"


import { Calculator, TrendingUp, Shield, User } from "lucide-react"
import { useLanguage } from "./language-context"
import { useState } from "react"
import { PlansModal } from "./modalPaquetes"
import CotizacionModal from "./cotizacionModal"

export function Hero() {
  const { t } = useLanguage()
  const [openPlans, setOpenPlans] = useState(false)
  const [openQuote, setOpenQuote] = useState(false)

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white pt-8 pb-20 lg:pt-12 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="!text-lg md:!text-xl lg:!text-4xl font-bold text-gray-900 leading-tight font-serif">
                {t("hero.subtitle")}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div style={{ display: "flex", gap: 12 }}>
                {/* botón cotizar existente (usando el modal de cotización separado) */}
                <button
                  onClick={() => setOpenQuote(true)}
                  style={{
                    backgroundColor: "#34A853",
                    color: "#fff",
                    padding: "0.6rem 1.2rem",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t("modal.quoteTitle")}
                </button>

                {/* botón escoger paquete (abre el modal de planes) */}
                <button
                  onClick={() => setOpenPlans(true)}
                  style={{
                    backgroundColor: "#4285F4",
                    color: "#fff",
                    padding: "0.6rem 1.2rem",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {t("hero.cta3") ?? "Escoger paquete"}
                </button>
              </div>

              {/* modals */}
              <PlansModal open={openPlans} onClose={() => setOpenPlans(false)} />
              <CotizacionModal open={openQuote} onClose={() => setOpenQuote(false)} />
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-serif">{t("hero.bookkeeping")}</h3>
                  <p className="text-gray-600 text-sm">{t("hero.bookkeeping_desc")}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-serif">{t("hero.financial_reports")}</h3>
                  <p className="text-gray-600 text-sm">{t("hero.financial_reports_desc")}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-serif">{t("hero.tax_compliance")}</h3>
                  <p className="text-gray-600 text-sm">{t("hero.tax_compliance_desc")}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-serif">{t("hero.practices_title")}</h3>
                  <p className="text-gray-600 text-sm">{t("hero.practices_desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
