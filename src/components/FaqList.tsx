import { useFaqs } from '../lib/content'
import { JsonLd } from './Seo'

export default function FaqList({ pageSlug }: { pageSlug: string }) {
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
    <section className="py-16">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-3xl font-bold text-[#1E3A5F]">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.id} className="group rounded-lg border bg-[#FBFCFF] p-4">
              <summary className="cursor-pointer font-semibold text-[#1E3A5F]">{f.question}</summary>
              <p className="mt-3 leading-relaxed text-[#1E3A5F]/80">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
