import { Blog } from "../components/blog"
import Seo from "../components/Seo"

export default function BlogIndex() {
  return (
    <main>
      <Seo
        title="Blog | Allison Silva Taxes & Accounting"
        description="Artículos sobre contabilidad, impuestos y QuickBooks para empresas en Nicaragua y EE. UU."
      />
      <section className="bg-ivory px-4 pb-4 pt-20 text-center sm:px-6 lg:pt-24">
        <div className="hero-in mx-auto max-w-3xl space-y-6">
          <span aria-hidden="true" className="mx-auto block h-px w-16 bg-taupe" />
          <h1 className="text-4xl font-medium leading-tight text-navy lg:text-6xl">Blog</h1>
        </div>
      </section>
      <Blog />
    </main>
  )
}
