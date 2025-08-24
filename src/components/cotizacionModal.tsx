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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    onClose(); // cerrar modal
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
        <div className="flex justify-end">
          <button
            type="submit"
            style={{
              backgroundColor: "#34A853", // verde de tu paleta
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            {t("modal.send")}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
