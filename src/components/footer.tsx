"use client"

import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from "./language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Allison Silva</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{t("hero.subtitle")}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">{t("footer.services.title")}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t("services.1.title")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t("services.2.title")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t("services.4.title")}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  {t("services.5.title")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">{t("footer.contact.title")}</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <span>+505 8767-3463</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span>info@allisonsilva.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4" />
                <span>{t("contact.info.city")}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">{t("contact.info.hours")}</h4>
            <div className="text-sm text-gray-300">
              <p>{t("contact.info.schedule")}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">© 2024 Allison Silva Taxes & Accounting. {t("footer.rights")}</p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
