import { useParams, Link } from "react-router-dom"
import BlogPostContent from "../components/BlogPostContent"
import { getPostBySlug } from "../data/BlogPost"
import Seo from "../components/Seo"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Seo title="Artículo no encontrado | Allison Silva Taxes & Accounting" description="El artículo que buscas no existe o fue movido." />
        <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
        <p className="mb-6">El artículo que buscas no existe o fue movido.</p>
        <Link to="/blog" className="text-green-600 hover:text-green-700 underline">
          Volver al blog
        </Link>
      </main>
    )
  }

  return (
    <>
      <Seo title={`${post.title} | Allison Silva`} description={post.excerpt} />
      <BlogPostContent post={post} />
    </>
  )
}
