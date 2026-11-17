import { test } from 'node:test'
import assert from 'node:assert/strict'
import { pickCampaignParams } from './utm.ts'

test('conserva utm_* e identificadores de clic, descarta el resto', () => {
  assert.deepEqual(
    pickCampaignParams('?utm_source=google&gclid=abc&fbclid=xyz&foo=bar'),
    { utm_source: 'google', gclid: 'abc', fbclid: 'xyz' },
  )
  assert.deepEqual(pickCampaignParams('gbraid=1&wbraid=2&msclkid=3'), { gbraid: '1', wbraid: '2', msclkid: '3' })
})

test('limita cada valor a 200 caracteres', () => {
  const out = pickCampaignParams(`?gclid=${'a'.repeat(300)}`)
  assert.equal(out.gclid.length, 200)
})

test('búsqueda vacía o sin parámetros de campaña', () => {
  assert.deepEqual(pickCampaignParams(''), {})
  assert.deepEqual(pickCampaignParams('?foo=1'), {})
})
