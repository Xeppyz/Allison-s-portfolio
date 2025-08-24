"use client"

import { useState } from "react"
import { useLanguage } from "../components/language-context"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Star } from "lucide-react"
import { ResponsiveModal } from "../components/modalResponsiveTestimonials"
import professionalMan from "../assets/img/professional-man-glasses.png"
import professsionalWoman from "../assets/img/professional-woman-smiling.png"
import professionalWomanEntrepreneur from "../assets/img/professional-woman-entrepreneur.png"

export function Testimonials() {
  const { t, language } = useLanguage()
  const [selectedTestimonial, setSelectedTestimonial] = useState<number | null>(null)

  const testimonials = [
    {
      name: "David Silva Briceño",
      position: "Founder & Managing Director",
      company: "IGH Financial Advisors",
      comment:
        language === "es"
          ? "Resultados satisfactorios, pues el tiempo de respuesta es el que requería."
          : "Satisfactory results, since the response time is just what I needed.",
      image: professionalMan,
      details: {
        problem:
          language === "es"
            ? "Necesitaba apoyo con unas certificaciones de ingresos, pero con un servicio ágil."
            : "I needed support with some income certifications, but with a fast service.",
        benefit:
          language === "es"
            ? "Resultados satisfactorios, pues el tiempo de respuesta es el que requería."
            : "Satisfactory results, as the response time met my requirements.",
        result:
          language === "es"
            ? "Aumenté mis ganancias en un 30% en 6 meses al tener mejor control de costos y precios. Los impuestos ya no son un problema."
            : "I increased my profits by 30% in 6 months by having better control of costs and prices. Taxes are no longer a problem.",
        satisfaction:
          language === "es"
            ? "Si lo recomendaría, por la calidad de servicio y además por el profesionalismo con que realizó su trabajo."
            : "I would definitely recommend it, because of the quality of service and the professionalism with which you carry out your work.",
      },
    },
    {
      name: "Dean Largaespada",
      position: "Founder",
      company: "ICONNECT GROUP LLC",
      comment:
        language === "es"
          ? "Ahora puedo saber cuánto estamos facturando, gastando, en qué categorías y cuánto es nuestra rentabilidad."
          : "Now I can see how much we are billing, spending, in which categories, and what our profitability is.",
      image: professsionalWoman,
      details: {
        problem:
          language === "es"
            ? "No teníamos una contabilidad clara ni rentabilidad."
            : "We did not have clear accounting and profitability.",
        benefit:
          language === "es"
            ? "Ahora puedo saber cuánto estamos facturando, gastando, en qué categorías y cuánto es nuestra rentabilidad."
            : "Now I can see how much we are billing, spending, in which categories, and what our profitability is",
        result:
          language === "es"
            ? "Conseguí una segunda ronda de inversión de $500K gracias a la claridad de mis reportes financieros."
            : "I secured a second investment round of $500K thanks to the clarity of my financial reports.",
        satisfaction:
          language === "es"
            ? "Si, porque has realizado tu trabajo con transparencia y calidad."
            : "Yes, because you have carried out your work with transparency and quality.",
      },
    },
    {
      name: "Bruce Lampson",
      position: "CEO",
      company: "RAPIMARKET",
      comment:
        language === "es"
          ? "Logramos tener procesos contables mucho más organizados, información financiera al día y asesoría oportuna para la toma de decisiones."
          : "We achieved much more organized accounting processes, up-to-date financial information, and timely advice for decision-making.",
      image: professionalWomanEntrepreneur,
      details: {
        problem:
          language === "es"
            ? "Necesitábamos tener un control más claro y preciso de la contabilidad de la empresa, con reportes financieros confiables y cumplimiento fiscal sin errores ni atrasos."
            : "We needed to have clearer and more precise control of the company’s accounting, with reliable financial reports and full tax compliance without errors or delays.",
        benefit:
          language === "es"
            ? "Logramos tener procesos contables mucho más organizados, información financiera al día y asesoría oportuna para la toma de decisiones. Además, nos sentimos tranquilos al saber que todo está en orden con nuestras obligaciones fiscales."
            : "We achieved much more organized accounting processes, up-to-date financial information, and timely advice for decision-making. In addition, we feel at ease knowing that everything is in order with our tax obligations.",
        result:
          language === "es"
            ? "Optimicé mi inventario, eliminé productos no rentables y aumenté mi margen de ganancia del 25% al 40%."
            : "I optimized my inventory, eliminated unprofitable products and increased my profit margin from 25% to 40%.",
        satisfaction:
          language === "es"
            ? "Definitivamente sí, porque ofrecen un servicio profesional, confiable y personalizado que realmente ayuda a las empresas a enfocarse en su crecimiento mientras ustedes se encargan de la parte contable."
            : "Definitely yes, because they offer a professional, reliable, and personalized service that truly helps companies focus on their growth while they take care of the accounting side.",
      },
    },
  ]

  return (
    <section id="testimonials" className="py-20" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: "#1E3A5F" }}>
            {t("testimonials.title")}
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "#1E3A5F", opacity: 0.8 }}>
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} style={{ backgroundColor: "#FBFCFF" }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" style={{ color: "#34A853" }} />
                  ))}
                </div>
                <p className="italic leading-relaxed" style={{ color: "#1E3A5F", opacity: 0.8 }}>
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold" style={{ color: "#1E3A5F" }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-sm" style={{ color: "#1E3A5F", opacity: 0.6 }}>
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTestimonial(index)}
                  className="w-full mt-4 border-2"
                  style={{
                    borderColor: "#4285F4",
                    color: "#4285F4",
                    backgroundColor: "transparent",
                  }}
                >
                  {language === "es" ? "Ver más" : "See more"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTestimonial !== null && (
          <ResponsiveModal
            open={selectedTestimonial !== null}
            onClose={() => setSelectedTestimonial(null)}
            title={`${testimonials[selectedTestimonial].name} - ${testimonials[selectedTestimonial].company}`}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={testimonials[selectedTestimonial].image || "/placeholder.svg"}
                  alt={testimonials[selectedTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg" style={{ color: "#1E3A5F" }}>
                    {testimonials[selectedTestimonial].name}
                  </h4>
                  <p style={{ color: "#1E3A5F", opacity: 0.7 }}>
                    {testimonials[selectedTestimonial].position}, {testimonials[selectedTestimonial].company}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold mb-2" style={{ color: "#1E3A5F" }}>
                    {language === "es" ? "Problemática:" : "Problem:"}
                  </h5>
                  <p style={{ color: "#1E3A5F", opacity: 0.8 }}>{testimonials[selectedTestimonial].details.problem}</p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2" style={{ color: "#1E3A5F" }}>
                    {language === "es" ? "Beneficio obtenido:" : "Benefit obtained:"}
                  </h5>
                  <p style={{ color: "#1E3A5F", opacity: 0.8 }}>{testimonials[selectedTestimonial].details.benefit}</p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2" style={{ color: "#1E3A5F" }}>
                    {language === "es" ? "Resultado:" : "Result:"}
                  </h5>
                  <p style={{ color: "#1E3A5F", opacity: 0.8 }}>{testimonials[selectedTestimonial].details.result}</p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2" style={{ color: "#1E3A5F" }}>
                    {language === "es" ? "Nivel de satisfacción:" : "Satisfaction level:"}
                  </h5>
                  <p style={{ color: "#1E3A5F", opacity: 0.8 }}>
                    {testimonials[selectedTestimonial].details.satisfaction}
                  </p>
                </div>
              </div>
            </div>
          </ResponsiveModal>
        )}
      </div>
    </section>
  )
}
