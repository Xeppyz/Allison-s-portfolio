import { useEffect, useState } from 'react'
import { supabase } from './supabase'

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

export interface QueryState<T> {
  data: T | null
  loading: boolean
  error: boolean
}

const TIMEOUT_MS = 8000
const cache = new Map<string, unknown>()
const inflight = new Map<string, Promise<unknown>>()

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

function useQuery<T>(key: string, fn: () => PromiseLike<T>): QueryState<T> {
  const [state, setState] = useState<{ key: string; data: T | null; error: boolean } | null>(null)

  useEffect(() => {
    if (cache.has(key) || !supabase) return
    let cancelled = false
    load(key, fn).then(
      (data) => { cache.set(key, data); if (!cancelled) setState({ key, data, error: false }) },
      () => { if (!cancelled) setState({ key, data: null, error: true }) },
    )
    return () => { cancelled = true }
    // fn se recrea en cada render; la clave identifica la consulta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (!supabase) return { data: null, loading: false, error: true }
  if (cache.has(key)) return { data: cache.get(key) as T, loading: false, error: false }
  if (state && state.key === key) return { data: state.data, loading: false, error: state.error }
  return { data: null, loading: true, error: false }
}

function unwrap<T>(res: { data: T | null; error: unknown }): T | null {
  if (res.error) throw res.error
  return res.data
}

export function useSettings(): QueryState<Settings> {
  return useQuery<Settings | null>('settings', async () =>
    unwrap(await supabase!.from('site_settings').select('*').eq('id', 1).maybeSingle<Settings>()),
  ) as QueryState<Settings>
}

export function usePage(slug: string): QueryState<Page | null> {
  return useQuery<Page | null>(`page:${slug}`, async () =>
    unwrap(await supabase!.from('pages').select('*').eq('slug', slug).maybeSingle<Page>()),
  )
}

export function usePlans(pageSlug: string): QueryState<Plan[]> {
  return useQuery<Plan[]>(`plans:${pageSlug}`, async () =>
    unwrap(
      await supabase!.from('plans').select('*').eq('active', true)
        .contains('page_slugs', [pageSlug]).order('sort').returns<Plan[]>(),
    ) ?? [],
  )
}

export function useFaqs(pageSlug: string): QueryState<Faq[]> {
  return useQuery<Faq[]>(`faqs:${pageSlug}`, async () =>
    unwrap(
      await supabase!.from('faqs').select('*').eq('active', true)
        .eq('page_slug', pageSlug).order('sort').returns<Faq[]>(),
    ) ?? [],
  )
}

export function useServices(): QueryState<Service[]> {
  return useQuery<Service[]>('services', async () =>
    unwrap(
      await supabase!.from('services').select('*').eq('active', true)
        .order('sort').returns<Service[]>(),
    ) ?? [],
  )
}

export function useTestimonials(): QueryState<Testimonial[]> {
  return useQuery<Testimonial[]>('testimonials', async () =>
    unwrap(
      await supabase!.from('testimonials').select('*').eq('active', true)
        .order('sort').returns<Testimonial[]>(),
    ) ?? [],
  )
}
