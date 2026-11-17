-- 0009_pages_keyword.sql — palabra clave principal por página (puntaje SEO del panel).
alter table public.pages add column if not exists focus_keyword text;

update public.pages set focus_keyword = v.kw from (values
  ('inicio', 'contabilidad'),
  ('contabilidad-mensual', 'contabilidad mensual'),
  ('planes', 'planes'),
  ('quickbooks', 'QuickBooks'),
  ('cumplimiento-fiscal', 'cumplimiento fiscal'),
  ('llc-usa', 'LLC'),
  ('llc-bookkeeping', 'bookkeeping'),
  ('finanzas-personales', 'finanzas personales'),
  ('certificaciones', 'certificaciones'),
  ('capacitacion', 'capacitación')
) as v(slug, kw) where pages.slug = v.slug and pages.focus_keyword is null;
