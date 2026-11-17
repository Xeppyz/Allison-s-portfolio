// Clases compartidas del panel: misma estética que la web (marfil, azul marino, taupe).
const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

export const btn = {
  primary: `${base} bg-navy px-5 text-white hover:bg-navy-deep`,
  secondary: `${base} border border-navy/20 bg-white px-4 text-navy hover:border-navy`,
  ghost: `${base} px-3 font-medium text-navy/70 hover:bg-sand hover:text-navy`,
  danger: `${base} border border-red-200 bg-white px-4 text-red-700 hover:border-red-400 hover:bg-red-50`,
}

export const card = 'rounded-2xl border border-navy/10 bg-white'
export const field =
  'w-full rounded-xl border border-navy/15 bg-white px-3.5 text-base text-navy placeholder:text-navy/40 transition focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15'
export const inputCls = `${field} h-11`
export const textareaCls = `${field} min-h-24 py-2.5 leading-relaxed`
export const labelCls = 'block text-sm font-semibold text-navy'
export const helpCls = 'text-xs leading-relaxed text-navy/60'
export const eyebrow = 'text-xs font-semibold uppercase tracking-[0.18em] text-taupe-deep'

export const toneCls = {
  good: { text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500', ring: '#10b981' },
  warn: { text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500', ring: '#f59e0b' },
  bad: { text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500', ring: '#ef4444' },
} as const
