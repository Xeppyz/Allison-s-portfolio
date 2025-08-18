"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string | string[]
  translations: (typeof translations)[Language]
}

const translations = {
  es: {
    // Navigation
    "nav.services": "Servicios",
    "nav.benefits": "Beneficios",
    "nav.testimonials": "Testimonios",
    "nav.blog": "Blog",
    "nav.contact": "Contacto",

    // Hero
    // Dentro de "es"
    "hero.bookkeeping": "Contabilidad",
    "hero.bookkeeping_desc": "Registros claros y precisos para tu negocio.",
    "hero.financial_reports": "Reportes financieros",
    "hero.financial_reports_desc": "Análisis detallado para la toma de decisiones.",
    "hero.tax_compliance": "Cumplimiento fiscal",
    "hero.tax_compliance_desc": "Cumple con tus obligaciones tributarias sin estrés.",

    "hero.title": "Allison Silva Taxes & Accounting",
    "hero.subtitle":
      "Te ayudamos a organizar y optimizar las finanzas de tu negocio, para que tomes decisiones con claridad y crezcas con confianza.",
    "hero.cta1": "Agenda tu consulta gratis",
    "hero.cta2": "Solicita una cotización",
    "hero.cta3": "Mirar planes",

    // About
    aboutTitle: "Sobre Mí",
    aboutSubtitle: "Conoce a la profesional detrás de tu éxito financiero",

    // Modal
    "modal.consultationTitle": "Agenda tu Consulta Gratis",
    "modal.quoteTitle": "Solicita una Cotización",
    "modal.name": "Nombre completo",
    "modal.email": "Correo electrónico",
    "modal.phone": "Teléfono",
    "modal.subject": "Tema de consulta",
    "modal.message": "Describe lo que necesitas",
    "modal.cancel": "Cancelar",
    "modal.send": "Enviar",

    // Entrepreneur Plan
    "entrepreneurPlan.title": "Plan Emprendedor",
    "entrepreneurPlan.subtitle": "Solución integral para empresarios que buscan organización y crecimiento",
    "entrepreneurPlan.planTitle": "Plan Emprendedor Completo",
    "entrepreneurPlan.planDescription":
      "Un servicio integral diseñado para empresarios que necesitan organizar sus finanzas y cumplir con todas las obligaciones fiscales mientras se enfocan en hacer crecer su negocio.",
    "entrepreneurPlan.seeDetails": "Ver Detalles",
    "entrepreneurPlan.hideDetails": "Ocultar Detalles",
    "entrepreneurPlan.includesTitle": "¿Qué incluye este plan?",
    "entrepreneurPlan.features.diagnosis":
      "Diagnóstico inicial de la situación fiscal, financiera y administrativa de la empresa",
    "entrepreneurPlan.features.actionPlan": "Propuesta de plan de acción con cronograma estimado de implementación",
    "entrepreneurPlan.features.followUp": "Seguimiento continuo y control mensual de registros contables",
    "entrepreneurPlan.features.financialStatements":
      "Elaboración de estados financieros garantizando el cumplimiento fiscal mensual y anual",
    "entrepreneurPlan.features.laborCompliance":
      "Cumplimiento laboral (si aplica), incluyendo registro de nómina ante autoridades locales como INSS",

    // Services
    "services.title": "Nuestros Servicios",
    "services.subtitle": "Soluciones completas para el éxito financiero de tu negocio",
    "services.seeDetails": "Ver Detalles",
    "services.detailsSubtitle": "Conoce todo lo que incluye este servicio",
    "services.includes": "Este servicio incluye",

    "services.1.title": "Bookkeeping mensual",
    "services.1.desc": "Mantenemos tus registros contables al día con precisión y detalle.",
    "services.1.details": [
      "Registro diario de todas las transacciones comerciales",
      "Conciliación bancaria mensual",
      "Clasificación correcta de ingresos y gastos",
      "Mantenimiento de libros contables actualizados",
      "Preparación de balances de comprobación",
      "Archivo organizado de documentos de respaldo",
    ],

    "services.2.title": "Implementación de QuickBooks",
    "services.2.desc": "Configuramos y optimizamos QuickBooks para tu negocio específico.",
    "services.2.details": [
      "Configuración inicial personalizada del sistema",
      "Creación del plan de cuentas específico para tu industria",
      "Configuración de productos y servicios",
      "Entrenamiento básico para el uso del sistema",
      "Migración de datos desde sistemas anteriores",
      "Soporte técnico durante los primeros 30 días",
    ],

    "services.3.title": "Control de ingresos y gastos",
    "services.3.desc": "Seguimiento detallado de todas tus transacciones financieras.",
    "services.3.details": [
      "Monitoreo en tiempo real de flujo de efectivo",
      "Categorización detallada de todos los gastos",
      "Seguimiento de cuentas por cobrar y pagar",
      "Análisis de rentabilidad por producto/servicio",
      "Alertas de gastos inusuales o excesivos",
      "Reportes de tendencias financieras mensuales",
    ],

    "services.4.title": "Control fiscal y cumplimiento",
    "services.4.desc": "Aseguramos el cumplimiento de todas las obligaciones fiscales.",
    "services.4.details": [
      "Preparación y presentación de declaraciones mensuales",
      "Cálculo preciso de impuestos sobre la renta",
      "Gestión de retenciones y pagos a cuenta",
      "Cumplimiento de obligaciones ante DGI",
      "Asesoría en planificación fiscal",
      "Representación ante autoridades fiscales",
    ],

    "services.5.title": "Reportes financieros mensuales",
    "services.5.desc": "Informes claros y detallados para la toma de decisiones.",
    "services.5.details": [
      "Estado de resultados (pérdidas y ganancias)",
      "Balance general actualizado",
      "Flujo de efectivo proyectado",
      "Análisis de indicadores financieros clave",
      "Comparativo con períodos anteriores",
      "Recomendaciones para mejora financiera",
    ],

    "services.6.title": "Plan emprendedor",
    "services.6.desc": "Organización + control + asesoría estratégica integral.",
    "services.6.details": [
      "Diagnóstico inicial completo de la situación fiscal y financiera",
      "Propuesta de plan de acción con cronograma de implementación",
      "Seguimiento continuo y control mensual de registros contables",
      "Elaboración de estados financieros con cumplimiento fiscal",
      "Cumplimiento laboral incluyendo registro de nómina ante INSS",
      "Asesoría estratégica para el crecimiento del negocio",
    ],

    // Benefits
    "benefits.title": "Beneficios para tu Negocio",
    "benefits.subtitle": "Descubre cómo podemos transformar la gestión financiera de tu empresa",
    "benefits.1": "Ahorro de tiempo",
    "benefits.2": "Cumplimiento fiscal sin estrés",
    "benefits.3": "Reportes claros para tomar decisiones",
    "benefits.4": "Procesos simples y sin complicaciones",

    // Testimonials
    "testimonials.title": "Lo que dicen nuestros clientes",
    "testimonials.subtitle": "Historias de éxito de empresarios que confían en nosotros",

    // Blog
    "blog.title": "Consejos y Recursos",
    "blog.subtitle": "Artículos útiles sobre contabilidad y finanzas empresariales",
    "blog.readmore": "Leer más",

    // Contact
    "contact.title": "Contáctanos",
    "contact.subtitle": "Estamos aquí para ayudarte a hacer crecer tu negocio",
    "contact.form.name": "Nombre completo",
    "contact.form.email": "Correo electrónico",
    "contact.form.phone": "Teléfono",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar mensaje",
    "contact.info.hours": "Horario de atención",
    "contact.info.schedule": "Lunes a Viernes 8:00 am – 5:00 pm",
    "contact.info.location": "Ubicación",
    "contact.info.city": "Managua, Nicaragua",

    // Footer
    "footer.rights": "Todos los derechos reservados.",
    "footer.services.title": "Servicios",
    "footer.contact.title": "Contacto",
    "footer.follow": "Síguenos",
  },
  en: {
    // Navigation
    "nav.services": "Services",
    "nav.benefits": "Benefits",
    "nav.testimonials": "Testimonials",
    "nav.blog": "Blog",
    "nav.contact": "Contact",

    // Hero
    // Dentro de "en"
    "hero.bookkeeping": "Bookkeeping",
    "hero.bookkeeping_desc": "Clear and accurate records for your business.",
    "hero.financial_reports": "Financial reports",
    "hero.financial_reports_desc": "Detailed analysis for decision-making.",
    "hero.tax_compliance": "Tax compliance",
    "hero.tax_compliance_desc": "Stay compliant with tax obligations stress-free.",
    "hero.title": "Allison Silva Taxes & Accounting",
    "hero.subtitle":
      "We help you organize and optimize your business finances so you can make decisions clearly and grow with confidence.",
    "hero.cta1": "Schedule your free consultation",
    "hero.cta2": "Request a quote",
    "hero.cta3": "Take a look at the plans",

    // About
    aboutTitle: "About Me",
    aboutSubtitle: "Meet the professional behind your financial success",

    // Modal
    "modal.consultationTitle": "Schedule Your Free Consultation",
    "modal.quoteTitle": "Request a Quote",
    "modal.name": "Full name",
    "modal.email": "Email address",
    "modal.phone": "Phone number",
    "modal.subject": "Subject",
    "modal.message": "Describe what you need",
    "modal.cancel": "Cancel",
    "modal.send": "Send",

    // Entrepreneur Plan
    "entrepreneurPlan.title": "Entrepreneur Plan",
    "entrepreneurPlan.subtitle": "Comprehensive solution for entrepreneurs seeking organization and growth",
    "entrepreneurPlan.planTitle": "Complete Entrepreneur Plan",
    "entrepreneurPlan.planDescription":
      "A comprehensive service designed for entrepreneurs who need to organize their finances and comply with all tax obligations while focusing on growing their business.",
    "entrepreneurPlan.seeDetails": "See Details",
    "entrepreneurPlan.hideDetails": "Hide Details",
    "entrepreneurPlan.includesTitle": "What does this plan include?",
    "entrepreneurPlan.features.diagnosis":
      "Initial diagnosis of the company's fiscal, financial, and administrative situation",
    "entrepreneurPlan.features.actionPlan": "Action plan proposal with estimated implementation timeline",
    "entrepreneurPlan.features.followUp": "Ongoing follow-up and monthly accounting record control",
    "entrepreneurPlan.features.financialStatements":
      "Financial statement preparation ensuring monthly and annual tax compliance",
    "entrepreneurPlan.features.laborCompliance":
      "Labor compliance (if applicable), including payroll registration with local authorities such as INSS",

    // Services
    "services.title": "Our Services",
    "services.subtitle": "Complete solutions for your business financial success",
    "services.seeDetails": "See Details",
    "services.detailsSubtitle": "Learn everything included in this service",
    "services.includes": "This service includes",

    "services.1.title": "Monthly bookkeeping",
    "services.1.desc": "We keep your accounting records up to date with precision and detail.",
    "services.1.details": [
      "Daily recording of all business transactions",
      "Monthly bank reconciliation",
      "Proper classification of income and expenses",
      "Maintenance of updated accounting books",
      "Preparation of trial balances",
      "Organized filing of supporting documents",
    ],

    "services.2.title": "QuickBooks implementation",
    "services.2.desc": "We configure and optimize QuickBooks for your specific business.",
    "services.2.details": [
      "Personalized initial system setup",
      "Creation of industry-specific chart of accounts",
      "Product and service configuration",
      "Basic training for system usage",
      "Data migration from previous systems",
      "Technical support during the first 30 days",
    ],

    "services.3.title": "Income and expense tracking",
    "services.3.desc": "Detailed tracking of all your financial transactions.",
    "services.3.details": [
      "Real-time cash flow monitoring",
      "Detailed categorization of all expenses",
      "Accounts receivable and payable tracking",
      "Profitability analysis by product/service",
      "Alerts for unusual or excessive expenses",
      "Monthly financial trend reports",
    ],

    "services.4.title": "Tax control and compliance",
    "services.4.desc": "We ensure compliance with all tax obligations.",
    "services.4.details": [
      "Preparation and filing of monthly tax returns",
      "Accurate income tax calculations",
      "Management of withholdings and advance payments",
      "Compliance with DGI obligations",
      "Tax planning advisory",
      "Representation before tax authorities",
    ],

    "services.5.title": "Monthly financial reports",
    "services.5.desc": "Clear and detailed reports for decision making.",
    "services.5.details": [
      "Income statement (profit and loss)",
      "Updated balance sheet",
      "Projected cash flow",
      "Key financial indicator analysis",
      "Comparison with previous periods",
      "Recommendations for financial improvement",
    ],

    "services.6.title": "Entrepreneur plan",
    "services.6.desc": "Organization + control + comprehensive strategic advisory.",
    "services.6.details": [
      "Complete initial diagnosis of fiscal and financial situation",
      "Action plan proposal with implementation timeline",
      "Ongoing follow-up and monthly accounting record control",
      "Financial statement preparation with tax compliance",
      "Labor compliance including payroll registration with INSS",
      "Strategic advisory for business growth",
    ],

    // Benefits
    "benefits.title": "Benefits for Your Business",
    "benefits.subtitle": "Discover how we can transform your company's financial management",
    "benefits.1": "Save time",
    "benefits.2": "Stress-free tax compliance",
    "benefits.3": "Clear reports for decision-making",
    "benefits.4": "Simple and hassle-free processes",

    // Testimonials
    "testimonials.title": "What our clients say",
    "testimonials.subtitle": "Success stories from entrepreneurs who trust us",

    // Blog
    "blog.title": "Tips and Resources",
    "blog.subtitle": "Useful articles about accounting and business finance",
    "blog.readmore": "Read more",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "We are here to help you grow your business",
    "contact.form.name": "Full name",
    "contact.form.email": "Email address",
    "contact.form.phone": "Phone",
    "contact.form.message": "Message",
    "contact.form.submit": "Send message",
    "contact.info.hours": "Business hours",
    "contact.info.schedule": "Monday to Friday 8:00 am – 5:00 pm",
    "contact.info.location": "Location",
    "contact.info.city": "Managua, Nicaragua",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.services.title": "Services",
    "footer.contact.title": "Contact",
    "footer.follow": "Follow us",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const t = (key: string): string | string[] => {
    const value = translations[language][key as keyof (typeof translations)["es"]];
    if (typeof value === "string") {
      return value;
    }
    // Si el valor es un array, devuélvelo tal cual (para detalles de servicios)
    if (Array.isArray(value)) {
      return value;
    }
    return key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
