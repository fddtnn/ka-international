// Cuts every product out of the catalogue's pages and pairs it with the name,
// reference and dimensions printed underneath.
//
// Grid pages (armchairs, poufs, chairs) are segmented automatically from the
// white gutters. The sofa and corner pages put the shots in a left column with
// a spec table beside them, so only that column is segmented.
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import sharp from 'sharp'
import { segment } from './segment.mjs'

const items = JSON.parse(readFileSync('cat-items.json', 'utf8'))

const PAGES = [
  { page: 6, img: 'img007', section: 'armchairs' },
  { page: 7, img: 'img008', section: 'armchairs' },
  { page: 8, img: 'img009', section: 'armchairs' },
  { page: 10, img: 'img011', section: 'sofas', leftOnly: 0.46 },
  { page: 11, img: 'img012', section: 'sofas', leftOnly: 0.46 },
  { page: 12, img: 'img014', section: 'sofas', leftOnly: 0.46 },
  { page: 14, img: 'img018', section: 'modular', leftOnly: 0.45 },
  { page: 15, img: 'img019', section: 'modular', leftOnly: 0.45 },
  { page: 16, img: 'img020', section: 'poufs' },
  { page: 17, img: 'img021', section: 'benches' },
  { page: 18, img: 'img022', section: 'chairs' },
]

const OUT = '../catalogue-out'
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const NAME = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 .&'-]{2,}$/

// Reads the caption that belongs to one cell: the text runs sitting directly
// under it, inside its own horizontal span. Tying the runs to the cell avoids
// guessing where one column's caption ends and the next begins.
function captionFor(page, box) {
  const { items: its } = items[page]
  const runs = its
    .filter((it) => it.y > box.top && it.y < box.bottom + 95 && it.x + 12 > box.left && it.x < box.right)
    .sort((a, b) => a.y - b.y || a.x - b.x)
  if (!runs.length) return null

  const joined = runs.map((r) => r.s).join(' ').replace(/\s+/g, ' ').trim()
  const name = runs.map((r) => r.s).find((s) => NAME.test(s) && !/^REF/i.test(s) && !/^\d/.test(s))
  const ref = (joined.match(/REF\.?\s*([\dA-Z][\dA-Z-]*)/i) || [])[1]
  const dim = (joined.match(/(\d{2,3}(?:\.\d)?)\s*[xX]\s*(\d{2,3}(?:\.\d)?)\s*[xX]\s*(\d{2,3}(?:\.\d)?)/) || [])
    .slice(1).join('×')
  if (!name && !ref) return null
  return { name, ref, dim, raw: joined }
}

const seen = new Set()
const products = []

for (const cfg of PAGES) {
  const src = `cat-img/${cfg.img}.jpg`
  const meta = await sharp(src).metadata()
  let work = src
  if (cfg.leftOnly) {
    work = `cat-img/_${cfg.img}-left.jpg`
    await sharp(src).extract({ left: 0, top: 0, width: Math.round(meta.width * cfg.leftOnly), height: meta.height }).toFile(work)
  }
  const { W, H, cells } = await segment(work)
  // The crop is in image pixels; the text is in page points.
  const [pw, ph] = items[cfg.page].size
  const sx = pw / (cfg.leftOnly ? meta.width : W) * (cfg.leftOnly ? 1 : 1)
  const sy = ph / (cfg.leftOnly ? meta.height : H)

  let made = 0
  for (const cell of cells.sort((a, b) => a.top - b.top || a.left - b.left)) {
    const box = {
      left: cell.left * (pw / meta.width),
      right: (cell.left + cell.width) * (pw / meta.width),
      top: cell.top * sy,
      bottom: (cell.top + cell.height) * sy,
    }
    const best = captionFor(cfg.page, box)
    if (!best) continue
    const label = best.name || best.ref
    const slug = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}${best.ref ? `-${best.ref}` : ''}`
    if (seen.has(slug)) continue
    seen.add(slug)
    const file = `${slug}.jpg`
    // Keep the catalogue's own pixels. Squaring by padding rather than resizing
    // avoids upscaling a ~580px cell to 760px, which only adds blur.
    const side = Math.max(cell.width, cell.height)
    await sharp(work)
      .extract(cell)
      .extend({
        top: Math.floor((side - cell.height) / 2),
        bottom: Math.ceil((side - cell.height) / 2),
        left: Math.floor((side - cell.width) / 2),
        right: Math.ceil((side - cell.width) / 2),
        background: '#ffffff',
      })
      .sharpen({ sigma: 0.6 }) // counters the softness of the page JPEG
      .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(`${OUT}/${file}`)
    products.push({
      slug, name: best.name || label, ref: best.ref || null, dim: best.dim || null,
      section: cfg.section, page: cfg.page, image: file,
    })
    made++
  }
  console.log(`p${String(cfg.page).padStart(2)} ${cfg.section.padEnd(9)} cells ${String(cells.length).padStart(2)} · products ${made}`)
}

writeFileSync(`${OUT}/index.json`, JSON.stringify(products, null, 1))
console.log(`\nDONE — ${products.length} products`)
const bySec = {}
products.forEach((p) => (bySec[p.section] = (bySec[p.section] || 0) + 1))
console.log(bySec)
