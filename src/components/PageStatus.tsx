import Seo, { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from './Seo'
import { useStrings } from '../lib/strings'

const linkClass =
  'rounded font-semibold text-navy underline decoration-taupe underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2'

export function PageLoading() {
  const { t } = useStrings()
  return (
    <main aria-busy="true" className="mx-auto max-w-4xl animate-pulse space-y-6 px-4 py-20 sm:px-6">
      <Seo title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} />
      <h1 className="sr-only">{t.cargando}</h1>
      <div className="h-10 w-3/4 rounded-xl bg-sand" />
      <div className="h-5 w-full rounded-xl bg-sand" />
      <div className="h-5 w-5/6 rounded-xl bg-sand" />
      <div className="h-40 w-full rounded-2xl bg-sand" />
    </main>
  )
}

export function PageError() {
  const { t } = useStrings()
  return (
    <main>
      <Seo title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} />
      <section className="bg-ivory px-4 py-20 text-center sm:px-6 lg:py-28">
        <div className="mx-auto max-w-2xl space-y-6">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h1 className="text-3xl font-medium text-navy lg:text-5xl">Allison Silva Taxes & Accounting</h1>
          <p className="text-lg text-navy/70">
            {t.errorCarga} {t.errorContacto}{' '}
            <a href="mailto:info@allisonsilvacorp.com" className={linkClass}>
              info@allisonsilvacorp.com
            </a>{' '}
            {t.errorLlama}{' '}
            <a href="tel:+50587673463" className={linkClass}>
              +505 8767-3463
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
