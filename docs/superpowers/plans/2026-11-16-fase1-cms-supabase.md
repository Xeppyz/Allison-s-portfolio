# Fase 1 allisonsilvacorp.com (CMS propio en Supabase) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el sitio de una página en un sitio multipágina cuyo contenido se edita desde un panel `/admin` propio sobre Supabase, con WhatsApp por página, formulario único, tracking y SEO por ruta.

**Architecture:** SPA React existente. El contenido vive en Postgres (Supabase) y se lee en el navegador con `supabase-js` y la clave anónima, protegido por RLS. Una plantilla de página de servicio pinta cualquier fila de `pages`. El formulario pasa por una Edge Function que guarda el lead y manda el correo. `/admin` es una ruta de carga diferida con Supabase Auth.

**Tech Stack:** React 19, Vite 7, Tailwind 4, react-router-dom 7, `@supabase/supabase-js` (única dependencia nueva), Supabase Edge Functions (Deno), `node --test` (Node 22.18 ejecuta `.ts` sin dependencias).

**Spec:** `docs/superpowers/specs/2026-11-16-fase1-cms-supabase-design.md` (incluye el anexo con precios, mensajes y criterios del brief).

## Global Constraints

- Proyecto Supabase: ref `ciedacwthmjeyhsmltls`. Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Precios y mensajes de WhatsApp: copiados literalmente del anexo del spec. Ningún precio escrito en componentes.
- `site_settings.whatsapp_number` arranca vacío; sin número no se pinta ningún botón de WhatsApp.
- Los seis testimonios actuales se siembran con `authorized = false`.
- GTM solo carga tras aceptar cookies.
- Todo el sitio en español; se elimina `language-context.tsx` y el contenido en inglés.
- Color de marca `#1E3A5F`, acento `#4285F4`; reutilizar `src/components/ui/*`.
- Un solo `<h1>` por página. Diseño móvil primero.
- Sin dependencias nuevas aparte de `@supabase/supabase-js`.
- Commits solo si Allan los autoriza al ejecutar; si no, se omite el paso de commit.

## Review Focus

1. Supabase lento o caído: la página muestra el esqueleto y luego un aviso con correo y teléfono fijos; nunca queda en blanco (Tarea 2).
2. UTM con espacios, acentos, símbolos o sin `utm_campaign`: el código sale limpio (`[G-QB]`) o no sale; nunca rompe el enlace (Tarea 3, prueba).
3. `bonus_deadline` vencido o vacío: el bloque de bono no se muestra (Tarea 5, prueba).
4. Slug inexistente (`/lo-que-sea`): página 404 con enlace al inicio, no plantilla vacía (Tarea 5).
5. El correo falla en la Edge Function: el lead queda guardado y el visitante ve la confirmación (Tarea 7).

## Estructura de archivos

```
supabase/migrations/0001_schema.sql      tablas, RLS, bucket
supabase/migrations/0002_seed.sql        contenido inicial
supabase/functions/lead/index.ts         guarda lead + correo
src/lib/supabase.ts                      cliente
src/lib/content.ts                       tipos + hooks de lectura
src/lib/whatsapp.ts (+ .test.ts)         enlace wa.me y código de campaña
src/lib/utm.ts                           captura y lectura de UTM
src/lib/track.ts                         dataLayer + consentimiento
src/lib/bonus.ts (+ .test.ts)            vigencia del bono
src/components/SiteLayout.tsx            nav + pie + botón flotante + banner
src/components/WhatsAppButton.tsx        flotante y variante en línea
src/components/CookieBanner.tsx
src/components/Seo.tsx                   title, description, JSON-LD
src/components/LeadForm.tsx
src/components/PlanCards.tsx, FaqList.tsx
src/pages/Home.tsx, ServicePage.tsx, LegalPage.tsx, ContactPage.tsx, NotFound.tsx
src/admin/Admin.tsx, Login.tsx, Crud.tsx, fields.ts, Leads.tsx
```

Se eliminan: `src/components/language-context.tsx`, `cotizacionModal.tsx`, `modalPaquetes.tsx`, `contact.tsx`, `src/App.tsx`, `server/`.

---

### Task 1: Esquema y datos iniciales en Supabase

**Files:**
- Create: `supabase/migrations/0001_schema.sql`, `supabase/migrations/0002_seed.sql`

**Interfaces:**
- Produces: tablas `site_settings`, `pages`, `services`, `plans`, `testimonials`, `faqs`, `leads`; bucket `media`.

- [ ] **Step 1: Escribir `0001_schema.sql`**

Columnas (todas las tablas: `id uuid pk default gen_random_uuid()`; las de contenido salvo `site_settings` y `pages`: `sort int default 0`, `active bool default true`):

| Tabla | Columnas |
|---|---|
| `site_settings` | `id int pk check (id = 1)`, `whatsapp_number text default ''`, `phone text`, `email text`, `hours text`, `address text`, `gbp_url text`, `gtm_id text default ''`, `credentials jsonb default '[]'` |
| `pages` | `slug text unique not null`, `lang text default 'es'`, `kind text check (kind in ('home','service','legal'))`, `meta_title text`, `meta_description text`, `h1 text`, `subheadline text`, `benefits jsonb default '[]'` (`[{title, text}]`), `bonus_text text`, `bonus_deadline date`, `guarantee text`, `wa_message text`, `body text` |
| `services` | `title text`, `description text`, `details jsonb default '[]'`, `link text` |
| `plans` | `slug text unique`, `name text`, `price_text text`, `description text`, `features jsonb default '[]'`, `"group" text check in ('empresa','llc','personal','certificacion','addon')`, `cta text check in ('planes','whatsapp')`, `page_slugs text[] default '{}'` |
| `testimonials` | `name`, `position`, `company`, `quote`, `problem`, `benefit`, `satisfaction`, `photo_url`, `logo_url` (text), `authorized bool default false` |
| `faqs` | `page_slug text`, `question text`, `answer text` |
| `leads` | `name`, `contact`, `company`, `country`, `service`, `message`, `page` (text), `utm jsonb`, `created_at timestamptz default now()` |

RLS activado en las siete. Políticas: `select` para `anon` en `site_settings`, `pages`, `services`, `plans`, `faqs`; en `testimonials` `select` para `anon` solo `using (authorized and active)`; `all` para `authenticated` en las seis de contenido; en `leads` solo `select` y `delete` para `authenticated` (insertar lo hace la función con la clave de servicio). Bucket `media` público; políticas de `storage.objects` para `insert/update/delete` a `authenticated` con `bucket_id = 'media'`.

- [ ] **Step 2: Escribir `0002_seed.sql`**

- `site_settings`: una fila `id = 1`, `email = 'info@allisonsilvacorp.com'`, `phone = '+505 8767-3463'`, `whatsapp_number = ''`, `credentials` = las cuatro del anexo.
- `pages`: `inicio` (kind home; h1 y subheadline del anexo; `wa_message` de "Inicio y Planes"), `planes` (kind service; mismo `wa_message`), `contabilidad-mensual` (kind service; `wa_message` del anexo; tres beneficios provisionales tomados de `services.1.details` actual), `privacidad` y `terminos` (kind legal; `body` provisional marcado "Texto pendiente de Allison").
- `services`: los cinco actuales en español desde `language-context.tsx` (`services.1`–`services.5`) más Certificaciones, Capacitación y Finanzas personales.
- `plans`: las once filas de la tabla de precios del anexo, `price_text` literal. Emprendedor, Pyme y Corporativo: `group = 'empresa'`, `cta = 'planes'`, `page_slugs = '{inicio,planes,contabilidad-mensual}'`. El resto solo en `planes`. Certificación de inventarios: `cta = 'whatsapp'`.
- `testimonials`: los seis de `testimonials.tsx` en español, `authorized = false`.
- `faqs`: tres preguntas provisionales para `inicio`.

- [ ] **Step 3: Aplicar en el proyecto `ciedacwthmjeyhsmltls`** (MCP de Supabase si hay acceso; si no, pegar ambos archivos en el SQL Editor).

- [ ] **Step 4: Verificar**

```sql
select count(*) from plans;                                  -- 11
select price_text from plans where slug = 'plan-emprendedor'; -- Desde US$199 al mes
select count(*) from testimonials where authorized;           -- 0
```
Y con la clave anónima: `GET /rest/v1/leads` devuelve `[]`; `POST /rest/v1/plans` devuelve 401/403.

- [ ] **Step 5: Commit** `feat(db): esquema y datos iniciales`

---

### Task 2: Cliente y lectura de contenido

**Files:**
- Create: `src/lib/supabase.ts`, `src/lib/content.ts`, `.env.example`
- Modify: `package.json` (`pnpm add @supabase/supabase-js`; script `"test": "node --test src/lib/"`), `.gitignore` (añadir `.env`)

**Interfaces:**
- Produces:
  - `supabase` (cliente).
  - Tipos `Settings`, `Page`, `Service`, `Plan`, `Testimonial`, `Faq`, `Lead` con las columnas de la Tarea 1.
  - `useSettings(): { data: Settings | null, loading: boolean, error: boolean }`
  - `usePage(slug: string)`: mismo formato con `Page | null`
  - `usePlans(pageSlug: string)`, `useFaqs(pageSlug: string)`, `useServices()`, `useTestimonials()`: mismo formato con arreglos, ordenados por `sort`, solo `active`.

- [ ] **Step 1:** Implementar. Un único `useQuery<T>(key, fn)` interno con caché en memoria por clave (un `Map`), para que `useSettings` no repita la petición en cada componente.
- [ ] **Step 2:** `error = true` si la petición falla o tarda más de 8 s.
- [ ] **Step 3: Verificar** `pnpm build` sin errores de tipos.
- [ ] **Step 4: Commit** `feat: capa de contenido Supabase`

---

### Task 3: WhatsApp, UTM y eventos

**Files:**
- Create: `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`, `src/lib/utm.ts`, `src/lib/track.ts`, `src/components/WhatsAppButton.tsx`

**Interfaces:**
- Produces:
  - `type Utm = Record<string, string>`
  - `campaignCode(utm: Utm): string` → `''` o `'[G-QB]'`
  - `buildWhatsAppUrl(number: string, message: string, utm: Utm): string | null` (`null` si no hay número)
  - `captureUtm(): void` (lee `utm_*` de `location.search`, guarda en `sessionStorage['utm']` solo si aún no existe), `getUtm(): Utm`
  - `track(event: 'whatsapp_click' | 'form_submit' | 'ver_planes_click' | 'phone_click', params?: Record<string, string>): void` → `window.dataLayer.push`
  - `<WhatsAppButton floating? label? message? />`: usa `useSettings`, `usePage` de la ruta actual si no recibe `message`, devuelve `null` sin número; al hacer clic llama `track('whatsapp_click', { page: location.pathname })`.

- [ ] **Step 1: Prueba que falla**

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { campaignCode, buildWhatsAppUrl } from './whatsapp.ts'

test('código de campaña', () => {
  assert.equal(campaignCode({ utm_source: 'google', utm_campaign: 'qb' }), '[G-QB]')
  assert.equal(campaignCode({ utm_source: 'meta', utm_campaign: 'Conta Mensual!' }), '[M-CONTAMENSUAL]')
  assert.equal(campaignCode({ utm_source: 'google' }), '')
  assert.equal(campaignCode({}), '')
})

test('enlace de WhatsApp', () => {
  assert.equal(buildWhatsAppUrl('', 'Hola', {}), null)
  assert.equal(
    buildWhatsAppUrl('+505 8767-3463', 'Hola, quiero más', { utm_source: 'google', utm_campaign: 'qb' }),
    'https://wa.me/50587673463?text=' + encodeURIComponent('Hola, quiero más [G-QB]'),
  )
  assert.equal(buildWhatsAppUrl('50587673463', 'Hola', {}), 'https://wa.me/50587673463?text=Hola')
})
```

- [ ] **Step 2:** `pnpm test` → FALLA (módulo inexistente).
- [ ] **Step 3:** Implementar. El código conserva solo `A-Z0-9` tras pasar a mayúsculas; el número conserva solo dígitos.
- [ ] **Step 4:** `pnpm test` → PASA.
- [ ] **Step 5:** `WhatsAppButton`: flotante abajo a la derecha, verde `#25D366`, `aria-label="Escribir por WhatsApp"`, 56 px, sin tapar el banner de cookies.
- [ ] **Step 6: Commit** `feat: WhatsApp por página con código de campaña`

---

### Task 4: Layout común y retiro del inglés

**Files:**
- Create: `src/components/SiteLayout.tsx`
- Modify: `src/components/navegation.tsx`, `footer.tsx`, `about.tsx`, `benefits.tsx`, `blog.tsx`, `BlogPostContent.tsx`, `hero.tsx`, `services.tsx`, `testimonials.tsx`, `src/data/BlogPost.tsx`, `src/pages/BlogPost.tsx`, `src/pages/BlogPageIndex.tsx`
- Delete: `src/components/language-context.tsx`

**Interfaces:**
- Consumes: `useSettings`, `WhatsAppButton`, `captureUtm`, `track`.
- Produces: `<SiteLayout>` (ruta padre con `<Outlet />`): `Navigation`, contenido, `Footer`, `WhatsAppButton floating`, `CookieBanner` (Tarea 8), `Analytics`, `SpeedInsights`; llama `captureUtm()` al montar.

- [ ] **Step 1:** Sustituir cada `t("…")` y cada `language === "es" ? a : b` por el texto en español. Los textos de servicios y testimonios ya no salen de aquí (Tareas 5 y 6): en esos componentes solo quitar la dependencia del contexto.
- [ ] **Step 2:** `Navigation`: enlaces `Link` a `/`, `/planes`, `/contabilidad-mensual`, `/blog`, `/contacto`; quitar el botón de idioma; botón "Ver planes" con `track('ver_planes_click')`.
- [ ] **Step 3:** `Footer`: `new Date().getFullYear()`; teléfono, correo, horario y dirección desde `useSettings`; el `tel:` llama `track('phone_click')`; enlaces a `/privacidad` y `/terminos`; enlace a `gbp_url` si existe.
- [ ] **Step 4: Verificar** `grep -r "language-context\|useLanguage" src` no devuelve nada; `pnpm build` pasa.
- [ ] **Step 5: Commit** `refactor: sitio en español y layout común`

---

### Task 5: Plantilla de servicio, rutas y SEO

**Files:**
- Create: `src/lib/bonus.ts`, `src/lib/bonus.test.ts`, `src/components/Seo.tsx`, `PlanCards.tsx`, `FaqList.tsx`, `src/pages/ServicePage.tsx`, `LegalPage.tsx`, `NotFound.tsx`
- Modify: `src/main.tsx`, `index.html`, `public/sitemap.xml`

**Interfaces:**
- Consumes: hooks de la Tarea 2, `WhatsAppButton`.
- Produces:
  - `isBonusActive(deadline: string | null, today?: Date): boolean`
  - `<Seo title description jsonLd? />` (pinta `<title>`, `<meta name="description">`, `<link rel="canonical">` y `<script type="application/ld+json">`; React 19 los sube al `<head>`)
  - `<PlanCards pageSlug />`, `<FaqList pageSlug />` (este añade JSON-LD `FAQPage`)
  - `<ServicePage slug? />` (sin prop usa `useParams().slug`)

- [ ] **Step 1: Prueba que falla**

```ts
test('vigencia del bono', () => {
  const hoy = new Date('2026-11-16T12:00:00')
  assert.equal(isBonusActive('2026-11-16', hoy), true)   // el último día cuenta
  assert.equal(isBonusActive('2026-11-15', hoy), false)
  assert.equal(isBonusActive(null, hoy), false)
  assert.equal(isBonusActive('', hoy), false)
})
```

- [ ] **Step 2:** `pnpm test` FALLA → implementar → PASA.
- [ ] **Step 3:** `ServicePage`, en este orden: `h1` + `subheadline` + botones ("Diagnóstico gratis por WhatsApp", "Ver planes"); tres `benefits`; un testimonio (el primero autorizado; se omite si no hay); `PlanCards`; bono (`bonus_text` + fecha, solo si `isBonusActive`); `guarantee` (se omite vacío); `FaqList`. Estados: `loading` → esqueleto; `error` → aviso con `info@allisonsilvacorp.com`; `data === null` → `NotFound`.
- [ ] **Step 4:** `PlanCards`: nombre, `price_text`, descripción, `features`; botón según `cta` (`planes` → `Link` a `/planes` con `track('ver_planes_click')`; `whatsapp` → `WhatsAppButton label="Cotizar por WhatsApp"`). En la página `planes`, agrupar por `group` con subtítulos.
- [ ] **Step 5:** `LegalPage`: `h1` y `body` (párrafos por línea en blanco; línea que empieza con `## ` → `<h2>`).
- [ ] **Step 6:** Rutas en `main.tsx` bajo `SiteLayout`: `/` → `Home` (Tarea 6), `/planes` → `ServicePage slug="planes"`, `/privacidad` y `/terminos` → `LegalPage`, `/contacto` → `ContactPage` (Tarea 7), `/blog`, `/blog/:slug`, `/admin/*` (lazy, fuera del layout, Tarea 9), `/:slug` → `ServicePage`, `*` → `NotFound`. Quitar la ruta `/about`.
- [ ] **Step 7:** `index.html`: quitar los `hreflang`, el `canonical` fijo y el JSON-LD (pasan a `Seo`); corregir `foundingDate` al mover el JSON-LD `AccountingService` a `Home`. `sitemap.xml`: `/`, `/planes`, `/contabilidad-mensual`, `/blog`, `/contacto`, `/privacidad`, `/terminos`; sin anclas `#`.
- [ ] **Step 8: Verificar** en `pnpm dev`: `/planes` muestra los once precios del anexo; `/contabilidad-mensual` tiene título de pestaña distinto al de `/planes`; `/no-existe` muestra 404; `document.querySelectorAll('h1').length === 1` en cada una.
- [ ] **Step 9: Commit** `feat: páginas de servicio, planes y SEO por ruta`

---

### Task 6: Inicio nuevo

**Files:**
- Create: `src/pages/Home.tsx`
- Modify: `src/components/hero.tsx`, `services.tsx`, `testimonials.tsx`
- Delete: `src/App.tsx`

**Interfaces:**
- Consumes: `usePage('inicio')`, `useServices`, `useTestimonials`, `useSettings`, `PlanCards`, `FaqList`, `WhatsAppButton`, `Seo`.

- [ ] **Step 1:** `Home`, en orden: `Hero` (h1 y subheadline de `pages`; botones "Diagnóstico gratis por WhatsApp" y "Ver planes"); tres tarjetas de entrada fijas ("Tengo una empresa en Nicaragua" → `/contabilidad-mensual`; "Tengo una LLC en EE. UU." y "Quiero ordenar mis finanzas personales" → `/contacto` hasta la Fase 2); `Services` desde `useServices` (el botón de cada tarjeta va a `link` si existe); `PlanCards pageSlug="inicio"` con botón a `/planes`; credenciales desde `settings.credentials`; `Testimonials` desde `useTestimonials` (la sección entera se omite si no hay ninguno); `Benefits`; `Blog`; `FaqList pageSlug="inicio"`; bloque final con `WhatsAppButton`.
- [ ] **Step 2:** `Seo` con JSON-LD `AccountingService` (nombre, url, logo, correo, `areaServed: ["NI","US"]`).
- [ ] **Step 3:** Quitar de `services.tsx` la sexta tarjeta "Plan emprendedor" y de `hero.tsx` los botones "Cotiza con nosotros" y "Escoger plan".
- [ ] **Step 4: Verificar** en `pnpm dev`: titular del anexo visible; con `whatsapp_number` vacío no hay ningún botón de WhatsApp y "Ver planes" sí funciona; sin testimonios autorizados no aparece la sección.
- [ ] **Step 5: Commit** `feat: inicio según brief`

---

### Task 7: Formulario y Edge Function

**Files:**
- Create: `supabase/functions/lead/index.ts`, `src/components/LeadForm.tsx`, `src/pages/ContactPage.tsx`
- Delete: `src/components/contact.tsx`, `cotizacionModal.tsx`, `modalPaquetes.tsx`, `responsiveDialog.tsx` (si queda sin uso), `server/`

**Interfaces:**
- Consumes: `supabase.functions.invoke('lead', { body })`, `getUtm`, `track`.
- Produces: `POST /functions/v1/lead` con `{ name, contact, company, country, service, message, page, utm, website, elapsedMs }` → `{ ok: true }` o `400 { error }`.

- [ ] **Step 1:** Función `lead`: CORS para `https://allisonsilvacorp.com`, `https://www.allisonsilvacorp.com` y `http://localhost:5173`. Requeridos: `name`, `contact`, `message` (recortados; máximo 200, 200 y 2000 caracteres) → si faltan, 400. Si `website` (campo trampa) trae algo o `elapsedMs < 3000` → responder `{ ok: true }` sin guardar. Insertar en `leads` con la clave de servicio. Después, `try` de envío al API `https://wservices.casavision.com/ApiWebHub/api/Email/send` con el mismo formato `{ to, subject, htmlBody, from }` que usa hoy `contact.tsx` (copiar `to`/`from` de ahí), escapando HTML en todos los valores; un fallo del correo se registra con `console.error` y no cambia la respuesta.
- [ ] **Step 2:** Desplegar la función (`verify_jwt` activado; la clave anónima basta).
- [ ] **Step 3:** `LeadForm`: campos nombre, WhatsApp o correo, empresa, país (`<select>`: Nicaragua, Estados Unidos, Otro), servicio (`<select>` con los títulos de `useServices`), mensaje; `<input name="website">` oculto con `tabIndex={-1}` y `autoComplete="off"`; mide `elapsedMs` desde el montaje. Al éxito: mensaje "Recibimos tu mensaje. Te respondemos en menos de un día hábil." y `track('form_submit')`. Al error: mensaje con el correo de contacto; el texto escrito no se borra.
- [ ] **Step 4:** `ContactPage`: `h1` "Contacto", `LeadForm`, datos de `useSettings`, `WhatsAppButton`, enlace a `gbp_url`.
- [ ] **Step 5: Verificar** con `curl`:
  - cuerpo válido con `elapsedMs: 5000` → `{ok:true}` y fila nueva en `leads`;
  - sin `contact` → 400;
  - con `website: "x"` → `{ok:true}` y ninguna fila nueva;
  - `to` inválido forzado (prueba temporal) → `{ok:true}` y la fila existe.
- [ ] **Step 6: Commit** `feat: formulario único con guardado de leads`

---

### Task 8: Banner de cookies y GTM

**Files:**
- Create: `src/components/CookieBanner.tsx`
- Modify: `src/lib/track.ts`

**Interfaces:**
- Produces: `getConsent(): 'granted' | 'denied' | null`, `setConsent(v)`, `loadGtm(id: string): void` (idempotente), en `track.ts`.

- [ ] **Step 1:** `CookieBanner`: texto "Usamos cookies de analítica y publicidad para medir nuestras campañas." con enlace a `/privacidad`; botones "Aceptar" y "Rechazar" del mismo tamaño. Guarda en `localStorage['consent']`. No se muestra si ya hay elección.
- [ ] **Step 2:** `SiteLayout`: cuando `getConsent() === 'granted'` y `settings.gtm_id` no está vacío → `loadGtm`. `track` siempre empuja a `dataLayer` (GTM los lee al cargar).
- [ ] **Step 3: Verificar** con un `gtm_id` de prueba: antes de aceptar no hay petición a `googletagmanager.com` en la pestaña de red; tras aceptar sí; tras rechazar y recargar, no.
- [ ] **Step 4: Commit** `feat: consentimiento de cookies y GTM`

---

### Task 9: Panel `/admin`

**Files:**
- Create: `src/admin/Admin.tsx`, `Login.tsx`, `Crud.tsx`, `fields.ts`, `Leads.tsx`

**Interfaces:**
- Consumes: `supabase` (auth, from, storage), tipos de `content.ts`.
- Produces:
  - `type Field = { name: string; label: string; kind: 'text' | 'textarea' | 'bool' | 'date' | 'select' | 'list' | 'pairs' | 'tags' | 'image'; options?: string[]; help?: string }`
  - `tables: Record<string, { label: string; titleField: string; fields: Field[]; single?: boolean }>` para `site_settings` (`single`), `pages`, `services`, `plans`, `testimonials`, `faqs`.
  - `<Crud table={key} />`

- [ ] **Step 1:** `Login`: correo y contraseña con `signInWithPassword`; error "Correo o contraseña incorrectos". `Admin` escucha `onAuthStateChange`; sin sesión muestra `Login`; con sesión, menú de secciones + "Cerrar sesión". `<meta name="robots" content="noindex">`.
- [ ] **Step 2:** `Crud`: lista ordenada por `sort` mostrando `titleField` y estado activo; crear, editar, borrar (con `confirm("¿Borrar …? No se puede deshacer.")`), subir/bajar orden. Formulario generado desde `fields`: `list` = arreglo de textos (features, details, credentials); `pairs` = arreglo de `{title, text}` (benefits); `tags` = `text[]` (page_slugs); `image` = subida al bucket `media` y guarda la URL pública (aceptar solo imágenes, máximo 2 MB). Mensaje "Guardado" o el error de Supabase tal cual.
- [ ] **Step 3:** Ayudas en `fields.ts`: en `price_text` "Tal como se verá, por ejemplo: Desde US$199 al mes"; en `whatsapp_number` "Con código de país. Si se deja vacío, el sitio no muestra botones de WhatsApp"; en `authorized` "Marcar solo con permiso escrito del cliente".
- [ ] **Step 4:** `Leads`: tabla de solo lectura, más recientes primero, con fecha, nombre, contacto, servicio, página, código de campaña (`campaignCode(utm)`) y mensaje; botón borrar.
- [ ] **Step 5:** Crear el usuario de prueba desde el panel de Supabase (lo hace Allan) y desactivar el registro público en Auth.
- [ ] **Step 6: Verificar** en `pnpm dev`: sin sesión `/admin` solo muestra el login; cambiar `price_text` de un plan y recargar `/planes` muestra el cambio; poner un número en `whatsapp_number` hace aparecer el botón flotante; marcar un testimonio como autorizado lo muestra en el inicio; `pnpm build` confirma que `admin` sale en un chunk aparte.
- [ ] **Step 7: Commit** `feat: panel de administración`

---

### Task 10: Aceptación

- [ ] **Step 1:** `pnpm test`, `pnpm lint`, `pnpm build` en verde.
- [ ] **Step 2:** Recorrer los criterios del anexo en el navegador a 375 px y en escritorio: precios contra la tabla uno por uno; mensaje de WhatsApp de `/`, `/planes` y `/contabilidad-mensual` con `?utm_source=google&utm_campaign=qb` termina en `[G-QB]`; los cuatro eventos aparecen en `window.dataLayer`; título, descripción y H1 distintos en cada ruta; formulario guarda y llega el correo; banner activo.
- [ ] **Step 3:** Lighthouse móvil en `/contabilidad-mensual` del build de producción; anotar LCP. Si pasa de 3 s, convertir las imágenes de `src/assets/img` a WebP.
- [ ] **Step 4:** Entregar a Allan la lista de lo que queda fuera de su alcance aquí: variables en Vercel, ID de GTM y etiquetas de GA4/Pixel dentro de GTM, Search Console, número de WhatsApp, pruebas en Safari/iOS reales.
