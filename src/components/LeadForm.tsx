import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useServices } from '../lib/content'
import { getUtm } from '../lib/utm'
import { track } from '../lib/track'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const COUNTRIES = ['Nicaragua', 'Estados Unidos', 'Otro']
const SELECT_CLASS =
  'h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]'
const LABEL_CLASS = 'mb-1 block text-sm font-medium text-[#1E3A5F]'

export default function LeadForm() {
  const services = useServices()
  const startedAt = useRef(Date.now())
  const [values, setValues] = useState({
    name: '',
    contact: '',
    company: '',
    country: COUNTRIES[0],
    service: 'Otro',
    message: '',
    website: '',
  })
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const set =
    (field: keyof typeof values) =>
    (e: { target: { value: string } }) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }))

  const titles = (services.data ?? []).map((s) => s.title).filter((t): t is string => !!t)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSending(true)
    setStatus('idle')
    try {
      if (!supabase) throw new Error('supabase no configurado')
      const { data, error } = await supabase.functions.invoke('lead', {
        body: {
          ...values,
          page: location.pathname,
          utm: getUtm(),
          elapsedMs: Date.now() - startedAt.current,
        },
      })
      if (error || !data || data.ok !== true) throw error ?? new Error('respuesta inválida')
      setStatus('success')
      track('form_submit')
    } catch {
      setStatus('error')
    } finally {
      setSending(false)
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="rounded-lg bg-green-50 p-4 font-medium text-green-800">
        Recibimos tu mensaje. Te respondemos en menos de un día hábil.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-4">
      <div>
        <label htmlFor="lead-name" className={LABEL_CLASS}>Nombre</label>
        <Input id="lead-name" name="name" required maxLength={200} autoComplete="name" value={values.name} onChange={set('name')} />
      </div>
      <div>
        <label htmlFor="lead-contact" className={LABEL_CLASS}>WhatsApp o correo</label>
        <Input id="lead-contact" name="contact" required maxLength={200} value={values.contact} onChange={set('contact')} />
      </div>
      <div>
        <label htmlFor="lead-company" className={LABEL_CLASS}>Empresa (opcional)</label>
        <Input id="lead-company" name="company" maxLength={200} autoComplete="organization" value={values.company} onChange={set('company')} />
      </div>
      <div>
        <label htmlFor="lead-country" className={LABEL_CLASS}>País</label>
        <select id="lead-country" name="country" className={SELECT_CLASS} value={values.country} onChange={set('country')}>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lead-service" className={LABEL_CLASS}>Servicio</label>
        <select id="lead-service" name="service" className={SELECT_CLASS} value={values.service} onChange={set('service')}>
          {titles.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div>
        <label htmlFor="lead-message" className={LABEL_CLASS}>Mensaje</label>
        <Textarea id="lead-message" name="message" required maxLength={2000} rows={4} value={values.message} onChange={set('message')} />
      </div>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="lead-website">Sitio web</label>
        <input id="lead-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>
      {status === 'error' && (
        <p role="alert" className="text-sm font-medium text-red-700">
          No pudimos enviar tu mensaje. Escríbenos a info@allisonsilvacorp.com.
        </p>
      )}
      <Button type="submit" disabled={sending} className="min-h-11 w-full bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90">
        {sending ? 'Enviando…' : 'Enviar'}
      </Button>
    </form>
  )
}
