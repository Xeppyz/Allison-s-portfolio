import { useState } from "react";
import ResponsiveModal from "./responsiveDialog";
import { useLanguage } from "./language-context";

interface CotizacionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CotizacionModal({ open, onClose }: CotizacionModalProps) {
  const { t } = useLanguage();

  // Estado para los campos
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    problematica: "",
    servicio: "",
  });

  // Servicios traducidos
  const servicios = t("modal.serviceOptions") as string[];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // TODO: replace with your real business recipient and verified sender
    const RECIPIENT = "allisonsilva684@gmail.com";
    const FROM = "onboarding@resend.dev";

   const payload = {
  to: RECIPIENT,
  subject: `Nueva cotización - ${formData.nombre}`,
  htmlBody: `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Cotización</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8f8f8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1E3A5F 0%, #4285F4 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Silva Taxes & Accounting</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Nueva Solicitud de Cotización</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <div style="margin-bottom: 30px;">
                    <h2 style="color: #1E3A5F; margin: 0 0 20px 0; font-size: 22px; border-bottom: 2px solid #4285F4; padding-bottom: 10px;">Información del Cliente</h2>
                  </div>
                  
                  <!-- Client Info Cards -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                    <tr>
                      <td width="50%" style="padding-right: 10px;">
                        <div style="background-color: #FBFCFF; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                          <h3 style="color: #1E3A5F; margin: 0 0 8px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Nombre Completo</h3>
                          <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 500;">${formData.nombre}</p>
                        </div>
                      </td>
                      <td width="50%" style="padding-left: 10px;">
                        <div style="background-color: #FBFCFF; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                          <h3 style="color: #1E3A5F; margin: 0 0 8px 0; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Correo Electrónico</h3>
                          <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 500;">${formData.correo}</p>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Service Info -->
                  <div style="background-color: #F7F7F7; border-left: 4px solid #34A853; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                    <h3 style="color: #1E3A5F; margin: 0 0 12px 0; font-size: 16px; font-weight: bold;">Servicio Solicitado</h3>
                    <p style="color: #374151; margin: 0; font-size: 16px; background-color: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e5e7eb;">${formData.servicio}</p>
                  </div>
                  
                  <!-- Problem Description -->
                  <div style="background-color: #FBFCFF; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
                    <h3 style="color: #1E3A5F; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">Problemática a Resolver</h3>
                    <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; border-left: 3px solid #4285F4;">
                      <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.6;">${formData.problematica}</p>
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
                          Servicios profesionales de contabilidad y asesoría contable<br>
                          📧 info@allisonsilvacorp.com | 📞 +505 8767-3463
                        </p>
                      </td>
                      <td align="right">
                        <div style="background-color: #4285F4; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                          NUEVA COTIZACIÓN
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

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSubmitting(false);
        // reset form optionally
        setFormData({ nombre: "", correo: "", problematica: "", servicio: "" });
        onClose();
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al enviar");
      } else {
        setError("Error al enviar");
      }
      setSubmitting(false);
    }
  };

  return (
    <ResponsiveModal open={open} onClose={onClose} title={t("modal.quoteTitle").toString()}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("modal.name")}</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder={t("modal.name").toString()}
          />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("modal.email")}</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="tucorreo@email.com"
          />
        </div>

        {/* Problemática */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("modal.problem")}</label>
          <textarea
            name="problematica"
            value={formData.problematica}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-2 border rounded-lg"
            placeholder={t("modal.problem").toString()}
          />
        </div>

        {/* Servicios */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("modal.service")}</label>
          <select
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">{t("modal.service")}</option>
            {servicios.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Botón */}
        <div className="flex justify-end items-center gap-4">
          {error && (
            <span style={{ color: "#dc2626" }} role="alert">
              {error}
            </span>
          )}
          {success && (
            <span style={{ color: "#16a34a" }} aria-live="polite">
              {t("modal.send") /* mostramos mismo texto como confirmación */}
            </span>
          )}
          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: submitting ? "#9CA3AF" : "#34A853",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
            aria-label={submitting ? "Enviando cotización" : "Enviar cotización"}
          >
            {submitting ? "Enviando..." : t("modal.send")}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
