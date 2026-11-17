import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Input } from '../components/ui/input'

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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-[#1E3A5F]">Panel de administración</h1>
        <div className="space-y-1">
          <label htmlFor="login-email" className="block text-sm font-medium">Correo</label>
          <Input id="login-email" type="email" autoComplete="username" required className="h-11 text-base"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <label htmlFor="login-password" className="block text-sm font-medium">Contraseña</label>
          <Input id="login-password" type="password" autoComplete="current-password" required className="h-11 text-base"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy}
          className="min-h-11 w-full rounded-md bg-[#1E3A5F] text-sm font-medium text-white hover:bg-[#16304f] disabled:opacity-50">
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
