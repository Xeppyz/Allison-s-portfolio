import { Link } from 'react-router-dom'
import Seo, { DEFAULT_DESCRIPTION } from '../components/Seo'
import { useStrings } from '../lib/strings'

export default function NotFound() {
  const { t } = useStrings()
  return (
    <main>
      <Seo title="Página no encontrada | Allison Silva Taxes & Accounting" description={DEFAULT_DESCRIPTION} noindex />
      <section className="bg-ivory px-4 py-20 text-center sm:px-6 lg:py-28">
        <div className="mx-auto max-w-2xl space-y-6">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h1 className="text-4xl font-medium leading-tight text-navy lg:text-6xl">{t.noEncontrada}</h1>
          <p className="text-lg text-navy/70">{t.noEncontradaTexto}</p>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-7 py-3 font-semibold text-white transition hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            {t.volverInicio}
          </Link>
        </div>
      </section>
    </main>
  )
}
