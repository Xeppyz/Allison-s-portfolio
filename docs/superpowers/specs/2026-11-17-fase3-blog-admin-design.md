# Fase 3: blog editable, SEO medible y panel rediseñado

Aprobado por Allan el 2026-11-17. Ejecución: nativa (sin subagentes), con una revisión final.

## Por qué

Allison tiene que publicar artículos sin programador, sin perder el SEO que ganó la Fase 2,
y ver de un vistazo si lo que escribe está bien optimizado y cuántos contactos llegan.
El panel actual funciona pero es plano: debe sentirse tan cuidado como la web.

## Objetivos

1. **Blog en Supabase** (tabla `posts`). Los 3 artículos actuales se migran con las mismas URL.
2. **SEO de servidor para el blog**: la función edge mete en el HTML inicial el título, la
   descripción, la portada (OG), JSON-LD `BlogPosting` (autor, imagen, `dateModified`) **y el
   texto completo del artículo** dentro de `#root`, para que cualquier buscador lo lea sin JS.
   `/blog` lleva la lista de enlaces. El sitemap añade `lastmod` desde la base.
3. **Editor tipo Word** (TipTap, cargado solo en `/admin`): H2, H3, negrita, cursiva, listas,
   cita, enlace, imagen con texto alternativo. Sin H1 (el título del artículo es el H1).
4. **Imágenes optimizadas al subir**: el panel convierte a WebP y reduce a 1600 px de ancho
   antes de subir (portadas, imágenes del artículo y demás campos de imagen).
5. **Panel SEO en vivo** (artículos y páginas): vista previa de Google y puntaje 0–100 con
   semáforo. Comprobaciones: largo del título (30–60) y de la descripción (120–160),
   palabra clave en título / descripción / dirección / primer párrafo / algún subtítulo,
   600+ palabras (artículos), subtítulos, imágenes con alt, enlaces internos, frases cortas.
6. **Panel rediseñado**: estética de la web (marfil, azul marino, Playfair), menú lateral
   (desplegable en móvil), pantalla **Resumen** con contactos del mes, contactos por origen
   (Google Ads / Meta / orgánico), puntaje SEO medio y lo que hay que mejorar; listados con
   estado y puntaje; barra de guardar fija, aviso al guardar y aviso de cambios sin guardar.

## No objetivos

Search Console / tráfico real (necesita acceso de Allison), artículos en inglés,
publicación programada, roles de usuario, historial de versiones.

## Decisiones

- `posts`: `slug` único, `title`, `seo_title`, `excerpt` (= descripción para Google),
  `focus_keyword`, `content_html`, `cover_url`, `cover_alt`, `tags text[]`, `published`,
  `published_at date`, `updated_at` (trigger). RLS: anon lee publicados; admins todo.
- Las imágenes actuales de los 3 artículos pasan a `public/blog/` (URL estable).
- El HTML del artículo se limpia (`cleanHtml`: fuera `script/style/iframe/object/embed`,
  atributos `on*` y URLs `javascript:`) tanto en servidor como en cliente.
- El puntaje SEO es una función pura (`src/lib/seo-score.ts`) con pruebas `node:test`.
- TipTap es la única dependencia nueva; vive en un chunk que solo carga el panel.
