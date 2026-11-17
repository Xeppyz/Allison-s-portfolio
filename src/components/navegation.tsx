"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"

import { Menu, X } from "lucide-react"
import { track } from "../lib/track"

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/planes", label: "Planes" },
  { to: "/contabilidad-mensual", label: "Contabilidad mensual" },
  { to: "/blog", label: "Blog" },
  { to: "/contacto", label: "Contacto" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const handleVerPlanes = () => {
    track("ver_planes_click")
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
              NO SOLO CIERRO LIBROS, ABRO OPORTUNIDADES
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "#1E3A5F" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#4285F4")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#1E3A5F")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {/* Ver planes - Only visible on desktop */}
            <Link
              to="/planes"
              onClick={handleVerPlanes}
              className="hidden md:inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "#4285F4" }}
            >
              Ver planes
            </Link>

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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="block px-3 py-2 text-base font-medium hover:opacity-80"
                style={{ color: "#1E3A5F" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Link
                to="/planes"
                onClick={() => {
                  track("ver_planes_click")
                  closeMenu()
                }}
                className="flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: "#4285F4" }}
              >
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
