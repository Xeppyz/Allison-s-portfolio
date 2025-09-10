
import './App.css'
import './styles/article.css'
import { LanguageProvider } from "./components/language-context"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Navigation } from "./components/navegation"
import { Hero } from "./components/hero"
import { Services } from "./components/services"
import { Benefits } from "./components/benefits"
import { Testimonials } from "./components/testimonials"
import { Blog } from "./components/blog"
import { Contact } from "./components/contact"
import { Footer } from "./components/footer"
import { About } from './components/about'

function App() {
  
  return (
    <LanguageProvider>
     <div className="min-h-screen bg-white">
        <Navigation />
        <Hero />
        <About />
        <Services />
        <Benefits />
        <Testimonials />
        <Blog />
        <Contact />
  <Footer />
  <Analytics />
  <SpeedInsights />
      </div>
    </LanguageProvider>
  )
}

export default App
