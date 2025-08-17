"use client"

import { useLanguage } from "./language-context"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import avatar from "../assets/img/avatar.jpg"

export function About() {
  const { language, translations } = useLanguage()

  const certifications = [
    "CPA (Certified Public Accountant)",
    "QuickBooks ProAdvisor",
    "IRS Enrolled Agent",
    "Tax Preparation Specialist",
  ]

  const experience = [
    {
      title: language === "es" ? "Contadora Pública Senior" : "Senior Public Accountant",
      company: "Silva & Associates",
      years: "2018 - Present",
      description:
        language === "es"
          ? "Liderando servicios de contabilidad y preparación de impuestos para más de 500 clientes"
          : "Leading accounting and tax preparation services for over 500 clients",
    },
    {
      title: language === "es" ? "Especialista en Impuestos" : "Tax Specialist",
      company: "H&R Block",
      years: "2015 - 2018",
      description:
        language === "es"
          ? "Preparación de declaraciones de impuestos complejas y asesoramiento fiscal"
          : "Complex tax return preparation and tax advisory services",
    },
    {
      title: language === "es" ? "Contadora Junior" : "Junior Accountant",
      company: "Martinez CPA Firm",
      years: "2013 - 2015",
      description:
        language === "es"
          ? "Contabilidad general y asistencia en auditorías para pequeñas empresas"
          : "General accounting and audit assistance for small businesses",
    },
  ]

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#1E3A5F" }}>
            {translations.aboutTitle}
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "#1E3A5F" }}>
            {translations.aboutSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Profile Section */}
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
                      {language === "es" ? "Contadora Pública Certificada" : "Certified Public Accountant"}
                    </p>
                    <p className="leading-relaxed" style={{ color: "#1E3A5F" }}>
                      {language === "es"
                        ? "Con más de 10 años de experiencia en contabilidad y preparación de impuestos, me especializo en ayudar a individuos y pequeñas empresas a navegar el complejo mundo de las finanzas y los impuestos."
                        : "With over 10 years of experience in accounting and tax preparation, I specialize in helping individuals and small businesses navigate the complex world of finance and taxes."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card style={{ backgroundColor: "#FBFCFF" }} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h4 className="text-xl font-bold mb-6" style={{ color: "#1E3A5F" }}>
                  {language === "es" ? "Certificaciones" : "Certifications"}
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

          {/* Experience Section */}
          <div className="space-y-6">
            <h4 className="text-2xl font-bold mb-8" style={{ color: "#1E3A5F" }}>
              {language === "es" ? "Experiencia Profesional" : "Professional Experience"}
            </h4>

            {experience.map((exp, index) => (
              <Card key={index} style={{ backgroundColor: "#FBFCFF" }} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 rounded-full mt-2" style={{ backgroundColor: "#4285F4" }}></div>
                    <div className="flex-1">
                      <h5 className="text-lg font-bold mb-1" style={{ color: "#1E3A5F" }}>
                        {exp.title}
                      </h5>
                      <p className="font-medium mb-2" style={{ color: "#4285F4" }}>
                        {exp.company} • {exp.years}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "#1E3A5F" }}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Stats */}
            <Card style={{ backgroundColor: "#FBFCFF" }} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: "#34A853" }}>
                      500+
                    </div>
                    <p className="text-sm" style={{ color: "#1E3A5F" }}>
                      {language === "es" ? "Clientes Satisfechos" : "Satisfied Clients"}
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2" style={{ color: "#34A853" }}>
                      10+
                    </div>
                    <p className="text-sm" style={{ color: "#1E3A5F" }}>
                      {language === "es" ? "Años de Experiencia" : "Years of Experience"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
