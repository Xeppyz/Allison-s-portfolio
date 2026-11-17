import { Blog } from "../components/blog"
import Seo from "../components/Seo"

export default function BlogIndex() {
  return (
    <>
      <Seo
        title="Blog | Allison Silva Taxes & Accounting"
        description="Artículos sobre contabilidad, impuestos y QuickBooks para empresas en Nicaragua y EE. UU."
      />
      <h1 className="sr-only">Blog</h1>
      <Blog />
    </>
  )
}
