import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
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
import { Calculator, Settings, BarChart3, FileCheck, PieChart, Briefcase, CheckCircle } from "lucide-react"

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
    <section id="services" className="py-20" style={{ backgroundColor: "#F7F7F7" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: "#1E3A5F" }}>
            Nuestros Servicios
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "#1E3A5F", opacity: 0.8 }}>
            Soluciones completas para el éxito financiero de tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow duration-300"
                style={{ backgroundColor: "#FBFCFF" }}
              >
                <CardHeader className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "rgba(66,133,244,0.10)" }} // solo el fondo tiene opacidad
                  >
                    <IconComponent className="h-8 w-8" style={{ color: "#4285F4", opacity: 1 }} />
                  </div>
                  <CardTitle className="text-xl font-semibold" style={{ color: "#1E3A5F" }}>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-center leading-relaxed" style={{ color: "#1E3A5F", opacity: 0.7 }}>
                    {service.description}
                  </CardDescription>

                  <Dialog
                    open={openDialog === service.id}
                    onOpenChange={(open) => setOpenDialog(open ? service.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        style={{
                          borderColor: "#4285F4",
                          color: "#4285F4",
                          background: "#fcfdffff"
                        }}
                      >
                        Ver Detalles
                       
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="max-w-2xl w-full max-h-[90vh] overflow-y-auto sm:rounded-2xl rounded-none p-6"
                      style={{ backgroundColor: "#FBFCFF" }}
                    >
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color: "#0f1011ff" }}>
                          <IconComponent className="h-8 w-8" style={{ color: "#4285F4" }} />
                          {service.title}
                        </DialogTitle>
                        <DialogDescription className="text-lg" style={{ color: "#1E3A5F", opacity: 0.8 }}>
                          Conoce todo lo que incluye este servicio
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 mt-6">
                        <h4 className="font-semibold text-lg" style={{ color: "#1E3A5F" }}>
                          Este servicio incluye:
                        </h4>
                        <ul className="space-y-3">
                          {service.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#34A853" }} />
                              <span style={{ color: "#1E3A5F", opacity: 0.9 }}>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {service.link && (
                    <Link
                      to={service.link}
                      className="block text-center text-sm font-semibold hover:underline"
                      style={{ color: "#4285F4" }}
                    >
                      Ver más
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
