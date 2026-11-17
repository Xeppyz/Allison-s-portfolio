-- 0004_fase2_pages.sql
-- Fase 2: borradores, SEO por pagina, version en otro idioma y aviso legal.

alter table public.pages
  add column active boolean not null default true,
  add column noindex boolean not null default false,
  add column og_image_url text,
  add column alt_slug text,
  add column legal_note text;

comment on column public.pages.active is 'false = borrador: solo lo ven los administradores';
comment on column public.pages.alt_slug is 'slug de la misma pagina en el otro idioma (para hreflang)';

-- Los visitantes solo leen paginas activas
drop policy "anon lee pages" on public.pages;
create policy "anon lee pages" on public.pages
  for select to anon using (active);
