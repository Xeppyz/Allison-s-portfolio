-- Fase 2: ajustes tras la revisión de la rama.

-- Planes: textos en inglés para las páginas /en/…
alter table public.plans
  add column name_en text,
  add column price_text_en text,
  add column description_en text;

update public.plans set
  name_en = 'Services LLC',
  price_text_en = 'From US$250 per month',
  description_en = 'Monthly bookkeeping for service LLCs.'
where slug = 'llc-servicios';

update public.plans set
  name_en = 'E-commerce LLC',
  price_text_en = 'From US$250 per month with fewer than 25 payouts; from US$350 with 25 or more',
  description_en = 'Monthly bookkeeping for e-commerce LLCs.'
where slug = 'llc-ecommerce';

-- FAQ: con la clave anónima solo se leen las de páginas públicas (o generales),
-- no las de páginas en borrador.
drop policy "anon lee faqs" on public.faqs;
create policy "anon lee faqs" on public.faqs
  for select to anon using (
    page_slug is null
    or exists (select 1 from public.pages p where p.slug = faqs.page_slug and p.active)
  );
