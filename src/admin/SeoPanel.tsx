import { useMemo } from 'react'
import { Check, AlertTriangle, X } from 'lucide-react'
import { scoreSeo, scoreTone, type SeoInput, type SeoStatus } from '../lib/seo-score'
import { eyebrow, toneCls } from './ui'

const ICON = { good: Check, warn: AlertTriangle, bad: X }
const ORDER: Record<SeoStatus, number> = { bad: 0, warn: 1, good: 2 }

/** Puntaje redondo pequeño para listas. */
export function ScoreBadge({ score, label = 'Puntaje SEO' }: { score: number; label?: string }) {
  const t = toneCls[scoreTone(score)]
  return (
    <span title={label} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${t.bg} ${t.text}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      <span className="sr-only">{label}: </span>SEO {score}
    </span>
  )
}

function Ring({ score }: { score: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  const tone = scoreTone(score)
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#F3EEE7" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={r} fill="none" stroke={toneCls[tone].ring} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-xl text-navy">{score}</span>
    </div>
  )
}

const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)

/** Vista previa de Google + puntaje + lista de comprobaciones, en vivo. */
export default function SeoPanel({ input, path }: { input: SeoInput; path: string }) {
  const { score, checks } = useMemo(() => scoreSeo(input), [input])
  const sorted = [...checks].sort((a, b) => ORDER[a.status] - ORDER[b.status])
  const crumbs = path.split('/').filter(Boolean).join(' › ')
  const tone = scoreTone(score)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Ring score={score} />
        <div>
          <p className={eyebrow}>Puntaje SEO</p>
          <p className="mt-1 text-sm text-navy/75" aria-live="polite">
            {tone === 'good' ? 'Muy bien optimizado.' : tone === 'warn' ? 'Bien, pero se puede mejorar.' : 'Necesita trabajo antes de publicar.'}
          </p>
        </div>
      </div>

      <div>
        <p className={`${eyebrow} mb-2`}>Así se verá en Google</p>
        <div className="rounded-xl border border-navy/10 bg-white p-4 font-[Arial,sans-serif]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sand">
              <img src="/qb-icon.svg" alt="" className="h-4 w-4" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm text-[#202124]">Allison Silva Taxes &amp; Accounting</p>
              <p className="truncate text-xs text-[#4d5156]">
                https://www.allisonsilvacorp.com{crumbs ? ` › ${crumbs}` : ''}
              </p>
            </div>
          </div>
          <p className="mt-2 text-lg leading-snug text-[#1a0dab]">{cut(input.title || 'Título del artículo', 62)}</p>
          <p className="mt-1 text-sm leading-relaxed text-[#4d5156]">
            {cut(input.description || 'Escribe una descripción para que Google no elija un fragmento al azar.', 160)}
          </p>
        </div>
      </div>

      <ul className="space-y-2.5">
        {sorted.map((c) => {
          const Icon = ICON[c.status]
          const t = toneCls[c.status]
          return (
            <li key={c.id} className="flex gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${t.bg} ${t.text}`}>
                <Icon className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy">
                  <span className="sr-only">{c.status === 'good' ? 'Bien: ' : c.status === 'warn' ? 'Mejorable: ' : 'Falta: '}</span>
                  {c.label}
                </p>
                {c.status !== 'good' && <p className="text-xs leading-relaxed text-navy/60">{c.hint}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
