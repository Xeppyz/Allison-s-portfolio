-- 0001_schema.sql
-- Esquema del CMS. Ejecutar una vez en un proyecto vacio (SQL Editor de Supabase).

-- ---------------------------------------------------------------- tablas

create table public.site_settings (
  id int primary key check (id = 1),
  whatsapp_number text default '',
  phone text,
  email text,
  hours text,
  address text,
  gbp_url text,
  gtm_id text default '',
  credentials jsonb default '[]'::jsonb
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  lang text default 'es',
  kind text check (kind in ('home', 'service', 'legal')),
  meta_title text,
  meta_description text,
  h1 text,
  subheadline text,
  benefits jsonb default '[]'::jsonb,
  bonus_text text,
  bonus_deadline date,
  guarantee text,
  wa_message text,
  body text
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  sort int default 0,
  active boolean default true,
  title text,
  description text,
  details jsonb default '[]'::jsonb,
  link text
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  sort int default 0,
  active boolean default true,
  slug text unique,
  name text,
  price_text text,
  description text,
  features jsonb default '[]'::jsonb,
  "group" text check ("group" in ('empresa', 'llc', 'personal', 'certificacion', 'addon')),
  cta text check (cta in ('planes', 'whatsapp')),
  page_slugs text[] default '{}'
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  sort int default 0,
  active boolean default true,
  name text,
  position text,
  company text,
  quote text,
  problem text,
  benefit text,
  satisfaction text,
  photo_url text,
  logo_url text,
  authorized boolean default false
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  sort int default 0,
  active boolean default true,
  page_slug text,
  question text,
  answer text
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  sort int default 0,
  active boolean default true,
  name text,
  contact text,
  company text,
  country text,
  service text,
  message text,
  page text,
  utm jsonb,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------- RLS

alter table public.site_settings enable row level security;
alter table public.pages         enable row level security;
alter table public.services      enable row level security;
alter table public.plans         enable row level security;
alter table public.testimonials  enable row level security;
alter table public.faqs          enable row level security;
alter table public.leads         enable row level security;

-- Lectura publica (anon) del contenido
create policy "anon lee site_settings" on public.site_settings
  for select to anon using (true);
create policy "anon lee pages" on public.pages
  for select to anon using (true);
create policy "anon lee services" on public.services
  for select to anon using (true);
create policy "anon lee plans" on public.plans
  for select to anon using (true);
create policy "anon lee faqs" on public.faqs
  for select to anon using (true);

-- Testimonios: solo los autorizados y activos
create policy "anon lee testimonials autorizados" on public.testimonials
  for select to anon using (authorized and active);

-- Escritura y lectura total para quien inicia sesion
create policy "auth gestiona site_settings" on public.site_settings
  for all to authenticated using (true) with check (true);
create policy "auth gestiona pages" on public.pages
  for all to authenticated using (true) with check (true);
create policy "auth gestiona services" on public.services
  for all to authenticated using (true) with check (true);
create policy "auth gestiona plans" on public.plans
  for all to authenticated using (true) with check (true);
create policy "auth gestiona testimonials" on public.testimonials
  for all to authenticated using (true) with check (true);
create policy "auth gestiona faqs" on public.faqs
  for all to authenticated using (true) with check (true);

-- Leads: sin acceso anon. Inserta la Edge Function con la clave de servicio.
create policy "auth lee leads" on public.leads
  for select to authenticated using (true);
create policy "auth borra leads" on public.leads
  for delete to authenticated using (true);

-- --------------------------------------------------------------- storage

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict do nothing;

create policy "auth lee media" on storage.objects
  for select to authenticated using (bucket_id = 'media');
create policy "auth sube a media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "auth actualiza media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');
create policy "auth borra de media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
