// Cuts a catalogue page using its captions rather than the white gutters.
//
// Every product is printed with its name underneath, so the caption grid is the
// product grid: names on one line mark a row, and each name marks the bottom of
// its own picture. This copes with pages that stack products with no gutter —
// which the pixel-projection segmenter merged into one cell — and with pages
// that change column count.
import { readFileSync } from 'node:fs'

const items = JSON.parse(readFileSync('cat-items.json', 'utf8'))

const NAME = /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9 .&'-]{2,}$/
const isName = (s) =>
  NAME.test(s) && !/^REF/i.test(s) && !/^\d/.test(s) && !/^(PZ|XL|SKIRT|WOODEN LEG|SEATS?)$/i.test(s)

export function captionRows(page, { rowGap = 26, joinGap = 60 } = {}) {
  const { size, items: its } = items[page]
  const [PW] = size
  const names = its.filter((it) => isName(it.s))

  const rows = []
  for (const n of names.sort((a, b) => a.y - b.y)) {
    const r = rows.find((x) => Math.abs(x.y - n.y) <= rowGap)
    if (r) { r.names.push(n); r.y = Math.min(r.y, n.y) } else rows.push({ y: n.y, names: [n] })
  }

  for (const row of rows) {
    row.names.sort((a, b) => a.x - b.x)
    // "SANTIAGO MAYA" and "SAN FRANCISCO" arrive as neighbouring runs.
    for (let i = row.names.length - 1; i > 0; i--) {
      const prev = row.names[i - 1]
      const cur = row.names[i]
      if (cur.x - (prev.x + prev.w) < 14 && Math.abs(cur.y - prev.y) <= 6) {
        prev.s = `${prev.s} ${cur.s}`
        prev.w = cur.x + cur.w - prev.x
        row.names.splice(i, 1)
      }
    }
    // Where this caption block stops — the reference and dimension lines run on
    // below the name, and the next picture starts under them.
    const block = its.filter((it) => it.y >= row.y - 6 && it.y <= row.y + 70)
    row.bottomY = block.length ? Math.max(...block.map((b) => b.y)) : row.y + 20

    // Column boundaries sit halfway between neighbouring caption centres.
    const centres = row.names.map((n) => n.x + n.w / 2)
    row.cols = row.names.map((n, i) => ({
      name: n.s.trim(),
      centre: centres[i],
      x0: i === 0 ? 0 : (centres[i - 1] + centres[i]) / 2,
      x1: i === centres.length - 1 ? PW : (centres[i] + centres[i + 1]) / 2,
    }))
  }
  return rows.sort((a, b) => a.y - b.y)
}

// Everything printed for one caption: its references and dimension triples.
function detailsFor(page, row, col, rows, idx) {
  const { items: its } = items[page]
  const bandTop = row.y - 6
  const bandBottom = idx + 1 < rows.length ? Math.min(row.y + 70, rows[idx + 1].y - 20) : row.y + 70
  const near = its.filter((it) => it.y >= bandTop && it.y <= bandBottom && it.x + it.w > col.x0 && it.x < col.x1)

  const lines = []
  for (const it of near.sort((a, b) => a.y - b.y || a.x - b.x)) {
    const l = lines.find((x) => Math.abs(x.y - it.y) <= 4)
    if (l) l.parts.push(it.s)
    else lines.push({ y: it.y, parts: [it.s] })
  }

  const refs = []
  const dims = []
  for (const l of lines) {
    const text = l.parts.join(' ').replace(/\s+/g, ' ')
    for (const m of text.matchAll(/REF\.\s*(\d+(?:\s*-\s*[\dA-Z]+)*)/gi)) {
      const ref = m[1].replace(/\s*-\s*/g, '-')
      const tail = text.slice(m.index + m[0].length, m.index + m[0].length + 26)
      const label = (tail.match(/^\s*-?\s*(SKIRT|WOODEN LEG|2\s*PZ|3\s*PZ|XL)/i) || [])[1]
      if (!refs.some((r) => r.ref === ref)) refs.push({ ref, label: label ? label.replace(/\s+/g, ' ').toUpperCase() : null })
    }
    for (const m of text.matchAll(/(\d{2,3}(?:\.\d)?)\s*[xX]\s*(\d{2,3}(?:\.\d)?)\s*[xX]\s*(\d{2,3}(?:\.\d)?)/g)) {
      const d = `${m[1]}×${m[2]}×${m[3]}`
      if (!dims.includes(d)) dims.push(d)
    }
  }
  return { refs, dims }
}

// Rectangles in page points; the caller scales them to image pixels.
export function cutPage(page, { topGap = 6, bottomGap = 10 } = {}) {
  const rows = captionRows(page)
  const [, PH] = items[page].size
  const out = []
  for (const [i, row] of rows.entries()) {
    const top = i === 0 ? 0 : rows[i - 1].bottomY + topGap
    const bottom = row.y - bottomGap
    if (bottom - top < 40) continue
    for (const col of row.cols) {
      const { refs, dims } = detailsFor(page, row, col, rows, i)
      out.push({
        name: col.name,
        refs,
        dims,
        box: { x0: col.x0, x1: col.x1, y0: Math.max(0, top), y1: Math.min(PH, bottom) },
      })
    }
  }
  return out
}
