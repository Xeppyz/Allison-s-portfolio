import { Link, useLocation, useParams } from 'react-router-dom'
import Seo, { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../components/Seo'
import WhatsAppButton from '../components/WhatsAppButton'
import PlanCards from '../components/PlanCards'
import FaqList from '../components/FaqList'
import { PageError, PageLoading } from '../components/PageStatus'
import NotFound from './NotFound'
import { usePage, useTestimonials } from '../lib/content'
import { isBonusActive, parseLocalDate } from '../lib/bonus'
import { track } from '../lib/track'
import { pagePath, useStrings } from '../lib/strings'

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
  // La página enlazada solo cuenta para hreflang si se lee (publicada), es indexable y es del otro idioma.
  const alt = usePage(page.data?.alt_slug ?? '').data
  const { pathname } = useLocation()
  const { t } = useStrings()

  if (page.loading) return <PageLoading />
  if (page.error) return <PageError />
  const p = page.data
  if (!p || p.kind !== 'service') return <NotFound />
  const lang = p.lang === 'en' ? 'en' : 'es'
  const other = lang === 'en' ? 'es' : 'en'
  // Cada página solo existe en la ruta de su idioma
  if (pathname.replace(/\/+$/, '') !== pagePath(p.slug, lang)) return <NotFound />

  const altOk = Boolean(alt) && !alt?.noindex && (alt?.lang === 'en' ? 'en' : 'es') === other
  const benefits = toBenefits(p.benefits)
  const testimonial = lang === 'en' ? undefined : testimonials.data?.[0]
  const deadline = parseLocalDate(p.bonus_deadline)
  const showBonus = Boolean(p.bonus_text) && deadline !== null && isBonusActive(p.bonus_deadline)

  return (
    <main>
      {p.active === false && (
        <div role="status" className="bg-sand py-2 text-center text-sm text-navy">{t.borrador}</div>
      )}
      <Seo
        title={p.meta_title || DEFAULT_TITLE}
        description={p.meta_description || DEFAULT_DESCRIPTION}
        lang={lang}
        noindex={p.noindex}
        image={p.og_image_url || undefined}
        alternates={altOk && p.alt_slug ? { [lang]: pagePath(p.slug, lang), [other]: pagePath(p.alt_slug, other) } : undefined}
      />

      <section className="bg-ivory px-4 py-20 text-center sm:px-6 lg:py-28">
        <div className="hero-in mx-auto max-w-3xl space-y-7">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h1 className="text-4xl font-medium leading-tight text-navy lg:text-6xl">{p.h1 || DEFAULT_TITLE}</h1>
          {p.subheadline && <p className="text-lg text-navy/70 lg:text-xl">{p.subheadline}</p>}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton label={t.diagnosticoWa} />
            {slug !== 'planes' && (
              <Link
                to="/planes"
                onClick={() => track('ver_planes_click')}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-7 py-3 font-semibold text-white transition hover:bg-navy-deep"
              >
                {t.verPlanesPrecios}
              </Link>
            )}
          </div>
        </div>
      </section>

      {benefits.length > 0 && (
        <section className="px-4 py-16 sm:px-6">
          <ol className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
            {benefits.map((b, i) => (
              <li key={i} className="border-t border-navy/15 pt-6">
                <span className="font-serif text-3xl text-taupe-deep" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 text-lg font-semibold text-navy">{b.title}</p>
                {b.text && <p className="mt-1 text-navy/75">{b.text}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {testimonial && (
        <section className="px-4 py-16 sm:px-6">
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="text-xl italic text-navy">“{testimonial.quote}”</blockquote>
            <figcaption className="mt-4 text-navy/80">
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
          <div className="mx-auto max-w-3xl rounded-2xl border border-taupe/50 bg-ivory p-6">
            <p className="text-lg font-semibold text-navy">{p.bonus_text}</p>
            <p className="mt-2 text-sm text-navy/70">
              {t.validoHasta} {deadline.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-NI', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </section>
      )}

      {p.guarantee && (
        <section className="px-4 py-12 text-center sm:px-6">
          <p className="mx-auto max-w-3xl text-lg font-semibold text-navy">{p.guarantee}</p>
        </section>
      )}

      <FaqList pageSlug={slug} />

      {p.legal_note && (
        <section className="px-4 pb-16 sm:px-6">
          <aside aria-label={t.avisoLegal} className="mx-auto max-w-3xl whitespace-pre-line border-t border-navy/10 pt-6 text-xs leading-relaxed text-navy/75">
            {p.legal_note}
          </aside>
        </section>
      )}
    </main>
  )
}
