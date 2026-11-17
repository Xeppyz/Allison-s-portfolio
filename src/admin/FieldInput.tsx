import { useRef, useState } from 'react'
import { ImagePlus, Plus, Trash2 } from 'lucide-react'
import type { Field } from './fields'
import { uploadImage } from './upload'
import { btn, helpCls, inputCls, labelCls, textareaCls } from './ui'

export type Pair = { title: string; text: string }
export type FormValue = string | boolean | string[] | Pair[]

const iconBtn =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-navy/50 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy'

function ListInput({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            id={i === 0 ? id : undefined}
            aria-label={`Elemento ${i + 1}`}
            className={inputCls}
            value={item}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button type="button" aria-label={`Quitar elemento ${i + 1}`} className={iconBtn}
            onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" className={btn.ghost} onClick={() => onChange([...value, ''])}>
        <Plus className="h-4 w-4" /> Añadir
      </button>
    </div>
  )
}

function PairsInput({ value, onChange }: { value: Pair[]; onChange: (v: Pair[]) => void }) {
  const set = (i: number, patch: Partial<Pair>) =>
    onChange(value.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  return (
    <div className="space-y-3">
      {value.map((p, i) => (
        <div key={i} className="flex gap-2 rounded-xl border border-navy/10 bg-ivory p-3">
          <span className="mt-2.5 w-5 shrink-0 text-center font-serif text-sm text-taupe-deep">{i + 1}</span>
          <div className="min-w-0 flex-1 space-y-2">
            <input className={inputCls} placeholder="Título" aria-label={`Título ${i + 1}`} value={p.title}
              onChange={(e) => set(i, { title: e.target.value })} />
            <textarea className={textareaCls} placeholder="Texto" aria-label={`Texto ${i + 1}`} value={p.text}
              onChange={(e) => set(i, { text: e.target.value })} />
          </div>
          <button type="button" aria-label={`Quitar ${i + 1}`} className={iconBtn}
            onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" className={btn.ghost} onClick={() => onChange([...value, { title: '', text: '' }])}>
        <Plus className="h-4 w-4" /> Añadir
      </button>
    </div>
  )
}

export function ImageInput({
  id, value, onChange, onBusy, wide,
}: { id: string; value: string; onChange: (v: string) => void; onBusy?: (b: boolean) => void; wide?: boolean }) {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  async function pick(file: File | undefined) {
    if (!file) return
    setMsg('')
    setBusy(true)
    onBusy?.(true)
    try {
      onChange(await uploadImage(file))
    } catch (err) {
      setMsg((err as Error).message)
    } finally {
      setBusy(false)
      onBusy?.(false)
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-navy/10 bg-sand">
          <img src={value} alt="" className={`w-full object-cover ${wide ? 'aspect-video' : 'aspect-[4/3] max-h-40'}`} />
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-navy/70 to-transparent p-2">
            <button type="button" className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-navy"
              onClick={() => input.current?.click()} disabled={busy}>Cambiar</button>
            <button type="button" className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-red-700"
              onClick={() => onChange('')}>Quitar</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => input.current?.click()} disabled={busy}
          className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-navy/25 bg-ivory text-navy/60 transition hover:border-navy hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${wide ? 'aspect-video' : 'py-6'}`}>
          <ImagePlus className={`h-6 w-6 ${busy ? 'animate-pulse' : ''}`} />
          <span className="text-sm font-medium">{busy ? 'Optimizando y subiendo…' : 'Subir imagen'}</span>
          <span className="text-xs">PNG, JPG o WebP · se convierte a WebP</span>
        </button>
      )}
      <input id={id} ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" tabIndex={-1}
        onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = '' }} />
      {msg && <p role="alert" className="text-sm text-red-700">{msg}</p>}
    </div>
  )
}

export function Toggle({ id, checked, onChange, label, help }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string; help?: string
}) {
  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input id={id} type="checkbox" role="switch" className="peer sr-only" checked={checked}
          onChange={(e) => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-navy/15 transition peer-checked:bg-navy peer-focus-visible:ring-2 peer-focus-visible:ring-navy peer-focus-visible:ring-offset-2" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-navy">{label}</span>
        {help && <span className={`block ${helpCls}`}>{help}</span>}
      </span>
    </label>
  )
}

/** Contador de caracteres con color según el rango ideal. */
export function Counter({ n, min, max }: { n: number; min: number; max: number }) {
  const cls = n === 0 ? 'text-navy/40' : n >= min && n <= max ? 'text-emerald-700' : 'text-amber-700'
  return <span className={`text-xs tabular-nums ${cls}`}>{n} / {max}</span>
}

const LIMITS: Record<string, [number, number]> = { meta_title: [30, 60], meta_description: [120, 160] }

export function FieldInput({
  field, value, onChange, onBusy,
}: { field: Field; value: FormValue; onChange: (v: FormValue) => void; onBusy?: (b: boolean) => void }) {
  const id = `f-${field.name}`
  const str = typeof value === 'string' ? value : ''

  if (field.kind === 'bool') {
    return <Toggle id={id} checked={value === true} onChange={onChange} label={field.label} help={field.help} />
  }

  let control
  switch (field.kind) {
    case 'textarea':
      control = <textarea id={id} rows={4} className={textareaCls} value={str} onChange={(e) => onChange(e.target.value)} />
      break
    case 'select':
      control = (
        <select id={id} className={inputCls} value={str} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )
      break
    case 'list':
      control = <ListInput id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
      break
    case 'pairs':
      control = <PairsInput value={Array.isArray(value) ? (value as Pair[]) : []} onChange={onChange} />
      break
    case 'image':
      control = <ImageInput id={id} value={str} onChange={onChange} onBusy={onBusy} />
      break
    default: {
      const type = field.kind === 'date' ? 'date' : field.kind === 'number' ? 'number' : 'text'
      control = <input id={id} type={type} className={inputCls} value={str} onChange={(e) => onChange(e.target.value)} />
    }
  }

  const limit = LIMITS[field.name]
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={labelCls}>{field.label}</label>
        {limit && <Counter n={str.length} min={limit[0]} max={limit[1]} />}
      </div>
      {control}
      {field.help && <p className={helpCls}>{field.help}</p>}
    </div>
  )
}
