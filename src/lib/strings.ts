// Textos fijos de la interfaz en los dos idiomas del sitio.
// El contenido editable (títulos, precios, FAQ) vive en Supabase, no aquí.
import { useLocation } from 'react-router-dom'

export type Lang = 'es' | 'en'

/** Las páginas en inglés viven bajo /en/… */
export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
}

/** Slug de la página actual: último segmento de la ruta, o "inicio". */
export function slugFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'en') parts.shift()
  return parts[0] ?? 'inicio'
}

/** Ruta pública de una página según su idioma. */
export function pagePath(slug: string, lang: string | null | undefined): string {
  if (slug === 'inicio') return '/'
  return lang === 'en' ? `/en/${slug}` : `/${slug}`
}

const es = {
  navInicio: 'Inicio',
  navPlanes: 'Planes',
  navContabilidad: 'Contabilidad mensual',
  navBlog: 'Blog',
  navContacto: 'Contacto',
  verPlanes: 'Ver planes',
  verPlanesPrecios: 'Ver planes y precios',
  diagnosticoWa: 'Diagnóstico gratis por WhatsApp',
  escribirWa: 'Escribir por WhatsApp',
  cotizarWa: 'Cotizar por WhatsApp',
  cotizar: 'Cotizar',
  consultarWa: 'Consultar por WhatsApp',
  consultar: 'Consultar',
  planes: 'Planes',
  nuestrosPlanes: 'Nuestros planes',
  otros: 'Otros',
  validoHasta: 'Válido hasta el',
  faq: 'Preguntas frecuentes',
  borrador: 'Borrador: esta página aún no es pública',
  avisoLegal: 'Aviso legal',
  errorCarga: 'No pudimos cargar esta página.',
  errorContacto: 'Escríbenos a',
  errorLlama: 'o llama al',
  cargando: 'Cargando…',
  noEncontrada: 'Página no encontrada',
  volverInicio: 'Volver al inicio',
  cookiesTexto: 'Usamos cookies de analítica y publicidad para medir nuestras campañas. Más información en nuestra',
  cookiesPolitica: 'política de privacidad',
  aceptar: 'Aceptar',
  rechazar: 'Rechazar',
  privacidad: 'Privacidad',
  terminos: 'Términos',
  preferenciasCookies: 'Preferencias de cookies',
  derechos: 'Todos los derechos reservados.',
  slogan: 'NO SOLO CIERRO LIBROS, ABRO OPORTUNIDADES',
  footerBlurb:
    'Te ayudamos a organizar y optimizar las finanzas de tu negocio, para que tomes decisiones con claridad y crezcas con confianza.',
  footerServicios: 'Servicios',
  footerContacto: 'Contacto',
  footerHorario: 'Horario de atención',
  footerGoogle: 'Encuéntranos en Google',
  ariaLinkedin: 'Ir a LinkedIn',
  ariaLlamar: 'Llamar por teléfono',
  ariaCorreo: 'Enviar correo',
  avisoCookies: 'Aviso de cookies',
  abrirMenu: 'Abrir menú',
  cerrarMenu: 'Cerrar menú',
  noEncontradaTexto: 'La página que buscas no existe o fue movida.',
  grupoEmpresa: 'Planes para empresas',
  grupoLlc: 'LLC de EE. UU.',
  grupoPersonal: 'Finanzas personales',
  grupoCertificacion: 'Certificaciones',
  grupoAddon: 'Servicios adicionales',
}

const en: typeof es = {
  navInicio: 'Home',
  navPlanes: 'Plans',
  navContabilidad: 'Monthly bookkeeping',
  navBlog: 'Blog',
  navContacto: 'Contact',
  verPlanes: 'See plans',
  verPlanesPrecios: 'See plans and pricing',
  diagnosticoWa: 'Free assessment on WhatsApp',
  escribirWa: 'Message us on WhatsApp',
  cotizarWa: 'Get a quote on WhatsApp',
  cotizar: 'Get a quote',
  consultarWa: 'Ask on WhatsApp',
  consultar: 'Ask us',
  planes: 'Plans',
  nuestrosPlanes: 'Our plans',
  otros: 'Other',
  validoHasta: 'Valid until',
  faq: 'Frequently asked questions',
  borrador: 'Draft: this page is not public yet',
  avisoLegal: 'Legal notice',
  errorCarga: 'We could not load this page.',
  errorContacto: 'Email us at',
  errorLlama: 'or call',
  cargando: 'Loading…',
  noEncontrada: 'Page not found',
  volverInicio: 'Back to home',
  cookiesTexto: 'We use analytics and advertising cookies to measure our campaigns. More information in our',
  cookiesPolitica: 'privacy policy',
  aceptar: 'Accept',
  rechazar: 'Decline',
  privacidad: 'Privacy',
  terminos: 'Terms',
  preferenciasCookies: 'Cookie preferences',
  derechos: 'All rights reserved.',
  slogan: 'I DON’T JUST CLOSE THE BOOKS, I OPEN OPPORTUNITIES',
  footerBlurb:
    'We help you organize and optimize your business finances so you can make decisions with clarity and grow with confidence.',
  footerServicios: 'Services',
  footerContacto: 'Contact',
  footerHorario: 'Business hours',
  footerGoogle: 'Find us on Google',
  ariaLinkedin: 'Go to LinkedIn',
  ariaLlamar: 'Call by phone',
  ariaCorreo: 'Send an email',
  avisoCookies: 'Cookie notice',
  abrirMenu: 'Open menu',
  cerrarMenu: 'Close menu',
  noEncontradaTexto: 'The page you are looking for does not exist or has been moved.',
  grupoEmpresa: 'Plans for businesses',
  grupoLlc: 'U.S. LLC',
  grupoPersonal: 'Personal finance',
  grupoCertificacion: 'Certifications',
  grupoAddon: 'Additional services',
}

export const STRINGS: Record<Lang, typeof es> = { es, en }
export type Strings = typeof es

/** Idioma y textos de la ruta actual. */
export function useStrings(): { lang: Lang; t: Strings } {
  const lang = langFromPath(useLocation().pathname)
  return { lang, t: STRINGS[lang] }
}
