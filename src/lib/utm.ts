import type { Utm } from './whatsapp.ts'

const KEY = 'utm'

export function getUtm(): Utm {
  try {
    const raw = sessionStorage.getItem(KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? (parsed as Utm) : {}
  } catch {
    return {}
  }
}

export function captureUtm(): void {
  try {
    if (sessionStorage.getItem(KEY)) return
    const utm: Utm = {}
    new URLSearchParams(location.search).forEach((value, name) => {
      if (name.startsWith('utm_')) utm[name] = value
    })
    if (Object.keys(utm).length) sessionStorage.setItem(KEY, JSON.stringify(utm))
  } catch {
    // sessionStorage no disponible (modo privado): se ignora
  }
}
