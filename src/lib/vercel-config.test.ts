// vercel.json mal formado tumba el despliegue completo: se comprueba su forma aquí.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'))

test('vercel.json: rewrites y headers con la forma que Vercel acepta', () => {
  for (const r of config.rewrites) {
    assert.deepEqual(Object.keys(r).sort(), ['destination', 'source'])
  }
  for (const rule of config.headers) {
    assert.equal(typeof rule.source, 'string')
    assert.ok(rule.headers.length > 0)
    for (const h of rule.headers) {
      assert.deepEqual(Object.keys(h).sort(), ['key', 'value'])
    }
  }
})
