// Utilidades de HTML puras (servidor, cliente y node:test).

// Lista blanca: solo lo que produce el editor del panel.
const ALLOWED = new Set([
  'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'img', 'blockquote', 'hr', 'br',
  'figure', 'figcaption', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
])
const VOID = new Set(['img', 'hr', 'br'])
const ATTRS: Record<string, string[]> = { a: ['href'], img: ['src', 'alt'] }
// Estas se eliminan con todo su contenido.
const DROP_WITH_CONTENT = new Set(['script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template', 'textarea', 'title', 'svg', 'math', 'select'])

const NAMED: Record<string, string> = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", colon: ':', tab: '\t', newline: '\n' }

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);?/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ''
    }
    return NAMED[e.toLowerCase()] ?? m
  })
}

const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** URL segura: http(s), mailto, tel, #ancla o ruta interna. null si no. */
function safeUrl(raw: string): string | null {
  // eslint-disable-next-line no-control-regex
  const v = decodeEntities(raw).replace(/[\u0000- \u007f-\u009f]/g, '')
  if (/^(https?:|mailto:|tel:)/i.test(v) || v.startsWith('#') || (v.startsWith('/') && !v.startsWith('//'))) return v
  if (v && /^[^:/?#]+(?:[/?#]|$)/.test(v) && !v.includes(':')) return v // relativa sin esquema (img.webp)
  return null
}

/** Deja solo etiquetas y atributos de la lista blanca. Defensa en profundidad: el contenido lo escriben admins. */
export function cleanHtml(html: string): string {
  const src = String(html ?? '')
  const token = /<!--[\s\S]*?(?:-->|$)|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|<|[^<]+/g
  let out = ''
  let skip: string | null = null
  for (const m of src.matchAll(token)) {
    const [whole, close, rawName, attrs] = m
    const name = rawName?.toLowerCase()
    if (skip) {
      if (close && name === skip) skip = null
      continue
    }
    if (whole.startsWith('<!--')) continue
    if (whole === '<') { out += '&lt;'; continue }
    if (!name) { out += whole.replace(/>/g, '&gt;'); continue }
    if (DROP_WITH_CONTENT.has(name)) { if (!close && !/\/\s*$/.test(attrs)) skip = name; continue }
    if (!ALLOWED.has(name)) continue
    if (close) { if (!VOID.has(name)) out += `</${name}>`; continue }
    let kept = ''
    for (const a of attrs.matchAll(/([^\s"'=<>/]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)) {
      const attr = a[1].toLowerCase()
      if (!ATTRS[name]?.includes(attr)) continue
      const value = a[3] ?? a[4] ?? a[5] ?? ''
      if (attr === 'href' || attr === 'src') {
        const url = safeUrl(value)
        if (url !== null) kept += ` ${attr}="${escAttr(url)}"`
      } else kept += ` ${attr}="${escAttr(decodeEntities(value))}"`
    }
    out += `<${name}${kept}>`
  }
  return out
}

export function htmlToText(html: string): string {
  return decodeEntities(
    String(html ?? '')
      .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, ' ')
      .replace(/<\/(p|h[1-6]|li|blockquote|div)>/gi, '. ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(new RegExp(String.fromCharCode(160), 'g'), ' ')
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

/** "10 de febrero de 2024" a partir de YYYY-MM-DD. */
export function formatDate(d: string): string {
  const t = new Date(String(d).slice(0, 10) + 'T12:00:00Z')
  return Number.isNaN(t.getTime()) ? '' : t.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
