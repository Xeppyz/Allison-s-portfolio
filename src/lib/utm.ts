import type { Utm } from './whatsapp.ts'

const KEY = 'utm'
const CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid']

export function getUtm(): Utm {
  try {
    const raw = sessionStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? (parsed as Utm) : {}
  } catch {
    return {}
  }
}

/** Parámetros de campaña de una query string: utm_* e identificadores de clic, cada valor hasta 200 caracteres. */
export function pickCampaignParams(search: string): Record<string, string> {
  const out: Record<string, string> = {}
  new URLSearchParams(search).forEach((value, name) => {
    if (name.startsWith('utm_') || CLICK_IDS.includes(name)) out[name] = value.slice(0, 200)
  })
  return out
}

export function captureUtm(): void {
  try {
    if (sessionStorage.getItem(KEY)) return
    const utm = pickCampaignParams(location.search)
    if (Object.keys(utm).length) sessionStorage.setItem(KEY, JSON.stringify(utm))
  } catch {
    // sessionStorage no disponible (modo privado): se ignora
  }
}
