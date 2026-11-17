import { useState } from "react"
import { Link, NavLink } from "react-router-dom"

import { Menu, X } from "lucide-react"
import { track } from "../lib/track"
import { useStrings } from "../lib/strings"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useStrings()

  const navLinks = [
    { to: "/", label: t.navInicio, end: true },
    { to: "/planes", label: t.navPlanes },
    { to: "/contabilidad-mensual", label: t.navContabilidad },
    { to: "/blog", label: t.navBlog },
    { to: "/contacto", label: t.navContacto },
  ]

  const closeMenu = () => setIsOpen(false)

  const handleVerPlanes = () => {
    track("ver_planes_click")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-navy/10 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className={`flex-shrink-0 rounded ${focusRing}`}>
            <span className="block font-serif text-base font-medium text-navy">
              Allison Silva Taxes and Accounting
            </span>
            <span className="block max-w-[300px] text-[10px] leading-tight text-navy/75 sm:text-xs">
              {t.slogan}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `border-b-2 px-1 py-2 text-sm font-medium transition-colors ${focusRing} ${
                      isActive
                        ? "border-taupe text-navy"
                        : "border-transparent text-navy/80 hover:text-navy"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {/* Ver planes - Only visible on desktop */}
            <Link
              to="/planes"
              onClick={handleVerPlanes}
              className={`hidden min-h-11 items-center rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition hover:bg-navy-deep lg:inline-flex ${focusRing}`}
            >
              {t.verPlanes}
            </Link>

            {/* Mobile menu button - Only visible on mobile */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-navy transition hover:bg-sand lg:hidden ${focusRing}`}
              aria-label={isOpen ? t.cerrarMenu : t.abrirMenu}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-navy/10 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl divide-y divide-navy/10 px-4 sm:px-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex min-h-12 items-center gap-3 text-base font-medium ${focusRing} ${
                    isActive ? "text-navy" : "text-navy/80 hover:text-navy"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-taupe" : "bg-transparent"}`}
                    />
                    {link.label}
                  </>
                )}
              </NavLink>
            ))}
            <div className="py-4">
              <Link
                to="/planes"
                onClick={() => {
                  track("ver_planes_click")
                  closeMenu()
                }}
                className={`flex min-h-12 w-full items-center justify-center rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-deep ${focusRing}`}
              >
                {t.verPlanes}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
