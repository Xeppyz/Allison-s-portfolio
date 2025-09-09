import { useLanguage } from "./language-context"
import { Calendar, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import type { BlogPost } from "../data/BlogPost"
import placeHolder from "../assets/img/placeholder.png"
import documentCalendar from "../assets/img/tax-documents-calendar.png"
import accountingDocument from "../assets/img/accounting-software-screen.png"

const imageMap: Record<string, string> = {
  placeholder: placeHolder,
  calendar: documentCalendar,
  accounting: accountingDocument,
}

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const { language } = useLanguage()
  const locale = language === "es" ? "es-ES" : "en-US"
  const title = post.title[language === "es" ? "es" : "en"]
  const contentHtml = post.contentHtml[language === "es" ? "es" : "en"]
  const imgSrc = imageMap[post.imageKey] || "/placeholder.svg"

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/blog" className="inline-flex items-center text-green-600 hover:text-green-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === "es" ? "Volver al blog" : "Back to blog"}
        </Link>
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Calendar className="h-4 w-4 mr-2" />
        {new Date(post.date).toLocaleDateString(locale)}
      </div>

      <div className="w-full overflow-hidden rounded-lg mb-8">
        <img
          src={imgSrc}
          alt={title}
          loading="eager"
          decoding="async"
          className="w-full h-auto object-cover"
        />
      </div>

      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-10">
        <Link to="/blog" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === "es" ? "Ver más artículos" : "See more articles"}
        </Link>
      </div>
    </article>
  )
}