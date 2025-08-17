"use client"


import { Calculator, TrendingUp, Shield } from "lucide-react"
import { useLanguage } from "./language-context"
import { Button } from "./ui/button"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight font-serif">{t("hero.title")}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">{t("hero.subtitle")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              style={{ backgroundColor: "#34A853" }}
              >
                {t("hero.cta1")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-8 py-3 bg-transparent"
                style={{ borderColor: "#4285F4", color: "#4285F4", backgroundColor: "transparent" }}
              >
                {t("hero.cta2")}
              </Button>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
