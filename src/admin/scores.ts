import type { Post } from '../lib/content'
import { scoreSeo, type SeoInput } from '../lib/seo-score'
import { POST_TITLE_SUFFIX, DEFAULT_TITLE, pagePath } from '../lib/seo-head'

type Row = Record<string, unknown>
const s = (v: unknown) => (typeof v === 'string' ? v : '')
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;')

export function postSeoInput(p: Pick<Post, 'title' | 'seo_title' | 'excerpt' | 'slug' | 'focus_keyword' | 'content_html' | 'cover_url' | 'cover_alt'>): SeoInput {
  return {
    kind: 'post',
    title: (p.seo_title || p.title) + POST_TITLE_SUFFIX,
    description: p.excerpt ?? '',
    slug: p.slug,
    keyword: p.focus_keyword,
    html: p.content_html,
    cover: { url: p.cover_url, alt: p.cover_alt },
  }
}

/** Una página de la tabla `pages` vista como la verá Google (mismos textos que pinta la plantilla). */
export function pageSeoInput(p: Row): SeoInput {
  const benefits = Array.isArray(p.benefits) ? (p.benefits as { title?: string; text?: string }[]) : []
  const body = s(p.body)
    .split(/\n{2,}/)
    .map((b) => (b.startsWith('## ') ? `<h2>${esc(b.slice(3))}</h2>` : `<p>${esc(b)}</p>`))
    .join('')
  const html =
    `<h1>${esc(s(p.h1))}</h1><p>${esc(s(p.subheadline))}</p>` +
    benefits.map((b) => `<h2>${esc(b.title ?? '')}</h2><p>${esc(b.text ?? '')}</p>`).join('') +
    (s(p.guarantee) ? `<p>${esc(s(p.guarantee))}</p>` : '') +
    body
  return {
    kind: 'page',
    title: s(p.meta_title) || s(p.h1) || DEFAULT_TITLE,
    description: s(p.meta_description) || s(p.subheadline),
    slug: s(p.slug) === 'inicio' ? 'inicio' : s(p.slug),
    keyword: s(p.focus_keyword),
    html,
    cover: s(p.og_image_url) ? { url: s(p.og_image_url), alt: s(p.h1) } : null,
  }
}

export const postScore = (p: Post) => scoreSeo(postSeoInput(p)).score
export const pageScore = (p: Row) => scoreSeo(pageSeoInput(p)).score
export const pageUrl = (p: Row) => pagePath(s(p.slug), s(p.lang))
export const pageLabel = (p: Row) => (s(p.slug) === 'inicio' ? 'Inicio' : pageUrl(p))
