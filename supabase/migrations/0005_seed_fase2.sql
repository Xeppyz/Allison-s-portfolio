-- 0005_seed_fase2.sql
-- Fase 2: landings nuevas como BORRADORES (active = false). Texto provisional: el copy final lo entrega la clienta.
-- Idempotente: se puede ejecutar mas de una vez.

begin;

insert into public.pages (slug, lang, kind, active, meta_title, meta_description, h1, subheadline, benefits, wa_message, alt_slug, legal_note) values
('quickbooks', 'es', 'service', false, 'QuickBooks Online: migración y orden | Allison Silva', 'Migración, limpieza y capacitación en QuickBooks Online para que tu contabilidad quede ordenada y tu equipo la use con confianza.', 'Implementación y migración a QuickBooks Online', 'Configuramos, migramos y ordenamos tu contabilidad en QuickBooks Online, y capacitamos a tu equipo para usarlo.', '[{"title": "Migración", "text": "Pasamos tu información contable a QuickBooks Online desde tu sistema actual u hojas de cálculo."}, {"title": "Limpieza y orden", "text": "Revisamos y depuramos cuentas y registros para partir de una base confiable."}, {"title": "Capacitación", "text": "Tu equipo aprende a usar QuickBooks en el día a día con sesiones adaptadas a tu operación."}]'::jsonb, 'Hola, quiero implementar o migrar a QuickBooks Online.', null, null),
('cumplimiento-fiscal', 'es', 'service', false, 'Cumplimiento fiscal en Nicaragua | Allison Silva', 'Apoyo con la DGI, declaraciones y calendario fiscal para pequeñas y medianas empresas en Nicaragua, con seguimiento claro de tus obligaciones.', 'Cumplimiento fiscal para tu empresa en Nicaragua', 'Te ayudamos a cumplir con la DGI, presentar tus declaraciones y llevar al día tu calendario fiscal.', '[{"title": "Trato con la DGI", "text": "Te acompañamos en trámites y requerimientos ante la Dirección General de Ingresos."}, {"title": "Declaraciones", "text": "Preparamos y presentamos tus declaraciones según las obligaciones de tu empresa."}, {"title": "Calendario fiscal", "text": "Llevamos el control de fechas y obligaciones para que nada se pase."}]'::jsonb, 'Hola, necesito ayuda con el cumplimiento fiscal de mi empresa.', null, null),
('llc-usa', 'es', 'service', false, 'Contabilidad para tu LLC en EE. UU. | Allison Silva', 'Contabilidad mensual, impuestos y certificado anual para dueños de LLC en EE. UU., con QuickBooks y apoyo para negocios de comercio electrónico.', 'Contabilidad e impuestos para tu LLC en EE. UU.', 'Contabilidad mensual y apoyo fiscal para dueños de LLC, con QuickBooks y atención a negocios de e-commerce.', '[{"title": "Contabilidad mensual", "text": "Registramos y conciliamos los movimientos de tu LLC cada mes en QuickBooks."}, {"title": "Impuestos y certificado anual", "text": "Te apoyamos con tus obligaciones fiscales y el certificado anual de tu LLC."}, {"title": "E-commerce", "text": "Ordenamos las ventas y los costos de tu tienda en línea dentro de tu contabilidad."}]'::jsonb, 'Hola, necesito contabilidad mensual y apoyo fiscal para mi LLC.', 'llc-bookkeeping', null),
('llc-bookkeeping', 'en', 'service', false, 'Bookkeeping for Your US LLC | Allison Silva', 'Monthly bookkeeping, tax support and annual certificate for US LLC owners, using QuickBooks and with support for e-commerce businesses.', 'Bookkeeping and tax support for your US LLC', 'Monthly bookkeeping and tax support for LLC owners, with QuickBooks and attention to e-commerce businesses.', '[{"title": "Monthly bookkeeping", "text": "We record and reconcile your LLC''s transactions every month in QuickBooks."}, {"title": "Taxes and annual certificate", "text": "We support you with your tax obligations and your LLC''s annual certificate."}, {"title": "E-commerce", "text": "We organize your online store''s sales and costs within your books."}]'::jsonb, 'Hi, I need monthly bookkeeping and tax support for my LLC.', 'llc-usa', null),
('finanzas-personales', 'es', 'service', false, 'Ordena tus finanzas personales | Allison Silva', 'Planes para ordenar tus finanzas personales, entender tus ingresos y gastos y mantener seguimiento con acompañamiento profesional.', 'Ordena tus finanzas personales', 'Planes para tener claridad sobre tus ingresos, gastos y obligaciones, con seguimiento.', '[{"title": "Claridad", "text": "Ordenamos tus ingresos, gastos y obligaciones para que veas dónde estás."}, {"title": "Plan a tu medida", "text": "Elegimos contigo el plan que se ajusta a tu situación personal."}, {"title": "Seguimiento", "text": "Te acompañamos después de ordenar para que mantengas el hábito."}]'::jsonb, 'Hola, quiero ordenar mis finanzas personales.', null, 'Aviso legal pendiente de validación con un asesor legal.'),
('certificaciones', 'es', 'service', false, 'Certificaciones contables | Allison Silva', 'Certificaciones de ingresos, estados financieros e inventarios para tus trámites, preparadas según lo que necesites presentar.', 'Certificaciones contables', 'Certificaciones de ingresos, estados financieros e inventarios, según lo que necesites presentar.', '[{"title": "Ingresos", "text": "Certificación de ingresos para tus trámites personales o de negocio."}, {"title": "Estados financieros", "text": "Certificación de estados financieros de tu empresa."}, {"title": "Inventarios", "text": "Certificación de inventarios para respaldar tus existencias."}]'::jsonb, 'Hola, necesito una certificación de ____ (ingresos, estados financieros o inventarios).', null, null),
('capacitacion', 'es', 'service', false, 'Capacitación en QuickBooks para equipos | Allison Silva', 'Capacitación en QuickBooks, US GAAP e impuestos de EE. UU. para LLC, dirigida a equipos contables que quieren trabajar con más seguridad.', 'Capacitación para equipos contables', 'QuickBooks, US GAAP e impuestos de EE. UU. para LLC, explicados para tu equipo.', '[{"title": "QuickBooks", "text": "Sesiones prácticas para que tu equipo use QuickBooks en su operación diaria."}, {"title": "US GAAP", "text": "Principios contables de EE. UU. aplicados al trabajo de tu equipo."}, {"title": "Impuestos de LLC", "text": "Conceptos de impuestos de EE. UU. para LLC, orientados a la práctica."}]'::jsonb, 'Hola, quiero capacitación en QuickBooks para mi equipo.', null, null)
on conflict (slug) do nothing;

-- FAQ (solo si la pregunta aun no existe en esa pagina)
insert into public.faqs (sort, page_slug, question, answer)
select 1, 'quickbooks', '¿Qué incluye la implementación de QuickBooks Online?', 'Incluye la configuración inicial, la migración de tu información, la depuración de registros y la capacitación de tu equipo. El alcance exacto se define según tu caso.'
where not exists (select 1 from public.faqs where page_slug = 'quickbooks' and question = '¿Qué incluye la implementación de QuickBooks Online?');
insert into public.faqs (sort, page_slug, question, answer)
select 2, 'quickbooks', '¿Puedo migrar desde otro sistema o desde Excel?', 'Sí. Revisamos tu información actual y definimos cómo trasladarla a QuickBooks Online.'
where not exists (select 1 from public.faqs where page_slug = 'quickbooks' and question = '¿Puedo migrar desde otro sistema o desde Excel?');
insert into public.faqs (sort, page_slug, question, answer)
select 3, 'quickbooks', '¿Cuánto cuesta el servicio?', 'Cada proyecto es distinto, por eso no publicamos un precio fijo. Escríbenos por WhatsApp y te orientamos según tu situación.'
where not exists (select 1 from public.faqs where page_slug = 'quickbooks' and question = '¿Cuánto cuesta el servicio?');

insert into public.faqs (sort, page_slug, question, answer)
select 1, 'cumplimiento-fiscal', '¿Para qué tipo de empresas es este servicio?', 'Está pensado para pequeñas y medianas empresas en Nicaragua que necesitan llevar sus obligaciones fiscales al día.'
where not exists (select 1 from public.faqs where page_slug = 'cumplimiento-fiscal' and question = '¿Para qué tipo de empresas es este servicio?');
insert into public.faqs (sort, page_slug, question, answer)
select 2, 'cumplimiento-fiscal', '¿Qué obligaciones fiscales pueden revisar?', 'Revisamos tus declaraciones y el calendario fiscal que corresponde a tu empresa. Las obligaciones concretas dependen de tu situación.'
where not exists (select 1 from public.faqs where page_slug = 'cumplimiento-fiscal' and question = '¿Qué obligaciones fiscales pueden revisar?');
insert into public.faqs (sort, page_slug, question, answer)
select 3, 'cumplimiento-fiscal', '¿Cómo empiezo?', 'Escríbenos por WhatsApp para un diagnóstico inicial y ver qué necesita tu empresa.'
where not exists (select 1 from public.faqs where page_slug = 'cumplimiento-fiscal' and question = '¿Cómo empiezo?');

insert into public.faqs (sort, page_slug, question, answer)
select 1, 'llc-usa', '¿Trabajan con LLC de cualquier estado?', 'Escríbenos con los datos de tu LLC y revisamos tu caso. Las obligaciones dependen de tu estructura y de dónde opera.'
where not exists (select 1 from public.faqs where page_slug = 'llc-usa' and question = '¿Trabajan con LLC de cualquier estado?');
insert into public.faqs (sort, page_slug, question, answer)
select 2, 'llc-usa', '¿Usan QuickBooks?', 'Sí. Llevamos la contabilidad de tu LLC en QuickBooks Online.'
where not exists (select 1 from public.faqs where page_slug = 'llc-usa' and question = '¿Usan QuickBooks?');
insert into public.faqs (sort, page_slug, question, answer)
select 3, 'llc-usa', '¿Atienden negocios de comercio electrónico?', 'Sí. Podemos ordenar ventas, comisiones y costos de tu tienda en línea dentro de tu contabilidad.'
where not exists (select 1 from public.faqs where page_slug = 'llc-usa' and question = '¿Atienden negocios de comercio electrónico?');

insert into public.faqs (sort, page_slug, question, answer)
select 1, 'llc-bookkeeping', 'Do you work with LLCs from any state?', 'Send us your LLC''s details and we will review your case. Obligations depend on your structure and where you operate.'
where not exists (select 1 from public.faqs where page_slug = 'llc-bookkeeping' and question = 'Do you work with LLCs from any state?');
insert into public.faqs (sort, page_slug, question, answer)
select 2, 'llc-bookkeeping', 'Do you use QuickBooks?', 'Yes. We keep your LLC''s books in QuickBooks Online.'
where not exists (select 1 from public.faqs where page_slug = 'llc-bookkeeping' and question = 'Do you use QuickBooks?');
insert into public.faqs (sort, page_slug, question, answer)
select 3, 'llc-bookkeeping', 'Do you support e-commerce businesses?', 'Yes. We can organize the sales, fees and costs of your online store within your books.'
where not exists (select 1 from public.faqs where page_slug = 'llc-bookkeeping' and question = 'Do you support e-commerce businesses?');

insert into public.faqs (sort, page_slug, question, answer)
select 1, 'finanzas-personales', '¿Qué incluyen los planes de finanzas personales?', 'Los planes ayudan a ordenar tus finanzas y a darles seguimiento. El detalle de cada plan aparece en esta página.'
where not exists (select 1 from public.faqs where page_slug = 'finanzas-personales' and question = '¿Qué incluyen los planes de finanzas personales?');
insert into public.faqs (sort, page_slug, question, answer)
select 2, 'finanzas-personales', '¿Necesito conocimientos previos?', 'No. Partimos de tu situación actual y avanzamos paso a paso.'
where not exists (select 1 from public.faqs where page_slug = 'finanzas-personales' and question = '¿Necesito conocimientos previos?');
insert into public.faqs (sort, page_slug, question, answer)
select 3, 'finanzas-personales', '¿Cómo empiezo?', 'Escríbenos por WhatsApp y te orientamos sobre qué plan se ajusta a ti.'
where not exists (select 1 from public.faqs where page_slug = 'finanzas-personales' and question = '¿Cómo empiezo?');

insert into public.faqs (sort, page_slug, question, answer)
select 1, 'certificaciones', '¿Qué certificaciones ofrecen?', 'Certificaciones de ingresos, de estados financieros y de inventarios.'
where not exists (select 1 from public.faqs where page_slug = 'certificaciones' and question = '¿Qué certificaciones ofrecen?');
insert into public.faqs (sort, page_slug, question, answer)
select 2, 'certificaciones', '¿Qué necesito para solicitarla?', 'Depende del tipo de certificación. Escríbenos y te indicamos qué información debes reunir.'
where not exists (select 1 from public.faqs where page_slug = 'certificaciones' and question = '¿Qué necesito para solicitarla?');
insert into public.faqs (sort, page_slug, question, answer)
select 3, 'certificaciones', '¿Cuánto tarda?', 'Los tiempos dependen del tipo de certificación y de la información disponible. Consúltanos por WhatsApp.'
where not exists (select 1 from public.faqs where page_slug = 'certificaciones' and question = '¿Cuánto tarda?');

insert into public.faqs (sort, page_slug, question, answer)
select 1, 'capacitacion', '¿A quién va dirigida la capacitación?', 'A equipos contables que trabajan o quieren trabajar con QuickBooks, US GAAP e impuestos de LLC en EE. UU.'
where not exists (select 1 from public.faqs where page_slug = 'capacitacion' and question = '¿A quién va dirigida la capacitación?');
insert into public.faqs (sort, page_slug, question, answer)
select 2, 'capacitacion', '¿Se adapta a nuestra operación?', 'Sí. Ajustamos las sesiones a lo que tu equipo necesita.'
where not exists (select 1 from public.faqs where page_slug = 'capacitacion' and question = '¿Se adapta a nuestra operación?');
insert into public.faqs (sort, page_slug, question, answer)
select 3, 'capacitacion', '¿Cómo coordinamos las sesiones?', 'Escríbenos por WhatsApp con el tamaño de tu equipo y el tema que te interesa.'
where not exists (select 1 from public.faqs where page_slug = 'capacitacion' and question = '¿Cómo coordinamos las sesiones?');

-- Planes existentes tambien en las nuevas paginas
update public.plans set page_slugs = array_append(page_slugs, 'cumplimiento-fiscal')
where slug in ('plan-emprendedor', 'plan-pyme', 'plan-corporativo') and not ('cumplimiento-fiscal' = any(page_slugs));
update public.plans set page_slugs = array_append(page_slugs, 'llc-usa')
where slug in ('llc-servicios', 'llc-ecommerce') and not ('llc-usa' = any(page_slugs));
update public.plans set page_slugs = array_append(page_slugs, 'llc-bookkeeping')
where slug in ('llc-servicios', 'llc-ecommerce') and not ('llc-bookkeeping' = any(page_slugs));
update public.plans set page_slugs = array_append(page_slugs, 'finanzas-personales')
where slug in ('finanzas-personales') and not ('finanzas-personales' = any(page_slugs));
update public.plans set page_slugs = array_append(page_slugs, 'certificaciones')
where slug in ('certificacion-ingresos', 'certificacion-estados-financieros', 'certificacion-inventarios') and not ('certificaciones' = any(page_slugs));

commit;
