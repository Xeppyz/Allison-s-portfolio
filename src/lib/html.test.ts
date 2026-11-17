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

test('cleanHtml resiste los bypass conocidos', () => {
  const payloads = [
    '<scr<!---->ipt>alert(1)</scr<!---->ipt>',
    '<ifr<!---->ame srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;"></iframe>',
    '<img src="x"onerror="alert(1)">',
    '<svg/onload=alert(1)>',
    '<a href="jav&#x61;script:alert(1)">x</a>',
    '<a href="java\tscript:alert(1)">x</a>',
    '<a href="&#106;avascript:alert(1)">x</a>',
    '<a href="//evil.com">x</a>',
    '<svg><animate attributeName="href" values="javascript:alert(1)"/></svg>',
    '<p style="background:url(javascript:alert(1))" class="x">t</p>',
    '<math><mtext><img src=x onerror=alert(1)></mtext></math>',
    '<a href="data:text/html,<script>alert(1)</script>">x</a>',
  ]
  for (const p of payloads) {
    const out = cleanHtml(p)
    // Puede quedar texto inerte; lo que no puede quedar es una etiqueta o atributo peligroso.
    assert.doesNotMatch(out, /<(script|iframe|svg|math|animate)\b/i, `${p} → ${out}`)
    assert.doesNotMatch(out, /<[a-z][^>]*\s(on\w+|srcdoc|style|class)\s*=/i, `${p} → ${out}`)
    assert.doesNotMatch(out, /(href|src)="(javascript|vbscript|data|\/\/)/i, `${p} → ${out}`)
  }
  assert.equal(cleanHtml('<p class="x" style="y">Hola <b>a</b> &amp; b</p>'), '<p>Hola <b>a</b> &amp; b</p>')
  assert.equal(cleanHtml('<a href="/planes" target="_blank" rel="nofollow">x</a>'), '<a href="/planes">x</a>')
  assert.equal(cleanHtml('<img src="https://x.co/a.webp" alt="A &quot;b&quot;">'), '<img src="https://x.co/a.webp" alt="A &quot;b&quot;">')
  assert.equal(cleanHtml('1 < 2 y 3 > 2'), '1 &lt; 2 y 3 &gt; 2')
})
