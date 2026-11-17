import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { invokeFunction, restConfigured } from '../lib/rest'
import { useServices } from '../lib/content'
import { getUtm } from '../lib/utm'
import { track } from '../lib/track'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const COUNTRIES = ['Nicaragua', 'Estados Unidos', 'Otro']
const SELECT_CLASS =
  'min-h-12 w-full rounded-xl border border-navy/15 bg-white px-3 text-base text-navy focus-visible:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy'
const FIELD_CLASS =
  'min-h-12 rounded-xl border border-navy/15 bg-white px-3 text-navy shadow-none focus-visible:border-navy focus-visible:ring-2 focus-visible:ring-navy'
const LABEL_CLASS = 'mb-1.5 block text-sm font-medium text-navy'

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
      if (!restConfigured) throw new Error('supabase no configurado')
      const data = await invokeFunction<{ ok?: boolean }>('lead', {
        ...values,
        page: location.pathname,
        utm: getUtm(),
        elapsedMs: Date.now() - startedAt.current,
      })
      if (data?.ok !== true) throw new Error('respuesta inválida')
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
      <p role="status" className="rounded-2xl border border-taupe/50 bg-white p-6 font-medium text-navy">
        Recibimos tu mensaje. Te respondemos en menos de un día hábil.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <div>
        <label htmlFor="lead-name" className={LABEL_CLASS}>Nombre</label>
        <Input id="lead-name" name="name" className={FIELD_CLASS} required maxLength={200} autoComplete="name" value={values.name} onChange={set('name')} />
      </div>
      <div>
        <label htmlFor="lead-contact" className={LABEL_CLASS}>WhatsApp o correo</label>
        <Input id="lead-contact" name="contact" className={FIELD_CLASS} required maxLength={200} value={values.contact} onChange={set('contact')} />
      </div>
      <div>
        <label htmlFor="lead-company" className={LABEL_CLASS}>Empresa (opcional)</label>
        <Input id="lead-company" name="company" className={FIELD_CLASS} maxLength={200} autoComplete="organization" value={values.company} onChange={set('company')} />
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
        <Textarea id="lead-message" name="message" className={FIELD_CLASS + ' py-3'} required maxLength={2000} rows={4} value={values.message} onChange={set('message')} />
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
      <Button type="submit" disabled={sending} className="min-h-12 w-full rounded-full bg-navy px-7 py-3 font-semibold text-white transition hover:bg-navy-deep focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2">
        {sending ? 'Enviando…' : 'Enviar'}
      </Button>
    </form>
  )
}
