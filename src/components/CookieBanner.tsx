import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConsent, setConsent } from '../lib/track'

interface Props {
  onChange: (v: 'granted' | 'denied') => void
}

const buttonClass =
  'min-h-11 flex-1 rounded-full border-2 border-[#1E3A5F] px-6 py-2 text-sm font-semibold text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] focus-visible:ring-offset-2 sm:flex-none'

export default function CookieBanner({ onChange }: Props) {
  const [open, setOpen] = useState(() => getConsent() === null)

  useEffect(() => {
    const reopen = () => setOpen(true)
    window.addEventListener('cookie-preferences', reopen)
    return () => window.removeEventListener('cookie-preferences', reopen)
  }, [])

  if (!open) return null

  const choose = (v: 'granted' | 'denied') => {
    setConsent(v)
    onChange(v)
    setOpen(false)
  }

  return (
    <section
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Usamos cookies de analítica y publicidad para medir nuestras campañas. Más información en nuestra{' '}
          <Link to="/privacidad" className="underline text-[#1E3A5F]">
            política de privacidad
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <button type="button" className={buttonClass} onClick={() => choose('granted')}>
            Aceptar
          </button>
          <button type="button" className={buttonClass} onClick={() => choose('denied')}>
            Rechazar
          </button>
        </div>
      </div>
    </section>
  )
}
