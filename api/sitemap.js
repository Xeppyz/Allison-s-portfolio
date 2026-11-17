// GENERADO por scripts/build-api.mjs desde server/sitemap.ts. No editar.
// src/lib/seo-head.ts
var ORIGIN = "https://www.allisonsilvacorp.com";
var ORG_ID = `${ORIGIN}/#organizacion`;
var DEFAULT_IMAGE = `${ORIGIN}/og-image.jpg`;
function pagePath(slug, lang) {
  if (slug === "inicio") return "/";
  return lang === "en" ? `/en/${slug}` : `/${slug}`;
}
function absoluteUrl(path) {
  return path === "/" ? `${ORIGIN}/` : ORIGIN + path;
}
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// src/data/BlogPost.tsx
var blogPosts = [
  {
    slug: "pasos-para-inscribirse-ante-la-dgi-de-nicaragua",
    date: "2024-02-01",
    imageKey: "calendar",
    title: "Pasos para inscribirse ante la DGI de Nicaragua",
    excerpt: "Gu\xEDa pr\xE1ctica para obtener tu RUC y cumplir con tus obligaciones fiscales ante la DGI.",
    contentHtml: `
        <p>Si est\xE1s por iniciar un negocio en Nicaragua, uno de los primeros requisitos legales es inscribirte ante la Direcci\xF3n General de Ingresos (DGI). Este tr\xE1mite te permite obtener tu RUC (Registro \xDAnico de Contribuyente) y cumplir con tus obligaciones fiscales seg\xFAn lo establece el C\xF3digo Tributario y la Ley de Concertaci\xF3n Tributaria.</p>
        <h3>Pasos principales:</h3>
        <ol>
          <li><strong>Definir el tipo de contribuyente</strong> \u2013 Persona natural o jur\xEDdica, seg\xFAn corresponda al negocio.</li>
          <li><strong>Reunir la documentaci\xF3n necesaria</strong> \u2013 C\xE9dula de identidad, escritura de constituci\xF3n inscrita; este proceso debe realizarse de forma personal; constancia de local arrendado o propio; RTN municipal.</li>
          <li><strong>Llenar el formulario de inscripci\xF3n</strong> \u2013 Proporcionado en las oficinas de la DGI o disponible en l\xEDnea.</li>
          <li><strong>Presentar y validar la informaci\xF3n</strong> \u2013 Un funcionario revisa los documentos y asigna el n\xFAmero de RUC.</li>
          <li><strong>Obtener tu RUC y clave de acceso</strong> \u2013 Con esto podr\xE1s declarar impuestos, emitir facturas autorizadas y cumplir tus obligaciones tributarias.</li>
        </ol>
        <p>Cumplir con este paso es fundamental para que tu negocio opere legalmente en Nicaragua. En Allison Silva Taxes and Accounting acompa\xF1amos a nuestros clientes en cada etapa para garantizar un proceso correcto.</p>
      `,
    tags: ["Nicaragua", "DGI", "RUC", "Cumplimiento fiscal"]
  },
  {
    slug: "ventajas-de-automatizar-e-integrar-quickbooks",
    date: "2024-02-10",
    imageKey: "accounting",
    title: "Ventajas de automatizar e integrar QuickBooks como sistema contable",
    excerpt: "Optimiza procesos, reduce errores y asegura cumplimiento fiscal con QuickBooks Online.",
    contentHtml: `
        <p>La contabilidad manual puede ser ineficiente y propensa a errores. Con la adopci\xF3n de sistemas tecnol\xF3gicos como QuickBooks Online, tu empresa puede cumplir con la normativa fiscal y al mismo tiempo optimizar procesos.</p>
        <h3>Principales ventajas:</h3>
        <ul>
          <li><strong>Automatizaci\xF3n de tareas</strong> \u2013 Registro de ingresos, egresos y conciliaciones bancarias en menor tiempo.</li>
          <li><strong>Cumplimiento fiscal</strong> \u2013 Reportes financieros organizados y alineados con obligaciones locales e internacionales.</li>
          <li><strong>Acceso en tiempo real</strong> \u2013 Informaci\xF3n disponible desde cualquier lugar para la toma de decisiones.</li>
          <li><strong>Reducci\xF3n de errores</strong> \u2013 Minimiza riesgos de omisiones y duplicidades en los registros.</li>
          <li><strong>Integraci\xF3n con otras herramientas</strong> \u2013 Conexi\xF3n con facturaci\xF3n, bancos y n\xF3mina.</li>
        </ul>
        <p>En Allison Silva Taxes and Accounting ayudamos a implementar QuickBooks de forma estrat\xE9gica, asegurando eficiencia y cumplimiento fiscal.</p>
      `,
    tags: ["QuickBooks", "Automatizaci\xF3n", "Contabilidad", "Tecnolog\xEDa"]
  },
  {
    slug: "como-prepararse-para-las-declaraciones-anuales-ca-y-eeuu",
    date: "2024-02-20",
    imageKey: "placeholder",
    title: "C\xF3mo prepararse para las declaraciones anuales en Centroam\xE9rica y Estados Unidos",
    excerpt: "Claves para evitar sanciones y cumplir con obligaciones en CA y EE. UU.",
    contentHtml: `
        <p>Las declaraciones anuales son una obligaci\xF3n establecida por las leyes fiscales en Centroam\xE9rica y en Estados Unidos. Prepararse con tiempo es la clave para evitar sanciones y garantizar el cumplimiento tributario.</p>
        <h3>Recomendaciones clave:</h3>
        <ol>
          <li><strong>Mant\xE9n registros contables organizados</strong> \u2013 Facturas, recibos y estados bancarios actualizados.</li>
          <li><strong>Identifica tus obligaciones fiscales</strong> \u2013 En CA: Impuesto sobre la Renta e IVA/ITBMS; en EE. UU.: Federal Income Tax, State Tax y Sales Tax seg\xFAn corresponda.</li>
          <li><strong>Revisa deducciones permitidas</strong> \u2013 Gastos operativos, depreciaciones y beneficios aplicables en cada pa\xEDs.</li>
          <li><strong>Usa herramientas tecnol\xF3gicas</strong> \u2013 QuickBooks u otros softwares que faciliten la preparaci\xF3n de reportes.</li>
          <li><strong>Consulta a un experto</strong> \u2013 La normativa cambia con frecuencia y conviene tener asesor\xEDa profesional.</li>
        </ol>
        <p>En Allison Silva Taxes and Accounting apoyamos a empresas y personas a cumplir con sus obligaciones fiscales tanto a nivel local como internacional, ofreciendo seguridad y tranquilidad tributaria.</p>
      `,
    tags: ["Declaraciones anuales", "Centroam\xE9rica", "Estados Unidos", "Cumplimiento"]
  }
];

// server/sitemap.ts
export const config = { runtime: "edge" };
function xml(entries, maxAge) {
  const body = entries.map((e) => {
    const links = (e.alternates ?? []).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}" />`).join("\n");
    return `  <url>
    <loc>${escapeHtml(e.loc)}</loc>${links ? "\n" + links : ""}
  </url>`;
  }).join("\n");
  const doc = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + body + "\n</urlset>\n";
  return new Response(doc, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": maxAge ? `public, s-maxage=${maxAge}` : "no-store"
    }
  });
}
async function handler() {
  const tail = [
    { loc: absoluteUrl("/contacto") },
    { loc: absoluteUrl("/blog") },
    ...blogPosts.map((b) => ({ loc: absoluteUrl(`/blog/${b.slug}`) }))
  ];
  const home = { loc: absoluteUrl("/") };
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) return xml([home, ...tail], 0);
  let rows;
  try {
    const res = await fetch(`${base}/rest/v1/pages?active=eq.true&select=slug,lang,noindex,alt_slug`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(3e3)
    });
    if (!res.ok) throw new Error(String(res.status));
    rows = await res.json();
  } catch {
    return xml([home, ...tail], 0);
  }
  const indexable = rows.filter((r) => !r.noindex);
  const bySlug = new Map(indexable.map((r) => [r.slug, r]));
  const lang = (r) => r.lang === "en" ? "en" : "es";
  const urlOf = (r) => absoluteUrl(pagePath(r.slug, lang(r)));
  const entryFor = (r) => {
    const alt = r.alt_slug ? bySlug.get(r.alt_slug) : void 0;
    if (!alt || lang(alt) === lang(r)) return { loc: urlOf(r) };
    const es = lang(r) === "es" ? r : alt;
    const en = lang(r) === "en" ? r : alt;
    return {
      loc: urlOf(r),
      alternates: [
        { hreflang: "es", href: urlOf(es) },
        { hreflang: "en", href: urlOf(en) },
        { hreflang: "x-default", href: urlOf(es) }
      ]
    };
  };
  const homeRow = bySlug.get("inicio");
  const pages = indexable.filter((r) => r.slug !== "inicio").map(entryFor);
  return xml([homeRow ? entryFor(homeRow) : home, ...pages, ...tail], 3600);
}
export {
  handler as default
};
