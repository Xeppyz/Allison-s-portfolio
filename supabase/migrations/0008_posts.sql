-- 0008_posts.sql — Fase 3: blog editable desde el panel.

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  seo_title text,
  excerpt text,
  focus_keyword text,
  content_html text not null default '',
  cover_url text,
  cover_alt text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger posts_updated_at before update on public.posts
  for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;

create policy "anon lee posts publicados" on public.posts
  for select to anon, authenticated using (published);
create policy "auth gestiona posts" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.posts (slug, title, seo_title, excerpt, focus_keyword, cover_url, cover_alt, tags, published, published_at, content_html) values
(
  'pasos-para-inscribirse-ante-la-dgi-de-nicaragua',
  'Pasos para inscribirse ante la DGI de Nicaragua',
  'Inscribirse en la DGI de Nicaragua: pasos',
  'Guía práctica para inscribirte ante la DGI de Nicaragua, obtener tu RUC y cumplir tus obligaciones fiscales desde el primer día.',
  'DGI',
  '/blog/inscripcion-dgi.webp',
  'Calendario y documentos fiscales sobre un escritorio',
  '{Nicaragua,DGI,RUC,"Cumplimiento fiscal"}',
  true, '2024-02-01',
  $html$<p>Si estás por iniciar un negocio en Nicaragua, uno de los primeros requisitos legales es inscribirte ante la Dirección General de Ingresos (DGI). Este trámite te permite obtener tu RUC (Registro Único de Contribuyente) y cumplir con tus obligaciones fiscales según lo establece el Código Tributario y la Ley de Concertación Tributaria.</p>
<h2>Pasos principales</h2>
<ol>
<li><p><strong>Definir el tipo de contribuyente</strong> – Persona natural o jurídica, según corresponda al negocio.</p></li>
<li><p><strong>Reunir la documentación necesaria</strong> – Cédula de identidad, escritura de constitución inscrita; este proceso debe realizarse de forma personal; constancia de local arrendado o propio; RTN municipal.</p></li>
<li><p><strong>Llenar el formulario de inscripción</strong> – Proporcionado en las oficinas de la DGI o disponible en línea.</p></li>
<li><p><strong>Presentar y validar la información</strong> – Un funcionario revisa los documentos y asigna el número de RUC.</p></li>
<li><p><strong>Obtener tu RUC y clave de acceso</strong> – Con esto podrás declarar impuestos, emitir facturas autorizadas y cumplir tus obligaciones tributarias.</p></li>
</ol>
<p>Cumplir con este paso es fundamental para que tu negocio opere legalmente en Nicaragua. En Allison Silva Taxes and Accounting acompañamos a nuestros clientes en cada etapa para garantizar un proceso correcto. Conoce nuestro servicio de <a href="/cumplimiento-fiscal">cumplimiento fiscal</a>.</p>$html$
),
(
  'ventajas-de-automatizar-e-integrar-quickbooks',
  'Ventajas de automatizar e integrar QuickBooks como sistema contable',
  'Ventajas de automatizar con QuickBooks',
  'Optimiza procesos, reduce errores y asegura el cumplimiento fiscal de tu empresa al integrar QuickBooks Online como sistema contable.',
  'QuickBooks',
  '/blog/quickbooks.webp',
  'Pantalla de un software contable con reportes financieros',
  '{QuickBooks,Automatización,Contabilidad,Tecnología}',
  true, '2024-02-10',
  $html$<p>La contabilidad manual puede ser ineficiente y propensa a errores. Con la adopción de sistemas tecnológicos como QuickBooks Online, tu empresa puede cumplir con la normativa fiscal y al mismo tiempo optimizar procesos.</p>
<h2>Principales ventajas de QuickBooks</h2>
<ul>
<li><p><strong>Automatización de tareas</strong> – Registro de ingresos, egresos y conciliaciones bancarias en menor tiempo.</p></li>
<li><p><strong>Cumplimiento fiscal</strong> – Reportes financieros organizados y alineados con obligaciones locales e internacionales.</p></li>
<li><p><strong>Acceso en tiempo real</strong> – Información disponible desde cualquier lugar para la toma de decisiones.</p></li>
<li><p><strong>Reducción de errores</strong> – Minimiza riesgos de omisiones y duplicidades en los registros.</p></li>
<li><p><strong>Integración con otras herramientas</strong> – Conexión con facturación, bancos y nómina.</p></li>
</ul>
<p>En Allison Silva Taxes and Accounting ayudamos a <a href="/quickbooks">implementar QuickBooks</a> de forma estratégica, asegurando eficiencia y cumplimiento fiscal.</p>$html$
),
(
  'como-prepararse-para-las-declaraciones-anuales-ca-y-eeuu',
  'Cómo prepararse para las declaraciones anuales en Centroamérica y Estados Unidos',
  'Declaraciones anuales en CA y EE. UU.',
  'Claves para preparar tus declaraciones anuales en Centroamérica y Estados Unidos, evitar sanciones y cumplir tus obligaciones a tiempo.',
  'declaraciones anuales',
  '/blog/declaraciones-anuales.png',
  'Documentos contables preparados para la declaración anual',
  '{"Declaraciones anuales",Centroamérica,"Estados Unidos",Cumplimiento}',
  true, '2024-02-20',
  $html$<p>Las declaraciones anuales son una obligación establecida por las leyes fiscales en Centroamérica y en Estados Unidos. Prepararse con tiempo es la clave para evitar sanciones y garantizar el cumplimiento tributario.</p>
<h2>Recomendaciones clave</h2>
<ol>
<li><p><strong>Mantén registros contables organizados</strong> – Facturas, recibos y estados bancarios actualizados.</p></li>
<li><p><strong>Identifica tus obligaciones fiscales</strong> – En CA: Impuesto sobre la Renta e IVA/ITBMS; en EE. UU.: Federal Income Tax, State Tax y Sales Tax según corresponda.</p></li>
<li><p><strong>Revisa deducciones permitidas</strong> – Gastos operativos, depreciaciones y beneficios aplicables en cada país.</p></li>
<li><p><strong>Usa herramientas tecnológicas</strong> – QuickBooks u otros softwares que faciliten la preparación de reportes.</p></li>
<li><p><strong>Consulta a un experto</strong> – La normativa cambia con frecuencia y conviene tener asesoría profesional.</p></li>
</ol>
<p>En Allison Silva Taxes and Accounting apoyamos a empresas y personas a cumplir con sus obligaciones fiscales tanto a nivel local como internacional. Revisa nuestros <a href="/planes">planes</a>.</p>$html$
);
