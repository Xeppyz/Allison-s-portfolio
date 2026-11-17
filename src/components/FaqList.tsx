import { useFaqs } from '../lib/content'
import { JsonLd } from './Seo'
import { useStrings } from '../lib/strings'

export default function FaqList({ pageSlug }: { pageSlug: string }) {
  const { t } = useStrings()
  const { data } = useFaqs(pageSlug)
  const faqs = (data ?? []).filter((f) => f.question && f.answer)
  if (faqs.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <section className="bg-white py-20 lg:py-24">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-12 space-y-5 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h2 className="text-3xl font-medium text-navy lg:text-5xl">{t.faq}</h2>
        </div>
        <div className="border-t border-navy/10">
          {faqs.map((f) => (
            <details key={f.id} className="group border-b border-navy/10">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded py-4 text-lg font-semibold text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                <span>{f.question}</span>
                <span aria-hidden="true" className="relative h-4 w-4 flex-shrink-0 text-taupe">
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition group-open:scale-y-0" />
                </span>
              </summary>
              <p className="pb-6 leading-relaxed text-navy/75">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
