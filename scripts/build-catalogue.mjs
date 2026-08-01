// Cuts every product out of the catalogue's pages and pairs it with the name,
// reference and dimensions printed underneath.
//
// The pages are single full-page JPEGs. Products are located from the captions,
// not from white gutters: every piece is printed with its name below it, so the
// caption grid is the product grid. Gutter detection merged pieces that touch.
//
// Sofa pages keep their own parser: they list three lengths (2PZ / 3PZ / XL)
// per model, each with its own reference.
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import sharp from 'sharp'
import { cutPage } from './captioncut.mjs'
import { cutStacked } from './stacked.mjs'

const items = JSON.parse(readFileSync('cat-items.json', 'utf8'))

const PAGES = [
  { page: 6, img: 'img007', section: 'armchairs' },
  { page: 7, img: 'img008', section: 'armchairs' },
  { page: 8, img: 'img009', section: 'armchairs' },
  { page: 10, img: 'img011', section: 'sofas', stacked: 2 },
  { page: 11, img: 'img012', section: 'sofas', stacked: 2 },
  { page: 12, img: 'img014', section: 'sofas', stacked: 2 },
  { page: 16, img: 'img020', section: 'poufs' },
  { page: 17, img: 'img021', section: 'benches' },
  { page: 18, img: 'img022', section: 'chairs' },
]

const OUT = '../catalogue-out'
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const seen = new Set()
const products = []

async function save(src, crop, file) {
  const side = Math.max(crop.width, crop.height)
  await sharp(src)
    .extract(crop)
    .extend({
      top: Math.floor((side - crop.height) / 2),
      bottom: Math.ceil((side - crop.height) / 2),
      left: Math.floor((side - crop.width) / 2),
      right: Math.ceil((side - crop.width) / 2),
      background: '#ffffff',
    })
    .sharpen({ sigma: 0.6 }) // counters the softness of the page JPEG
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(`${OUT}/${file}`)
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

for (const cfg of PAGES) {
  const src = `cat-img/${cfg.img}.jpg`
  const { width: IW, height: IH } = await sharp(src).metadata()
  const [PW, PH] = items[cfg.page].size
  let made = 0

  if (cfg.stacked) {
    for (const c of await cutStacked(src, cfg.page, { cols: cfg.stacked })) {
      const slug = `${slugify(c.name)}-${cfg.section}`
      if (!c.name || seen.has(slug)) continue
      seen.add(slug)
      await save(src, c.crop, `${slug}.jpg`)
      products.push({
        slug, name: c.name, ref: c.variants[0]?.ref || null, dim: c.variants[0]?.dim || null,
        variants: c.variants, section: cfg.section, page: cfg.page, image: `${slug}.jpg`,
      })
      made++
    }
  } else {
    for (const c of cutPage(cfg.page)) {
      const slug = `${slugify(c.name)}-${cfg.section}`
      if (!c.name || seen.has(slug)) continue
      const crop = {
        left: Math.max(0, Math.round((c.box.x0 / PW) * IW)),
        top: Math.max(0, Math.round((c.box.y0 / PH) * IH)),
        width: Math.round(((c.box.x1 - c.box.x0) / PW) * IW),
        height: Math.round(((c.box.y1 - c.box.y0) / PH) * IH),
      }
      crop.width = Math.min(crop.width, IW - crop.left)
      crop.height = Math.min(crop.height, IH - crop.top)
      if (crop.width < 40 || crop.height < 40) continue
      seen.add(slug)
      await save(src, crop, `${slug}.jpg`)
      // A piece can carry more than one reference (SKIRT / WOODEN LEG finishes).
      const variants = c.refs.map((r, i) => ({
        ref: r.ref, size: r.label || null, dim: c.dims[i] || c.dims[0] || null,
      }))
      products.push({
        slug, name: c.name, ref: c.refs[0]?.ref || null, dim: c.dims[0] || null,
        variants: variants.length > 1 ? variants : null,
        section: cfg.section, page: cfg.page, image: `${slug}.jpg`,
      })
      made++
    }
  }
  console.log(`p${String(cfg.page).padStart(2)} ${cfg.section.padEnd(9)} products ${made}`)
}

writeFileSync(`${OUT}/index.json`, JSON.stringify(products, null, 1))
const bySec = {}
products.forEach((p) => (bySec[p.section] = (bySec[p.section] || 0) + 1))
console.log(`\nDONE — ${products.length} products`)
console.log(bySec)
console.log(`with ref ${products.filter((p) => p.ref).length} · with dim ${products.filter((p) => p.dim).length}`)
