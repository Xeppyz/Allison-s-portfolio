"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "./language-context"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function Contact() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const RECIPIENT = "allisonsilva684@gmail.com"
    const FROM = "onboarding@resend.dev"
const payload = {
  to: RECIPIENT,
  subject: `Contacto - ${formData.name}`,
  htmlBody: `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuevo Contacto</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8f8f8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1E3A5F 0%, #34A853 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Silva Taxes & Accounting</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Nuevo Mensaje de Contacto</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <div style="margin-bottom: 30px;">
                    <h2 style="color: #1E3A5F; margin: 0 0 20px 0; font-size: 22px; border-bottom: 2px solid #34A853; padding-bottom: 10px;">Información de Contacto</h2>
                  </div>
                  
                  <!-- Contact Info Grid -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                    <tr>
                      <td width="50%" style="padding-right: 10px; padding-bottom: 15px;">
                        <div style="background-color: #FBFCFF; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                          <h3 style="color: #1E3A5F; margin: 0 0 8px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">👤 Nombre</h3>
                          <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 500;">${formData.name}</p>
                        </div>
                      </td>
                      <td width="50%" style="padding-left: 10px; padding-bottom: 15px;">
                        <div style="background-color: #FBFCFF; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                          <h3 style="color: #1E3A5F; margin: 0 0 8px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">📧 Email</h3>
                          <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 500;">${formData.email}</p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <div style="background-color: #F7F7F7; border-left: 4px solid #4285F4; border-radius: 8px; padding: 20px;">
                          <h3 style="color: #1E3A5F; margin: 0 0 8px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">📞 Teléfono</h3>
                          <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 500;">${formData.phone}</p>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Message Section -->
                  <div style="background-color: #FBFCFF; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
                    <h3 style="color: #1E3A5F; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">💬 Mensaje</h3>
                    <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; border-left: 3px solid #34A853; min-height: 80px;">
                      <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
                    </div>
                  </div>
                  
                  <!-- Action Section -->
                  <div style="background-color: #F7F7F7; border-radius: 8px; padding: 20px; margin-top: 25px; text-align: center;">
                    <p style="color: #6B7280; margin: 0 0 10px 0; font-size: 14px;">Responder lo antes posible</p>
                    <div style="background-color: #34A853; color: #ffffff; padding: 10px 20px; border-radius: 25px; display: inline-block; font-size: 14px; font-weight: bold;">
                      ⚡ RESPUESTA PRIORITARIA
                    </div>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #F8F8F8; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="color: #6B7280; margin: 0; font-size: 14px;">
                          <strong style="color: #1E3A5F;">Silva Taxes & Accounting</strong><br>
                          Tu socio confiable en servicios contables<br>
                          📧 info@allisonsilvacorp.com | 📞 +505 8767-3463
                        </p>
                      </td>
                      <td align="right">
                        <div style="background-color: #34A853; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                          NUEVO CONTACTO
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
  from: FROM,
};

    try {
      const res = await fetch("https://wservices.casavision.com/ApiWebHub/api/Email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `HTTP ${res.status}`);
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setSubmitting(false)
        // reset form
        setFormData({ name: "", email: "", phone: "", message: "" })
      }, 1200)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al enviar");
      } else {
        setError("Error al enviar");
      }
      setSubmitting(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t("contact.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("contact.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">{t("contact.form.submit")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder={t("contact.form.name") as string}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t("contact.form.email") as string}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder={t("contact.form.phone") as string}
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder={t("contact.form.message") as string}
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {error && <div style={{ color: '#dc2626' }}>{error}</div>}
                  {success && <div style={{ color: '#16a34a' }}>Mensaje enviado</div>}
                  <Button
                    type="submit"
                    className="w-full"
                    style={{ backgroundColor: submitting ? '#9CA3AF' : '#34A853', color: '#fff' }}
                    disabled={submitting}
                  >
                    {submitting ? 'Enviando...' : t('contact.form.submit')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
              <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                  <p className="text-gray-600">
                    <a href="tel:+50587673463" className="underline hover:text-green-600">+505 8767-3463</a>
                    <a href="https://wa.me/50587673463" target="_blank" rel="noopener" className="ml-3 text-green-500 hover:text-green-600 underline">WhatsApp</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                 <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:info@allisonsilvacorp.com" className="underline hover:text-green-600">info@allisonsilvacorp.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t("contact.info.location")}</h3>
                  <p className="text-gray-600">{t("contact.info.city")}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{t("contact.info.hours")}</h3>
                  <p className="text-gray-600">{t("contact.info.schedule")}</p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Managua, Nicaragua</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
