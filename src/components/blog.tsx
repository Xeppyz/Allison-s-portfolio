import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { usePosts, type PostCard } from "../lib/content"

export const formatDate = (d: string) =>
  new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })

function Card({ post }: { post: PostCard }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white transition hover:-translate-y-px hover:border-taupe/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
    >
      <div className="aspect-video overflow-hidden border-b border-navy/10 bg-sand">
        {post.cover_url && (
          <img
            src={post.cover_url}
            width={1200}
            height={675}
            alt={post.cover_alt || post.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={post.published_at} className="text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep">
          {formatDate(post.published_at)}
        </time>
        <h3 className="mt-3 line-clamp-2 font-serif text-xl font-medium text-navy">{post.title}</h3>
        {post.excerpt && <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-navy/70">{post.excerpt}</p>}
        <span className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-navy">
          Leer más
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}

/** Sección de artículos. En el inicio muestra los 3 últimos; en /blog, todos. */
export function Blog({ limit }: { limit?: number }) {
  const { data, loading } = usePosts()
  const posts = (data ?? []).slice(0, limit)
  if (!loading && posts.length === 0) return null

  return (
    <section id="blog" className="bg-ivory py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-5 text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h2 className="text-3xl font-medium text-navy lg:text-5xl">Consejos y Recursos</h2>
          <p className="text-lg text-navy/70">Artículos útiles sobre contabilidad y finanzas empresariales</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-busy={loading}>
          {loading
            ? Array.from({ length: 3 }, (_, i) => <div key={i} className="h-96 animate-pulse rounded-2xl bg-sand" />)
            : posts.map((post) => <Card key={post.id} post={post} />)}
        </div>
      </div>
    </section>
  )
}
