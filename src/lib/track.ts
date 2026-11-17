export type TrackEvent = 'whatsapp_click' | 'form_submit' | 'ver_planes_click' | 'phone_click'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: TrackEvent, params: Record<string, string> = {}): void {
  const layer = (window.dataLayer ??= [])
  layer.push({ event, ...params })
}

const GTM_ID = /^GTM-[A-Z0-9]{4,12}$/

export function isValidGtmId(id: string): boolean {
  return GTM_ID.test(id)
}

export type Consent = 'granted' | 'denied'

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem('consent')
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

export function setConsent(v: Consent): void {
  try {
    localStorage.setItem('consent', v)
  } catch {
    // modo privado: la elección solo vale para esta visita
  }
}

let gtmLoaded = false

export function loadGtm(id: string): void {
  if (!isValidGtmId(id) || gtmLoaded) return
  if (document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
    gtmLoaded = true
    return
  }
  gtmLoaded = true
  const layer = (window.dataLayer ??= [])
  layer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
}
