"use client"

import { useLanguage } from "./language-context"
import { Card, CardContent } from "./ui/card"
import { Star } from "lucide-react"

export function Testimonials() {
  const { t, language } = useLanguage()

  const testimonials = [
    {
      name: "María González",
      position: "CEO",
      company: "Café Luna",
      comment:
        language === "es"
          ? "Allison transformó completamente la organización financiera de mi café. Ahora puedo enfocarme en hacer crecer mi negocio sin preocuparme por los números."
          : "Allison completely transformed the financial organization of my café. Now I can focus on growing my business without worrying about the numbers.",
      image: "/professional-woman-smiling.png",
    },
    {
      name: "Carlos Mendoza",
      position: "Founder",
      company: "TechStart Nicaragua",
      comment:
        language === "es"
          ? "Los reportes mensuales que recibo son increíblemente claros. Por primera vez entiendo realmente la situación financiera de mi startup."
          : "The monthly reports I receive are incredibly clear. For the first time I really understand the financial situation of my startup.",
      image: "/professional-man-glasses.png",
    },
    {
      name: "Ana Rodríguez",
      position: "Owner",
      company: "Boutique Elegancia",
      comment:
        language === "es"
          ? "El plan emprendedor me dio la estructura que necesitaba. Allison no solo maneja mis libros, sino que me asesora estratégicamente."
          : "The entrepreneur plan gave me the structure I needed. Allison not only handles my books, but also advises me strategically.",
      image: "/professional-woman-entrepreneur.png",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t("testimonials.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
