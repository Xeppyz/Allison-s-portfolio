-- 0006_publicar_fase2.sql
-- Ejecutar SOLO cuando el sitio nuevo este desplegado y los textos revisados:
-- publica las landings de la Fase 2 y apunta a ellas las tarjetas de servicios.

begin;

update public.pages set active = true
where slug in ('quickbooks', 'cumplimiento-fiscal', 'llc-usa', 'llc-bookkeeping', 'finanzas-personales', 'certificaciones', 'capacitacion');

-- Enlaces de la seccion de servicios (solo donde aun apuntan a /contacto)
update public.services set link = '/quickbooks' where title = 'Implementación de QuickBooks' and link = '/contacto';
update public.services set link = '/cumplimiento-fiscal' where title = 'Control fiscal y cumplimiento' and link = '/contacto';
update public.services set link = '/certificaciones' where title = 'Certificaciones' and link = '/contacto';
update public.services set link = '/capacitacion' where title = 'Capacitación' and link = '/contacto';
update public.services set link = '/finanzas-personales' where title = 'Finanzas personales' and link = '/contacto';

commit;
