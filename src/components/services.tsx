"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Calculator, Settings, BarChart3, FileCheck, PieChart, Briefcase } from "lucide-react"
import { useLanguage } from "./language-context"

const serviceIcons = [Calculator, Settings, BarChart3, FileCheck, PieChart, Briefcase]

export function Services() {
  const { t } = useLanguage()

  const services = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: t(`services.${i + 1}.title`),
    description: t(`services.${i + 1}.desc`),
    icon: serviceIcons[i],
  }))

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t("services.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("services.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card key={service.id} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
