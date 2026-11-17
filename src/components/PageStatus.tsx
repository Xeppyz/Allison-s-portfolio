import Seo, { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from './Seo'

export function PageLoading() {
  return (
    <main aria-busy="true" className="mx-auto max-w-4xl animate-pulse space-y-6 px-4 py-20 sm:px-6">
      <Seo title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} />
      <h1 className="sr-only">Cargando…</h1>
      <div className="h-10 w-3/4 rounded bg-gray-200" />
      <div className="h-5 w-full rounded bg-gray-200" />
      <div className="h-5 w-5/6 rounded bg-gray-200" />
      <div className="h-40 w-full rounded bg-gray-200" />
    </main>
  )
}

export function PageError() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-20 text-center sm:px-6">
      <Seo title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} />
      <h1 className="text-3xl font-bold text-[#1E3A5F]">Allison Silva Taxes & Accounting</h1>
      <p className="text-[#1E3A5F]/80">
        No pudimos cargar esta página. Escríbenos a{' '}
        <a href="mailto:info@allisonsilvacorp.com" className="font-semibold text-[#4285F4] underline">
          info@allisonsilvacorp.com
        </a>{' '}
        o llama al{' '}
        <a href="tel:+50587673463" className="font-semibold text-[#4285F4] underline">
          +505 8767-3463
        </a>
        .
      </p>
    </main>
  )
}
