import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConsent, setConsent } from '../lib/track'
import { useStrings } from '../lib/strings'

interface Props {
  onChange: (v: 'granted' | 'denied') => void
}

const buttonClass =
  'min-h-12 flex-1 rounded-full border border-navy px-6 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 sm:flex-none'

export default function CookieBanner({ onChange }: Props) {
  const { t } = useStrings()
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
      aria-label={t.avisoCookies}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white p-4"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy/75">
          {t.cookiesTexto}{' '}
          <Link to="/privacidad" className="rounded text-[#4285F4] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]">
            {t.cookiesPolitica}
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <button type="button" className={buttonClass} onClick={() => choose('granted')}>
            {t.aceptar}
          </button>
          <button type="button" className={buttonClass} onClick={() => choose('denied')}>
            {t.rechazar}
          </button>
        </div>
      </div>
    </section>
  )
}
