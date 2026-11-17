import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isValidGtmId } from './track.ts'

test('validación del ID de GTM', () => {
  assert.equal(isValidGtmId('GTM-ABC1234'), true)
  assert.equal(isValidGtmId(''), false)
  assert.equal(isValidGtmId('gtm-abc1234'), false)
  assert.equal(isValidGtmId('GTM-ABC1234"><script>'), false)
  assert.equal(isValidGtmId('UA-123456'), false)
  assert.equal(isValidGtmId('GTM-AB'), false)
})
