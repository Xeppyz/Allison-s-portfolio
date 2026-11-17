import { useEffect, useMemo, useRef, useState } from "react"
import { Calendar, ArrowLeft, Clock, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { getAllPosts, type BlogPost } from "../data/BlogPost"

import placeHolder from "../assets/img/placeholder.png"
import documentCalendar from "../assets/img/tax-documents-calendar.webp"
import accountingDocument from "../assets/img/accounting-software-screen.webp"
import avatar from "../assets/img/avatar.jpg"

const imageMap: Record<string, { src: string; width: number; height: number }> = {
  placeholder: { src: placeHolder, width: 1200, height: 675 },
  calendar: { src: documentCalendar, width: 1200, height: 798 },
  accounting: { src: accountingDocument, width: 1200, height: 899 },
}

type HeadingItem = { id: string; text: string; level: number }

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function estimateReadingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ")
  const words = (text.match(/\S+/g) || []).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return minutes
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
const secondaryBtn = `inline-flex min-h-12 items-center justify-center rounded-full border border-navy/25 px-5 py-3 font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white ${ring}`
const primaryBtn = `inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-7 py-3 font-semibold text-white transition hover:bg-navy-deep ${ring}`
const cardLink = `group block rounded-2xl border border-navy/10 bg-white p-5 transition hover:-translate-y-px hover:border-taupe/60 ${ring}`

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const locale = "es-ES"
  const title = post.title
  const contentHtml = post.contentHtml
  const excerpt = post.excerpt
  const img = imageMap[post.imageKey] ?? { src: "/placeholder.svg", width: 1200, height: 675 }
  const readMin = estimateReadingTime(contentHtml)

  const containerRef = useRef<HTMLDivElement>(null)
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const location = useLocation()

  // Genera IDs en h2/h3 y construye TOC
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const hs = Array.from(el.querySelectorAll<HTMLElement>("h2, h3"))
    const seen = new Map<string, number>()
    const collected: HeadingItem[] = []

    hs.forEach((h) => {
      const base = slugify(h.textContent || "")
      const count = seen.get(base) || 0
      const id = count ? `${base}-${count}` : base
      seen.set(base, count + 1)
      h.id = id
      collected.push({ id, text: h.textContent || "", level: h.tagName === "H2" ? 2 : 3 })
    })
    setHeadings(collected)
  }, [contentHtml])

  // Scroll to top on mount or location change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])
  // Ordena posts por fecha para prev/next
  const { prev, next, related } = useMemo(() => {
    const all = getAllPosts().slice().sort((a, b) => (a.date < b.date ? 1 : -1))
    const idx = all.findIndex((p) => p.slug === post.slug)
    const prev = idx > 0 ? all[idx - 1] : undefined
    const next = idx < all.length - 1 ? all[idx + 1] : undefined
    const related = all.filter((p) => p.slug !== post.slug).slice(0, 2)
    return { prev, next, related }
  }, [post.slug])

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://example.com${location.pathname}`
  const shareText = `${title} — ${excerpt}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl })
      } catch {
        // Ignorar si el usuario cancela
      }
    } else {
      // Fallback: copiar enlace
      try {
        await navigator.clipboard.writeText(shareUrl)
        alert("Enlace copiado al portapapeles")
      } catch {
        window.open(shareUrl, "_blank")
      }
    }
  }

  return (
    <main>
      <article>
        {/* Cabecera */}
        <header className="bg-ivory px-4 py-16 sm:px-6 lg:py-24">
          <div className="hero-in mx-auto max-w-3xl space-y-6 text-center">
            <nav aria-label="Migas de pan" className="text-sm text-navy/60">
              <Link to="/" className={`rounded hover:text-navy ${ring}`}>Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link to="/blog" className={`rounded hover:text-navy ${ring}`}>Blog</Link>
            </nav>
            <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
            <h1 className="text-3xl font-medium leading-tight text-navy sm:text-4xl lg:text-5xl">{title}</h1>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-navy/70">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-taupe" aria-hidden="true" />
                {new Date(post.date).toLocaleDateString(locale)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-taupe" aria-hidden="true" />
                {`${readMin} min de lectura`}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-2">
                {post.tags.map((t) => (
                  <li key={t} className="rounded-full border border-navy/15 px-3 py-1.5 text-sm text-navy/80">{t}</li>
                ))}
              </ul>
            )}
          </div>
        </header>

        {/* Contenido + índice */}
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-3xl">
            <img
              src={img.src}
              width={img.width}
              height={img.height}
              alt={title}
              loading="lazy"
              decoding="async"
              className="mb-10 h-auto w-full rounded-2xl border border-navy/10"
            />

            <div className="mb-8 flex items-center justify-between gap-4">
              <Link to="/blog" className={`inline-flex min-h-11 items-center rounded font-semibold text-[#4285F4] hover:underline ${ring}`}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Volver al blog
              </Link>
              <button type="button" onClick={handleShare} className={secondaryBtn}>
                <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Compartir
              </button>
            </div>

            {/* Cuerpo del artículo */}
            <div ref={containerRef} className="article-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

            {/* Autora */}
            <div className="mt-12 flex items-center gap-4 border-y border-navy/10 py-6 sm:gap-6">
              <img
                src={avatar}
                alt="Allison Silva, CPA"
                width={64}
                height={64}
                className="h-14 w-14 flex-shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="font-serif text-lg text-navy">Allison Silva, CPA</p>
                <p className="text-sm text-navy/70">
                  {"Fundadora y Directora de Allison Silva Taxes & Accounting. Asesoría en contabilidad, cumplimiento tributario y finanzas."}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-medium text-navy">¿Necesitas ayuda con este tema?</h2>
                <p className="mt-1 text-navy/70">Agenda una consulta y obtén asesoría personalizada.</p>
              </div>
              <Link to="/contacto" className={primaryBtn}>
                Contactar
              </Link>
            </div>

            {/* Prev / Next */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link to={`/blog/${prev.slug}`} className={cardLink}>
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    Artículo anterior
                  </div>
                  <div className="line-clamp-2 font-serif text-lg text-navy">{prev.title}</div>
                </Link>
              ) : <div className="hidden sm:block" />}
              {next && (
                <Link to={`/blog/${next.slug}`} className={`${cardLink} text-right`}>
                  <div className="mb-1 flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">
                    Siguiente artículo
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="line-clamp-2 font-serif text-lg text-navy">{next.title}</div>
                </Link>
              )}
            </div>

            {/* Relacionados */}
            {related.length > 0 && (
              <>
                <h2 className="mb-5 mt-14 text-2xl font-medium text-navy">Artículos relacionados</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link key={r.slug} to={`/blog/${r.slug}`} className={cardLink}>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">
                        {new Date(r.date).toLocaleDateString(locale)}
                      </div>
                      <div className="line-clamp-2 font-serif text-lg text-navy">{r.title}</div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Índice */}
          <aside>
            <div className="border-t border-navy/10 pt-6 lg:sticky lg:top-24 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">Contenido</p>
              {headings.length === 0 ? (
                <p className="text-sm text-navy/60">Este artículo no tiene secciones</p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
                      <a href={`#${h.id}`} className={`inline-flex min-h-9 items-center rounded text-navy/75 hover:text-navy ${ring}`}>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </article>
    </main>
  )
}
