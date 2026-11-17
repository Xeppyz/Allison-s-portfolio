import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, ExternalLink, PenLine, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { tables, type Field } from './fields'
import { FieldInput, type FormValue, type Pair } from './FieldInput'
import SeoPanel, { ScoreBadge } from './SeoPanel'
import { pageLabel, pageScore, pageSeoInput, pageUrl } from './scores'
import { btn, card, eyebrow } from './ui'
import { confirmDiscard, useUnsavedWarning } from './useDirty'

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

export default function Crud({ table, initial }: { table: string; initial?: string }) {
  const def = tables[table]
  const hasSort = def.fields.some((f) => f.name === 'sort')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState<Row | 'new' | null>(null)
  const [pending, setPending] = useState(initial)

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

  useEffect(() => {
    if (!pending || loading) return
    setEditing(pending === 'new' ? 'new' : (rows.find((r) => r.id === pending) ?? null))
    setPending(undefined)
  }, [pending, loading, rows])

  const errorBox = loadError ? <p role="alert" className="text-red-700">{loadError}</p> : null

  if (loading) {
    return <div className="space-y-3">{[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-sand" />)}</div>
  }

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

  const isPages = table === 'pages'

  return (
    <div className="space-y-5">
      {errorBox}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy/60">{rows.length} {rows.length === 1 ? 'elemento' : 'elementos'}</p>
        <button type="button" className={btn.primary} onClick={() => setEditing('new')}>
          <Plus className="h-4 w-4" /> Nuevo
        </button>
      </div>
      {rows.length === 0 && <p className={`${card} px-6 py-10 text-center text-navy/60`}>No hay elementos todavía.</p>}
      <ul className={`${card} divide-y divide-navy/10 overflow-hidden`}>
        {rows.map((row) => {
          const title = String(row[def.titleField] ?? '') || '(sin título)'
          return (
            <li key={String(row.id)} className="flex flex-wrap items-center gap-3 px-4 py-3 transition hover:bg-ivory">
              <button type="button" onClick={() => setEditing(row)}
                className="min-w-0 flex-1 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
                <span className="block break-words font-medium text-navy">{isPages ? pageLabel(row) : title}</span>
                {isPages && row.meta_title ? <span className="block truncate text-sm text-navy/60">{String(row.meta_title)}</span> : null}
              </button>
              {row.active === false && (
                <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-taupe-deep">{isPages ? 'Borrador' : 'Oculto'}</span>
              )}
              {table === 'testimonials' && row.authorized !== true && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Sin autorizar</span>
              )}
              {isPages && row.kind !== 'legal' && <ScoreBadge score={pageScore(row)} />}
              <div className="flex gap-1">
                <button type="button" aria-label={`Editar ${title}`} title="Editar" className={btn.ghost} onClick={() => setEditing(row)}>
                  <PenLine className="h-4 w-4" />
                </button>
                {isPages && row.active !== false && (
                  <a href={pageUrl(row)} target="_blank" rel="noopener" aria-label={`Ver ${title}`} title="Ver" className={btn.ghost}>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button type="button" aria-label={`Borrar ${title}`} title="Borrar"
                  className={`${btn.ghost} hover:bg-red-50 hover:text-red-700`} onClick={() => void remove(row)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          )
        })}
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
  const [saved, setSaved] = useState<Form>(() => toForm(def.fields, row))
  const [saving, setSaving] = useState(false)
  const [uploads, setUploads] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const dirty = JSON.stringify(form) !== JSON.stringify(saved)
  useUnsavedWarning(dirty)

  const isPage = table === 'pages'
  const seoInput = useMemo(() => (isPage ? pageSeoInput(toPayload(def.fields, form)) : null), [isPage, def, form])

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
    setSaved(form)
    setStatus('Guardado')
    window.setTimeout(() => setStatus(''), 2500)
    await onSaved()
  }

  const fields = (
    <div className={`${card} space-y-5 p-5 sm:p-6`}>
      {def.fields.map((f) => (
        <FieldInput
          key={f.name}
          field={f}
          value={form[f.name]}
          onChange={(v) => setForm((prev) => ({ ...prev, [f.name]: v }))}
          onBusy={(b) => setUploads((n) => n + (b ? 1 : -1))}
        />
      ))}
    </div>
  )

  return (
    <form onSubmit={save} className="pb-24">
      {onBack && (
        <button type="button" className={`${btn.ghost} mb-4`} onClick={() => confirmDiscard(dirty) && onBack()}>
          <ArrowLeft className="h-4 w-4" /> Volver a la lista
        </button>
      )}
      {isPage && seoInput && form.kind !== 'legal' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {fields}
          <aside className={`${card} h-fit space-y-4 p-5 lg:sticky lg:top-6`}>
            <h2 className={eyebrow} style={{ fontFamily: 'inherit' }}>SEO de la página</h2>
            <SeoPanel input={seoInput} path={String(form.slug) === 'inicio' ? '/' : pageUrl(form)} />
          </aside>
        </div>
      ) : (
        <div className="max-w-3xl">{fields}</div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <p className="mr-auto text-sm" role="status" aria-live="polite">
            {status ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700"><Check className="h-4 w-4" />{status}</span>
            ) : error ? (
              <span className="text-red-700">{error}</span>
            ) : dirty ? (
              <span className="text-amber-700">Cambios sin guardar</span>
            ) : (
              <span className="text-navy/50">Todo guardado</span>
            )}
          </p>
          <button type="submit" disabled={saving || uploads > 0} className={btn.primary}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  )
}
