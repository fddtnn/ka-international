// Splits the flat armchair description into the labelled sections the shop's
// product page shows ("Measurements", "Features", "Responsible and sustainable
// manufacturing", …). The labels are already embedded in the scraped text, so
// this only needs to cut the string — no extra requests.
import { readFileSync, writeFileSync } from 'node:fs'

// Longest first, so "Responsible and sustainable manufacturing" wins over any
// shorter prefix that might also match.
const LABELS = [
  'Responsible and sustainable manufacturing',
  'Responsible manufacturing',
  'Exchanges and returns',
  'Measurements',
  'Dimensions',
  'Features',
  'Composition',
]

const path = new URL('../public/armchairs.json', import.meta.url)
const data = JSON.parse(readFileSync(path, 'utf8'))

function split(text) {
  const found = []
  for (const label of LABELS) {
    let from = 0
    for (;;) {
      const at = text.indexOf(label, from)
      if (at === -1) break
      // Skip matches nested inside a longer label already claimed.
      if (!found.some((f) => at >= f.at && at < f.at + f.label.length)) found.push({ at, label })
      from = at + label.length
    }
  }
  found.sort((a, b) => a.at - b.at)
  if (!found.length) return [{ label: '', text: text.trim() }]

  const out = []
  const lead = text.slice(0, found[0].at).trim()
  if (lead) out.push({ label: '', text: lead })
  found.forEach((f, i) => {
    const end = i + 1 < found.length ? found[i + 1].at : text.length
    const body = text.slice(f.at + f.label.length, end).replace(/^[:\s.]+/, '').trim()
    if (body) out.push({ label: f.label, text: body })
  })
  return out
}

let total = 0
for (const p of data.products) {
  p.sections = split(p.description || '')
  total += p.sections.length
}

writeFileSync(path, JSON.stringify(data))
console.log(`DONE — ${data.products.length} products, ${total} sections`)
console.log('labels:', [...new Set(data.products.flatMap((p) => p.sections.map((s) => s.label)))].filter(Boolean).join(' · '))
