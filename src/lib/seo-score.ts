// Puntaje SEO en vivo para artículos y páginas. Puro: lo usan el panel y node:test.
import { htmlToText, wordCount } from './html.ts'

export type SeoStatus = 'good' | 'warn' | 'bad'
export type SeoCheck = { id: string; label: string; status: SeoStatus; hint: string; weight: number }
export type SeoInput = {
  kind: 'post' | 'page'
  title: string
  description: string
  slug: string
  keyword?: string | null
  html: string
  cover?: { url?: string | null; alt?: string | null } | null
}

/** Minúsculas y sin acentos, para comparar palabras clave. */
export function norm(s: string): string {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** "Cómo usar QuickBooks" → "como-usar-quickbooks". */
export function slugify(s: string): string {
  return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '')
}

const range =(n: number, good: [number, number], warn: [number, number]): SeoStatus =>
  n >= good[0] && n <= good[1] ? 'good' : n >= warn[0] && n <= warn[1] ? 'warn' : 'bad'

const has = (hay: string, needle: string) => norm(hay).includes(norm(needle))

export function scoreSeo(input: SeoInput): { score: number; checks: SeoCheck[] } {
  const checks: SeoCheck[] = []
  const add = (id: string, label: string, status: SeoStatus, hint: string, weight = 1) =>
    checks.push({ id, label, status, hint, weight })
  const isPost = input.kind === 'post'
  const title = (input.title ?? '').trim()
  const description = (input.description ?? '').trim()
  const html = input.html ?? ''
  const text = htmlToText(html)
  const words = wordCount(html)
  const keyword = (input.keyword ?? '').trim()

  add('title', `Título para Google: ${title.length} caracteres`, range(title.length, [30, 60], [20, 70]),
    'Lo ideal es entre 30 y 60 caracteres: más largo, Google lo corta.', 2)
  add('description', `Descripción: ${description.length} caracteres`, range(description.length, [120, 160], [70, 180]),
    'Lo ideal es entre 120 y 160 caracteres, con un motivo para hacer clic.', 2)

  const slug = input.slug ?? ''
  add('slug', 'Dirección corta y legible', slug && slug.length <= 60 ? 'good' : slug ? 'warn' : 'bad',
    'Usa pocas palabras separadas por guiones, sin fechas ni palabras vacías.')

  if (!keyword) {
    add('keyword', 'Palabra clave principal', 'bad', 'Define la búsqueda por la que quieres aparecer (por ejemplo: “QuickBooks”).', 3)
  } else {
    add('kw-title', 'Palabra clave en el título', has(title, keyword) ? 'good' : 'bad', 'Inclúyela, idealmente al principio.', 2)
    add('kw-description', 'Palabra clave en la descripción', has(description, keyword) ? 'good' : 'warn',
      'Google la resalta en negrita en los resultados.')
    add('kw-slug', 'Palabra clave en la dirección', has(slug.replace(/-/g, ' '), keyword.replace(/-/g, ' ')) ? 'good' : 'warn',
      'Ayuda a que la URL se entienda y se comparta mejor.')
    const firstP = htmlToText((html.match(/<p\b[^>]*>[\s\S]*?<\/p>/i) ?? [''])[0])
    add('kw-intro', 'Palabra clave en el primer párrafo', has(firstP, keyword) ? 'good' : 'warn',
      'Menciónala al inicio para dejar claro el tema.')
    const headings = (html.match(/<h[23]\b[^>]*>[\s\S]*?<\/h[23]>/gi) ?? []).map(htmlToText).join(' ')
    add('kw-heading', 'Palabra clave en un subtítulo', has(headings, keyword) ? 'good' : 'warn',
      'Úsala (o una variante) en al menos un subtítulo.')
    const hits = norm(text).split(norm(keyword)).length - 1
    const density = words ? (hits * keyword.split(/\s+/).length * 100) / words : 0
    add('kw-density', `Repetición de la palabra clave: ${hits} ${hits === 1 ? 'vez' : 'veces'}`,
      density >= 0.4 && density <= 3 ? 'good' : hits > 0 && density < 0.4 ? 'warn' : density > 3 ? 'warn' : 'bad',
      density > 3 ? 'Se repite demasiado; suena forzado.' : 'Úsala de forma natural un par de veces en el texto.')
  }

  if (isPost) {
    add('length', `Extensión: ${words} palabras`, words >= 600 ? 'good' : words >= 300 ? 'warn' : 'bad',
      'Los artículos de 600 palabras o más suelen posicionar mejor.', 3)
    add('headings', 'Subtítulos (H2) que ordenan el texto', /<h2\b/i.test(html) ? 'good' : 'bad',
      'Divide el artículo en secciones con subtítulos.')
    const internal = (html.match(/<a\b[^>]*href\s*=\s*["'](\/(?!\/)|https?:\/\/(www\.)?allisonsilvacorp\.com)/gi) ?? []).length
    add('links', 'Enlaces a tus servicios', internal > 0 ? 'good' : 'warn',
      'Enlaza a una página de servicio o a /planes para convertir lectores en clientes.')
  } else {
    add('length', `Extensión: ${words} palabras`, words >= 250 ? 'good' : 'warn', 'Más texto útil ayuda a Google a entender la página.')
  }

  const imgs = html.match(/<img\b[^>]*>/gi) ?? []
  const alts = imgs.map((t) => /\balt\s*=\s*["']\s*[^"'\s][^"']*["']/i.test(t))
  if (input.cover?.url) alts.push(!!input.cover.alt?.trim())
  add('images', imgs.length || input.cover?.url ? 'Imágenes con texto alternativo' : 'Imágenes',
    alts.length === 0 ? (isPost ? 'warn' : 'good') : alts.every(Boolean) ? 'good' : 'bad',
    alts.length === 0 ? 'Una imagen con texto alternativo hace el artículo más atractivo.' : 'Describe cada imagen: lo lee Google y quien usa lector de pantalla.')

  const sentences = text.split(/[.!?¿¡]+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 3)
  if (sentences.length >= 3) {
    const avg = sentences.reduce((n, s) => n + s.split(/\s+/).length, 0) / sentences.length
    add('readability', `Frases de ${Math.round(avg)} palabras en promedio`, avg <= 20 ? 'good' : avg <= 25 ? 'warn' : 'bad',
      'Frases cortas se leen mejor en el celular.')
  }

  const total = checks.reduce((n, c) => n + c.weight, 0)
  const points = checks.reduce((n, c) => n + c.weight * (c.status === 'good' ? 1 : c.status === 'warn' ? 0.5 : 0), 0)
  const score = Math.round((100 * points) / total)
  // Con algo en rojo no puede salir "muy bien".
  return { score: checks.some((c) => c.status === 'bad') ? Math.min(score, 79) : score, checks }
}

export function scoreTone(score: number): SeoStatus {
  return score >= 80 ? 'good' : score >= 50 ? 'warn' : 'bad'
}
