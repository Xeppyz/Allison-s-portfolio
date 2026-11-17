import { test } from 'node:test'
import assert from 'node:assert/strict'
import { serializeJsonLd } from './jsonld.ts'

test('JSON-LD no puede cerrar la etiqueta script', () => {
  const data = { a: '</script><script>alert(1)</script>' }
  const out = serializeJsonLd(data)
  assert.equal(out.includes('<'), false)
  assert.deepEqual(JSON.parse(out), data)
})
