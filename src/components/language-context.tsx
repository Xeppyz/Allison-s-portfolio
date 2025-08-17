"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
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
    "hero.title": "Allison Silva Taxes & Accounting",
    "hero.subtitle":
      "Te ayudamos a organizar y optimizar las finanzas de tu negocio, para que tomes decisiones con claridad y crezcas con confianza.",
    "hero.cta1": "Agenda tu consulta gratis",
    "hero.cta2": "Solicita una cotización",

  // Hero Cards
  "hero.bookkeeping": "Contabilidad",
  "hero.bookkeeping_desc": "Organización mensual",
  "hero.financial_reports": "Reportes Financieros",
  "hero.financial_reports_desc": "Información clara",
  "hero.tax_compliance": "Cumplimiento Fiscal",
  "hero.tax_compliance_desc": "Sin estrés",
  // About
    aboutTitle: "Acerca de mí",
    aboutSubtitle: "Conoce a la profesional detrás de tu éxito financiero",

    // Services
    "services.title": "Nuestros Servicios",
    "services.subtitle": "Soluciones completas para el éxito financiero de tu negocio",
    "services.1.title": "Bookkeeping mensual",
    "services.1.desc": "Mantenemos tus registros contables al día con precisión y detalle.",
    "services.2.title": "Implementación de QuickBooks",
    "services.2.desc": "Configuramos y optimizamos QuickBooks para tu negocio específico.",
    "services.3.title": "Control de ingresos y gastos",
    "services.3.desc": "Seguimiento detallado de todas tus transacciones financieras.",
    "services.4.title": "Control fiscal y cumplimiento",
    "services.4.desc": "Aseguramos el cumplimiento de todas las obligaciones fiscales.",
    "services.5.title": "Reportes financieros mensuales",
    "services.5.desc": "Informes claros y detallados para la toma de decisiones.",
    "services.6.title": "Plan emprendedor",
    "services.6.desc": "Organización + control + asesoría estratégica integral.",

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
    "hero.title": "Allison Silva Taxes & Accounting",
    "hero.subtitle":
      "We help you organize and optimize your business finances so you can make decisions clearly and grow with confidence.",
    "hero.cta1": "Schedule your free consultation",
    "hero.cta2": "Request a quote",

  // Hero Cards
  "hero.bookkeeping": "Bookkeeping",
  "hero.bookkeeping_desc": "Monthly organization",
  "hero.financial_reports": "Financial Reports",
  "hero.financial_reports_desc": "Clear insights",
  "hero.tax_compliance": "Tax Compliance",
  "hero.tax_compliance_desc": "Stress-free",
  // About
    aboutTitle: "About me",
    aboutSubtitle: "Meet the professional behind your financial success",

    // Services
    "services.title": "Our Services",
    "services.subtitle": "Complete solutions for your business financial success",
    "services.1.title": "Monthly bookkeeping",
    "services.1.desc": "We keep your accounting records up to date with precision and detail.",
    "services.2.title": "QuickBooks implementation",
    "services.2.desc": "We configure and optimize QuickBooks for your specific business.",
    "services.3.title": "Income and expense tracking",
    "services.3.desc": "Detailed tracking of all your financial transactions.",
    "services.4.title": "Tax control and compliance",
    "services.4.desc": "We ensure compliance with all tax obligations.",
    "services.5.title": "Monthly financial reports",
    "services.5.desc": "Clear and detailed reports for decision making.",
    "services.6.title": "Entrepreneur plan",
    "services.6.desc": "Organization + control + comprehensive strategic advisory.",

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

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["es"]] || key
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
