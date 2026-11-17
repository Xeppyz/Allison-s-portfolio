import { useLocation } from 'react-router-dom'
import Seo, { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../components/Seo'
import { PageError, PageLoading } from '../components/PageStatus'
import NotFound from './NotFound'
import { usePage } from '../lib/content'

export default function LegalPage() {
  const { pathname } = useLocation()
  const slug = pathname.split('/').filter(Boolean)[0] ?? ''
  const page = usePage(slug)

  if (page.loading) return <PageLoading />
  if (page.error) return <PageError />
  const p = page.data
  if (!p) return <NotFound />

  const blocks = (p.body ?? '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)

  return (
    <main>
      <Seo title={p.meta_title || DEFAULT_TITLE} description={p.meta_description || DEFAULT_DESCRIPTION} />
      <section className="bg-ivory px-4 py-20 text-center sm:px-6 lg:py-24">
        <div className="hero-in mx-auto max-w-3xl space-y-6">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h1 className="text-4xl font-medium leading-tight text-navy lg:text-5xl">{p.h1 || DEFAULT_TITLE}</h1>
        </div>
      </section>
      <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-5">
          {blocks.map((b, i) =>
            b.startsWith('## ') ? (
              <h2 key={i} className="pt-8 text-2xl font-medium text-navy lg:text-3xl">{b.slice(3)}</h2>
            ) : (
              <p key={i} className="whitespace-pre-line text-lg leading-8 text-navy/75">{b}</p>
            ),
          )}
        </div>
      </section>
    </main>
  )
}
