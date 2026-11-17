// GENERADO por scripts/build-api.mjs desde server/render.ts. No editar.
// src/lib/seo-head.ts
var ORIGIN = "https://www.allisonsilvacorp.com";
var ORG_ID = `${ORIGIN}/#organizacion`;
var ORG_NAME = "Allison Silva Taxes & Accounting";
var DEFAULT_TITLE = ORG_NAME;
var DEFAULT_DESCRIPTION = "Servicios profesionales de contabilidad, impuestos, reportes financieros y consultor\xEDa estrat\xE9gica para emprendedores, pymes y corporaciones en Latinoam\xE9rica y EE.UU.";
var DEFAULT_DESCRIPTION_EN = "Professional accounting, tax and financial reporting services for entrepreneurs, small businesses and corporations in Nicaragua and the U.S.";
var DEFAULT_IMAGE = `${ORIGIN}/og-image.jpg`;
function pagePath(slug, lang) {
  if (slug === "inicio") return "/";
  return lang === "en" ? `/en/${slug}` : `/${slug}`;
}
function absoluteUrl(path) {
  return path === "/" ? `${ORIGIN}/` : ORIGIN + path;
}
function normalizePath(pathname) {
  if (typeof pathname !== "string" || !pathname.startsWith("/")) return null;
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  return clean === "" ? "/" : clean;
}
function routeForPath(pathname) {
  const path = normalizePath(pathname);
  if (path === null) return null;
  if (path === "/") return { type: "page", slug: "inicio", lang: "es" };
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "admin") return { type: "admin" };
  if (parts[0] === "en") {
    if (parts.length === 2) return { type: "page", slug: parts[1], lang: "en" };
    return null;
  }
  if (parts[0] === "contacto" && parts.length === 1) return { type: "contact" };
  if (parts[0] === "blog") {
    if (parts.length === 1) return { type: "blog" };
    if (parts.length === 2) return { type: "post", slug: parts[1] };
    return null;
  }
  if (parts.length === 1) return { type: "page", slug: parts[0], lang: "es" };
  return null;
}
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
var HEAD_CLOSE = /<\/head\s*>/i;
function insertBeforeHeadEnd(html, tag) {
  const m = HEAD_CLOSE.exec(html);
  if (!m) return html;
  return html.slice(0, m.index) + "  " + tag + "\n" + html.slice(m.index);
}
function upsert(html, re, tag) {
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let seen = false;
  let found = false;
  const out = html.replace(g, () => {
    found = true;
    if (seen) return "";
    seen = true;
    return tag;
  });
  return found ? out : insertBeforeHeadEnd(html, tag);
}
function metaRe(attr, key) {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<meta\\b[^>]*?\\b${attr}\\s*=\\s*["']${k}["'][^>]*>`, "i");
}
function setMeta(html, attr, key, content) {
  return upsert(html, metaRe(attr, key), `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`);
}
function removeMeta(html, attr, key) {
  const re = metaRe(attr, key);
  return html.replace(new RegExp(re.source, "gi"), "");
}
var LOCALES = { es: "es_NI", en: "en_US" };
function renderHead(html, meta) {
  let out = html;
  if (/<html\b[^>]*?\blang\s*=/i.test(out)) {
    out = out.replace(/(<html\b[^>]*?\blang\s*=\s*)(["'])[^"']*\2/i, (_m, pre) => `${pre}"${meta.lang}"`);
  } else {
    out = out.replace(/<html\b/i, `<html lang="${meta.lang}"`);
  }
  out = upsert(out, /<title\b[^>]*>[\s\S]*?<\/title\s*>/i, `<title>${escapeHtml(meta.title)}</title>`);
  out = setMeta(out, "name", "description", meta.description);
  out = setMeta(out, "name", "robots", meta.noindex ? "noindex,nofollow" : "index,follow");
  out = upsert(
    out,
    /<link\b[^>]*?\brel\s*=\s*["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`
  );
  out = setMeta(out, "property", "og:type", meta.type ?? "website");
  out = setMeta(out, "property", "og:locale", LOCALES[meta.lang]);
  out = setMeta(out, "property", "og:title", meta.title);
  out = setMeta(out, "property", "og:description", meta.description);
  out = setMeta(out, "property", "og:url", meta.canonical);
  out = setMeta(out, "property", "og:image", meta.image);
  out = setMeta(out, "property", "og:image:alt", meta.title);
  if (meta.image !== DEFAULT_IMAGE) {
    for (const k of ["og:image:width", "og:image:height", "og:image:type"]) out = removeMeta(out, "property", k);
  }
  out = setMeta(out, "name", "twitter:title", meta.title);
  out = setMeta(out, "name", "twitter:description", meta.description);
  out = setMeta(out, "name", "twitter:image", meta.image);
  out = out.replace(/<link\b[^>]*?\bhreflang\s*=[^>]*>\s*/gi, "");
  const alts = meta.alternates;
  if (alts && Object.values(alts).filter(Boolean).length >= 2) {
    for (const l of ["es", "en"]) {
      const href = alts[l];
      if (href) out = insertBeforeHeadEnd(out, `<link rel="alternate" hreflang="${l}" href="${escapeHtml(href)}" />`);
    }
    const def = alts.es ?? alts.en;
    out = insertBeforeHeadEnd(out, `<link rel="alternate" hreflang="x-default" href="${escapeHtml(def)}" />`);
  }
  out = out.replace(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*\bdata-ssr\b[^>]*>[\s\S]*?<\/script\s*>\s*/gi, "");
  for (const block of meta.jsonLd ?? []) {
    out = insertBeforeHeadEnd(out, `<script type="application/ld+json" data-ssr="1">${serializeJsonLd(block)}</script>`);
  }
  return out;
}
var other = (l) => l === "es" ? "en" : "es";
function organization(settings, image = DEFAULT_IMAGE) {
  const org = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/qb-icon.svg`,
    image,
    areaServed: ["NI", "US"],
    founder: { "@type": "Person", name: "Allison Silva", jobTitle: "CPA" },
    priceRange: "$$"
  };
  if (settings?.email) org.email = settings.email;
  if (settings?.phone) org.telephone = settings.phone;
  return org;
}
function faqBlock(faqs, slug) {
  const list = (faqs ?? []).filter((f) => f.active !== false && (!f.page_slug || f.page_slug === slug)).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  if (list.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
}
function metaForPath(pathname, data = {}) {
  const route = routeForPath(pathname);
  if (!route) return null;
  const path = normalizePath(pathname);
  if (route.type === "admin") {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      canonical: absoluteUrl(path),
      lang: "es",
      image: DEFAULT_IMAGE,
      noindex: true
    };
  }
  if (route.type === "contact") {
    return {
      title: `Contacto | ${ORG_NAME}`,
      description: "Escr\xEDbenos por WhatsApp, correo o formulario. Diagn\xF3stico financiero gratis de 30 minutos.",
      canonical: absoluteUrl("/contacto"),
      lang: "es",
      image: DEFAULT_IMAGE
    };
  }
  if (route.type === "blog") {
    return {
      title: `Blog | ${ORG_NAME}`,
      description: "Art\xEDculos sobre contabilidad, impuestos y QuickBooks para empresas en Nicaragua y EE. UU.",
      canonical: absoluteUrl("/blog"),
      lang: "es",
      image: DEFAULT_IMAGE
    };
  }
  if (route.type === "post") {
    const post = data.post;
    if (!post || post.slug !== route.slug) return null;
    const canonical2 = absoluteUrl(`/blog/${post.slug}`);
    return {
      title: `${post.title} | Allison Silva`,
      description: post.excerpt,
      canonical: canonical2,
      lang: "es",
      image: DEFAULT_IMAGE,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          image: DEFAULT_IMAGE,
          mainEntityOfPage: canonical2,
          author: { "@type": "Person", name: "Allison Silva" },
          publisher: { "@id": ORG_ID }
        }
      ]
    };
  }
  const page = data.page;
  if (!page || page.active === false || page.slug !== route.slug) return null;
  const pageLang = page.lang === "en" ? "en" : "es";
  if (pageLang !== route.lang) return null;
  const canonicalPath = pagePath(page.slug, pageLang);
  const canonical = absoluteUrl(canonicalPath);
  const image = page.og_image_url || DEFAULT_IMAGE;
  const title = page.meta_title || page.h1 || DEFAULT_TITLE;
  const description = page.meta_description || page.subheadline || (pageLang === "en" ? DEFAULT_DESCRIPTION_EN : DEFAULT_DESCRIPTION);
  const jsonLd = [];
  if (page.kind === "home") jsonLd.push(organization(data.settings, image));
  if (page.kind === "service") {
    const name = page.h1 || title;
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      description,
      provider: { "@id": ORG_ID },
      areaServed: ["NI", "US"],
      url: canonical
    });
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: pageLang === "en" ? "Home" : "Inicio", item: `${ORIGIN}/` },
        { "@type": "ListItem", position: 2, name, item: canonical }
      ]
    });
  }
  const faq = faqBlock(data.faqs, page.slug);
  if (faq) jsonLd.push(faq);
  const meta = { title, description, canonical, lang: pageLang, image, noindex: !!page.noindex, jsonLd };
  if (page.alt_slug) {
    meta.alternates = {
      [pageLang]: canonical,
      [other(pageLang)]: absoluteUrl(pagePath(page.alt_slug, other(pageLang)))
    };
  }
  return meta;
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

// server/render.ts
export const config = { runtime: "edge" };
var SHELL_TTL_MS = 6e4;
var TIMEOUT_MS = 3e3;
var shellCache = null;
var HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };
async function getShell(req) {
  if (shellCache && Date.now() - shellCache.at < SHELL_TTL_MS) return shellCache.text;
  try {
    const cookie = req.headers.get("cookie");
    const res = await fetch(new URL("/index.html", req.url), {
      headers: cookie ? { cookie } : void 0,
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    if (!res.ok) throw new Error(`shell ${res.status}`);
    const text = await res.text();
    shellCache = { text, at: Date.now() };
    return text;
  } catch {
    return shellCache?.text ?? null;
  }
}
function validPath(p) {
  return !!p && p.startsWith("/") && p.length <= 200 && !p.includes("//") && !p.includes("..");
}
async function rest(base, key, query) {
  const res = await fetch(`${base}/rest/v1/${query}`, {
    headers: { apikey: key, authorization: `Bearer ${key}`, accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!res.ok) throw new Error(`supabase ${res.status}`);
  return await res.json();
}
var PAGE_COLS = "slug,lang,kind,meta_title,meta_description,h1,subheadline,active,noindex,og_image_url,alt_slug";
function noindexShell(shell) {
  const tag = '<meta name="robots" content="noindex,nofollow" />';
  const re = /<meta\b[^>]*?\bname\s*=\s*["']robots["'][^>]*>/i;
  return re.test(shell) ? shell.replace(re, () => tag) : shell.replace(/<\/head\s*>/i, () => `${tag}</head>`);
}
async function handler(req) {
  const shell = await getShell(req);
  if (shell === null) {
    return new Response("Servicio no disponible", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" }
    });
  }
  const notFound = () => new Response(noindexShell(shell), {
    status: 404,
    headers: { ...HTML_HEADERS, "cache-control": "public, s-maxage=60" }
  });
  const unmodified = () => new Response(shell, { status: 200, headers: { ...HTML_HEADERS, "cache-control": "no-store" } });
  const path = new URL(req.url).searchParams.get("path");
  if (!validPath(path)) return notFound();
  const route = routeForPath(path);
  if (!route) return notFound();
  let page = null;
  let faqs = [];
  let settings = null;
  let degraded = false;
  if (route.type === "page") {
    const base = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (!base || !key) return unmodified();
    const slug = encodeURIComponent(route.slug);
    const [p, f, s] = await Promise.allSettled([
      rest(base, key, `pages?slug=eq.${slug}&select=${PAGE_COLS}&limit=1`),
      rest(
        base,
        key,
        `faqs?page_slug=eq.${slug}&active=eq.true&select=page_slug,question,answer,active,sort&order=sort.asc`
      ),
      rest(base, key, "site_settings?select=phone,email,address,hours&limit=1")
    ]);
    if (p.status === "rejected") return unmodified();
    page = p.value[0] ?? null;
    if (f.status === "fulfilled") faqs = f.value;
    else degraded = true;
    if (s.status === "fulfilled") settings = s.value[0] ?? null;
    else degraded = true;
  }
  const post = route.type === "post" ? blogPosts.find((b) => b.slug === route.slug) ?? null : null;
  const meta = metaForPath(path, { page, faqs, settings, post });
  if (!meta) return notFound();
  return new Response(renderHead(shell, meta), {
    status: 200,
    headers: {
      ...HTML_HEADERS,
      // Si faltó algo secundario (FAQ/ajustes) no se cachea una cabecera incompleta.
      "cache-control": degraded ? "no-store" : "public, s-maxage=300, stale-while-revalidate=86400"
    }
  });
}
export {
  handler as default
};
