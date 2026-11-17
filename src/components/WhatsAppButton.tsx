import { useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { usePage, useSettings } from '../lib/content'
import { getUtm } from '../lib/utm'
import { track } from '../lib/track'
import { buildWhatsAppUrl } from '../lib/whatsapp'

interface Props {
  floating?: boolean
  label?: string
  message?: string
}

export default function WhatsAppButton({ floating = false, label, message }: Props) {
  const { pathname } = useLocation()
  const slug = pathname.split('/').filter(Boolean)[0] ?? 'inicio'
  const settings = useSettings()
  const page = usePage(slug)
  const home = usePage('inicio')

  const number = settings.data?.whatsapp_number
  if (settings.loading || settings.error || !number) return null

  const text = message || page.data?.wa_message || home.data?.wa_message || ''
  const href = buildWhatsAppUrl(number, text, getUtm())
  if (!href) return null

  const onClick = () => track('whatsapp_click', { page: pathname })

  if (floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        aria-label="Escribir por WhatsApp"
        onClick={onClick}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      {label ?? 'Escribir por WhatsApp'}
    </a>
  )
}
