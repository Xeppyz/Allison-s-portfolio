export type Utm = Record<string, string>

const clean = (s: string | undefined) => (s ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '')

export function campaignCode(utm: Utm): string {
  const source = clean(utm.utm_source).slice(0, 1)
  const campaign = clean(utm.utm_campaign)
  return source && campaign ? `[${source}-${campaign}]` : ''
}

export function buildWhatsAppUrl(number: string, message: string, utm: Utm): string | null {
  const digits = number.replace(/\D/g, '')
  if (!digits) return null
  const code = campaignCode(utm)
  const text = code ? `${message} ${code}` : message
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}
