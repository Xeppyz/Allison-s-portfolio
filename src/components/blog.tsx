import { Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "./language-context"
import { Button } from "./ui/button"
import { CardTitle, CardHeader, Card, CardContent, CardDescription } from "./ui/card"
import placeHolder from "../assets/img/placeholder.png"
import documentCalendar from "../assets/img/tax-documents-calendar.png"
import accountingDocument from "../assets/img/accounting-software-screen.png"
import { getAllPosts } from "../data/BlogPost"

const imageMap: Record<string, string> = {
  placeholder: placeHolder,
  calendar: documentCalendar,
  accounting: accountingDocument,
}

export function Blog() {
  const { t, language } = useLanguage()
  const posts = getAllPosts()
  const dateLocale = language === "es" ? "es-ES" : "en-US"

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t("blog.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("blog.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const imgSrc = imageMap[post.imageKey] || "/placeholder.svg"
            const title = post.title[language === "es" ? "es" : "en"]
            const excerpt = post.excerpt[language === "es" ? "es" : "en"]

            return (
              <Card key={post.slug} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={imgSrc}
                    alt={
                      title +
                      (language === "es"
                        ? " - Artículo de blog sobre contabilidad y finanzas"
                        : " - Blog article about accounting and finance")
                    }
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(post.date).toLocaleDateString(dateLocale)}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-600 line-clamp-3">{excerpt}</CardDescription>
                  <Link to={`/blog/${post.slug}`} className="inline-block" aria-label={title}>
                    <Button className="text-white" style={{ backgroundColor: "#34A853" }}>
                      {t("blog.readmore")}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}