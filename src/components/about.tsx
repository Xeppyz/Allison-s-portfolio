"use client"

import { useLanguage } from "./language-context"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import avatar from "../assets/img/avatar.jpg"
export function About() {
  const { language } = useLanguage()

  const certifications = [
    "CPA (Certified Public Accountant)",
    "QuickBooks ProAdvisor",
    language === "es" ? "Maestría en Finanzas" : "Master's in Finance",
    language === "es" ? "Graduada de UCA" : "UCA Graduate",
  ]

  const companyMilestones = [
    {
      title: language === "es" ? "Fundación de la Empresa" : "Company Foundation",
      year: "2018",
      description:
        language === "es"
          ? "Allison fundó Silva Taxes & Accounting con la visión de brindar servicios contables personalizados y de alta calidad."
          : "Allison founded Silva Taxes & Accounting with the vision of providing personalized, high-quality accounting services.",
    },
    {
      title: language === "es" ? "Expansión del Equipo" : "Team Expansion",
      year: "2020",
      description:
        language === "es"
          ? "Incorporamos un equipo de profesionales especializados para atender mejor a nuestros clientes en crecimiento."
          : "We incorporated a team of specialized professionals to better serve our growing client base.",
    },
    {
      title: language === "es" ? "Crecimiento Sostenido" : "Sustained Growth",
      year: "2024",
      description:
        language === "es"
          ? "Hoy servimos a más de 800 clientes con un equipo dedicado de contadores y especialistas en impuestos."
          : "Today we serve over 800 clients with a dedicated team of accountants and tax specialists.",
    },
  ]

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#1E3A5F" }}>
            {language === "es" ? "Acerca de Nosotros" : "About Us"}
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "#1E3A5F" }}>
            {language === "es" ? "Nuestra Historia" : "Our Story"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Founder Profile Section */}
          <div className="space-y-8">
            <Card style={{ backgroundColor: "#FBFCFF" }} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4" style={{ borderColor: "#4285F4" }}>
                    <img src={avatar} alt="Allison Silva" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: "#1E3A5F" }}>
                      Allison Silva, CPA
                    </h3>
                    <p className="text-lg mb-4" style={{ color: "#1E3A5F" }}>
                      {language === "es" ? "Fundadora y Directora" : "Founder & Director"}
                    </p>
                    <p className="leading-relaxed" style={{ color: "#1E3A5F" }}>
                      {language === "es"
                        ? "Graduada como contadora de la Universidad Centroamericana (UCA), con certificación CPA y Maestría en Finanzas. Allison lidera nuestro equipo de profesionales con más de 10 años de experiencia, brindando servicios contables y fiscales de excelencia."
                        : "Graduated as an accountant from Universidad Centroamericana (UCA), with CPA certification and a Master's degree in Finance. Allison leads our team of professionals with over 10 years of experience, providing excellent accounting and tax services."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card style={{ backgroundColor: "#FBFCFF" }} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h4 className="text-xl font-bold mb-6" style={{ color: "#1E3A5F" }}>
                  {language === "es" ? "Educación y Certificaciones" : "Education & Certifications"}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {certifications.map((cert, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium"
                      style={{
                        backgroundColor: "#34A853",
                        color: "white",
                        border: "none",
                      }}
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Growth Section */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold mb-8" style={{ color: "#1E3A5F" }}>
              {language === "es" ? "Nuestro Crecimiento" : "Our Growth"}
            </h4>

            {companyMilestones.map((milestone, index) => (
              <Card key={index} style={{ backgroundColor: "#FBFCFF" }} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 rounded-full mt-2" style={{ backgroundColor: "#4285F4" }}></div>
                    <div className="flex-1">
                      <h5 className="text-lg font-bold mb-1" style={{ color: "#1E3A5F" }}>
                        {milestone.title}
                      </h5>
                      <p className="font-medium mb-2" style={{ color: "#4285F4" }}>
                        {milestone.year}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "#1E3A5F" }}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Company Stats */}
            <Card style={{ backgroundColor: "#FBFCFF" }} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: "#34A853" }}>
                      800+
                    </div>
                    <p className="text-sm" style={{ color: "#1E3A5F" }}>
                      {language === "es" ? "Clientes Atendidos" : "Clients Served"}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: "#34A853" }}>
                      6+
                    </div>
                    <p className="text-sm" style={{ color: "#1E3A5F" }}>
                      {language === "es" ? "Años de Experiencia" : "Years in Business"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm leading-relaxed" style={{ color: "#1E3A5F" }}>
                    {language === "es"
                      ? "Respaldados por un equipo de profesionales especializados trabajando bajo el liderazgo de Allison para brindar servicios de confianza y excelencia."
                      : "Backed by a team of specialized professionals working under Allison's leadership to provide trusted and excellent services."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
