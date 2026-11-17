// GENERADO por scripts/build-api.mjs desde server/render.ts. No editar.
// src/lib/html.ts
var BLOCKED = "script|style|iframe|object|embed|noscript|template|form|input|button|textarea|select|link|meta|base";
function cleanHtml(html) {
  return String(html ?? "").replace(new RegExp(`<(${BLOCKED})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, "gi"), "").replace(new RegExp(`<\\/?(${BLOCKED})\\b[^>]*>`, "gi"), "").replace(/<!--[\s\S]*?-->/g, "").replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/\s+(href|src|srcset|xlink:href)\s*=\s*("\s*(?:javascript|vbscript|data):[^"]*"|'\s*(?:javascript|vbscript|data):[^']*'|(?:javascript|vbscript|data):[^\s>]*)/gi, "");
}
function formatDate(d) {
  const t = /* @__PURE__ */ new Date(String(d).slice(0, 10) + "T12:00:00Z");
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

// src/lib/seo-head.ts
var ORIGIN = "https://www.allisonsilvacorp.com";
var ORG_ID = `${ORIGIN}/#organizacion`;
var ORG_NAME = "Allison Silva Taxes & Accounting";
var DEFAULT_TITLE = ORG_NAME;
var DEFAULT_DESCRIPTION = "Servicios profesionales de contabilidad, impuestos, reportes financieros y consultor\xEDa estrat\xE9gica para emprendedores, pymes y corporaciones en Latinoam\xE9rica y EE.UU.";
var DEFAULT_DESCRIPTION_EN = "Professional accounting, tax and financial reporting services for entrepreneurs, small businesses and corporations in Nicaragua and the U.S.";
var DEFAULT_IMAGE = `${ORIGIN}/og-image.jpg`;
var POST_TITLE_SUFFIX = " | Allison Silva";
function absoluteImage(url) {
  if (!url) return DEFAULT_IMAGE;
  return url.startsWith("/") ? ORIGIN + url : url;
}
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
var JSON_LD_SSR = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*\bdata-ssr\b[^>]*>[\s\S]*?<\/script\s*>\s*/gi;
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
function renderBody(html, inner) {
  return html.replace(/<div id="root">\s*<\/div>/, () => `<div id="root">${inner}</div>`);
}
function postBody(post) {
  const cover = post.cover_url ? `<img src="${escapeHtml(post.cover_url)}" alt="${escapeHtml(post.cover_alt || post.title)}" width="1200" height="675">` : "";
  return `<main class="mx-auto max-w-3xl px-4 py-16"><article><nav aria-label="Migas de pan"><a href="/">Inicio</a> / <a href="/blog">Blog</a></nav><h1>${escapeHtml(post.title)}</h1><p><time datetime="${escapeHtml(post.published_at)}">${formatDate(post.published_at)}</time> \xB7 Allison Silva, CPA</p>` + cover + `<div class="article-content">${cleanHtml(post.content_html ?? "")}</div></article></main>`;
}
function blogIndexBody(posts) {
  const items = posts.map(
    (p) => `<li><a href="/blog/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a>` + (p.excerpt ? `<p>${escapeHtml(p.excerpt)}</p>` : "") + `</li>`
  ).join("");
  return `<main class="mx-auto max-w-3xl px-4 py-16"><h1>Blog: contabilidad, impuestos y QuickBooks</h1><ul>${items}</ul></main>`;
}
function stripIdentity(html) {
  return removeMeta(html, "property", "og:url").replace(/<link\b[^>]*?\brel\s*=\s*["']canonical["'][^>]*>\s*/gi, "").replace(JSON_LD_SSR, "");
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
    const image2 = absoluteImage(post.cover_url);
    const description2 = post.excerpt || DEFAULT_DESCRIPTION;
    const posting = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: description2,
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      image: image2,
      inLanguage: "es",
      mainEntityOfPage: canonical2,
      author: { "@type": "Person", name: "Allison Silva", jobTitle: "CPA", url: `${ORIGIN}/` },
      publisher: { "@id": ORG_ID }
    };
    if (post.tags?.length) posting.keywords = post.tags.join(", ");
    return {
      title: (post.seo_title || post.title) + POST_TITLE_SUFFIX,
      description: description2,
      canonical: canonical2,
      lang: "es",
      image: image2,
      type: "article",
      jsonLd: [
        posting,
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${ORIGIN}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
            { "@type": "ListItem", position: 3, name: post.title, item: canonical2 }
          ]
        }
      ]
    };
  }
  const page = data.page;
  if (!page || page.active === false || page.slug !== route.slug) return null;
  const pageLang = page.lang === "en" ? "en" : "es";
  if (pageLang !== route.lang) return null;
  const expectedKind = path === "/" ? "home" : path === "/privacidad" || path === "/terminos" ? "legal" : "service";
  if (page.kind !== expectedKind) return null;
  if (expectedKind === "legal" && pageLang !== "es") return null;
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
  const alt = data.alt;
  const altLang = alt ? alt.lang === "en" ? "en" : "es" : null;
  if (page.alt_slug && alt && alt.slug === page.alt_slug && !alt.noindex && altLang !== pageLang) {
    meta.alternates = {
      [pageLang]: canonical,
      [other(pageLang)]: absoluteUrl(pagePath(page.alt_slug, other(pageLang)))
    };
  }
  return meta;
}

// server/render.ts
export const config = { runtime: "edge" };
var SHELL_TTL_MS = 6e4;
var TIMEOUT_MS = 3e3;
var REST_TIMEOUT_MS = 1500;
var DATA_TTL_MS = 6e4;
var shellCache = null;
var dataCache = /* @__PURE__ */ new Map();
var blogCache = /* @__PURE__ */ new Map();
var POST_COLS = "slug,title,seo_title,excerpt,published_at,updated_at,cover_url,cover_alt,tags,content_html";
async function blogData(base, key, slug) {
  const cached = blogCache.get(slug);
  if (cached && Date.now() - cached.at < DATA_TTL_MS) return cached.data;
  const data = slug ? (await rest(base, key, `posts?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=${POST_COLS}&limit=1`))[0] ?? null : await rest(base, key, "posts?published=eq.true&select=slug,title,excerpt,published_at&order=published_at.desc&limit=100");
  blogCache.set(slug, { data, at: Date.now() });
  return data;
}
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
    signal: AbortSignal.timeout(REST_TIMEOUT_MS)
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
  const unmodified = () => new Response(stripIdentity(shell), { status: 200, headers: { ...HTML_HEADERS, "cache-control": "no-store" } });
  const params = new URL(req.url).searchParams;
  if (params.getAll("__p").length !== 1) return unmodified();
  const path = params.get("__p");
  if (!validPath(path)) return notFound();
  const route = routeForPath(path);
  if (!route) return notFound();
  let page = null;
  let faqs = [];
  let settings = null;
  let alt = null;
  let degraded = false;
  if (route.type === "page") {
    const base = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (!base || !key) return unmodified();
    const cached = dataCache.get(route.slug);
    if (cached && Date.now() - cached.at < DATA_TTL_MS) {
      ;
      ({ page, faqs, settings, alt } = cached.data);
    } else {
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
      if (page?.alt_slug) {
        try {
          alt = (await rest(
            base,
            key,
            `pages?slug=eq.${encodeURIComponent(page.alt_slug)}&select=slug,lang,noindex&limit=1`
          ))[0] ?? null;
        } catch {
          degraded = true;
        }
      }
      if (!degraded) dataCache.set(route.slug, { data: { page, faqs, settings, alt }, at: Date.now() });
    }
  }
  let post = null;
  let body = "";
  if (route.type === "post" || route.type === "blog") {
    const base = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (!base || !key) return unmodified();
    try {
      const data = await blogData(base, key, route.type === "post" ? route.slug : "");
      if (route.type === "post") {
        post = data;
        if (post) body = postBody(post);
      } else body = blogIndexBody(data ?? []);
    } catch {
      if (route.type === "post") return unmodified();
      degraded = true;
    }
  }
  const meta = metaForPath(path, { page, faqs, settings, post, alt });
  if (!meta) return notFound();
  const head = renderHead(shell, meta);
  return new Response(body ? renderBody(head, body) : head, {
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
