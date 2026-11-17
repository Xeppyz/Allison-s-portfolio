# Fase 3 Implementation Plan

> Ejecución nativa (superpowers:executing-plans), revisión final de toda la rama.

**Goal:** blog en Supabase con SEO de servidor completo, editor tipo Word, puntaje SEO en vivo y panel rediseñado.
**Spec:** `docs/superpowers/specs/2026-11-17-fase3-blog-admin-design.md`
**Tech:** React 19, Vite 7, Tailwind 4, Supabase, Vercel edge, TipTap 3, `node:test`.

## Global Constraints

- Mismas URL de los 3 artículos: `pasos-para-inscribirse-ante-la-dgi-de-nicaragua`, `ventajas-de-automatizar-e-integrar-quickbooks`, `como-prepararse-para-las-declaraciones-anuales-ca-y-eeuu`.
- TipTap solo en el chunk de `/admin`; el bundle público no crece.
- Funciones puras de `src/lib` sin `import.meta` (las importa la función edge y `node --test`).
- `pnpm build:api` regenera `api/*.js` (se comitean).
- Estética: tokens `navy`, `ivory`, `taupe`, `taupe-deep`, `font-serif`; sin sombras duras; botones `rounded-full`.

## Review Focus

1. Artículo inexistente o en borrador → 404 en servidor, "no encontrado" en cliente.
2. HTML con `<script>` u `onerror=` guardado en la base → no llega a la página (servidor y cliente).
3. Supabase caído → `/blog/<slug>` no se cae (shell sin identidad, `no-store`).
4. Imagen grande (8 MB JPG) → se convierte a WebP ≤ 1600 px y se sube.
5. Salir del editor con cambios sin guardar → aviso.

---

### Task 1: tabla `posts` + datos
- Create `supabase/migrations/0008_posts.sql`: tabla, trigger `updated_at`, RLS (`anon lee posts publicados` using `published`; `auth gestiona posts` con `is_admin()`), seed de los 3 artículos (contenido actual, `cover_url` `/blog/<archivo>`, `focus_keyword`).
- Copiar las 3 imágenes a `public/blog/`.
- Aplicar con MCP; comprobar con `select`.

### Task 2: `cleanHtml` + `seo-score` (puros, con pruebas)
- `src/lib/html.ts`: `cleanHtml(html)`, `htmlToText(html)`, `estimateReadingMinutes(html)`.
- `src/lib/seo-score.ts`: `scoreSeo({ kind:'post'|'page', title, description, slug, keyword, html }) → { score, checks: {id,label,status:'good'|'warn'|'bad',hint}[] }`.
- Tests: `html.test.ts` (quita script/on*/javascript:, conserva h2/a/img), `seo-score.test.ts` (artículo bueno ≥ 80; título 90 chars → bad; sin palabra clave → checks de palabra clave en bad; página no exige 600 palabras).

### Task 3: blog público y servidor desde Supabase
- `content.ts`: `Post` type, `usePosts()` (columnas ligeras, publicados, `published_at desc`), `usePost(slug)`.
- `blog.tsx`, `pages/BlogPost.tsx`, `BlogPostContent.tsx` usan los hooks (portada `cover_url`, `cleanHtml`, Seo con imagen y `type article`). Borrar `src/data/BlogPost.tsx`.
- `seo-head.ts`: `PostMeta` gana `seo_title`, `cover_url`, `cover_alt`, `updated_at`, `tags`; `BlogPosting` con `image`, `dateModified`, `keywords`; nueva `renderBody(html, inner)` que llena `#root`.
- `server/render.ts`: lee el post (y para `/blog` la lista) con caché como las páginas; inyecta cuerpo. `server/sitemap.ts`: posts con `lastmod`.
- Tests en `seo-head.test.ts` para `renderBody` y la meta del post.

### Task 4: editor y formulario de artículos
- `pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image`.
- `src/lib/image.ts` → `toWebp(file, maxWidth=1600)` (canvas); `ImageInput` lo usa.
- `src/admin/RichEditor.tsx` (barra de herramientas, H2/H3, enlace, imagen subida con alt).
- `src/admin/Posts.tsx` (lista con portada, estado, puntaje) + `PostEditor.tsx` (columna principal: título, editor; lateral: publicación, portada, SEO con vista previa de Google y checklist).
- `src/admin/SeoPanel.tsx` reutilizado por páginas en `Crud`.

### Task 5: panel rediseñado
- `Admin.tsx`: layout con menú lateral / desplegable móvil, cabecera con usuario.
- `Dashboard.tsx`: contactos del mes vs. anterior, por origen, últimos 5; SEO medio y peores; borradores.
- Restyle de `Crud`, `FieldInput`, `Leads`, `Login`; barra de guardar fija; aviso `beforeunload` y al volver con cambios.

### Task 6: verificación y PR
- `pnpm test`, `pnpm lint`, `pnpm build`; probar en dev con el navegador (editor, guardar, publicar, ver en sitio); smoke del render con `smoke.mjs`.
- Revisión final de la rama (un revisor, modelo más capaz); corregir; PR.
