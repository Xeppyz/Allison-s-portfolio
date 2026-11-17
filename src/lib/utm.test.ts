import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mergeCampaignParams, pickCampaignParams } from './utm.ts'

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

test('mergeCampaignParams conserva utm_* guardados y actualiza los identificadores de clic', () => {
  assert.deepEqual(
    mergeCampaignParams({ utm_source: 'google', gclid: 'old' }, { utm_source: 'fb', utm_medium: 'cpc', gclid: 'new', fbclid: 'f' }),
    { utm_source: 'google', gclid: 'new', fbclid: 'f' },
  )
  assert.deepEqual(mergeCampaignParams({}, { utm_source: 'x' }), { utm_source: 'x' })
  assert.deepEqual(mergeCampaignParams({ utm_source: 'x' }, {}), { utm_source: 'x' })
})
