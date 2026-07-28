// Adds the per-model dimension form (Length / Depth / Height / Seat height) to
// public/portal-models.json. Run after fetch-portal-models.mjs.
//
// formulario.asp returns the same read-only form the portal shows under
// "Select the model", keyed by the model's scene code.
import { readFileSync, writeFileSync } from 'node:fs'

const U = process.env.KA_PORTAL_TOKEN || 'K66375468260728030700'
const HOST = 'https://www.deco3dserver.com/jover/shop'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const path = new URL('../public/portal-models.json', import.meta.url)
const data = JSON.parse(readFileSync(path, 'utf8'))

const scenes = [...new Set(data.models.map((m) => m.scene))]
console.log(`scenes to probe: ${scenes.length}`)

const dims = new Map()
let i = 0
for (const scene of scenes) {
  i++
  try {
    const res = await fetch(`${HOST}/formulario.asp`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `u=${U}&tipo=${encodeURIComponent(scene)}&Gtipo=muebles&zonas=1&ps=&p=`,
    })
    const html = Buffer.from(await res.arrayBuffer()).toString('latin1')
    const rows = [...html.matchAll(/value="([^"]*)"[^>]*><\/td><td>([^<]+)</g)]
      .map((m) => ({ value: m[1].trim(), label: m[2].trim() }))
      .filter((r) => r.value && r.label)
    if (rows.length) dims.set(scene, rows)
  } catch (err) {
    console.error(`  FAILED ${scene}: ${err.message}`)
  }
  if (i % 50 === 0) console.log(`  ${i}/${scenes.length} · ${dims.size} with dimensions`)
  await sleep(110)
}

for (const m of data.models) {
  const d = dims.get(m.scene)
  if (d) m.dims = d
}

writeFileSync(path, JSON.stringify(data))
console.log(`\nDONE — ${dims.size}/${scenes.length} scenes carry dimensions`)
