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
    language === "es" ? "Diplomado en Tributación en Panamá" : "Diploma in Taxation in Panama",
  ]

  const companyMilestones = [
    {
      title: language === "es" ? "Fundación de la Empresa" : "Company Foundation",
      year: "2024",
      description:
        language === "es"
          ? "Motivada por ofrecer un servicio cercano y de excelencia, en el año 2024 Allison fundó Allison Silva Taxes & Accounting. La empresa nació con el propósito de brindar a emprendedores, pymes y corporaciones un acompañamiento integral en contabilidad, cumplimiento tributario y control financiero, con la premisa de que la gestión contable no debe ser vista como un gasto, sino como una inversión en crecimiento y sostenibilidad."
          : "Driven by the motivation to provide a close and high-quality service, in 2024 Allison established Allison Silva Taxes & Accounting. The firm was created with the purpose of offering entrepreneurs, small and medium-sized businesses, and corporations comprehensive support in accounting, tax compliance, and financial control—under the premise that accounting management should not be seen as an expense, but rather as an investment in growth and sustainability.",
    },
    {
      title: language === "es" ? "Expansión del Equipo" : "Team Expansion",
      year: "2025",
      description:
        language === "es"
          ? "Con el tiempo el  proyecto evolucionó a un equipo multidisciplinario de profesionales comprometidos en apoyar a clientes en Nicaragua, Panamá y otros países de la región. Este crecimiento ha permitido integrar servicios adicionales como migración de sistemas contables a QuickBooks, diseño de procesos internos, manuales contables, consultoría estratégica y reportes financieros personalizados."
          : "Over time, the project evolved into a multidisciplinary team of professionals committed to supporting clients in Nicaragua, Panama, and other countries in the region. This growth has made it possible to integrate additional services such as the migration of accounting systems to QuickBooks, the design of internal processes, accounting manuals, strategic consulting, and customized financial reporting.",
    },
    {
      title: language === "es" ? "Crecimiento Sostenido" : "Sustained Growth",
      year: "2025",
      description:
        language === "es"
          ? "La misión de Allison Silva Taxes & Accounting es transformar la contabilidad de un gasto a una inversión estratégica, ayudando a sus clientes a crecer con datos financieros confiables y planificación inteligente. El objetivo a futuro es continuar expandiendo la cartera de servicios, fortaleciendo la presencia internacional y acompañando a empresas en su transformación financiera y digital, siempre con un estándar de calidad y confianza con el que se distingue."
          : "The mission of Allison Silva Taxes & Accounting is to transform accounting from an expense into a strategic investment, helping clients grow with reliable financial data and smart planning. Looking ahead, the goal is to continue expanding the service portfolio, strengthening international presence, and supporting companies in their financial and digital transformation—always with the standard of quality and trust that distinguishes the firm.",
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
                <div className="flex flex-col items-center text-justify space-y-6">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4" style={{ borderColor: "#4285F4" }}>
                    <img 
                      src={avatar} 
                      alt={language === 'es' ? 'Allison Silva CPA - Fundadora y Directora' : 'Allison Silva CPA - Founder & Director'} 
                      loading="lazy" 
                      decoding="async" 
                      className="w-full h-full object-cover" />
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
                        ? "Trayectoria Profesional Allison Silva, CPA Fundadora y Directora Allison Silva es Contadora Pública Autorizada (CPA), graduada de la Universidad Centroamericana (UCA) y Máster en Finanzas. Cuenta con más de 10 años de experiencia en contabilidad, tributación y consultoría financiera, además de posgrados especializados en tributación en Estados Unidos, Panamá, Costa Rica y Nicaragua. Su sólida formación y visión estratégica le han permitido asesorar a empresas de diferentes sectores en la optimización fiscal, implementación de sistemas contables y elaboración de reportes financieros de alto valor para la toma de decisiones."
                        : "Allison Silva is a Certified Public Accountant (CPA), graduated from the Central American University (UCA), and holds a Master’s degree in Finance. She has over 10 years of experience in accounting, taxation, and financial consulting, in addition to specialized postgraduate studies in taxation in the United States, Panama, Costa Rica, and Nicaragua. Her solid academic background and strategic vision have enabled her to advise companies from various industries on tax optimization, implementation of accounting systems, and the preparation of high-value financial reports for decision-making."}
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
                  <div className="flex items-start space-x-4 text-justify">
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

          
          </div>
        </div>
      </div>
    </section>
  )
}
