import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Navigation } from "./navegation"
import { Footer } from "./footer"
import WhatsAppButton from "./WhatsAppButton"
import CookieBanner from "./CookieBanner"
import { captureUtm } from "../lib/utm"
import { useSettings } from "../lib/content"
import { getConsent, loadGtm } from "../lib/track"

export default function SiteLayout() {
  const { pathname } = useLocation()
  const [consent, setConsentState] = useState(getConsent)
  const { data: settings } = useSettings()
  const gtmId = settings?.gtm_id ?? ""

  useEffect(() => {
    if (consent === "granted" && gtmId) loadGtm(gtmId)
  }, [consent, gtmId])

  useEffect(() => {
    captureUtm()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Outlet />
      <Footer />
      <WhatsAppButton floating />
      <CookieBanner onChange={setConsentState} />
      <Analytics />
      <SpeedInsights />
    </div>
  )
}
