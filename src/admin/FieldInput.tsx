import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import type { Field } from './fields'

export type Pair = { title: string; text: string }
export type FormValue = string | boolean | string[] | Pair[]

const MAX_BYTES = 2 * 1024 * 1024
const EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }
const inputCls = 'h-11 text-base'
const smallBtn =
  'min-h-11 rounded-md border border-[#1E3A5F] px-3 text-sm font-medium text-[#1E3A5F] hover:bg-slate-50'
const dangerBtn =
  'min-h-11 rounded-md border border-red-300 px-3 text-sm font-medium text-red-700 hover:bg-red-50'

function ListInput({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            id={i === 0 ? id : undefined}
            className={inputCls}
            value={item}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button type="button" className={dangerBtn} onClick={() => onChange(value.filter((_, j) => j !== i))}>
            Quitar
          </button>
        </div>
      ))}
      <button type="button" className={smallBtn} onClick={() => onChange([...value, ''])}>
        Añadir
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
        <div key={i} className="space-y-2 rounded-md border border-slate-200 p-3">
          <Input
            className={inputCls}
            placeholder="Título"
            aria-label="Título"
            value={p.title}
            onChange={(e) => set(i, { title: e.target.value })}
          />
          <Textarea
            placeholder="Texto"
            aria-label="Texto"
            value={p.text}
            onChange={(e) => set(i, { text: e.target.value })}
          />
          <button type="button" className={dangerBtn} onClick={() => onChange(value.filter((_, j) => j !== i))}>
            Quitar
          </button>
        </div>
      ))}
      <button type="button" className={smallBtn} onClick={() => onChange([...value, { title: '', text: '' }])}>
        Añadir
      </button>
    </div>
  )
}

function ImageInput({
  id, value, onChange, onBusy,
}: { id: string; value: string; onChange: (v: string) => void; onBusy?: (b: boolean) => void }) {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function pick(file: File | undefined) {
    if (!file || !supabase) return
    setMsg('')
    const ext = EXT[file.type]
    if (!ext) {
      setMsg('Solo se aceptan imágenes PNG, JPG o WebP')
      return
    }
    if (file.size > MAX_BYTES) {
      setMsg('La imagen supera 2 MB')
      return
    }
    setBusy(true)
    onBusy?.(true)
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type })
    setBusy(false)
    onBusy?.(false)
    if (error) {
      setMsg(error.message)
      return
    }
    onChange(supabase.storage.from('media').getPublicUrl(path).data.publicUrl)
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-3">
          <img src={value} alt="" className="h-20 w-20 rounded-md border border-slate-200 object-cover" />
          <button type="button" className={dangerBtn} onClick={() => onChange('')}>
            Quitar imagen
          </button>
        </div>
      )}
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="block min-h-11 w-full text-sm"
        disabled={busy}
        onChange={(e) => {
          void pick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {busy && <p className="text-sm text-slate-600">Subiendo…</p>}
      {msg && <p role="alert" className="text-sm text-red-700">{msg}</p>}
    </div>
  )
}

export function FieldInput({
  field, value, onChange, onBusy,
}: { field: Field; value: FormValue; onChange: (v: FormValue) => void; onBusy?: (b: boolean) => void }) {
  const id = `f-${field.name}`
  const str = typeof value === 'string' ? value : ''

  let control
  switch (field.kind) {
    case 'bool':
      control = (
        <label className="flex min-h-11 items-center gap-3">
          <input
            id={id}
            type="checkbox"
            className="size-5"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-sm font-medium">{field.label}</span>
        </label>
      )
      break
    case 'textarea':
      control = <Textarea id={id} rows={4} value={str} onChange={(e) => onChange(e.target.value)} />
      break
    case 'select':
      control = (
        <select
          id={id}
          className="h-11 w-full rounded-md border border-input bg-white px-3 text-base"
          value={str}
          onChange={(e) => onChange(e.target.value)}
        >
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
      control = (
        <Input id={id} type={type} className={inputCls} value={str} onChange={(e) => onChange(e.target.value)} />
      )
    }
  }

  return (
    <div className="space-y-1">
      {field.kind !== 'bool' && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-800">{field.label}</label>
      )}
      {control}
      {field.help && <p className="text-xs text-slate-600">{field.help}</p>}
    </div>
  )
}
