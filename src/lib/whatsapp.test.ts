import { test } from 'node:test'
import assert from 'node:assert/strict'
import { campaignCode, buildWhatsAppUrl } from './whatsapp.ts'

test('código de campaña', () => {
  assert.equal(campaignCode({ utm_source: 'google', utm_campaign: 'qb' }), '[G-QB]')
  assert.equal(campaignCode({ utm_source: 'meta', utm_campaign: 'Conta Mensual!' }), '[M-CONTAMENSUAL]')
  assert.equal(campaignCode({ utm_source: 'google' }), '')
  assert.equal(campaignCode({}), '')
})

test('enlace de WhatsApp', () => {
  assert.equal(buildWhatsAppUrl('', 'Hola', {}), null)
  assert.equal(
    buildWhatsAppUrl('+505 8767-3463', 'Hola, quiero más', { utm_source: 'google', utm_campaign: 'qb' }),
    'https://wa.me/50587673463?text=' + encodeURIComponent('Hola, quiero más [G-QB]'),
  )
  assert.equal(buildWhatsAppUrl('50587673463', 'Hola', {}), 'https://wa.me/50587673463?text=Hola')
})
