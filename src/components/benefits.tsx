import { Clock, Shield, BarChart, Zap } from "lucide-react"

const benefitIcons = [Clock, Shield, BarChart, Zap]

const benefitTexts = [
  "Ahorro de tiempo",
  "Cumplimiento fiscal sin estrés",
  "Reportes claros para tomar decisiones",
  "Procesos simples y sin complicaciones",
]

export function Benefits() {
  return (
    <section id="benefits" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-5 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h2 className="text-3xl font-medium text-navy lg:text-5xl">Beneficios para tu Negocio</h2>
          <p className="text-lg text-navy/70">Descubre cómo podemos transformar la gestión financiera de tu empresa</p>
        </div>

        <ul className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {benefitTexts.map((text, index) => {
            const Icon = benefitIcons[index]
            return (
              <li key={`benefit-${index + 1}`} className="border-t border-navy/15 pt-6">
                <Icon className="h-6 w-6 text-taupe" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl font-medium leading-snug text-navy">{text}</h3>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
