import { Clock, Shield, BarChart, Zap } from "lucide-react"
import { useLanguage } from "./language-context"

const benefitIcons = [
  <Clock className="h-10 w-10 text-yellow-600" />, 
  <Shield className="h-10 w-10 text-yellow-600" />, 
  <BarChart className="h-10 w-10 text-yellow-600" />, 
  <Zap className="h-10 w-10 text-yellow-600" />
]

export function Benefits() {
  const { t } = useLanguage()

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t("benefits.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("benefits.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({length: 4}).map((_, index) => {
            return (
              <div key={`benefit-${index + 1}`} className="text-center space-y-4">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  {benefitIcons[index]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t(`benefits.${index + 1}`)}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
