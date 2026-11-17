import { useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Link } from "react-router-dom"
import { useServices } from "../lib/content"
import { Calculator, Settings, BarChart3, FileCheck, PieChart, Briefcase, ArrowRight } from "lucide-react"

const serviceIcons = [Calculator, Settings, BarChart3, FileCheck, PieChart, Briefcase]

export function Services() {
  const { data } = useServices()
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  const services = (data ?? []).map((svc, i) => ({
    id: svc.id,
    title: svc.title ?? "",
    description: svc.description ?? "",
    details: (svc.details ?? []).filter((d): d is string => typeof d === "string"),
    link: svc.link ?? "",
    icon: serviceIcons[i % serviceIcons.length],
  }))

  if (services.length === 0) return null

  return (
    <section id="services" className="bg-ivory py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-5 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h2 className="text-3xl font-medium text-navy lg:text-5xl">Nuestros Servicios</h2>
          <p className="text-lg text-navy/70">Soluciones completas para el éxito financiero de tu negocio</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <article
                key={service.id}
                className="flex flex-col rounded-2xl border border-navy/10 bg-white p-6 transition hover:-translate-y-px hover:border-taupe/60 sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-taupe/50 text-taupe">
                  <IconComponent className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-serif text-xl font-medium text-navy">{service.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-navy/70">{service.description}</p>

                <div className="mt-6 space-y-4">
                  <Dialog
                    open={openDialog === service.id}
                    onOpenChange={(open) => setOpenDialog(open ? service.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-navy/25 bg-transparent px-5 py-3 font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
                      >
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-none border-navy/10 bg-white p-6 sm:rounded-2xl sm:p-8">
                      <DialogHeader className="space-y-3">
                        <span aria-hidden="true" className="block h-px w-12 bg-taupe" />
                        <DialogTitle className="flex items-center gap-3 font-serif text-2xl font-medium leading-snug text-navy">
                          <IconComponent className="h-6 w-6 shrink-0 text-taupe" aria-hidden="true" />
                          {service.title}
                        </DialogTitle>
                        <DialogDescription className="text-base text-navy/70">
                          Conoce todo lo que incluye este servicio
                        </DialogDescription>
                      </DialogHeader>

                      <div className="mt-6 space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">
                          Este servicio incluye:
                        </h4>
                        <ul className="divide-y divide-navy/10 border-y border-navy/10">
                          {service.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-3 py-3">
                              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-taupe" />
                              <span className="text-navy/80">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {service.link && (
                    <Link
                      to={service.link}
                      className="group inline-flex min-h-11 items-center gap-1.5 rounded text-sm font-semibold text-navy underline decoration-taupe underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
                    >
                      Ver más
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
