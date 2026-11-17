export function About() {
  const certifications = [
    "CPA (Certified Public Accountant)",
    "QuickBooks ProAdvisor",
    "Maestría en Finanzas",
    "Diplomado en Tributación en Panamá y Costa Rica",
  ]

  const companyMilestones = [
    {
      title: "Fundación de la Empresa",
      year: "2024",
      description:
        "Motivada por ofrecer un servicio cercano y de excelencia, en el año 2024 Allison fundó Allison Silva Taxes & Accounting. La empresa nació con el propósito de brindar a emprendedores, pymes y corporaciones un acompañamiento integral en contabilidad, cumplimiento tributario y control financiero, con la premisa de que la gestión contable no debe ser vista como un gasto, sino como una inversión en crecimiento y sostenibilidad.",
    },
    {
      title: "Expansión del Equipo",
      year: "2025",
      description:
        "Con el tiempo el  proyecto evolucionó a un equipo multidisciplinario de profesionales comprometidos en apoyar a clientes en Nicaragua, Panamá y otros países de la región. Este crecimiento ha permitido integrar servicios adicionales como migración de sistemas contables a QuickBooks, diseño de procesos internos, manuales contables, consultoría estratégica y reportes financieros personalizados.",
    },
    {
      title: "Crecimiento Sostenido",
      year: "2025",
      description:
        "La misión de Allison Silva Taxes & Accounting es transformar la contabilidad de un gasto a una inversión estratégica, ayudando a sus clientes a crecer con datos financieros confiables y planificación inteligente. El objetivo a futuro es continuar expandiendo la cartera de servicios, fortaleciendo la presencia internacional y acompañando a empresas en su transformación financiera y digital, siempre con un estándar de calidad y confianza con el que se distingue.",
    },
  ]

  return (
    <section id="about" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-5 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h2 className="text-3xl font-medium text-navy lg:text-5xl">Acerca de Nosotros</h2>
          <p className="text-lg text-navy/70">Nuestra Historia</p>
        </div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-2xl font-medium text-navy lg:text-3xl">Allison Silva, CPA</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-taupe">Fundadora y Directora</p>
            </div>
            <p className="break-words leading-relaxed text-navy/75">
              Allison Silva es Contadora Pública Autorizada (CPA), graduada de la Universidad Centroamericana (UCA) y Máster en Finanzas. Cuenta con más de 10 años de experiencia en contabilidad, tributación y consultoría financiera, además de posgrados especializados en tributación en Estados Unidos, Panamá, Costa Rica y Nicaragua. Su sólida formación y visión estratégica le han permitido asesorar a empresas de diferentes sectores en la optimización fiscal, implementación de sistemas contables y elaboración de reportes financieros de alto valor para la toma de decisiones.
            </p>
            <div className="border-t border-navy/10 pt-6">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-taupe">
                Educación y Certificaciones
              </h4>
              <ul className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <li
                    key={cert}
                    className="rounded-full border border-navy/15 px-3 py-1.5 text-sm text-navy/80"
                  >
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-8 font-serif text-2xl font-medium text-navy">Nuestro Crecimiento</h4>
            <ol className="space-y-10 border-l border-navy/15 pl-8">
              {companyMilestones.map((milestone) => (
                <li key={milestone.title} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.2rem] top-2.5 h-2 w-2 rounded-full bg-taupe"
                  />
                  <p className="font-serif text-xl text-taupe">{milestone.year}</p>
                  <h5 className="mt-1 break-words text-lg font-semibold text-navy">{milestone.title}</h5>
                  <p className="mt-2 break-words leading-relaxed text-navy/75">{milestone.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
