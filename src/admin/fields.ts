export type FieldKind =
  | 'text' | 'textarea' | 'bool' | 'date' | 'select'
  | 'list' | 'pairs' | 'tags' | 'image' | 'number'

export type Field = {
  name: string
  label: string
  kind: FieldKind
  options?: string[]
  help?: string
}

export type TableDef = {
  label: string
  titleField: string
  fields: Field[]
  single?: boolean
}

const sort: Field = { name: 'sort', label: 'Orden', kind: 'number', help: 'Número menor aparece primero' }
const active: Field = { name: 'active', label: 'Activo', kind: 'bool', help: 'Si se desmarca, no se muestra en el sitio' }

export const tables: Record<string, TableDef> = {
  site_settings: {
    label: 'Datos del sitio',
    titleField: 'email',
    single: true,
    fields: [
      { name: 'whatsapp_number', label: 'Número de WhatsApp', kind: 'text', help: 'Con código de país. Si se deja vacío, el sitio no muestra botones de WhatsApp' },
      { name: 'phone', label: 'Teléfono', kind: 'text' },
      { name: 'email', label: 'Correo', kind: 'text' },
      { name: 'hours', label: 'Horario', kind: 'text' },
      { name: 'address', label: 'Dirección', kind: 'text' },
      { name: 'gbp_url', label: 'Enlace de Google Business', kind: 'text' },
      { name: 'gtm_id', label: 'ID de Google Tag Manager', kind: 'text', help: 'Formato GTM-XXXXXXX. Vacío = sin seguimiento' },
      { name: 'credentials', label: 'Credenciales', kind: 'list' },
    ],
  },
  pages: {
    label: 'Páginas',
    titleField: 'slug',
    fields: [
      { name: 'slug', label: 'Dirección (slug)', kind: 'text' },
      { name: 'kind', label: 'Tipo de página', kind: 'select', options: ['home', 'service', 'legal'] },
      { name: 'meta_title', label: 'Título para Google', kind: 'text' },
      { name: 'meta_description', label: 'Descripción para Google', kind: 'textarea' },
      { name: 'h1', label: 'Título principal', kind: 'text' },
      { name: 'subheadline', label: 'Subtítulo', kind: 'textarea' },
      { name: 'benefits', label: 'Beneficios', kind: 'pairs' },
      { name: 'bonus_text', label: 'Texto del bono', kind: 'text' },
      { name: 'bonus_deadline', label: 'Fecha límite del bono', kind: 'date' },
      { name: 'guarantee', label: 'Garantía', kind: 'textarea' },
      { name: 'wa_message', label: 'Mensaje de WhatsApp', kind: 'textarea' },
      { name: 'body', label: 'Texto de la página', kind: 'textarea', help: 'Solo para páginas legales. Deja una línea en blanco entre párrafos; una línea que empieza con ## es un título' },
    ],
  },
  services: {
    label: 'Servicios',
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Título', kind: 'text' },
      { name: 'description', label: 'Descripción', kind: 'textarea' },
      { name: 'details', label: 'Detalles', kind: 'list' },
      { name: 'link', label: 'Enlace', kind: 'text', help: 'Ruta interna, por ejemplo /contabilidad-mensual' },
      sort,
      active,
    ],
  },
  plans: {
    label: 'Planes',
    titleField: 'name',
    fields: [
      { name: 'slug', label: 'Identificador (slug)', kind: 'text' },
      { name: 'name', label: 'Nombre', kind: 'text' },
      { name: 'price_text', label: 'Precio', kind: 'text', help: 'Tal como se verá, por ejemplo: Desde US$199 al mes' },
      { name: 'description', label: 'Descripción', kind: 'textarea' },
      { name: 'features', label: 'Qué incluye', kind: 'list' },
      { name: 'group', label: 'Grupo', kind: 'select', options: ['empresa', 'llc', 'personal', 'certificacion', 'addon'] },
      { name: 'cta', label: 'Botón', kind: 'select', options: ['planes', 'whatsapp'] },
      { name: 'page_slugs', label: 'Páginas donde aparece', kind: 'tags', help: 'Páginas donde aparece, por ejemplo: inicio, planes, contabilidad-mensual' },
      sort,
      active,
    ],
  },
  testimonials: {
    label: 'Testimonios',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Nombre', kind: 'text' },
      { name: 'position', label: 'Cargo', kind: 'text' },
      { name: 'company', label: 'Empresa', kind: 'text' },
      { name: 'quote', label: 'Testimonio', kind: 'textarea' },
      { name: 'problem', label: 'Problema', kind: 'textarea' },
      { name: 'benefit', label: 'Beneficio', kind: 'textarea' },
      { name: 'satisfaction', label: 'Satisfacción', kind: 'textarea' },
      { name: 'photo_url', label: 'Foto', kind: 'image' },
      { name: 'logo_url', label: 'Logo', kind: 'image' },
      { name: 'authorized', label: 'Autorizado', kind: 'bool', help: 'Marcar solo con permiso escrito del cliente' },
      sort,
      active,
    ],
  },
  faqs: {
    label: 'Preguntas frecuentes',
    titleField: 'question',
    fields: [
      { name: 'page_slug', label: 'Página', kind: 'text', help: 'Página donde aparece, por ejemplo: inicio' },
      { name: 'question', label: 'Pregunta', kind: 'text' },
      { name: 'answer', label: 'Respuesta', kind: 'textarea' },
      sort,
      active,
    ],
  },
}
