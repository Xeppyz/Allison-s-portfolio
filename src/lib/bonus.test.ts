import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isBonusActive } from './bonus.ts'

test('vigencia del bono', () => {
  const hoy = new Date('2026-11-16T12:00:00')
  assert.equal(isBonusActive('2026-11-16', hoy), true) // el último día cuenta
  assert.equal(isBonusActive('2026-11-15', hoy), false)
  assert.equal(isBonusActive(null, hoy), false)
  assert.equal(isBonusActive('', hoy), false)
  assert.equal(isBonusActive('no-es-fecha', hoy), false)
})
