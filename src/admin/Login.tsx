import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { btn, inputCls, labelCls } from './ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setError('Correo o contraseña incorrectos')
  }

  return (
    <main className="grid min-h-screen bg-ivory lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-navy p-12 text-white lg:flex">
        <div>
          <p className="font-serif text-2xl">Allison Silva</p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-taupe">Taxes &amp; Accounting</p>
        </div>
        <div className="max-w-md space-y-4">
          <span aria-hidden="true" className="block h-px w-12 bg-taupe" />
          <p className="font-serif text-4xl leading-tight">Tu web, tus artículos y tus contactos en un solo lugar.</p>
        </div>
        <p className="text-sm text-white/50">allisonsilvacorp.com</p>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <span aria-hidden="true" className="block h-px w-12 bg-taupe" />
            <h1 className="text-3xl font-medium text-navy">Panel de administración</h1>
            <p className="text-navy/60">Entra con tu correo y contraseña.</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="login-email" className={labelCls}>Correo</label>
            <input id="login-email" type="email" autoComplete="username" required className={inputCls}
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="login-password" className={labelCls}>Contraseña</label>
            <input id="login-password" type="password" autoComplete="current-password" required className={inputCls}
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className={`${btn.primary} w-full`}>
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
