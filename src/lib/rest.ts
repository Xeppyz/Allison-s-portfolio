// Acceso de solo lectura a Supabase para la web pública, sin la librería completa
// (supabase-js vive solo en el chunk del panel). ponytail: fetch directo a PostgREST.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const restConfigured = !!(url && key)

/** Si hay una sesión de admin vigente (guardada por el panel), se usa: así ve los borradores. */
function bearer(): string {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!
      if (!k.startsWith('sb-') || !k.endsWith('-auth-token')) continue
      const s = JSON.parse(localStorage.getItem(k) ?? 'null')
      if (s?.access_token && s.expires_at * 1000 > Date.now() + 30_000) return s.access_token
    }
  } catch {
    // sin almacenamiento: anónimo
  }
  return key!
}

/** GET a /rest/v1/<query> (ya codificada). */
export async function rest<T>(query: string): Promise<T> {
  const res = await fetch(`${url}/rest/v1/${query}`, {
    headers: { apikey: key!, authorization: `Bearer ${bearer()}` },
  })
  if (!res.ok) throw new Error(`supabase ${res.status}`)
  return (await res.json()) as T
}

/** POST a una Edge Function con la clave pública. */
export async function invokeFunction<T>(name: string, body: unknown): Promise<T> {
  const res = await fetch(`${url}/functions/v1/${name}`, {
    method: 'POST',
    headers: { apikey: key!, authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`función ${res.status}`)
  return (await res.json()) as T
}

export const eq = (v: string) => `eq.${encodeURIComponent(v)}`
