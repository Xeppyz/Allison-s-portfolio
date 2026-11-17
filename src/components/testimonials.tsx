"use client"

import { useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Star } from "lucide-react"
import { ResponsiveModal } from "../components/modalResponsiveTestimonials"
import guest from "../assets/img/user_guest.png"
import { useTestimonials } from "../lib/content"

export function Testimonials() {
  const { data } = useTestimonials()
  const [selectedTestimonial, setSelectedTestimonial] = useState<number | null>(null)

  const testimonials = (data ?? []).map((t) => ({
    id: t.id,
    name: t.name ?? "",
    position: t.position ?? "",
    company: t.company ?? "",
    comment: t.quote ?? "",
    image: t.photo_url || guest,
    logo: t.logo_url || "",
    details: {
      problem: t.problem ?? "",
      benefit: t.benefit ?? "",
      satisfaction: t.satisfaction ?? "",
    },
  }))

  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="py-20" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: "#1E3A5F" }}>
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "#1E3A5F", opacity: 0.8 }}>
            Historias de éxito de empresarios que confían en nosotros
          </p>
        </div>

        <div
          className=" flex gap-6 overflow-x-auto overflow-y-hidden pb-4 px-1 md:px-4 lg:px-8
         scroll-smooth
                    scrollbar scrollbar-thin
                    scrollbar-track-slate-200
                    scrollbar-thumb-[#4285F4]/70
                    hover:scrollbar-thumb-[#4285F4]
                    scrollbar-thumb-rounded-full scrollbar-track-rounded-full
"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              style={{ backgroundColor: '#FBFCFF', minWidth: 320, maxWidth: 380, scrollSnapAlign: 'start', flex: '0 0 auto' }}
              className="shadow-md"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" style={{ color: '#34A853' }} />
                  ))}
                </div>
                <p className="italic leading-relaxed" style={{ color: '#1E3A5F', opacity: 0.8 }}>
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={`${testimonial.name} - ${testimonial.company}`}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold" style={{ color: '#1E3A5F' }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-sm" style={{ color: '#1E3A5F', opacity: 0.6 }}>
                      {[testimonial.position, testimonial.company].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                {testimonial.logo && (
                  <img src={testimonial.logo} alt={testimonial.company} loading="lazy" decoding="async" className="h-8 object-contain" />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTestimonial(index)}
                  className="w-full mt-4 border-2"
                  style={{
                    borderColor: '#4285F4',
                    color: '#4285F4',
                    backgroundColor: 'transparent',
                  }}
                >
                  Ver más
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
                  alt={`${testimonials[selectedTestimonial].name} - ${testimonials[selectedTestimonial].company}`}
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg" style={{ color: "#1E3A5F" }}>
                    {testimonials[selectedTestimonial].name}
                  </h4>
                  <p style={{ color: "#1E3A5F", opacity: 0.7 }}>
                    {[testimonials[selectedTestimonial].position, testimonials[selectedTestimonial].company].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {testimonials[selectedTestimonial].details.problem && (
                <div>
                  <h5 className="font-semibold mb-2" style={{ color: "#1E3A5F" }}>
                    Problemática:
                  </h5>
                  <p style={{ color: "#1E3A5F", opacity: 0.8 }}>{testimonials[selectedTestimonial].details.problem}</p>
                </div>
                )}

                {testimonials[selectedTestimonial].details.benefit && (

                <div>
                  <h5 className="font-semibold mb-2" style={{ color: "#1E3A5F" }}>
                    Beneficio obtenido:
                  </h5>
                  <p style={{ color: "#1E3A5F", opacity: 0.8 }}>{testimonials[selectedTestimonial].details.benefit}</p>
                </div>

                )}

                {testimonials[selectedTestimonial].details.satisfaction && (

                <div>
                  <h5 className="font-semibold mb-2" style={{ color: "#1E3A5F" }}>
                    Nivel de satisfacción:
                  </h5>
                  <p style={{ color: "#1E3A5F", opacity: 0.8 }}>
                    {testimonials[selectedTestimonial].details.satisfaction}
                  </p>
                </div>

                )}
              </div>
            </div>
          </ResponsiveModal>
        )}
      </div>
    </section>
  )
}
