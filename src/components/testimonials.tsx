"use client"

import { useState } from "react"
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

  const selected = selectedTestimonial !== null ? testimonials[selectedTestimonial] : null

  return (
    <section id="testimonials" className="bg-ivory py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-5 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h2 className="text-3xl font-medium text-navy lg:text-5xl">Lo que dicen nuestros clientes</h2>
          <p className="text-lg text-navy/70">Historias de éxito de empresarios que confían en nosotros</p>
        </div>

        <ul
          className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth px-1 pb-4"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {testimonials.map((testimonial, index) => (
            <li
              key={testimonial.id}
              className="flex w-[85%] max-w-sm flex-none flex-col rounded-2xl border border-navy/10 bg-white p-6 sm:w-80"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="flex gap-1 text-taupe" role="img" aria-label="5 de 5 estrellas">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-4 flex-1 font-serif text-lg leading-relaxed text-navy/80">
                “{testimonial.comment}”
              </p>
              <div className="mt-6 flex items-center gap-4 border-t border-navy/10 pt-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={`${testimonial.name} - ${testimonial.company}`}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-navy">{testimonial.name}</h3>
                  <p className="text-sm text-navy/60">
                    {[testimonial.position, testimonial.company].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
              {testimonial.logo && (
                <img src={testimonial.logo} alt={testimonial.company} loading="lazy" decoding="async" className="mt-4 h-8 object-contain object-left" />
              )}
              <button
                type="button"
                onClick={() => setSelectedTestimonial(index)}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-navy/25 px-5 py-3 font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
              >
                Ver más
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <ResponsiveModal
            open={selectedTestimonial !== null}
            onClose={() => setSelectedTestimonial(null)}
            title={`${selected.name} - ${selected.company}`}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={selected.image || "/placeholder.svg"}
                  alt={`${selected.name} - ${selected.company}`}
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-serif text-lg font-medium text-navy">{selected.name}</h4>
                  <p className="text-navy/70">
                    {[selected.position, selected.company].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-navy/10 border-y border-navy/10">
                {selected.details.problem && (
                  <div className="py-4">
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-taupe">Problemática:</h5>
                    <p className="text-navy/80">{selected.details.problem}</p>
                  </div>
                )}
                {selected.details.benefit && (
                  <div className="py-4">
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-taupe">Beneficio obtenido:</h5>
                    <p className="text-navy/80">{selected.details.benefit}</p>
                  </div>
                )}
                {selected.details.satisfaction && (
                  <div className="py-4">
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-taupe">Nivel de satisfacción:</h5>
                    <p className="text-navy/80">{selected.details.satisfaction}</p>
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
