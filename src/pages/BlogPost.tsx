import { useParams, Link } from "react-router-dom"
import BlogPostContent from "../components/BlogPostContent"
import { usePost } from "../lib/content"
import { PageError, PageLoading } from "../components/PageStatus"
import Seo from "../components/Seo"

export default function BlogPostPage() {
  const { slug = "" } = useParams<{ slug: string }>()
  const { data: post, loading, error } = usePost(slug)

  if (loading) return <PageLoading />
  if (error) return <PageError />
  if (!post) {
    return (
      <main>
        <Seo noindex title="Artículo no encontrado | Allison Silva Taxes & Accounting" description="El artículo que buscas no existe o fue movido." />
        <section className="bg-ivory px-4 py-20 text-center sm:px-6 lg:py-28">
          <div className="mx-auto max-w-2xl space-y-6">
            <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
            <h1 className="text-4xl font-medium leading-tight text-navy lg:text-5xl">Artículo no encontrado</h1>
            <p className="text-lg text-navy/70">El artículo que buscas no existe o fue movido.</p>
            <Link
              to="/blog"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-7 py-3 font-semibold text-white transition hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Volver al blog
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <>
      <Seo
        title={`${post.seo_title || post.title} | Allison Silva`}
        description={post.excerpt ?? ""}
        image={post.cover_url ?? undefined}
        noindex={!post.published}
      />
      <BlogPostContent post={post} />
    </>
  )
}
