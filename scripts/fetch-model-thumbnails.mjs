// Caches one plain render per model into public/model-thumbs/, so the "Select
// the model" grid paints instantly instead of waiting on ~50 live renders.
// The big preview still renders live, because it has to follow the fabric.
//
// The engine's `&80&` segment is JPEG quality, not size — every render comes
// back 1500px wide. Quality 20 is indistinguishable once the grid scales the
// image down to ~250px, and cuts each file from 66 KB to 35 KB.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const QUALITY = 20
const DEFAULT_FABRIC = '009029203.jpg'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const dataPath = new URL('../public/portal-models.json', import.meta.url)
const outDir = new URL('../public/model-thumbs/', import.meta.url)
mkdirSync(outDir, { recursive: true })

const data = JSON.parse(readFileSync(dataPath, 'utf8'))
const force = process.argv.includes('--force')
console.log(`models: ${data.models.length}${force ? ' (forcing re-download)' : ''}`)

let saved = 0
let skipped = 0
let failed = 0

for (const [i, m] of data.models.entries()) {
  const file = new URL(`${m.id}.jpg`, outDir)
  if (!force && existsSync(file)) { skipped++; continue }
  const url =
    `${data.renderBase}${m.scene}/${m.views[0]}&${QUALITY}` +
    `&E:100&${data.fabricDir}${DEFAULT_FABRIC}` +
    (m.zones > 1 ? `&E:100&${data.fabricDir}${DEFAULT_FABRIC}` : '') +
    `&${Math.max(1, m.zones)}`
  try {
    const res = await fetch(url)
    const buf = Buffer.from(await res.arrayBuffer())
    // Guard against the engine handing back an error page instead of a render.
    if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('not a JPEG')
    writeFileSync(file, buf)
    saved++
  } catch (err) {
    console.error(`  FAILED ${m.id} ${m.scene}: ${err.message}`)
    failed++
  }
  if ((i + 1) % 40 === 0) console.log(`  ${i + 1}/${data.models.length} · saved ${saved}`)
  await sleep(120)
}

console.log(`\nDONE — saved ${saved}, skipped ${skipped}, failed ${failed}`)
