import { useCallback, useEffect, useState } from 'react'
import { Plus, PenLine, ExternalLink, Trash2, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Post } from '../lib/content'
import { formatDate } from '../lib/html'
import { postScore } from './scores'
import PostEditor from './PostEditor'
import { ScoreBadge } from './SeoPanel'
import { btn, card } from './ui'

export default function Posts({ initial }: { initial?: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Post | 'new' | null>(null)
  const [pending, setPending] = useState(initial)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase.from('posts').select('*').order('published_at', { ascending: false })
    if (error) setError(error.message)
    else {
      setError('')
      setPosts((data ?? []) as Post[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  // Abrir directamente un artículo (desde el Resumen).
  useEffect(() => {
    if (!pending || loading) return
    setEditing(pending === 'new' ? 'new' : (posts.find((p) => p.id === pending) ?? null))
    setPending(undefined)
  }, [pending, loading, posts])

  async function remove(p: Post) {
    if (!window.confirm(`¿Borrar “${p.title}”? No se puede deshacer.`)) return
    const { error } = await supabase!.from('posts').delete().eq('id', p.id)
    if (error) setError(error.message)
    else await load()
  }

  if (editing) {
    return (
      <PostEditor
        key={editing === 'new' ? 'new' : editing.id}
        post={editing === 'new' ? null : editing}
        onBack={() => { setEditing(null); void load() }}
        onSaved={() => void load()}
      />
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy/60">
          {posts.filter((p) => p.published).length} publicados · {posts.filter((p) => !p.published).length} borradores
        </p>
        <button type="button" className={btn.primary} onClick={() => setEditing('new')}>
          <Plus className="h-4 w-4" /> Nuevo artículo
        </button>
      </div>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-sand" />)}</div>
      ) : posts.length === 0 ? (
        <div className={`${card} flex flex-col items-center gap-3 px-6 py-14 text-center`}>
          <FileText className="h-8 w-8 text-taupe" />
          <p className="font-serif text-xl text-navy">Aún no hay artículos</p>
          <button type="button" className={btn.primary} onClick={() => setEditing('new')}>Escribir el primero</button>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className={`${card} flex flex-wrap items-center gap-4 p-3 pr-4 transition hover:border-taupe/60`}>
              <button type="button" onClick={() => setEditing(p)} className="flex min-w-0 flex-1 items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-xl">
                <span className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-sand">
                  {p.cover_url && <img src={p.cover_url} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 font-serif text-lg leading-snug text-navy">{p.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-navy/60">
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${p.published ? 'bg-emerald-50 text-emerald-700' : 'bg-sand text-taupe-deep'}`}>
                      {p.published ? 'Publicado' : 'Borrador'}
                    </span>
                    {formatDate(p.published_at)}
                  </span>
                </span>
              </button>
              <ScoreBadge score={postScore(p)} />
              <div className="flex gap-1">
                <button type="button" aria-label={`Editar ${p.title}`} title="Editar" className={btn.ghost} onClick={() => setEditing(p)}>
                  <PenLine className="h-4 w-4" />
                </button>
                <a href={`/blog/${p.slug}`} target="_blank" rel="noopener" aria-label={`Ver ${p.title}`} title="Ver" className={btn.ghost}>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button type="button" aria-label={`Borrar ${p.title}`} title="Borrar" className={`${btn.ghost} hover:bg-red-50 hover:text-red-700`} onClick={() => void remove(p)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
