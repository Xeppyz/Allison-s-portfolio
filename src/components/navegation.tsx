"use client"

import { useState } from "react"
import { Button } from "./ui/button"

import { Menu, X, Globe } from "lucide-react"
import { useLanguage } from "./language-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  return (
    <nav
      className="shadow-sm border-b sticky top-0 z-50"
      style={{ backgroundColor: "#F8F8F8", borderColor: "#F7F7F7" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="block font-bold font-serif text-base" style={{ color: "#1E3A5F" }}>
              Allison Silva Taxes and Accounting
            </span>
            <span className="block text-[10px] sm:text-xs text-gray-500" style={{ maxWidth: 300, lineHeight: 1.1 }}>
              {t("nav.slogan")}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#services"
                className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "#1E3A5F" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#4285F4")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#1E3A5F")}
              >
                {t("nav.services")}
              </a>
              <a
                href="#benefits"
                className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "#1E3A5F" }}
               onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#4285F4")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#1E3A5F")}
              >
                {t("nav.benefits")}
              </a>
              <a
                href="#testimonials"
                className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "#1E3A5F" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#4285F4")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#1E3A5F")}
              >
                {t("nav.testimonials")}
              </a>
              <a
                href="#blog"
                className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "#1E3A5F" }}
               onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#4285F4")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#1E3A5F")}
              >
                {t("nav.blog")}
              </a>
              <a
                href="#contact"
                className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "#1E3A5F" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#4285F4")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#1E3A5F")}
              >
                {t("nav.contact")}
              </a>
            </div>
          </div>

          <div className="flex items-center">
            {/* Language Toggle - Only visible on desktop */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex items-center space-x-1 bg-transparent"
              style={{
                backgroundColor: "transparent",
                borderColor: "#4285F4",
                color: "#4285F4",
              }}
              aria-label={language === "es" ? "Cambiar a inglés" : "Cambiar a español"}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">{language === "es" ? "EN" : "ES"}</span>
              <style>
                {`
                  button:hover {
                    background-color: #4285F4;
                    color: white;
                  }
                `}
              </style>
            </Button>

            {/* Mobile menu button - Only visible on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              style={{ color: "#1e5bbdff", backgroundColor: "transparent" }}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t"
            style={{ backgroundColor: "#F8F8F8", borderColor: "#F7F7F7" }}
          >
            <div className="px-3 py-2 border-b" style={{ borderColor: "#F7F7F7" }}>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center space-x-2 bg-transparent"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "#4285F4",
                  color: "#4285F4",
                }}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{language === "es" ? "English" : "Español"}</span>
              </Button>
            </div>

            <a
              href="#services"
              className="block px-3 py-2 text-base font-medium hover:opacity-80"
              style={{ color: "#1E3A5F" }}
            >
              {t("nav.services")}
            </a>
            <a
              href="#benefits"
              className="block px-3 py-2 text-base font-medium hover:opacity-80"
              style={{ color: "#1E3A5F" }}
            >
              {t("nav.benefits")}
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 text-base font-medium hover:opacity-80"
              style={{ color: "#1E3A5F" }}
            >
              {t("nav.testimonials")}
            </a>
            <a
              href="#blog"
              className="block px-3 py-2 text-base font-medium hover:opacity-80"
              style={{ color: "#1E3A5F" }}
            >
              {t("nav.blog")}
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-base font-medium hover:opacity-80"
              style={{ color: "#1E3A5F" }}
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
