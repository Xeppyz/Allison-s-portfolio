# Fase 1 de allisonsilvacorp.com: sitio multipágina con panel propio en Supabase

Fecha: 2026-11-16. Estado: pendiente de aprobación.

## Por qué

Allison va a lanzar anuncios (Google y Meta). Quien llegue debe entender en 10 segundos qué ofrece, ver un precio "desde" y escribir por WhatsApp. Además, Allison debe poder cambiar textos, precios y testimonios sin programador. La Fase 1 tiene que estar en línea antes de activar cualquier anuncio.

## Metas de la Fase 1

- Inicio actualizado, `/planes`, `/contabilidad-mensual`, `/privacidad`, `/terminos`.
- Botón flotante de WhatsApp con mensaje por página y código de campaña.
- Formulario corto que llega al correo y se guarda.
- Eventos de conversión listos para Google Ads y Meta.
- Título, descripción y H1 únicos por página; sitemap y datos estructurados.
- Banner de cookies y aviso de privacidad.
- Panel `/admin` para editar el contenido.

## Fuera de la Fase 1

- Landings de QuickBooks, Cumplimiento fiscal, LLC (es/en), Finanzas personales, Certificaciones, Capacitación (Fase 2). La plantilla de página de servicio queda lista: en Fase 2 cada landing es una fila nueva en la base.
- Blog editable desde el panel, Nosotros ampliado, reseñas de Google (Fase 3). El blog actual queda como está.
- Roles de usuario en el panel, historial de cambios, vista previa de borradores.
- Prerenderizado (ver "Límites conocidos").

## Lo que no debe pasar

- Un precio en el sitio distinto al de la tabla del brief.
- El botón de WhatsApp apuntando a un número no confirmado por Allison.
- Analytics o Meta Pixel cargando antes de que el visitante acepte cookies.
- Testimonios publicados sin autorización del cliente.
- Que cualquiera pueda leer los leads o escribir contenido sin iniciar sesión.

## Punto de partida

React 19 + Vite + Tailwind 4 + react-router 7, desplegado en Vercel como SPA (`vercel.json` reescribe todo a `/`). Una sola página. Textos en `src/components/language-context.tsx` con interruptor es/en. Los tres formularios (`contact.tsx`, `cotizacionModal.tsx`, `modalPaquetes.tsx`) llaman desde el navegador al API de correo de casavision, sin antispam. `server/` es un proxy Express que no se usa.

## Enfoques considerados

1. **Sanity** (hospedado): panel listo, CDN de imágenes. Descartado por decisión del dueño del proyecto.
2. **CMS basado en git** (Decap/Tina): contenido en el repo; login con GitHub engorroso en Vercel y 1–2 min de espera al publicar. Descartado.
3. **Supabase + panel propio** — **elegido por Allan**. Contenido en Postgres, login con Supabase Auth, panel `/admin` dentro del mismo sitio. Cuesta más construir y mantener, pero todo queda bajo control propio y la misma base guarda los leads.

## Diseño

### Supabase

Proyecto nuevo `allison-web` en la organización "xeppyz's projects", región us-east-1 (no existe uno para Allison; costo consultado: US$0/mes). Un solo entorno: el proyecto nace vacío, así que migraciones y datos iniciales van directo a él. Lo crea Claude por MCP cuando Allan lo confirme. Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` las pone Allan en Vercel. Una dependencia nueva: `@supabase/supabase-js`.

Tablas (todas con `id`, `sort`, `active` donde aplique):

| Tabla | Para qué | Campos principales |
|---|---|---|
| `site_settings` | Una sola fila con datos globales | `whatsapp_number`, `phone`, `email`, `hours`, `address`, `gbp_url`, `gtm_id`, `credentials` (lista de textos) |
| `pages` | Una fila por página (inicio, planes, cada landing) | `slug`, `lang`, `meta_title`, `meta_description`, `h1`, `subheadline`, `benefits` (jsonb, 3 ítems), `bonus_text`, `bonus_deadline`, `guarantee`, `wa_message`, `body` (texto largo para páginas legales) |
| `services` | Tarjetas de servicios del inicio | `title`, `description`, `details` (jsonb), `link` |
| `plans` | Planes, add-ons y precios sueltos | `slug`, `name`, `price_text`, `description`, `features` (jsonb), `group` (empresa, llc, personal, certificacion, addon), `cta` (planes o whatsapp), `page_slugs` (en qué páginas aparece) |
| `testimonials` | Testimonios | `name`, `position`, `company`, `quote`, `problem`, `benefit`, `satisfaction`, `photo_url`, `logo_url`, `authorized` |
| `faqs` | Preguntas frecuentes | `page_slug`, `question`, `answer` |
| `leads` | Envíos del formulario | `name`, `contact` (WhatsApp o correo), `company`, `country`, `service`, `message`, `page`, `utm` (jsonb), `created_at` |

`price_text` es texto libre ("Desde US$199 al mes") porque varios precios del brief no son un número.

Seguridad (RLS activado en todo):
- Contenido: lectura pública; escritura solo con sesión iniciada. `testimonials` solo se lee públicamente si `authorized = true`.
- `leads`: sin acceso público. Inserta solo la Edge Function; lee solo quien inició sesión.
- Storage: un bucket público `media` para fotos y logos; subir solo con sesión.
- Registro de usuarios desactivado. Las cuentas las crea Allan en el panel de Supabase. Cualquier usuario con sesión puede editar todo (sin roles).

Datos iniciales: los textos y testimonios actuales en español, y los precios de la tabla del brief tal cual. Los seis testimonios entran con `authorized = false` hasta que Allison confirme los permisos.

### Sitio público

Rutas nuevas en `main.tsx`: `/`, `/planes`, `/contabilidad-mensual` (y cualquier `/:slug` que exista en `pages`), `/privacidad`, `/terminos`, `/contacto`, `/admin`. Se conservan `/blog` y `/blog/:slug`.

- **Plantilla de página de servicio** (un solo componente, lee su fila de `pages`): titular, tres beneficios, testimonio, planes "desde", bono con fecha límite (se oculta solo cuando la fecha pasa), garantía, preguntas frecuentes, botón de WhatsApp.
- **Inicio**: titular y línea de apoyo del brief; botones "Diagnóstico gratis por WhatsApp" y "Ver planes"; tres tarjetas de entrada (empresa en Nicaragua → `/contabilidad-mensual`, LLC → `/llc-usa`, finanzas personales → `/finanzas-personales`; las dos últimas llevan a `/contacto` hasta la Fase 2); servicios actuales más Certificaciones, Capacitación y Finanzas personales; franja de tres planes; credenciales; testimonios; preguntas frecuentes; bloque final de WhatsApp. El "Plan emprendedor" sale del inicio y vive en `/planes`.
- **Pie**: año dinámico, datos de contacto desde `site_settings`, enlaces legales, enlace a Google Business Profile si existe.
- **Carga**: el contenido se pide a Supabase al abrir la página. Mientras llega se muestra el esqueleto de la página, no texto viejo.
- **Idioma**: el contenido del CMS es solo en español en la Fase 1. Se retira el interruptor es/en del sitio (el brief pide español en todo y solo la página de LLC en inglés, que llega en Fase 2 como `/en/llc-bookkeeping` con `lang = en`). Se corrige el `hreflang` que hoy apunta a un `/en` inexistente.

### WhatsApp

Función pura `buildWhatsAppUrl(number, message, utm)` → `https://wa.me/<número>?text=<mensaje codificado> [CÓDIGO]`.

- Mensaje: `pages.wa_message` de la página actual; si falta, el de inicio.
- Código de campaña: inicial de `utm_source` en mayúscula + `-` + `utm_campaign` en mayúsculas, por ejemplo `utm_source=google&utm_campaign=qb` → `[G-QB]`. Sin UTM no se agrega código.
- Los UTM se guardan en `sessionStorage` en la primera carga de la visita.
- Si `site_settings.whatsapp_number` está vacío, el botón flotante y los botones de WhatsApp no se muestran. Arranca vacío hasta que Allison confirme el número.

### Formulario

Un solo formulario (nombre, WhatsApp o correo, empresa, país, servicio, mensaje; el brief no pide dato de contacto, pero sin él no se puede responder al lead) reemplaza los tres actuales. Envía a una Edge Function de Supabase `lead` que:
1. valida los campos y descarta spam con un campo trampa oculto y un tiempo mínimo de llenado;
2. guarda en `leads` con la página y los UTM;
3. manda el correo a info@allisonsilvacorp.com por el mismo API de casavision que se usa hoy, ahora desde el servidor.

Si el correo falla, el lead ya quedó guardado y el visitante ve la confirmación igual. Los leads se ven en una lista dentro de `/admin`; esa lista es el "CRM" de la Fase 1. Se elimina la carpeta `server/`, que no se usa.

### Seguimiento

Solo se instala Google Tag Manager (`site_settings.gtm_id`); GA4 y Meta Pixel se configuran dentro de GTM, sin código extra. GTM carga únicamente después de aceptar el banner de cookies (la elección se guarda en `localStorage`). El sitio empuja a `dataLayer`: `whatsapp_click` (con `page`), `form_submit`, `ver_planes_click`, `phone_click`.

### SEO

`<title>` y `<meta name="description">` por ruta desde `pages` (React 19 los sube al `<head>` de forma nativa, sin librería). Un solo H1 por página. `sitemap.xml` y `robots.txt` actualizados a mano. JSON-LD de `AccountingService` en el inicio y de `FAQPage` en cada página con preguntas.

### Panel `/admin`

Carga diferida (no pesa en el sitio público). Pantalla de inicio de sesión con correo y contraseña. Después, una sección por tabla: lista con ordenar, activar/desactivar, crear, editar y borrar (con confirmación). Los formularios se generan desde una descripción de campos por tabla, para no escribir cinco pantallas a mano. Subida de imagen para foto y logo de testimonios. Lista de leads de solo lectura. Interfaz en español, usable desde el celular.

## Decisiones tomadas por mí (corregibles)

- Campo de contacto obligatorio en el formulario, aunque el brief no lo lista.
- Editable desde el panel: datos globales, credenciales, páginas (incluido el texto legal), servicios, planes, testimonios y preguntas. Fijo en código: las tres tarjetas de entrada del inicio (son navegación) y el texto del banner de cookies.
- `pages.body` es texto plano: párrafos separados por línea en blanco y títulos con `## `. Sin editor enriquecido.
- Vercel Analytics y Speed Insights se quedan: no usan cookies, así que no dependen del banner.
- Se elimina todo el contenido en inglés: el contexto de idioma, las traducciones y la versión en inglés del blog y de "Sobre mí". Queda en el historial de git.

- Texto libre para precios en vez de número.
- Sin roles: todo usuario con sesión edita todo.
- Antispam con campo trampa y tiempo mínimo; se sube a Cloudflare Turnstile si aparece spam.
- GTM como único contenedor.
- Fórmula del código de campaña.
- Retirar el interruptor es/en y eliminar `server/`.
- Leads en Supabase en lugar de hoja de cálculo.

## Límites conocidos

- **Sin prerenderizado**: Google indexa bien, pero la vista previa al compartir un enlace en WhatsApp o Meta muestra el título del inicio en todas las páginas. Se resuelve prerenderizando en el build; propuesto para Fase 2.
- **Respaldos**: el plan gratuito de Supabase no incluye copias automáticas. Para cumplir el requisito 10 hace falta el plan de pago o un respaldo programado propio. Queda por decidir.
- **Proyecto pausado**: los proyectos gratuitos de Supabase se pausan por inactividad; un sitio con visitas no debería llegar a eso, pero es un riesgo del plan gratuito.

## Pendiente de Allison

Número de WhatsApp definitivo, textos finales, ID de GTM (y accesos a GA4 y Meta), autorizaciones de testimonios, textos legales. Todo se carga desde el panel cuando llegue; nada bloquea la construcción.

## Qué queda al constructor

Diseño visual de las secciones nuevas siguiendo el estilo actual (#1E3A5F, tarjetas existentes), nombres de componentes, estructura de archivos, y la prueba mínima: una prueba de `buildWhatsAppUrl` y una comprobación manual de cada criterio de aceptación del brief.

## Anexo: datos del brief

**Titular del inicio:** "Sabe cuánto gana tu negocio, cada mes, sin multas ni sorpresas." **Línea de apoyo:** CPA con 11 años de experiencia en Nicaragua y EE. UU., contabilidad mensual, QuickBooks y cumplimiento fiscal con respuesta rápida por WhatsApp.

**Credenciales:** CPA (CCPN, Nicaragua), QuickBooks ProAdvisor, Máster en Finanzas, 11 años de experiencia.

**Precios** (los proyectos de QuickBooks, limpieza, manuales, consultoría y capacitación no publican precio: botón "Cotizar por WhatsApp"):

| Servicio | Texto a publicar |
|---|---|
| Plan Emprendedor | Desde US$199 al mes |
| Plan Pyme | Desde US$299 al mes |
| Plan Corporativo | Desde US$750 al mes, según el volumen de transacciones |
| LLC de servicios | Desde US$250 al mes |
| LLC de e-commerce | Desde US$250 al mes con menos de 25 payouts; desde US$350 con 25 o más |
| Finanzas personales | Plan "Ordena tu dinero" US$99; con app y plantillas en Excel US$149; seguimiento de 3 meses US$120 (precio por validar) |
| Certificación de ingresos de persona natural | US$50 |
| Certificación de estados financieros | Desde US$150 según régimen, períodos y objetivo |
| Certificación de inventarios | Cotizar por WhatsApp (precio por definir) |
| Chequeo de salud contable | US$99, que se acredita al primer mes del plan |
| Diagnóstico financiero de 30 minutos | Gratis |

**Mensajes de WhatsApp:**

| Página | Mensaje |
|---|---|
| Inicio y Planes | Hola Allison, vi su sitio y quiero el diagnóstico financiero gratis. Mi empresa es ____ y necesito ayuda con ____. |
| Contabilidad mensual | Hola, quiero ordenar la contabilidad mensual de mi empresa. |
| QuickBooks | Hola, quiero implementar o migrar a QuickBooks Online. |
| Cumplimiento fiscal | Hola, necesito ayuda con el cumplimiento fiscal de mi empresa. |
| LLC de EE. UU. (inglés) | Hi, I need monthly bookkeeping and tax support for my LLC. |
| Finanzas personales | Hola, quiero ordenar mis finanzas personales. |
| Certificaciones | Hola, necesito una certificación de ____ (ingresos, estados financieros o inventarios). |
| Capacitación | Hola, quiero capacitación en QuickBooks para mi equipo. |

**Criterios de aceptación:** cada página carga bien en Chrome, Safari, Android e iOS; el botón de WhatsApp abre el chat con el mensaje correcto de cada página; los eventos aparecen en Analytics y sirven en Google Ads y Meta; título, descripción y H1 únicos por página; precios iguales a la tabla; el formulario llega al correo y se guarda; banner de cookies y política de privacidad activos; Fase 1 en línea antes de activar anuncios.
