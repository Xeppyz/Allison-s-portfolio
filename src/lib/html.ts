// Utilidades de HTML puras (servidor, cliente y node:test).

const BLOCKED = 'script|style|iframe|object|embed|noscript|template|form|input|button|textarea|select|link|meta|base'

/** Quita lo peligroso del HTML de un artículo. El contenido lo escriben admins; esto es defensa en profundidad. */
export function cleanHtml(html: string): string {
  return String(html ?? '')
    .replace(new RegExp(`<(${BLOCKED})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, 'gi'), '')
    .replace(new RegExp(`<\\/?(${BLOCKED})\\b[^>]*>`, 'gi'), '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+(href|src|srcset|xlink:href)\s*=\s*("\s*(?:javascript|vbscript|data):[^"]*"|'\s*(?:javascript|vbscript|data):[^']*'|(?:javascript|vbscript|data):[^\s>]*)/gi, '')
}

const ENTITIES: Record<string, string> = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" }

export function htmlToText(html: string): string {
  return String(html ?? '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<\/(p|h[1-6]|li|blockquote|div)>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(nbsp|amp|lt|gt|quot|#39|apos);/g, (_m, e: string) => ENTITIES[e])
    .replace(/(\.\s*){2,}/g, '. ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function wordCount(html: string): number {
  return (htmlToText(html).match(/[\p{L}\p{N}]+/gu) ?? []).length
}

export function readingMinutes(html: string): number {
  return Math.max(1, Math.ceil(wordCount(html) / 200))
}
