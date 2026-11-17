import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// null cuando faltan las variables: los hooks devuelven error en vez de romper la app.
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null
