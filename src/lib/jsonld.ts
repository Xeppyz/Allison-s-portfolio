// Serializa JSON-LD para incrustarlo en <script>: escapa "<" para que ningún
// texto (p. ej. "</script>") pueda cerrar la etiqueta.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
