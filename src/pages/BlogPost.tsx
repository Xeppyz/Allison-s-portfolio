import { useParams, Link } from "react-router-dom"
import { LanguageProvider } from "../components/language-context"
import { Navigation } from "../components/navegation"
import { Footer } from "../components/footer"
import BlogPostContent from "../components/BlogPostContent"
import { getPostBySlug } from "../data/BlogPost"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Navigation />
        {!post ? (
          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
            <p className="mb-6">El artículo que buscas no existe o fue movido.</p>
            <Link to="/blog" className="text-green-600 hover:text-green-700 underline">
              Volver al blog
            </Link>
          </main>
        ) : (
          <BlogPostContent post={post} />
        )}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </LanguageProvider>
  )
}