import { useEffect, useState } from 'react'
import { eq, rest, restConfigured } from './rest'

export interface Settings {
  id: number
  whatsapp_number: string | null
  phone: string | null
  email: string | null
  hours: string | null
  address: string | null
  gbp_url: string | null
  gtm_id: string | null
  credentials: unknown[] | null
}

export interface Page {
  id: string
  slug: string
  lang: string | null
  kind: 'home' | 'service' | 'legal' | null
  meta_title: string | null
  meta_description: string | null
  h1: string | null
  subheadline: string | null
  benefits: { title: string; text?: string }[] | null
  bonus_text: string | null
  bonus_deadline: string | null
  guarantee: string | null
  wa_message: string | null
  body: string | null
  active: boolean
  noindex: boolean
  og_image_url: string | null
  alt_slug: string | null
  legal_note: string | null
}

export interface Service {
  id: string
  sort: number | null
  active: boolean | null
  title: string | null
  description: string | null
  details: unknown[] | null
  link: string | null
}

export interface Plan {
  id: string
  sort: number | null
  active: boolean | null
  slug: string | null
  name: string | null
  price_text: string | null
  description: string | null
  name_en: string | null
  price_text_en: string | null
  description_en: string | null
  features: unknown[] | null
  group: 'empresa' | 'llc' | 'personal' | 'certificacion' | 'addon' | null
  cta: 'planes' | 'whatsapp' | null
  page_slugs: string[] | null
}

export interface Testimonial {
  id: string
  sort: number | null
  active: boolean | null
  name: string | null
  position: string | null
  company: string | null
  quote: string | null
  problem: string | null
  benefit: string | null
  satisfaction: string | null
  photo_url: string | null
  logo_url: string | null
  authorized: boolean | null
}

export interface Faq {
  id: string
  sort: number | null
  active: boolean | null
  page_slug: string | null
  question: string | null
  answer: string | null
}

export interface Lead {
  id: string
  sort: number | null
  active: boolean | null
  name: string | null
  contact: string | null
  company: string | null
  country: string | null
  service: string | null
  message: string | null
  page: string | null
  utm: unknown
  created_at: string | null
}

export interface Post {
  id: string
  slug: string
  title: string
  seo_title: string | null
  excerpt: string | null
  focus_keyword: string | null
  content_html: string
  cover_url: string | null
  cover_alt: string | null
  tags: string[]
  published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export type PostCard = Pick<Post, 'id' | 'slug' | 'title' | 'excerpt' | 'cover_url' | 'cover_alt' | 'published_at'>

export interface QueryState<T> {
  data: T | null
  loading: boolean
  error: boolean
}

const TIMEOUT_MS = 8000
const cache = new Map<string, unknown>()
const inflight = new Map<string, Promise<unknown>>()

// El servidor deja el artículo (o la lista) en #__seed: la primera pintura no espera a Supabase.
if (typeof document !== 'undefined') {
  const el = document.getElementById('__seed')
  try {
    const { key, data } = JSON.parse(el?.textContent ?? 'null') ?? {}
    if (typeof key === 'string' && data) cache.set(key, data)
  } catch {
    // sin semilla: se consulta como siempre
  }
}

function load<T>(key: string, fn: () => PromiseLike<T>): Promise<T> {
  let p = inflight.get(key) as Promise<T> | undefined
  if (!p) {
    p = new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
      Promise.resolve(fn()).then(
        (v) => { clearTimeout(timer); resolve(v) },
        (e) => { clearTimeout(timer); reject(e) },
      )
    })
    inflight.set(key, p)
    const clear = () => inflight.delete(key)
    p.then(clear, clear)
  }
  return p
}

function useQuery<T>(key: string, fn: () => PromiseLike<T>, enabled = true): QueryState<T> {
  const [state, setState] = useState<{ key: string; data: T | null; error: boolean } | null>(null)

  useEffect(() => {
    if (!enabled || cache.has(key) || !restConfigured) return
    let cancelled = false
    load(key, fn).then(
      (data) => { cache.set(key, data); if (!cancelled) setState({ key, data, error: false }) },
      () => { if (!cancelled) setState({ key, data: null, error: true }) },
    )
    return () => { cancelled = true }
    // fn se recrea en cada render; la clave identifica la consulta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (!enabled) return { data: null, loading: false, error: false }
  if (!restConfigured) return { data: null, loading: false, error: true }
  if (cache.has(key)) return { data: cache.get(key) as T, loading: false, error: false }
  if (state && state.key === key) return { data: state.data, loading: false, error: state.error }
  return { data: null, loading: true, error: false }
}

const first = async <T,>(q: string): Promise<T | null> => (await rest<T[]>(q))[0] ?? null

export function useSettings(): QueryState<Settings> {
  return useQuery<Settings | null>('settings', () => first<Settings>('site_settings?select=*&id=eq.1')) as QueryState<Settings>
}

/** Con slug vacío no consulta nada (data null, sin carga). */
export function usePage(slug: string): QueryState<Page | null> {
  return useQuery<Page | null>(`page:${slug}`, () => first<Page>(`pages?select=*&slug=${eq(slug)}`), slug !== '')
}

export function usePlans(pageSlug: string): QueryState<Plan[]> {
  return useQuery<Plan[]>(`plans:${pageSlug}`, () =>
    rest<Plan[]>(`plans?select=*&active=eq.true&page_slugs=cs.%7B${encodeURIComponent(pageSlug)}%7D&order=sort.asc`),
  )
}

export function useFaqs(pageSlug: string): QueryState<Faq[]> {
  return useQuery<Faq[]>(`faqs:${pageSlug}`, () =>
    rest<Faq[]>(`faqs?select=*&active=eq.true&page_slug=${eq(pageSlug)}&order=sort.asc`),
  )
}

export function useServices(): QueryState<Service[]> {
  return useQuery<Service[]>('services', () => rest<Service[]>('services?select=*&active=eq.true&order=sort.asc'))
}

/** Artículos publicados, del más nuevo al más viejo (sin el contenido). */
export function usePosts(): QueryState<PostCard[]> {
  return useQuery<PostCard[]>('posts', () =>
    rest<PostCard[]>('posts?select=id,slug,title,excerpt,cover_url,cover_alt,published_at&published=eq.true&order=published_at.desc'),
  )
}

/** Un artículo; los borradores solo los ve un admin con sesión (RLS). */
export function usePost(slug: string): QueryState<Post | null> {
  return useQuery<Post | null>(`post:${slug}`, () => first<Post>(`posts?select=*&slug=${eq(slug)}`), slug !== '')
}

export function useTestimonials(): QueryState<Testimonial[]> {
  return useQuery<Testimonial[]>('testimonials', () =>
    rest<Testimonial[]>('testimonials?select=*&active=eq.true&order=sort.asc'),
  )
}
