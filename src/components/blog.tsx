"use client"


import { Calendar, ArrowRight } from "lucide-react"
import { useLanguage } from "./language-context"
import { Button } from "./ui/button"
import { CardTitle, CardHeader, Card, CardContent, CardDescription } from "./ui/card"

export function Blog() {
  const { t, language } = useLanguage()

  const blogPosts = [
    {
      title:
        language === "es"
          ? "5 Errores Comunes en la Contabilidad de Pequeñas Empresas"
          : "5 Common Mistakes in Small Business Accounting",
      excerpt:
        language === "es"
          ? "Descubre los errores más frecuentes que cometen los emprendedores y cómo evitarlos para mantener finanzas saludables."
          : "Discover the most common mistakes entrepreneurs make and how to avoid them to maintain healthy finances.",
      date: "2024-01-15",
      image: "./src/assets/img/placeholder.png",
    },
    {
      title:
        language === "es"
          ? "Cómo Preparar tu Negocio para la Temporada Fiscal"
          : "How to Prepare Your Business for Tax Season",
      excerpt:
        language === "es"
          ? "Una guía paso a paso para organizar tus documentos y maximizar tus deducciones fiscales este año."
          : "A step-by-step guide to organize your documents and maximize your tax deductions this year.",
      date: "2024-01-10",
      image: "./src/assets/img/tax-documents-calendar.png",
    },
    {
      title:
        language === "es"
          ? "QuickBooks vs. Hojas de Cálculo: ¿Cuál es Mejor?"
          : "QuickBooks vs. Spreadsheets: Which is Better?",
      excerpt:
        language === "es"
          ? "Comparamos las ventajas y desventajas de cada método para ayudarte a tomar la mejor decisión."
          : "We compare the advantages and disadvantages of each method to help you make the best decision.",
      date: "2024-01-05",
      image: "./src/assets/img/accounting-software-screen.png",
    },
  ]

  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t("blog.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("blog.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(post.date).toLocaleDateString(language === "es" ? "es-ES" : "en-US")}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600 line-clamp-3">{post.excerpt}</CardDescription>
                <Button
                  className="text-white"
                  style={{ backgroundColor: "#34A853" }}
                >
                  {t("blog.readmore")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
