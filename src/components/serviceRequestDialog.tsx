import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { ResponsiveDialog } from "./responsiveDialog"

const services = [
  {
    value: "bookkeeping",
    label: "Bookkeeping mensual",
    desc: "Mantenemos tus registros contables al día con precisión y detalle."
  },
  {
    value: "quickbooks",
    label: "Implementación de QuickBooks",
    desc: "Configuramos y optimizamos QuickBooks para tu negocio específico."
  },
  {
    value: "tracking",
    label: "Control de ingresos y gastos",
    desc: "Seguimiento detallado de todas tus transacciones financieras."
  },
  {
    value: "compliance",
    label: "Control fiscal y cumplimiento",
    desc: "Aseguramos el cumplimiento de todas las obligaciones fiscales."
  },
  {
    value: "reports",
    label: "Reportes financieros mensuales",
    desc: "Informes claros y detallados para la toma de decisiones."
  },
  {
    value: "entrepreneur",
    label: "Plan emprendedor",
    desc: "Organización + control + asesoría estratégica integral."
  },
]

export function ServiceRequestDialog() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [service, setService] = useState(services[0].value)

  const handleSubmit = () => {
    // Aquí podrías enviar la info a tu backend
    const selected = services.find(s => s.value === service)
    console.log({ name, email, notes, service: selected?.label })
    alert("Solicitud enviada ✅")
    setName(""); setEmail(""); setNotes(""); setService(services[0].value)
  }

  return (
    <ResponsiveDialog
      trigger={
        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3" style={{ borderColor: "#4285F4", color: "#4285F4", backgroundColor: "transparent" }}>
          Solicitar Servicio
        </Button>
      }
      title="Solicitar Servicio"
      description="Completa los campos para solicitar un servicio."
    >
      <div className="flex flex-col gap-4 px-1 sm:px-0">
        <Input
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <div>
          <label className="block text-sm font-medium mb-1">Servicio</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={service}
            onChange={e => setService(e.target.value)}
          >
            {services.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">{services.find(s => s.value === service)?.desc}</p>
        </div>
        <Textarea
          placeholder="Notas (opcional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="resize-none w-full"
          rows={3}
        />
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" onClick={handleSubmit}>
          Enviar Solicitud
        </Button>
      </div>
    </ResponsiveDialog>
  )
}
