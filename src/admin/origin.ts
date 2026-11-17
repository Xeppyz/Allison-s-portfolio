import type { Utm } from '../lib/whatsapp'

/** De dónde vino un contacto, según los parámetros guardados al llegar. */
export function leadOrigin(utm: Utm | null | undefined): string {
  const u = utm ?? {}
  if (u.gclid || u.gbraid || u.wbraid) return 'Google Ads'
  if (u.fbclid) return 'Meta Ads'
  if (u.msclkid) return 'Microsoft Ads'
  if (u.utm_source) return `Campaña · ${u.utm_source}`
  return 'Directo u orgánico'
}
