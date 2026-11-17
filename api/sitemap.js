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

// server/sitemap.ts
export const config = { runtime: "edge" };
function xml(entries, maxAge) {
  const body = entries.map((e) => {
    const links = (e.alternates ?? []).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}" />`).join("\n");
    const lastmod = e.lastmod ? `
    <lastmod>${escapeHtml(e.lastmod.slice(0, 10))}</lastmod>` : "";
    return `  <url>
    <loc>${escapeHtml(e.loc)}</loc>${lastmod}${links ? "\n" + links : ""}
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
  const home = { loc: absoluteUrl("/") };
  const fixed = [{ loc: absoluteUrl("/contacto") }, { loc: absoluteUrl("/blog") }];
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) return xml([home, ...fixed], 0);
  const get = async (query) => {
    const res = await fetch(`${base}/rest/v1/${query}`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(3e3)
    });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  };
  const [pagesRes, postsRes] = await Promise.allSettled([
    get("pages?active=eq.true&select=slug,lang,noindex,alt_slug"),
    get("posts?published=eq.true&select=slug,updated_at&order=published_at.desc")
  ]);
  const posts = postsRes.status === "fulfilled" ? postsRes.value.map((p) => ({ loc: absoluteUrl(`/blog/${p.slug}`), lastmod: p.updated_at ?? void 0 })) : [];
  const tail = [...fixed, ...posts];
  if (pagesRes.status === "rejected") return xml([home, ...tail], 0);
  const rows = pagesRes.value;
  const maxAge = postsRes.status === "fulfilled" ? 3600 : 0;
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
  return xml([homeRow ? entryFor(homeRow) : home, ...pages, ...tail], maxAge);
}
export {
  handler as default
};
