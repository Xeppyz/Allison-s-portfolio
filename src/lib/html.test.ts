import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanHtml, htmlToText, readingMinutes, wordCount } from './html.ts'

test('cleanHtml quita scripts, eventos y URLs javascript', () => {
  const dirty =
    '<p onclick="x()">Hola</p><script>alert(1)</script><img src="a.webp" alt="A" onerror=alert(1)>' +
    '<a href="javascript:alert(1)">mal</a><a href="/planes">bien</a><iframe src="//x"></iframe><style>p{}</style>'
  const out = cleanHtml(dirty)
  assert.doesNotMatch(out, /script|onclick|onerror|javascript:|iframe|style/i)
  assert.match(out, /<p>Hola<\/p>/)
  assert.match(out, /<img src="a.webp" alt="A">/)
  assert.match(out, /<a href="\/planes">bien<\/a>/)
})

test('htmlToText y conteo de palabras', () => {
  const html = '<h2>Título</h2><p>Uno dos&nbsp;tres.</p><ul><li><p>cuatro</p></li></ul>'
  assert.equal(htmlToText(html), 'Título. Uno dos tres. cuatro.')
  assert.equal(wordCount(html), 5)
  assert.equal(readingMinutes(html), 1)
  assert.equal(readingMinutes('<p>' + 'palabra '.repeat(401) + '</p>'), 3)
})
