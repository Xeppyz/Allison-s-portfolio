import { Link, useParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Seo, { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../components/Seo'
import WhatsAppButton from '../components/WhatsAppButton'
import PlanCards from '../components/PlanCards'
import FaqList from '../components/FaqList'
import { PageError, PageLoading } from '../components/PageStatus'
import NotFound from './NotFound'
import { usePage, useTestimonials } from '../lib/content'
import { isBonusActive, parseLocalDate } from '../lib/bonus'
import { track } from '../lib/track'

interface Benefit { title: string; text?: string }

// benefits es jsonb: se conservan solo los elementos con título de texto.
function toBenefits(raw: unknown): Benefit[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((b): Benefit[] => {
    if (!b || typeof b !== 'object') return []
    const { title, text } = b as Record<string, unknown>
    if (typeof title !== 'string' || !title) return []
    return [{ title, text: typeof text === 'string' && text ? text : undefined }]
  })
}

export default function ServicePage({ slug: slugProp }: { slug?: string }) {
  const params = useParams()
  const slug = slugProp ?? params.slug ?? ''
  const page = usePage(slug)
  const testimonials = useTestimonials()

  if (page.loading) return <PageLoading />
  if (page.error) return <PageError />
  const p = page.data
  if (!p || p.kind !== 'service') return <NotFound />

  const benefits = toBenefits(p.benefits)
  const testimonial = testimonials.data?.[0]
  const deadline = parseLocalDate(p.bonus_deadline)
  const showBonus = Boolean(p.bonus_text) && deadline !== null && isBonusActive(p.bonus_deadline)

  return (
    <main>
      <Seo title={p.meta_title || DEFAULT_TITLE} description={p.meta_description || DEFAULT_DESCRIPTION} />

      <section className="px-4 py-16 text-center sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold lg:text-5xl" style={{ color: '#1E3A5F' }}>{p.h1 || DEFAULT_TITLE}</h1>
          {p.subheadline && <p className="text-xl" style={{ color: '#1E3A5F', opacity: 0.8 }}>{p.subheadline}</p>}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WhatsAppButton label="Diagnóstico gratis por WhatsApp" />
            {slug !== 'planes' && (
              <Link
                to="/planes"
                onClick={() => track('ver_planes_click')}
                className="inline-flex items-center justify-center rounded-full border border-[#4285F4] px-5 py-3 font-semibold text-[#4285F4] hover:bg-[#4285F4]/10"
              >
                Ver planes
              </Link>
            )}
          </div>
        </div>
      </section>

      {benefits.length > 0 && (
        <section className="px-4 py-12 sm:px-6" style={{ backgroundColor: '#F7F7F7' }}>
          <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg p-4" style={{ backgroundColor: '#FBFCFF' }}>
                <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0" style={{ color: '#34A853' }} aria-hidden="true" />
                <div>
                  <p className="font-bold" style={{ color: '#1E3A5F' }}>{b.title}</p>
                  {b.text && <p className="mt-1" style={{ color: '#1E3A5F', opacity: 0.8 }}>{b.text}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {testimonial && (
        <section className="px-4 py-16 sm:px-6">
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="text-xl italic" style={{ color: '#1E3A5F' }}>“{testimonial.quote}”</blockquote>
            <figcaption className="mt-4" style={{ color: '#1E3A5F', opacity: 0.8 }}>
              <span className="font-semibold">{testimonial.name}</span>
              {[testimonial.position, testimonial.company].filter(Boolean).map((x) => (
                <span key={x}>{' · '}{x}</span>
              ))}
            </figcaption>
          </figure>
        </section>
      )}

      <PlanCards pageSlug={slug} />

      {showBonus && deadline && (
        <section className="px-4 py-12 text-center sm:px-6">
          <div className="mx-auto max-w-3xl rounded-lg border border-[#4285F4] p-6" style={{ backgroundColor: '#FBFCFF' }}>
            <p className="text-lg font-semibold" style={{ color: '#1E3A5F' }}>{p.bonus_text}</p>
            <p className="mt-2 text-sm" style={{ color: '#1E3A5F', opacity: 0.7 }}>
              Válido hasta el {deadline.toLocaleDateString('es-NI', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </section>
      )}

      {p.guarantee && (
        <section className="px-4 py-12 text-center sm:px-6">
          <p className="mx-auto max-w-3xl text-lg font-semibold" style={{ color: '#1E3A5F' }}>{p.guarantee}</p>
        </section>
      )}

      <FaqList pageSlug={slug} />
    </main>
  )
}
