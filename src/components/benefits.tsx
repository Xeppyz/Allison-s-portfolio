import { Clock, Shield, BarChart, Zap } from "lucide-react"

const benefitIcons = [
  <Clock className="h-10 w-10 text-yellow-600" />, 
  <Shield className="h-10 w-10 text-yellow-600" />, 
  <BarChart className="h-10 w-10 text-yellow-600" />, 
  <Zap className="h-10 w-10 text-yellow-600" />
]

const benefitTexts = [
  "Ahorro de tiempo",
  "Cumplimiento fiscal sin estrés",
  "Reportes claros para tomar decisiones",
  "Procesos simples y sin complicaciones",
]

export function Benefits() {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Beneficios para tu Negocio</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Descubre cómo podemos transformar la gestión financiera de tu empresa</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({length: 4}).map((_, index) => {
            return (
              <div key={`benefit-${index + 1}`} className="text-center space-y-4">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  {benefitIcons[index]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{benefitTexts[index]}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
