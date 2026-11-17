// Empaqueta las funciones edge (server/*.ts) en JavaScript autocontenido dentro de api/.
// Vercel las despliega tal cual: no las compila ni revisa sus tipos.
import { build } from 'esbuild'
import { writeFileSync } from 'node:fs'

for (const name of ['render', 'sitemap']) {
  const result = await build({
    entryPoints: [`server/${name}.ts`],
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    write: false,
  })
  let code = result.outputFiles[0].text
  // Vercel lee `config` de forma estática: debe ser un `export const` literal.
  if (!code.includes('var config = { runtime: "edge" };') || !code.includes('export {\n  config,\n'))
    throw new Error(`${name}: no se encontró el export de config esperado`)
  code = code
    .replace('var config = { runtime: "edge" };', 'export const config = { runtime: "edge" };')
    .replace('export {\n  config,\n', 'export {\n')
  writeFileSync(`api/${name}.js`, `// GENERADO por scripts/build-api.mjs desde server/${name}.ts. No editar.\n${code}`)
}
