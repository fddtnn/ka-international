// Sofa and modular pages stack their products with no white gutter between
// them, so the gutter-based segmenter merges the whole column into one cell.
// These pages are cut using the captions instead: each model's name marks the
// bottom of its own picture.
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const items = JSON.parse(readFileSync('cat-items.json', 'utf8'))
const NAME = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 .&'-]{2,}$/

// One caption row can hold two models — one per page column.
export function models(page, cols) {
  const { size, items: its } = items[page]
  const [W] = size
  const names = its.filter(
    (it) => NAME.test(it.s) && !/^REF/i.test(it.s) && !/^\d/.test(it.s) && !/^(PZ|XL|SEATS?)$/i.test(it.s),
  )

  // rows: names within ~30pt of each other belong to the same band
  const rows = []
  for (const n of names.sort((a, b) => a.y - b.y)) {
    const r = rows.find((x) => Math.abs(x.y - n.y) <= 30)
    if (r) { r.names.push(n); r.y = Math.min(r.y, n.y) } else rows.push({ y: n.y, names: [n] })
  }

  // "SAN FRANCISCO" and "SANTIAGO MAYA" arrive as two runs side by side.
  for (const row of rows) {
    row.names.sort((a, b) => a.x - b.x)
    for (let i = row.names.length - 1; i > 0; i--) {
      const prev = row.names[i - 1]
      const cur = row.names[i]
      if (cur.x - prev.x < 60 && Math.abs(cur.y - prev.y) <= 8) {
        prev.s = `${prev.s} ${cur.s}`
        row.names.splice(i, 1)
      }
    }
  }

  return rows.map((row, i) => ({
    y: row.y,
    entries: row.names
      .map((n) => {
        const col = cols === 1 ? 0 : n.x < W / 2 ? 0 : 1
        // every REF line sitting in this band and this half of the page
        const near = its.filter(
          (it) => Math.abs(it.y - row.y) <= 26 && (cols === 1 || (it.x < W / 2) === (col === 0)),
        )
        // One variant per printed line. Reading the block as a single string
        // would let a match run across two lines and swallow the next one.
        const lines = []
        for (const it of near.sort((a, b) => a.y - b.y || a.x - b.x)) {
          const l = lines.find((x) => Math.abs(x.y - it.y) <= 4)
          if (l) l.parts.push(it.s)
          else lines.push({ y: it.y, parts: [it.s] })
        }
        const variants = []
        for (const l of lines) {
          const text = l.parts.join(' ').replace(/\s+/g, ' ')
          const m = text.match(/REF\.\s*([\d]+(?:\s*-\s*\d+)*)\s*-\s*(2\s*PZ|3\s*PZ|XL)\s+(\d{2,3})\s*x\s*(\d{2,3})\s*x\s*(\d{2,3})/i)
          if (m) {
            variants.push({
              ref: m[1].replace(/\s*-\s*/g, '-'),
              size: m[2].replace(/\s+/g, '').toUpperCase(),
              dim: `${m[3]}×${m[4]}×${m[5]}`,
            })
          }
        }
        return { name: n.s.trim(), col, variants }
      })
      .sort((a, b) => a.col - b.col),
    row: i,
  }))
}

export async function cutStacked(src, page, { cols = 2, imgFrac = 1, topPad = 6, bottomGap = 16 } = {}) {
  const { width: IW, height: IH } = await sharp(src).metadata()
  const [PW, PH] = items[page].size
  const rows = models(page, cols)
  const out = []

  for (const [i, row] of rows.entries()) {
    // picture band: from just under the previous caption to just above this one
    const topPt = i === 0 ? 0 : rows[i - 1].y + 14
    const botPt = row.y - bottomGap
    if (botPt - topPt < 30) continue
    const top = Math.max(0, Math.round((topPt / PH) * IH) - topPad)
    const height = Math.min(IH - top, Math.round(((botPt - topPt) / PH) * IH) + topPad)

    for (const entry of row.entries) {
      const halfW = Math.round((IW * imgFrac) / cols)
      const left = entry.col * halfW
      out.push({ ...entry, crop: { left, top, width: Math.min(halfW, IW - left), height } })
    }
  }
  return out
}
