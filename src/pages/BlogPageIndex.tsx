import { LanguageProvider } from "../components/language-context"
import { Navigation } from "../components/navegation"
import { Footer } from "../components/footer"
import { Blog } from "../components/blog"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

export default function BlogIndex() {
  // Opcional: si tu LanguageProvider solo está en App, lo añadimos aquí para asegurar contexto.
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Navigation />
        <Blog />
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </LanguageProvider>
  )
}