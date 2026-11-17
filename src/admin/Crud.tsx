import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Badge } from '../components/ui/badge'
import { tables, type Field } from './fields'
import { FieldInput, type FormValue, type Pair } from './FieldInput'

type Row = Record<string, unknown>
type Form = Record<string, FormValue>

// Estas dos columnas se guardan como '' (no null) cuando se dejan vacías.
const EMPTY_STRING_COLUMNS = new Set(['whatsapp_number', 'gtm_id'])

const REQUIRE_SLUG = new Set(['pages', 'plans'])

const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []

function toForm(fields: Field[], row: Row | null): Form {
  const form: Form = {}
  for (const f of fields) {
    const v = row?.[f.name]
    switch (f.kind) {
      case 'bool':
        form[f.name] = row ? v === true : f.name === 'active'
        break
      case 'list':
        form[f.name] = asStrings(v)
        break
      case 'tags':
        form[f.name] = asStrings(v).join(', ')
        break
      case 'pairs':
        form[f.name] = (Array.isArray(v) ? v : []).map((p): Pair => {
          const o = (p ?? {}) as Record<string, unknown>
          return { title: String(o.title ?? ''), text: String(o.text ?? '') }
        })
        break
      case 'number':
        form[f.name] = v == null ? '0' : String(v)
        break
      default:
        form[f.name] = v == null ? '' : String(v)
    }
  }
  return form
}

function toPayload(fields: Field[], form: Form): Row {
  const out: Row = {}
  for (const f of fields) {
    const v = form[f.name]
    switch (f.kind) {
      case 'bool':
        out[f.name] = v === true
        break
      case 'list':
        out[f.name] = (v as string[]).map((s) => s.trim()).filter(Boolean)
        break
      case 'tags':
        out[f.name] = String(v).split(',').map((s) => s.trim()).filter(Boolean)
        break
      case 'pairs':
        out[f.name] = (v as Pair[])
          .map((p) => ({ title: p.title.trim(), text: p.text.trim() }))
          .filter((p) => p.title || p.text)
        break
      case 'number':
        out[f.name] = Number.parseInt(String(v), 10) || 0
        break
      default: {
        const s = String(v)
        out[f.name] = s === '' ? (EMPTY_STRING_COLUMNS.has(f.name) ? '' : null) : s
      }
    }
  }
  return out
}

export default function Crud({ table }: { table: string }) {
  const def = tables[table]
  const hasSort = def.fields.some((f) => f.name === 'sort')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState<Row | 'new' | null>(null)

  const load = useCallback(async () => {
    if (!supabase) return
    let q = supabase.from(table).select('*')
    if (def.single) q = q.eq('id', 1)
    else {
      if (hasSort) q = q.order('sort', { ascending: true })
      q = q.order(def.titleField, { ascending: true })
    }
    const { data, error } = await q
    if (error) setLoadError(error.message)
    else {
      setLoadError('')
      setRows((data ?? []) as Row[])
    }
    setLoading(false)
  }, [table, def, hasSort])

  useEffect(() => {
    void load()
  }, [load])

  const errorBox = loadError ? (
    <p role="alert" className="text-red-700">{loadError}</p>
  ) : null

  if (loading) return <p className="text-slate-600">Cargando…</p>

  if (def.single) {
    return (
      <div className="space-y-4">
        {errorBox}
        <RowForm table={table} row={rows[0] ?? null} single onSaved={load} />
      </div>
    )
  }

  if (editing) {
    return (
      <div className="space-y-4">
        {errorBox}
        <RowForm
          key={editing === 'new' ? 'new' : String(editing.id)}
          table={table}
          row={editing === 'new' ? null : editing}
          onSaved={load}
          onBack={() => setEditing(null)}
        />
      </div>
    )
  }

  async function remove(row: Row) {
    const title = String(row[def.titleField] ?? '')
    if (!window.confirm(`¿Borrar “${title}”? No se puede deshacer.`)) return
    const { error } = await supabase!.from(table).delete().eq('id', row.id as string)
    if (error) setLoadError(error.message)
    else {
      setLoadError('')
      await load()
    }
  }

  return (
    <div className="space-y-4">
      {errorBox}
      <button
        type="button"
        className="min-h-11 rounded-md bg-[#1E3A5F] px-4 text-sm font-medium text-white hover:bg-[#16304f]"
        onClick={() => setEditing('new')}
      >
        Nuevo
      </button>
      {rows.length === 0 && <p className="text-slate-600">No hay elementos todavía.</p>}
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={String(row.id)}
            className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white p-3"
          >
            <span className="min-w-0 flex-1 break-words font-medium">
              {String(row[def.titleField] ?? '') || '(sin título)'}
            </span>
            {row.active === false && <Badge variant="secondary">Inactivo</Badge>}
            {table === 'testimonials' && row.authorized !== true && (
              <Badge variant="outline">Sin autorizar</Badge>
            )}
            <button
              type="button"
              className="min-h-11 rounded-md border border-[#1E3A5F] px-3 text-sm font-medium text-[#1E3A5F]"
              onClick={() => setEditing(row)}
            >
              Editar
            </button>
            <button
              type="button"
              className="min-h-11 rounded-md border border-red-300 px-3 text-sm font-medium text-red-700"
              onClick={() => void remove(row)}
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RowForm({
  table, row, single, onSaved, onBack,
}: {
  table: string
  row: Row | null
  single?: boolean
  onSaved: () => Promise<void>
  onBack?: () => void
}) {
  const def = tables[table]
  // Tras crear, el formulario sigue abierto y los guardados siguientes actualizan esa fila.
  const [current, setCurrent] = useState<Row | null>(row)
  const [form, setForm] = useState<Form>(() => toForm(def.fields, row))
  const [saving, setSaving] = useState(false)
  const [uploads, setUploads] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setStatus('')
    setError('')
    if (REQUIRE_SLUG.has(table) && String(form.slug ?? '').trim() === '') {
      setError('El campo slug es obligatorio')
      return
    }
    if (table === 'plans' && String(form.group ?? '').trim() === '') {
      setError('El campo grupo es obligatorio')
      return
    }
    setSaving(true)
    const payload = toPayload(def.fields, form)
    let err: { message: string } | null
    if (single) {
      err = (await supabase.from(table).upsert({ id: 1, ...payload })).error
    } else if (current) {
      err = (await supabase.from(table).update(payload).eq('id', current.id as string)).error
    } else {
      const res = await supabase.from(table).insert(payload).select().single()
      err = res.error
      if (!err && res.data) setCurrent(res.data as Row)
    }
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setStatus('Guardado')
    await onSaved()
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      {onBack && (
        <button type="button" className="min-h-11 text-sm font-medium text-[#1E3A5F] underline" onClick={onBack}>
          ← Volver a la lista
        </button>
      )}
      {def.fields.map((f) => (
        <FieldInput
          key={f.name}
          field={f}
          value={form[f.name]}
          onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
          onBusy={(b) => setUploads((n) => n + (b ? 1 : -1))}
        />
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploads > 0}
          className="min-h-11 rounded-md bg-[#1E3A5F] px-5 text-sm font-medium text-white hover:bg-[#16304f] disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
        {status && <p role="status" className="text-sm font-medium text-green-700">{status}</p>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      </div>
    </form>
  )
}
