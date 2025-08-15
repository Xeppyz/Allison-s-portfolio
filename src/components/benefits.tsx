"use client"


import { Clock, Shield, BarChart, Zap } from "lucide-react"
import { useLanguage } from "./language-context"

const benefitIcons = [Clock, Shield, BarChart, Zap]

export function Benefits() {
  const { t } = useLanguage()

  const benefits = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    title: t(`benefits.${i + 1}`),
    icon: benefitIcons[i],
  }))

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t("benefits.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("benefits.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon
            return (
              <div key={benefit.id} className="text-center space-y-4">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
