"use client"

import { useState } from "react"

import { Menu, X, Globe } from "lucide-react"
import { useLanguage } from "./language-context"
import { Button } from "./ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-blue-600">Allison Silva</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#services"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("nav.services")}
              </a>
              <a
                href="#benefits"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("nav.benefits")}
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("nav.testimonials")}
              </a>
              <a
                href="#blog"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("nav.blog")}
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {t("nav.contact")}
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 bg-transparent"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language === "es" ? "EN" : "ES"}</span>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            <a href="#services" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              {t("nav.services")}
            </a>
            <a href="#benefits" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              {t("nav.benefits")}
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              {t("nav.testimonials")}
            </a>
            <a href="#blog" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              {t("nav.blog")}
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              {t("nav.contact")}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
