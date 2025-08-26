"use client"

import { useState } from "react"
import { useLanguage } from "../components/language-context"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {
  Calculator,
  Settings,
  BarChart3,
  FileCheck,
  PieChart,
  Briefcase,
  X,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

const serviceIcons = [Calculator, Settings, BarChart3, FileCheck, PieChart, Briefcase]

interface PlansModalProps {
  open: boolean
  onClose: () => void
}

export function PlansModal({ open, onClose }: PlansModalProps) {
  const { t } = useLanguage()
  const [selectedPlans, setSelectedPlans] = useState<number[]>([])
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const services = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: t(`services.${i + 1}.title`),
    description: t(`services.${i + 1}.desc`),
    icon: serviceIcons[i],
  }))

  const togglePlan = (planId: number) => {
    setSelectedPlans((prev) => (prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]))
  }

  const handleContinue = async () => {
    if (selectedPlans.length === 0) {
      setError("Selecciona al menos un servicio")
      return
    }
    if (!nombre.trim() || !correo.trim()) {
      setError("Nombre y correo son requeridos")
      return
    }
    setError(null)
    setSubmitting(true)

    const chosen = services.filter(s => selectedPlans.includes(s.id))
    const RECIPIENT = "allisonsilva684@gmail.com" // destinatario interno
    const FROM = "onboarding@resend.dev" // reemplazar por remitente verificado

    const htmlBody = `<!DOCTYPE html><html lang="es"><head><meta charset='UTF-8'><title>Selección de Servicios</title></head><body style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;padding:24px;">
    <table width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden" cellpadding="0" cellspacing="0">
      <tr><td style="background:linear-gradient(135deg,#1E3A5F,#4285F4);padding:28px 32px;color:#ffffff;">
        <h1 style="margin:0;font-size:22px;">Nueva selección de paquetes</h1>
        <p style="margin:8px 0 0 0;font-size:14px;opacity:.9;">Solicitud enviada desde el modal de planes</p>
      </td></tr>
      <tr><td style="padding:32px 32px 12px 32px;">
        <h2 style="margin:0 0 16px 0;font-size:18px;color:#1E3A5F;border-bottom:2px solid #4285F4;padding-bottom:6px;">Datos del solicitante</h2>
        <p style="margin:0 0 4px 0;color:#374151;font-size:14px;"><strong>Nombre:</strong> ${nombre}</p>
        <p style="margin:0 0 16px 0;color:#374151;font-size:14px;"><strong>Correo:</strong> ${correo}</p>
        <h2 style="margin:0 0 12px 0;font-size:18px;color:#1E3A5F;">Servicios Seleccionados (${chosen.length})</h2>
        <ul style="list-style:none;padding:0;margin:0 0 8px 0;">
          ${chosen.map(c => `<li style='margin:0 0 10px 0;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;background:#FBFCFF;'><strong style='color:#1E3A5F;'>${c.title}</strong><br/><span style='color:#4b5563;font-size:13px;'>${c.description}</span></li>`).join("")}
        </ul>
      </td></tr>
      <tr><td style="background:#F8F8F8;padding:20px 32px;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:12px;color:#6B7280;">Silva Taxes & Accounting • info@allisonsilvacorp.com</p>
      </td></tr>
    </table>
    </body></html>`

    const payload = { to: RECIPIENT, subject: `Selección de planes - ${nombre}`, htmlBody, from: FROM }

    try {
      const res = await fetch("https://wservices.casavision.com/ApiWebHub/api/Email/send", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Error al enviar')
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setSubmitting(false)
        setSelectedPlans([])
        setNombre("")
        setCorreo("")
        onClose()
      }, 1200)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error al enviar'
      setError(msg)
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con animación */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        onClick={onClose}
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: open ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out',
        }}
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{
          backgroundColor: "#FBFCFF",
          animation: open ? "slideUp 0.4s ease-out" : "slideDown 0.4s ease-out",
        }}
      >
        {/* Header */}
  <div className="sticky top-0 z-10 p-6" style={{ backgroundColor: "#FBFCFF", borderBottom: '1px solid #E5E7EB' }}>
            <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "#1E3A5F" }}>
                {t("plans.title") || "Elige tus Servicios"}
              </h2>
              <p className="text-lg mt-2" style={{ color: "#1E3A5F", opacity: 0.7 }}>
                {t("plans.subtitle") || "Selecciona los servicios que necesitas para tu negocio"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full" style={{ backgroundColor: 'transparent', color: '#1E3A5F' }}>
              <X className="h-6 w-6" style={{ color: "#1E3A5F" }} />
            </Button>
          </div>
        </div>

        {/* Name & Email */}
        <div style={{ padding: '0 24px', marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px', minWidth: 220 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#1E3A5F', marginBottom:4 }}>Nombre</label>
            <input
              value={nombre}
              onChange={e=>setNombre(e.target.value)}
              placeholder="Tu nombre"
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #d1d5db', borderRadius:8, background:'#ffffff', fontSize:14 }}
            />
          </div>
          <div style={{ flex: '1 1 240px', minWidth: 220 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#1E3A5F', marginBottom:4 }}>Correo</label>
            <input
              type="email"
              value={correo}
              onChange={e=>setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #d1d5db', borderRadius:8, background:'#ffffff', fontSize:14 }}
            />
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon
              const isSelected = selectedPlans.includes(service.id)
              const isHovered = hoveredPlan === service.id

              return (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected ? "ring-2 shadow-lg" : "hover:shadow-md"
                  }`}
                  style={{
                    backgroundColor: isSelected ? "#F8F8F8" : "#FBFCFF",
                    borderColor: isSelected ? "#34A853" : "#E5E7EB",
                   // ringColor: isSelected ? "#34A853" : "transparent",
                    animationDelay: `${index * 0.1}s`,
                    animation: "slideInUp 0.5s ease-out both",
                  }}
                  onClick={() => togglePlan(service.id)}
                  onMouseEnter={() => setHoveredPlan(service.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  <CardHeader className="text-center relative">
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="h-6 w-6" style={{ color: "#34A853" }} />
                      </div>
                    )}

                    {/* Icon with animation */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                        isHovered ? "scale-110" : ""
                      }`}
                      style={{
                        backgroundColor: isSelected ? "#34A853" : "#4285F4",
                        opacity: isSelected ? 1 : 0.2,
                      }}
                    >
                      <IconComponent
                        className={`h-8 w-8 transition-colors duration-300`}
                        style={{ color: isSelected ? '#ffffff' : '#4285F4' }}
                      />
                    </div>

                    <CardTitle className="text-xl font-semibold" style={{ color: "#1E3A5F" }}>
                      {service.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-center leading-relaxed" style={{ color: "#1E3A5F", opacity: 0.7 }}>
                      {service.description}
                    </p>

                    {/* Hover effect indicator */}
                    <div
                      className={`mt-4 text-center transition-all duration-300 ${
                        isHovered ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
                      }`}
                    >
                      <span className="text-sm font-medium" style={{ color: "#4285F4" }}>
                        {isSelected ? "✓ Seleccionado" : "Clic para seleccionar"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t" style={{ backgroundColor: "#F8F8F8" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#1E3A5F", opacity: 0.7 }}>
                {selectedPlans.length} servicio{selectedPlans.length !== 1 ? "s" : ""} seleccionado
                {selectedPlans.length !== 1 ? "s" : ""}
              </p>
              {error && <p style={{ color:'#dc2626', fontSize:12, marginTop:4 }}>{error}</p>}
              {success && <p style={{ color:'#16a34a', fontSize:12, marginTop:4 }}>Enviado</p>}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                style={{ backgroundColor: '#F3F4F6', borderColor: '#E5E7EB', color: '#1E3A5F' }}
              >
                Close
              </Button>
              <Button
                onClick={handleContinue}
                disabled={selectedPlans.length === 0 || submitting}
                className="flex items-center gap-0"
                style={{
                  backgroundColor: selectedPlans.length > 0 && !submitting ? "#34A853" : "#9CA3AF",
                  color: "white",
                }}
              >
                {submitting ? 'Enviando...' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
