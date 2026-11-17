import { Link } from "react-router-dom"
import WhatsAppButton from "./WhatsAppButton"
import { track } from "../lib/track"
import { HERO_IMAGE } from "../lib/seo-head"

interface HeroProps {
  h1: string
  subheadline: string
  credentials: string[]
}

export function Hero({ h1, subheadline, credentials }: HeroProps) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-28 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-36 lg:pt-24">
        <div className="hero-in space-y-8">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-taupe-deep">
            <span aria-hidden="true" className="h-px w-10 bg-taupe" />
            Taxes &amp; Accounting · CPA
          </p>
          <h1 className="text-4xl font-medium leading-[1.08] text-navy sm:text-5xl lg:text-[4rem]">{h1}</h1>
          <p className="max-w-xl text-lg leading-relaxed text-navy/70">{subheadline}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppButton label="Diagnóstico gratis por WhatsApp" />
            <Link
              to="/planes"
              onClick={() => track("ver_planes_click")}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-7 py-3 font-semibold text-white transition hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Ver planes y precios
            </Link>
          </div>
          {credentials.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-navy/10 pt-6 text-sm text-navy/70">
              {credentials.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-taupe" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        <figure className="hero-in relative mx-auto w-full max-w-sm lg:max-w-md" style={{ animationDelay: "120ms" }}>
          {/* Arco fino concéntrico: enmarca solo la foto, con el mismo aire en los tres lados. */}
          <div className="relative p-3">
            <div aria-hidden="true" className="absolute inset-0 rounded-t-full border border-taupe/50" />
            <img
              src={HERO_IMAGE.href}
              srcSet={HERO_IMAGE.srcset}
              sizes={HERO_IMAGE.sizes}
              alt="Allison Silva, CPA, fundadora de Allison Silva Taxes & Accounting"
              width={800}
              height={1000}
              fetchPriority="high"
              className="relative aspect-[4/5] w-full rounded-t-full object-cover object-top"
            />
          </div>
          <figcaption className="relative mt-5 text-center">
            <span className="block font-serif text-xl text-navy">Allison Silva, CPA</span>
            <span className="text-xs uppercase tracking-[0.18em] text-navy/75">Fundadora y directora</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
