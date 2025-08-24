import { useState } from "react"
import ResponsiveModal from "./responsiveDialog"
import { useLanguage } from "./language-context"

type Option = {
  id: string
  label: string
  scores: Record<number, number> // servicioId -> weight
}

type Question = {
  id: string
  text: string
  options: Option[]
}

interface ServicePickerModalProps {
  open: boolean
  onClose: () => void
}

export default function ServicePickerModal({ open, onClose }: ServicePickerModalProps) {
  const { t } = useLanguage()
  const questions: Question[] = [
    {
      id: "q-bookkeeping",
      text: t("services.1.title")?.toString() ?? "Bookkeeping?",
      options: [
        { id: "b_full", label: t("services.1.title")?.toString() ?? "Full bookkeeping", scores: { 1: 3 } },
        { id: "b_partial", label: t("services.5.title")?.toString() ?? "Summaries only", scores: { 1: 1, 5: 1 } },
      ],
    },
    {
      id: "q-quickbooks",
      text: t("services.2.title")?.toString() ?? "QuickBooks?",
      options: [
        { id: "q_yes", label: t("services.2.title")?.toString() ?? "Need QuickBooks", scores: { 2: 4 } },
        { id: "q_no", label: "No", scores: {} },
      ],
    },
    {
      id: "q-control",
      text: t("services.3.title")?.toString() ?? "Income / Expense control?",
      options: [
        { id: "c_daily", label: t("services.3.title")?.toString() ?? "Detailed tracking", scores: { 3: 3 } },
        { id: "c_monthly", label: t("services.1.title")?.toString() ?? "Monthly review", scores: { 1: 1, 3: 1 } },
      ],
    },
    {
      id: "q-fiscal",
      text: t("services.4.title")?.toString() ?? "Tax / Compliance?",
      options: [
        { id: "f_full", label: t("services.4.title")?.toString() ?? "Full compliance", scores: { 4: 4 } },
        { id: "f_advise", label: t("entrepreneurPlan.title")?.toString() ?? "Occasional advisory", scores: { 6: 1 } },
      ],
    },
    {
      id: "q-reports",
      text: t("services.5.title")?.toString() ?? "Reports?",
      options: [
        { id: "r_monthly", label: t("services.5.title")?.toString() ?? "Monthly reports", scores: { 5: 4 } },
        { id: "r_basic", label: "Basic reports", scores: { 5: 1 } },
      ],
    },
    {
      id: "q-entrepreneur",
      text: t("entrepreneurPlan.title")?.toString() ?? "Entrepreneur plan?",
      options: [
        { id: "e_yes", label: t("entrepreneurPlan.title")?.toString() ?? "Yes, full plan", scores: { 6: 4 } },
        { id: "e_no", label: "No", scores: {} },
      ],
    },
  ]

  const [selected, setSelected] = useState<Record<string, Set<string>>>(
    () =>
      questions.reduce((acc, q) => {
        acc[q.id] = new Set<string>()
        return acc
      }, {} as Record<string, Set<string>>)
  )

  const [result, setResult] = useState<{ id: number; title: string; desc?: string } | null>(null)

  const toggleOption = (qId: string, optId: string) => {
    setSelected((prev) => {
      const copy: Record<string, Set<string>> = { ...prev }
      const set = new Set(copy[qId])
      if (set.has(optId)) set.delete(optId)
      else set.add(optId)
      copy[qId] = set
      return copy
    })
  }

  const computeRecommendation = () => {
    const scores: Record<number, number> = {}
    questions.forEach((q) => {
      const sel = Array.from(selected[q.id] ?? [])
      sel.forEach((optId) => {
        const option = q.options.find((o) => o.id === optId)
        if (option) {
          Object.entries(option.scores).forEach(([svcIdStr, w]) => {
            const svcId = Number(svcIdStr)
            scores[svcId] = (scores[svcId] ?? 0) + w
          })
        }
      })
    })

    const bestId =
      Object.keys(scores).length === 0
        ? 1
        : Number(Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0])

    const titleRaw = t(`services.${bestId}.title`)
    const descRaw = t(`services.${bestId}.desc`)
    const title = typeof titleRaw === "string" ? titleRaw : String(titleRaw)
    const desc = typeof descRaw === "string" ? descRaw : undefined

    setResult({ id: bestId, title, desc })
  }

  const reset = () => {
    setSelected(
      questions.reduce((acc, q) => {
        acc[q.id] = new Set<string>()
        return acc
      }, {} as Record<string, Set<string>>)
    )
    setResult(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const modalTitle =
    typeof t("hero.cta3") === "string" ? (t("hero.cta3") as string) : "Escoger paquete"

  return (
    <ResponsiveModal open={open} onClose={handleClose} title={modalTitle}>
      <div style={{ maxHeight: "70vh", overflowY: "auto", padding: 12 }}>
        {!result ? (
          <>
            <p style={{ marginBottom: 12 }}>{t("services.subtitle")?.toString() ?? "Selecciona las opciones que aplican a tu caso:"}</p>
            <div style={{ display: "grid", gap: 12 }}>
              {questions.map((q) => (
                <div key={q.id} style={{ borderRadius: 8, padding: 10, background: "#FBFCFF" }}>
                  <strong style={{ display: "block", marginBottom: 8 }}>{q.text}</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.options.map((opt) => (
                      <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          type="checkbox"
                          checked={selected[q.id]?.has(opt.id) ?? false}
                          onChange={() => toggleOption(q.id, opt.id)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
              <button type="button" onClick={handleClose} style={{ background: "#eee", padding: "0.5rem 1rem", borderRadius: 8 }}>
                {t("modal.close") ?? "Cancelar"}
              </button>
              <button
                type="button"
                onClick={computeRecommendation}
                style={{ background: "#34A853", color: "#fff", padding: "0.5rem 1rem", borderRadius: 8 }}
              >
                {t("services.seeDetails") ?? "Recomendar paquete"}
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <h3 style={{ margin: 0 }}>{result.title}</h3>
            {result.desc && <p style={{ margin: 0 }}>{result.desc}</p>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={reset} style={{ background: "#eee", padding: "0.5rem 1rem", borderRadius: 8 }}>
                {t("entrepreneurPlan.hideDetails") ?? "Volver"}
              </button>
              <button
                onClick={handleClose}
                style={{ background: "#34A853", color: "#fff", padding: "0.5rem 1rem", borderRadius: 8 }}
              >
                {t("modal.quoteTitle") ?? "Solicitar cotización"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ResponsiveModal>
  )
}