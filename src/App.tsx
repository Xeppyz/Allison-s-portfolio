
import './App.css'
import { LanguageProvider } from "./components/language-context"
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
      </div>
    </LanguageProvider>
  )
}

export default App
