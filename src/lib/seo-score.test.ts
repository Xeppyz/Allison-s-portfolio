import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scoreSeo } from './seo-score.ts'

const para = (n: number, extra = '') =>
  `<p>${extra}${Array.from({ length: n }, (_, i) => `Frase corta número ${i} sobre contabilidad para empresas.`).join(' ')}</p>`

const good = {
  kind: 'post' as const,
  title: 'Cómo migrar a QuickBooks Online sin perder datos',
  description:
    'Guía paso a paso para migrar tu contabilidad a QuickBooks Online sin perder información, con consejos prácticos para pymes de Nicaragua.',
  slug: 'migrar-a-quickbooks-online',
  keyword: 'QuickBooks',
  html:
    para(10, 'Migrar a QuickBooks es más fácil de lo que crees. ') +
    '<h2>Por qué usar QuickBooks</h2>' + para(45) +
    '<h2>Pasos</h2>' + para(45, 'En QuickBooks Online. ') +
    '<p>Mira nuestros <a href="/quickbooks">servicios</a>.</p><img src="/x.webp" alt="Pantalla">',
}

test('un artículo bien hecho saca 80 o más', () => {
  const r = scoreSeo(good)
  assert.ok(r.score >= 80, `score ${r.score}: ${JSON.stringify(r.checks.filter((c) => c.status !== 'good'))}`)
})

test('título demasiado largo queda en rojo', () => {
  const r = scoreSeo({ ...good, title: 'x'.repeat(90) })
  assert.equal(r.checks.find((c) => c.id === 'title')?.status, 'bad')
})

test('sin palabra clave avisa en rojo y baja el puntaje', () => {
  const r = scoreSeo({ ...good, keyword: '' })
  assert.equal(r.checks.find((c) => c.id === 'keyword')?.status, 'bad')
  assert.ok(!r.checks.some((c) => c.id.startsWith('kw-')))
  assert.ok(r.score < scoreSeo(good).score)
})

test('palabra clave sin acentos coincide con texto acentuado', () => {
  const r = scoreSeo({ ...good, keyword: 'como migrar' })
  assert.equal(r.checks.find((c) => c.id === 'kw-title')?.status, 'good')
})

test('imagen sin alt queda en rojo', () => {
  const r = scoreSeo({ ...good, html: good.html + '<img src="/y.webp">' })
  assert.equal(r.checks.find((c) => c.id === 'images')?.status, 'bad')
})

test('una página no exige 600 palabras ni subtítulos ni enlaces', () => {
  const r = scoreSeo({ ...good, kind: 'page', html: para(40, 'QuickBooks. ') })
  assert.equal(r.checks.find((c) => c.id === 'length')?.status, 'good')
  assert.ok(!r.checks.some((c) => c.id === 'headings' || c.id === 'links'))
})
