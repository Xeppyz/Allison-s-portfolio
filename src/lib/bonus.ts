// Interpreta 'YYYY-MM-DD' como fecha LOCAL (no UTC), para que el último día cuente.
export function parseLocalDate(value: string | null): Date | null {
  if (!value) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(y, mo - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null
  return date
}

export function isBonusActive(deadline: string | null, today: Date = new Date()): boolean {
  const end = parseLocalDate(deadline)
  if (!end) return false
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return startOfToday.getTime() <= end.getTime()
}
