// Cleans a raw catalogue crop: whitens the page background, drops the hairline
// column dividers that sit at the edges, and trims tight to the product.
//
// The background is flood-filled inward from the border, so a white product on
// a tinted page keeps its own whites — only the background is connected to the
// edge, the product's interior is not.
import sharp from 'sharp'

const TOL = 26 // per-channel distance that still counts as background
const MIN_RUN = 6 // a product edge is thicker than a 1–2px divider line

export async function tidy(input, { pad = 0.05 } = {}) {
  const img = sharp(input).ensureAlpha().raw()
  const { data, info } = await img.toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info

  const at = (x, y) => (y * W + x) * C
  const sample = (x, y) => [data[at(x, y)], data[at(x, y) + 1], data[at(x, y) + 2]]

  // Background colour: the median of the four corners, so one stray dark
  // corner can't throw it off.
  const corners = [sample(1, 1), sample(W - 2, 1), sample(1, H - 2), sample(W - 2, H - 2)]
  const bg = [0, 1, 2].map((i) => corners.map((c) => c[i]).sort((a, b) => a - b)[1])
  const near = (x, y) => {
    const p = at(x, y)
    return (
      Math.abs(data[p] - bg[0]) <= TOL &&
      Math.abs(data[p + 1] - bg[1]) <= TOL &&
      Math.abs(data[p + 2] - bg[2]) <= TOL
    )
  }

  // Flood fill the background inward from every border pixel.
  const isBg = new Uint8Array(W * H)
  const stack = []
  for (let x = 0; x < W; x++) { stack.push(x, 0, x, H - 1) }
  for (let y = 0; y < H; y++) { stack.push(0, y, W - 1, y) }
  while (stack.length) {
    const y = stack.pop()
    const x = stack.pop()
    if (x < 0 || y < 0 || x >= W || y >= H) continue
    const i = y * W + x
    if (isBg[i] || !near(x, y)) continue
    isBg[i] = 1
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1)
  }

  // Paint the background pure white.
  for (let i = 0; i < W * H; i++) {
    if (!isBg[i]) continue
    const p = i * C
    data[p] = 255
    data[p + 1] = 255
    data[p + 2] = 255
  }

  const colInk = new Int32Array(W)
  const rowInk = new Int32Array(H)
  const countInk = () => {
    colInk.fill(0)
    rowInk.fill(0)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!isBg[y * W + x]) { colInk[x]++; rowInk[y]++ }
      }
    }
  }
  countInk()

  // The page's column rules survive the flood fill when their tone sits outside
  // the tolerance. They give themselves away by being narrow yet nearly
  // full-height, so wipe those strips before measuring the product.
  const wipeRules = (ink, span, isColumn) => {
    const edge = ink.length * 0.2 // rules hug the page column edges
    let run = 0
    for (let i = 0; i <= ink.length; i++) {
      const tall = i < ink.length && ink[i] > span * 0.6
      if (tall) { run++; continue }
      const centre = i - run / 2
      const atEdge = centre < edge || centre > ink.length - edge
      if (run > 0 && run <= 18 && atEdge) {
        for (let k = i - run; k < i; k++) {
          for (let j = 0; j < span; j++) {
            const idx = isColumn ? j * W + k : k * W + j
            isBg[idx] = 1
            const p = idx * C
            data[p] = 255
            data[p + 1] = 255
            data[p + 2] = 255
          }
        }
      }
      run = 0
    }
  }
  wipeRules(colInk, H, true)
  wipeRules(rowInk, W, false)
  countInk()
  const bounds = (arr, span) => {
    let lo = -1
    let hi = -1
    let run = 0
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > span * 0.02) {
        run++
        if (run >= MIN_RUN) { if (lo === -1) lo = i - run + 1; hi = i }
      } else run = 0
    }
    return [lo, hi]
  }
  let [x0, x1] = bounds(colInk, H)
  let [y0, y1] = bounds(rowInk, W)
  if (x0 === -1 || y0 === -1) { x0 = 0; y0 = 0; x1 = W - 1; y1 = H - 1 }

  const padX = Math.round((x1 - x0) * pad)
  const padY = Math.round((y1 - y0) * pad)
  x0 = Math.max(0, x0 - padX)
  y0 = Math.max(0, y0 - padY)
  x1 = Math.min(W - 1, x1 + padX)
  y1 = Math.min(H - 1, y1 + padY)

  const cleaned = await sharp(Buffer.from(data), { raw: { width: W, height: H, channels: C } })
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .png()
    .toBuffer()

  return { buffer: cleaned, width: x1 - x0 + 1, height: y1 - y0 + 1 }
}
