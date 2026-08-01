// Dumps every text item with its position for the catalogue's product pages, so
// each name / REF / dimension can be tied to the grid cell it sits under.
import { readFileSync, writeFileSync } from 'node:fs'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const PAGES = [6, 7, 8, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22]

const data = new Uint8Array(readFileSync('C:/Users/fddtn/Downloads/KA international Catalogue v.2026.pdf'))
const doc = await getDocument({ data, useSystemFonts: true }).promise

const out = {}
for (const p of PAGES) {
  const page = await doc.getPage(p)
  const vp = page.getViewport({ scale: 1 })
  const content = await page.getTextContent()
  const items = content.items
    .filter((i) => i.str.trim())
    .map((i) => ({
      s: i.str.trim(),
      x: Math.round(i.transform[4]),
      y: Math.round(vp.height - i.transform[5]), // top-down, like the image
    }))
    .sort((a, b) => a.y - b.y || a.x - b.x)
  out[p] = { size: [Math.round(vp.width), Math.round(vp.height)], items }
}

writeFileSync('cat-items.json', JSON.stringify(out, null, 1))
for (const p of PAGES) console.log(`p${p}: ${out[p].items.length} items`)
console.log('\np6 sample:')
for (const i of out[6].items.slice(0, 14)) console.log(`  x${String(i.x).padStart(4)} y${String(i.y).padStart(4)}  ${i.s}`)
