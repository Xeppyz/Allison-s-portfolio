// Edge Function `lead`: guarda el lead en `leads` y avisa por correo.
// ponytail: sin rate limit; si aparece spam, añadir Turnstile
const ALLOWED_ORIGINS = [
  'https://allisonsilvacorp.com',
  'https://www.allisonsilvacorp.com',
  'http://localhost:5173',
  'http://localhost:4173',
]
const EMAIL_API = 'https://wservices.casavision.com/ApiWebHub/api/Email/send'
const EMAIL_TO = 'allisonsilva684@gmail.com'
const EMAIL_FROM = 'onboarding@resend.dev'

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? ''
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
  if (ALLOWED_ORIGINS.includes(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function cleanUtm(value: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  let count = 0
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out
  for (const [key, v] of Object.entries(value)) {
    if (count >= 10) break
    if (key.startsWith('utm_') && typeof v === 'string') {
      out[key.slice(0, 200)] = v.slice(0, 200)
      count++
    }
  }
  return out
}

function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(req) })
  if (req.method !== 'POST') return json(req, { error: 'Método no permitido' }, 405)

  const MAX_BODY = 20000
  const declared = Number(req.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > MAX_BODY) return json(req, { error: 'Mensaje demasiado largo' }, 413)

  let raw: unknown
  try {
    const text = await req.text()
    if (text.length > MAX_BODY) return json(req, { error: 'Mensaje demasiado largo' }, 413)
    raw = JSON.parse(text)
  } catch {
    return json(req, { error: 'Faltan datos' }, 400)
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return json(req, { error: 'Faltan datos' }, 400)
  const body = raw as Record<string, unknown>

  // Spam: campo trampa lleno o envío demasiado rápido -> se finge éxito sin guardar
  const elapsed = body.elapsedMs
  if ((body.website !== undefined && body.website !== null && body.website !== '') || typeof elapsed !== 'number' || !(elapsed >= 3000)) {
    return json(req, { ok: true })
  }

  const lead = {
    name: clean(body.name, 200),
    contact: clean(body.contact, 200),
    company: clean(body.company, 200),
    country: clean(body.country, 100),
    service: clean(body.service, 200),
    message: clean(body.message, 2000),
    page: clean(body.page, 200),
    utm: cleanUtm(body.utm),
  }
  if (!lead.name || !lead.contact || !lead.message) return json(req, { error: 'Faltan datos' }, 400)

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  try {
    const res = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(lead),
    })
    if (!res.ok) throw new Error(`insert HTTP ${res.status}: ${await res.text()}`)
  } catch (err) {
    console.error('lead insert failed', err)
    return json(req, { error: 'No se pudo guardar' }, 500)
  }

  // El correo es secundario: el lead ya está guardado
  try {
    const campaign = Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(', ')
    const rows: [string, string][] = [
      ['Nombre', lead.name],
      ['Contacto', lead.contact],
      ['Empresa', lead.company],
      ['País', lead.country],
      ['Servicio', lead.service],
      ['Página', lead.page],
      ['Campaña', campaign],
      ['Mensaje', lead.message],
    ]
    const htmlBody =
      '<table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif">' +
      rows
        .map(([k, v]) => `<tr><th align="left">${k}</th><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
        .join('') +
      '</table>'
    const subject = `Nuevo lead desde el sitio: ${lead.service || 'sin servicio'}`.replace(/[\r\n]+/g, ' ')
    const res = await fetch(EMAIL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: EMAIL_TO, subject, htmlBody, from: EMAIL_FROM }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`email HTTP ${res.status}`)
  } catch (err) {
    console.error('lead email failed', err)
  }

  return json(req, { ok: true })
})
