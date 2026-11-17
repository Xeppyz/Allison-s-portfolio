import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import placeHolder from "../assets/img/placeholder.png"
import documentCalendar from "../assets/img/tax-documents-calendar.webp"
import accountingDocument from "../assets/img/accounting-software-screen.webp"
import { getAllPosts } from "../data/BlogPost"

const imageMap: Record<string, { src: string; width: number; height: number }> = {
  placeholder: { src: placeHolder, width: 1200, height: 675 },
  calendar: { src: documentCalendar, width: 1200, height: 798 },
  accounting: { src: accountingDocument, width: 1200, height: 899 },
}

export function Blog() {
  const posts = getAllPosts()

  return (
    <section id="blog" className="bg-ivory py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-5 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h2 className="text-3xl font-medium text-navy lg:text-5xl">Consejos y Recursos</h2>
          <p className="text-lg text-navy/70">Artículos útiles sobre contabilidad y finanzas empresariales</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const img = imageMap[post.imageKey] ?? { src: "/placeholder.svg", width: 1200, height: 675 }
            const title = post.title
            const excerpt = post.excerpt

            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white transition hover:-translate-y-px hover:border-taupe/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
              >
                <div className="aspect-video overflow-hidden border-b border-navy/10">
                  <img
                    src={img.src}
                    width={img.width}
                    height={img.height}
                    alt={title + " - Artículo de blog sobre contabilidad y finanzas"}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <time dateTime={post.date} className="text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">
                    {new Date(post.date).toLocaleDateString("es-ES")}
                  </time>
                  <h3 className="mt-3 line-clamp-2 font-serif text-xl font-medium text-navy">{title}</h3>
                  <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-navy/70">{excerpt}</p>
                  <span className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-navy">
                    Leer más
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
