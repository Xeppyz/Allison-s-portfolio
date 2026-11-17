-- 0002_seed.sql
-- Datos iniciales. Ejecutar una sola vez, despues de 0001_schema.sql.

-- ---------------------------------------------------------- site_settings

insert into public.site_settings (id, whatsapp_number, phone, email, credentials)
values (
  1,
  '',
  '+505 8767-3463',
  'info@allisonsilvacorp.com',
  '["CPA (CCPN, Nicaragua)", "QuickBooks ProAdvisor", "Máster en Finanzas", "11 años de experiencia"]'::jsonb
);

-- ------------------------------------------------------------------ pages

insert into public.pages
  (slug, lang, kind, meta_title, meta_description, h1, subheadline, benefits, wa_message, body)
values
(
  'inicio', 'es', 'home',
  'Contabilidad mensual y QuickBooks en Nicaragua | Allison Silva',
  'CPA con 11 años de experiencia en Nicaragua y EE. UU. Contabilidad mensual, QuickBooks y cumplimiento fiscal con respuesta rápida por WhatsApp.',
  'Sabe cuánto gana tu negocio, cada mes, sin multas ni sorpresas.',
  'CPA con 11 años de experiencia en Nicaragua y EE. UU., contabilidad mensual, QuickBooks y cumplimiento fiscal con respuesta rápida por WhatsApp.',
  '[]'::jsonb,
  'Hola Allison, vi su sitio y quiero el diagnóstico financiero gratis. Mi empresa es ____ y necesito ayuda con ____.',
  null
),
(
  'planes', 'es', 'service',
  'Planes y precios de contabilidad | Allison Silva',
  'Planes de contabilidad mensual, LLC, certificaciones y finanzas personales con precios de referencia.',
  'Planes y precios',
  'Elige el plan que se ajusta a tu negocio o pide tu diagnóstico financiero gratis por WhatsApp.',
  '[]'::jsonb,
  'Hola Allison, vi su sitio y quiero el diagnóstico financiero gratis. Mi empresa es ____ y necesito ayuda con ____.',
  null
),
(
  'contabilidad-mensual', 'es', 'service',
  'Contabilidad mensual para empresas en Nicaragua | Allison Silva',
  'Contabilidad mensual al día, conciliaciones y reportes claros para tu empresa en Nicaragua.',
  'Contabilidad mensual para tu empresa',
  'Mantenemos tus registros contables al día con precisión y detalle.',
  '[
    {"title": "Registro diario", "text": "Registro diario de todas las transacciones comerciales"},
    {"title": "Conciliación bancaria", "text": "Conciliación bancaria mensual"},
    {"title": "Ingresos y gastos clasificados", "text": "Clasificación correcta de ingresos y gastos"}
  ]'::jsonb,
  'Hola, quiero ordenar la contabilidad mensual de mi empresa.',
  null
),
(
  'privacidad', 'es', 'legal',
  'Política de privacidad | Allison Silva',
  'Política de privacidad de allisonsilvacorp.com.',
  'Política de privacidad',
  null,
  '[]'::jsonb,
  null,
  $body$Texto pendiente de Allison.$body$
),
(
  'terminos', 'es', 'legal',
  'Términos y condiciones | Allison Silva',
  'Términos y condiciones de uso de allisonsilvacorp.com.',
  'Términos y condiciones',
  null,
  '[]'::jsonb,
  null,
  $body$Texto pendiente de Allison.$body$
);

-- --------------------------------------------------------------- services

insert into public.services (sort, title, description, details, link) values
(1, 'Contabilidad mensual',
 'Mantenemos tus registros contables al día con precisión y detalle.',
 '["Registro diario de todas las transacciones comerciales", "Conciliación bancaria mensual", "Clasificación correcta de ingresos y gastos", "Mantenimiento de libros contables actualizados", "Preparación de balances de comprobación", "Archivo organizado de documentos de respaldo"]'::jsonb,
 '/contabilidad-mensual'),
(2, 'Implementación de QuickBooks',
 'Configuramos y optimizamos QuickBooks para tu negocio específico.',
 '["Configuración inicial personalizada del sistema", "Creación del plan de cuentas específico para tu industria", "Configuración de productos y servicios", "Entrenamiento básico para el uso del sistema", "Migración de datos desde sistemas anteriores", "Soporte técnico durante los primeros 30 días"]'::jsonb,
 '/contacto'),
(3, 'Control de ingresos y gastos',
 'Seguimiento detallado de todas tus transacciones financieras.',
 '["Monitoreo en tiempo real de flujo de efectivo", "Categorización detallada de todos los gastos", "Seguimiento de cuentas por cobrar y pagar", "Análisis de rentabilidad por producto/servicio", "Alertas de gastos inusuales o excesivos", "Reportes de tendencias financieras mensuales"]'::jsonb,
 '/contacto'),
(4, 'Control fiscal y cumplimiento',
 'Aseguramos el cumplimiento de todas las obligaciones fiscales.',
 '["Preparación y presentación de declaraciones mensuales", "Cálculo preciso de impuestos sobre la renta", "Gestión de retenciones y pagos a cuenta", "Cumplimiento de obligaciones ante DGI", "Asesoría en planificación fiscal", "Representación ante autoridades fiscales"]'::jsonb,
 '/contacto'),
(5, 'Reportes financieros mensuales',
 'Informes claros y detallados para la toma de decisiones.',
 '["Estado de resultados (pérdidas y ganancias)", "Balance general actualizado", "Flujo de efectivo proyectado", "Análisis de indicadores financieros clave", "Comparativo con períodos anteriores", "Recomendaciones para mejora financiera"]'::jsonb,
 '/contacto'),
(6, 'Certificaciones',
 'Certificaciones contables para tus trámites, según lo que necesites presentar.',
 '["Certificación de ingresos de persona natural", "Certificación de estados financieros", "Certificación de inventarios", "Atención por WhatsApp para definir el alcance"]'::jsonb,
 '/contacto'),
(7, 'Capacitación',
 'Capacitación práctica para que tu equipo use bien su sistema contable.',
 '["Capacitación en QuickBooks para tu equipo", "Sesiones adaptadas a tu operación", "Orientación en buenas prácticas de registro contable"]'::jsonb,
 '/contacto'),
(8, 'Finanzas personales',
 'Ordena tus ingresos, gastos y metas con acompañamiento profesional.',
 '["Revisión de tus ingresos y gastos", "Plan para ordenar tu dinero", "Herramientas y plantillas para el seguimiento", "Acompañamiento para mantener el orden"]'::jsonb,
 '/contacto');

-- ------------------------------------------------------------------ plans

insert into public.plans
  (sort, slug, name, price_text, description, features, "group", cta, page_slugs)
values
(1, 'plan-emprendedor', 'Plan Emprendedor', 'Desde US$199 al mes',
 'Organización, control y asesoría para emprendedores.', '[]'::jsonb,
 'empresa', 'planes', '{inicio,planes,contabilidad-mensual}'),
(2, 'plan-pyme', 'Plan Pyme', 'Desde US$299 al mes',
 'Contabilidad mensual para pequeñas y medianas empresas.', '[]'::jsonb,
 'empresa', 'planes', '{inicio,planes,contabilidad-mensual}'),
(3, 'plan-corporativo', 'Plan Corporativo', 'Desde US$750 al mes, según el volumen de transacciones',
 'Contabilidad mensual para empresas con alto volumen de transacciones.', '[]'::jsonb,
 'empresa', 'planes', '{inicio,planes,contabilidad-mensual}'),
(4, 'llc-servicios', 'LLC de servicios', 'Desde US$250 al mes',
 'Contabilidad mensual para LLC de servicios.', '[]'::jsonb,
 'llc', 'planes', '{planes}'),
(5, 'llc-ecommerce', 'LLC de e-commerce', 'Desde US$250 al mes con menos de 25 payouts; desde US$350 con 25 o más',
 'Contabilidad mensual para LLC de comercio electrónico.', '[]'::jsonb,
 'llc', 'planes', '{planes}'),
(6, 'finanzas-personales', 'Finanzas personales', 'Plan "Ordena tu dinero" US$99; con app y plantillas en Excel US$149; seguimiento de 3 meses US$120 (precio por validar)',
 'Ordena tus finanzas personales con acompañamiento profesional.', '[]'::jsonb,
 'personal', 'planes', '{planes}'),
(7, 'certificacion-ingresos', 'Certificación de ingresos de persona natural', 'US$50',
 'Certificación de ingresos para personas naturales.', '[]'::jsonb,
 'certificacion', 'planes', '{planes}'),
(8, 'certificacion-estados-financieros', 'Certificación de estados financieros', 'Desde US$150 según régimen, períodos y objetivo',
 'Certificación de estados financieros según tu régimen y necesidad.', '[]'::jsonb,
 'certificacion', 'planes', '{planes}'),
(9, 'certificacion-inventarios', 'Certificación de inventarios', 'Cotizar por WhatsApp (precio por definir)',
 'Certificación de inventarios.', '[]'::jsonb,
 'certificacion', 'whatsapp', '{planes}'),
(10, 'chequeo-salud-contable', 'Chequeo de salud contable', 'US$99, que se acredita al primer mes del plan',
 'Revisión del estado de tu contabilidad.', '[]'::jsonb,
 'addon', 'planes', '{planes}'),
(11, 'diagnostico-financiero', 'Diagnóstico financiero de 30 minutos', 'Gratis',
 'Una conversación de 30 minutos para entender la situación de tu negocio.', '[]'::jsonb,
 'addon', 'planes', '{planes}');

-- ------------------------------------------------------------ testimonials

insert into public.testimonials
  (sort, name, position, company, quote, problem, benefit, satisfaction, authorized)
values
(1, 'David Silva Briceño', 'Founder & Managing Director', 'IGH Financial Advisors',
 'Resultados satisfactorios, pues el tiempo de respuesta es el que requería.',
 'Necesitaba apoyo con unas certificaciones de ingresos, pero con un servicio ágil.',
 'Resultados satisfactorios, pues el tiempo de respuesta es el que requería.',
 'Si lo recomendaría, por la calidad de servicio y además por el profesionalismo con que realizó su trabajo.',
 false),
(2, 'Dean Largaespada', 'Founder', 'ICONNECT GROUP LLC',
 'Ahora puedo saber cuánto estamos facturando, gastando, en qué categorías y cuánto es nuestra rentabilidad.',
 'No teníamos una contabilidad clara ni rentabilidad.',
 'Ahora puedo saber cuánto estamos facturando, gastando, en qué categorías y cuánto es nuestra rentabilidad.',
 'Si, porque has realizado tu trabajo con transparencia y calidad.',
 false),
(3, 'Bruce Lampson', 'CEO', 'RAPIMARKET',
 'Logramos tener procesos contables mucho más organizados, información financiera al día y asesoría oportuna para la toma de decisiones.',
 'Necesitábamos tener un control más claro y preciso de la contabilidad de la empresa, con reportes financieros confiables y cumplimiento fiscal sin errores ni atrasos.',
 'Logramos tener procesos contables mucho más organizados, información financiera al día y asesoría oportuna para la toma de decisiones. Además, nos sentimos tranquilos al saber que todo está en orden con nuestras obligaciones fiscales.',
 'Definitivamente sí, porque ofrecen un servicio profesional, confiable y personalizado que realmente ayuda a las empresas a enfocarse en su crecimiento mientras ustedes se encargan de la parte contable.',
 false),
(4, 'Leslie Xaviera Martínez Benavides', 'Gerente contable', 'INGROMESA',
 'Atención de calidad y personalizada para capacitación de personal en implementación de sistema contable',
 'Sistemas contables.',
 'Excelente servicio.',
 'Si, porque es personalizado y de calidad.',
 false),
(5, 'Anónimo', 'COO', 'Empresa Regional - Sector Exportación de Materiales.',
 'Nos guió a poder estructurar el departamento contable para tener una buena trazabilidad.',
 'Organización dentro del equipo contable, no teníamos definidos roles ni responsabilidades.',
 'Nos guió a poder estructurar el departamento contable para tener una buena trazabilidad.',
 'Si, Allison se caracteriza por su profesionalismo y curiosidad. Ella quiere comprender cada paso en tu proceso operativo para así brindarte la mejor solución.',
 false),
(6, 'Julio Rodriguez', 'Gerente General', 'Omniprint International.',
 'Puntualidad, asesoría pertinente y consistencia.',
 'Necesitaba a alguien confiable que llevara la contabilidad de la empresa.',
 'Puntualidad, asesoría pertinente y consistencia.',
 'Definitivamente SI. Por los valores que tienes como proveedor de servicios contables y el profesionalismo que te caracteriza.',
 false);

-- ------------------------------------------------------------------- faqs
-- Respuestas provisionales, sin precios ni promesas legales.

insert into public.faqs (sort, page_slug, question, answer) values
(1, 'inicio', '¿Qué incluye el diagnóstico financiero gratis?',
 'Es una conversación corta por WhatsApp para entender la situación de tu negocio y orientarte sobre el siguiente paso.'),
(2, 'inicio', '¿Cómo me atienden?',
 'La atención es por WhatsApp, con respuesta rápida. Escríbenos y te indicamos cómo seguir.'),
(3, 'inicio', '¿Atienden empresas fuera de Nicaragua?',
 'Sí, también apoyamos a empresas con operación en EE. UU. Escríbenos y revisamos tu caso.');
