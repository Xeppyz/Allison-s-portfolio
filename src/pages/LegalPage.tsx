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
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-16 sm:px-6">
      <Seo title={p.meta_title || DEFAULT_TITLE} description={p.meta_description || DEFAULT_DESCRIPTION} />
      <h1 className="text-3xl font-bold lg:text-4xl" style={{ color: '#1E3A5F' }}>{p.h1 || DEFAULT_TITLE}</h1>
      {blocks.map((b, i) =>
        b.startsWith('## ') ? (
          <h2 key={i} className="pt-4 text-2xl font-semibold" style={{ color: '#1E3A5F' }}>{b.slice(3)}</h2>
        ) : (
          <p key={i} className="whitespace-pre-line leading-relaxed" style={{ color: '#1E3A5F', opacity: 0.85 }}>{b}</p>
        ),
      )}
    </main>
  )
}
