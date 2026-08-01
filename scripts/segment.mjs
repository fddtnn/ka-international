// Finds the products on a catalogue page instead of assuming a grid. The shots
// sit on white with clear gutters, so projecting the non-white pixels onto each
// axis gives the bands, and their intersections give the cells.
import sharp from 'sharp'

const INK = 244 // anything darker than this counts as product

export async function segment(src, { minBand = 0.02, pad = 10 } = {}) {
  const img = sharp(src).greyscale()
  const { width: W, height: H } = await img.metadata()
  const data = await img.raw().toBuffer()

  const colInk = new Float64Array(W)
  const rowInk = new Float64Array(H)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[y * W + x] < INK) { colInk[x]++; rowInk[y]++ }
    }
  }

  const bands = (arr, span, minPx) => {
    const out = []
    let start = -1
    for (let i = 0; i < arr.length; i++) {
      // 2% of the span, so the faint hairline dividers between columns don't
      // read as content and glue every row together.
      const on = arr[i] > span * 0.02
      if (on && start === -1) start = i
      if ((!on || i === arr.length - 1) && start !== -1) {
        const end = i
        if (end - start >= minPx) out.push([start, end])
        start = -1
      }
    }
    return out
  }

  // merge bands separated by a gutter smaller than the typical one
  const merge = (list, gap) => {
    const out = []
    for (const b of list) {
      const last = out[out.length - 1]
      if (last && b[0] - last[1] < gap) last[1] = b[1]
      else out.push([...b])
    }
    return out
  }

  const rows = merge(bands(rowInk, W, H * minBand), H * 0.02)

  // Columns are found inside each row, not across the whole page — the pages
  // carry full-height hairline dividers that otherwise glue the columns.
  const cells = []
  const rowCols = []
  for (const [y0, y1] of rows) {
    const span = y1 - y0
    const ink = new Float64Array(W)
    for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) if (data[y * W + x] < INK) ink[x]++
    const cols = merge(bands(ink, span, W * minBand), W * 0.02)
    rowCols.push(cols.length)
    for (const [x0, x1] of cols) {
      cells.push({
        left: Math.max(0, x0 - pad),
        top: Math.max(0, y0 - pad),
        width: Math.min(W, x1 + pad) - Math.max(0, x0 - pad),
        height: Math.min(H, y1 + pad) - Math.max(0, y0 - pad),
        row: rows.findIndex((r) => r[0] === y0),
      })
    }
  }
  return { W, H, rows, rowCols, cells }
}

if (process.argv[2]) {
  const { W, H, rowCols, rows, cells } = await segment(process.argv[2])
  console.log(`${process.argv[2]} ${W}x${H}`)
  console.log(`cols per row: ${rowCols.join(" ")}`)
  console.log(`rows ${rows.length}: ${rows.map((r) => r.join('-')).join(' ')}`)
  console.log(`cells ${cells.length}`)
}
