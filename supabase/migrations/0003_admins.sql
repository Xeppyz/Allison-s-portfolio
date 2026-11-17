-- 0003_admins.sql
-- Solo los usuarios listados en public.admins tienen derechos de administracion.
-- Antes, cualquier usuario registrado (rol authenticated) pasaba las politicas.

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- RLS activo y SIN politicas: solo la clave de servicio / el panel de Supabase escriben aqui.
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------- politicas de tablas

drop policy "auth gestiona site_settings" on public.site_settings;
create policy "auth gestiona site_settings" on public.site_settings
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy "auth gestiona pages" on public.pages;
create policy "auth gestiona pages" on public.pages
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy "auth gestiona services" on public.services;
create policy "auth gestiona services" on public.services
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy "auth gestiona plans" on public.plans;
create policy "auth gestiona plans" on public.plans
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy "auth gestiona testimonials" on public.testimonials;
create policy "auth gestiona testimonials" on public.testimonials
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy "auth gestiona faqs" on public.faqs;
create policy "auth gestiona faqs" on public.faqs
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy "auth lee leads" on public.leads;
create policy "auth lee leads" on public.leads
  for select to authenticated using (public.is_admin());

drop policy "auth borra leads" on public.leads;
create policy "auth borra leads" on public.leads
  for delete to authenticated using (public.is_admin());

-- ------------------------------------------------------------------ storage

drop policy "auth lee media" on storage.objects;
create policy "auth lee media" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and public.is_admin());

drop policy "auth sube a media" on storage.objects;
create policy "auth sube a media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy "auth actualiza media" on storage.objects;
create policy "auth actualiza media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy "auth borra de media" on storage.objects;
create policy "auth borra de media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

update storage.buckets
set file_size_limit = 2097152,
    allowed_mime_types = array['image/png','image/jpeg','image/webp']
where id = 'media';

-- Dar acceso a Allison (ejecutar a mano tras crear su usuario):
-- insert into public.admins (user_id) select id from auth.users where email = 'CORREO_DE_ALLISON';
