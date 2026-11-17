import { Link } from 'react-router-dom'
import Seo, { DEFAULT_DESCRIPTION } from '../components/Seo'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-20 text-center sm:px-6">
      <Seo title="Página no encontrada | Allison Silva Taxes & Accounting" description={DEFAULT_DESCRIPTION} />
      <h1 className="text-3xl font-bold text-[#1E3A5F]">Página no encontrada</h1>
      <p className="text-[#1E3A5F]/80">La página que buscas no existe o fue movida.</p>
      <Link to="/" className="inline-block font-semibold text-[#4285F4] underline">
        Volver al inicio
      </Link>
    </main>
  )
}
