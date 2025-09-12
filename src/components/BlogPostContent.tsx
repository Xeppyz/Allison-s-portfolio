import { useEffect, useMemo, useRef, useState } from "react"
import { useLanguage } from "./language-context"
import { Calendar, ArrowLeft, Clock, Share2, ChevronLeft, ChevronRight, Tag } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { getAllPosts, type BlogPost } from "../data/BlogPost"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

import placeHolder from "../assets/img/placeholder.png"
import documentCalendar from "../assets/img/tax-documents-calendar.png"
import accountingDocument from "../assets/img/accounting-software-screen.png"
import avatar from "../assets/img/avatar.jpg"

const imageMap: Record<string, string> = {
  placeholder: placeHolder,
  calendar: documentCalendar,
  accounting: accountingDocument,
}

type HeadingItem = { id: string; text: string; level: number }

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const { language } = useLanguage()
  const locale = language === "es" ? "es-ES" : "en-US"
  const title = post.title[language === "es" ? "es" : "en"]
  const contentHtml = post.contentHtml[language === "es" ? "es" : "en"]
  const excerpt = post.excerpt[language === "es" ? "es" : "en"]
  const imgSrc = imageMap[post.imageKey] || "/placeholder.svg"
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
  }, [contentHtml, language])

   // Scroll to top on mount or location change
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
        alert(language === "es" ? "Enlace copiado al portapapeles" : "Link copied to clipboard")
      } catch {
        window.open(shareUrl, "_blank")
      }
    }
  }

  return (
    <article className="bg-white">
      {/* Breadcrumb simple */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-gray-500 mb-3">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-gray-700">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{title}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={imgSrc}
            alt={title}
            loading="eager"
            decoding="async"
            className="w-full h-[260px] sm:h-[360px] lg:h-[440px] object-cover block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold drop-shadow">
              {title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-white/95">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString(locale)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {language === "es" ? `${readMin} min de lectura` : `${readMin} min read`}
              </span>
              {post.tags && post.tags.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className="bg-white/25 backdrop-blur px-2 py-0.5 rounded text-xs">{t}</span>
                    ))}
                    {post.tags.length > 2 && <span className="bg-white/25 px-2 py-0.5 rounded text-xs">+{post.tags.length - 2}</span>}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contenido + Sidebar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-8">
          {/* Acciones superiores */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/blog" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "es" ? "Volver al blog" : "Back to blog"}
            </Link>

            <Button onClick={handleShare} className="bg-gray-900 hover:bg-black text-white">
              <Share2 className="h-4 w-4 mr-2" />
              {language === "es" ? "Compartir" : "Share"}
            </Button>
          </div>

          {/* Chips de etiquetas (completas) */}
          {post.tags && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="px-3 py-1 text-xs font-medium whitespace-normal break-words"
                  style={{ backgroundColor: "#34A853", color: "white", border: "none" }}
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}

          {/* Cuerpo del artículo */}
          <div ref={containerRef} className="article-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {/* Divider */}
          <hr className="my-10 border-gray-200" />

          {/* Autora */}
          <Card className="border-0 shadow-md mb-8" style={{ backgroundColor: "#FBFCFF" }}>
            <CardContent className="p-6 flex gap-4 sm:gap-6">
              <img
                src={avatar}
                alt="Allison Silva, CPA"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2"
                style={{ borderColor: "#4285F4" }}
                loading="lazy"
                decoding="async"
              />
              <div>
                <h5 className="text-lg font-bold" style={{ color: "#1E3A5F" }}>Allison Silva, CPA</h5>
                <p className="text-sm text-gray-600">
                  {language === "es"
                    ? "Fundadora y Directora de Allison Silva Taxes & Accounting. Asesoría en contabilidad, cumplimiento tributario y finanzas."
                    : "Founder & Director at Allison Silva Taxes & Accounting. Advisory in accounting, tax compliance, and finance."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-0 shadow-md" style={{ backgroundColor: "#FBFCFF" }}>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold mb-1" style={{ color: "#1E3A5F" }}>
                    {language === "es" ? "¿Necesitas ayuda con este tema?" : "Need help with this topic?"}
                  </h4>
                  <p className="text-gray-700">
                    {language === "es"
                      ? "Agenda una consulta y obtén asesoría personalizada."
                      : "Book a consultation and get personalized advice."}
                  </p>
                </div>
                <a href="/#contact">
                  <Button className="text-white" style={{ backgroundColor: "#34A853" }}>
                    {language === "es" ? "Contactar" : "Contact"}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Prev / Next */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link to={`/blog/${prev.slug}`} className="group block rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  {language === "es" ? "Artículo anterior" : "Previous"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-gray-700 line-clamp-2">
                  {prev.title[language === "es" ? "es" : "en"]}
                </div>
              </Link>
            ) : <div className="hidden sm:block" />}
            {next && (
              <Link to={`/blog/${next.slug}`} className="group block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-right">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-2 justify-end">
                  {language === "es" ? "Siguiente artículo" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-gray-700 line-clamp-2">
                  {next.title[language === "es" ? "es" : "en"]}
                </div>
              </Link>
            )}
          </div>

          {/* Relacionados */}
          {related.length > 0 && (
            <>
              <h4 className="mt-12 mb-4 text-xl font-bold" style={{ color: "#1E3A5F" }}>
                {language === "es" ? "Artículos relacionados" : "Related articles"}
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} to={`/blog/${r.slug}`} className="rounded-lg border border-gray-200 hover:bg-gray-50 p-4">
                    <div className="text-sm text-gray-500 mb-1">
                      {new Date(r.date).toLocaleDateString(locale)}
                    </div>
                    <div className="font-semibold text-gray-900 line-clamp-2">
                      {r.title[language === "es" ? "es" : "en"]}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <Card className="border-0 shadow-md sticky top-24" style={{ backgroundColor: "#FBFCFF" }}>
            <CardContent className="p-6">
              <h5 className="text-base font-bold mb-3" style={{ color: "#1E3A5F" }}>
                {language === "es" ? "Contenido" : "Contents"}
              </h5>
              {headings.length === 0 ? (
                <p className="text-sm text-gray-600">
                  {language === "es" ? "Este artículo no tiene secciones" : "This article has no sections"}
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
                      <a
                        href={`#${h.id}`}
                        className="text-gray-700 hover:text-green-700"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6">
                <Button onClick={handleShare} variant="secondary" className="w-full bg-green-600 text-white hover:bg-green-700">
                  <Share2 className="h-4 w-4 mr-2" />
                  {language === "es" ? "Compartir" : "Share"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </article>
  )
}