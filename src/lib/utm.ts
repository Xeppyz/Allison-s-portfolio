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

/** Los utm_* del primer contacto se conservan; los identificadores de clic siempre se actualizan. */
export function mergeCampaignParams(
  stored: Record<string, string>,
  incoming: Record<string, string>,
): Record<string, string> {
  const hasUtm = Object.keys(stored).some((k) => k.startsWith('utm_'))
  const out = { ...stored }
  for (const [name, value] of Object.entries(incoming)) {
    if (CLICK_IDS.includes(name) || (!hasUtm && name.startsWith('utm_'))) out[name] = value
  }
  return out
}

export function captureUtm(): void {
  try {
    const incoming = pickCampaignParams(location.search)
    if (Object.keys(incoming).length === 0) return
    sessionStorage.setItem(KEY, JSON.stringify(mergeCampaignParams(getUtm() as Record<string, string>, incoming)))
  } catch {
    // sessionStorage no disponible (modo privado): se ignora
  }
}
