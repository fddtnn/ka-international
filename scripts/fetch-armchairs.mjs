// Builds public/armchairs.json from the KA International shop.
// Run with:  node scripts/fetch-armchairs.mjs
//
// The shop sits behind Cloudflare and rejects anything that does not look like
// a real browser, so every request carries a full desktop Chrome fingerprint.
// Prices are published in EUR; they are converted to SAR here so the demo store
// shows one currency throughout.
import { writeFileSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const BASE = 'https://ka-international.com/shop/en'
const LIST = `${BASE}/armchairs`
const EUR_TO_SAR = Number(process.env.EUR_TO_SAR || 4.1)

const HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const toSar = (eur) => Math.round(Number(eur) * EUR_TO_SAR)

// Cloudflare fingerprints the TLS/HTTP2 stack, not just the User-Agent, and
// turns Node's own fetch away with a 403. curl gets through, so shell out to it.
async function get(url) {
  const args = ['-sS', '--compressed', url]
  for (const [k, v] of Object.entries(HEADERS)) args.push('-H', `${k}: ${v}`)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { stdout } = await execFileAsync('curl', args, { maxBuffer: 32 * 1024 * 1024 })
      if (!stdout || stdout.length < 2000) throw new Error(`short response (${stdout.length} bytes)`)
      return stdout
    } catch (err) {
      if (attempt === 3) throw err
      await sleep(2000)
    }
  }
}

// ---- pass 1: the category listing ----
const cards = new Map()
for (let page = 1; page <= 5; page++) {
  const html = await get(page === 1 ? LIST : `${LIST}?page=${page}`)
  const articles = html.split('<article').slice(1)
  let added = 0
  for (const chunk of articles) {
    const id = (chunk.match(/data-id-product="(\d+)"/) || [])[1]
    if (!id || cards.has(id)) continue
    const href = (chunk.match(/href="(https:\/\/ka-international\.com\/shop\/en\/[^"#]+)/) || [])[1]
    const name = (chunk.match(/product-title[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/) || [])[1]
    const eur = (chunk.match(/itemprop="price"[^>]*content="([\d.]+)"/) || [])[1]
    const teaser = (chunk.match(/product-meta-description">\s*<h2>([\s\S]*?)<\/h2>/) || [])[1]
    const flag = (chunk.match(/product-flag[^>]*>([^<]+)</) || [])[1]
    if (!href || !name) continue
    cards.set(id, {
      id,
      url: href,
      name: strip(name),
      teaser: teaser ? strip(teaser) : '',
      flag: flag ? strip(flag) : '',
      priceEur: eur ? Number(eur) : null,
      price: eur ? toSar(eur) : null,
    })
    added++
  }
  const total = Number((html.match(/of (\d+) items/) || [])[1] || 0)
  console.log(`page ${page}: +${added} (have ${cards.size}${total ? ` of ${total}` : ''})`)
  if (!added || (total && cards.size >= total)) break
  await sleep(400)
}

// ---- pass 2: each product page ----
const products = []
for (const [i, card] of [...cards.values()].entries()) {
  let detail = {}
  try {
    const html = await get(card.url)
    const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]
    const desc = (html.match(/<div[^>]*class="[^"]*product-description[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/) || [])[1]
    // Every gallery shot is published under the same slug at several sizes.
    const images = [...new Set([...html.matchAll(/shop\/(\d+)-large_default\/([a-z0-9-]+)\.jpg/g)].map((m) => `${m[1]}/${m[2]}`))]
    // "Leg types" and friends: one <select> per attribute group.
    const options = [...html.matchAll(/<span class="control-label">([^<]+)<\/span>[\s\S]{0,400}?<select[^>]*name="group\[(\d+)\]"[^>]*>([\s\S]*?)<\/select>/g)].map((m) => ({
      label: strip(m[1]).replace(/:$/, ''),
      group: m[2],
      values: [...m[3].matchAll(/<option value="(\d+)"[^>]*>([^<]+)<\/option>/g)].map((o) => ({ id: o[1], label: strip(o[2]) })),
    }))
    detail = { title: title ? strip(title) : card.name, description: desc ? strip(desc) : card.teaser, images, options }
  } catch (err) {
    console.error(`  FAILED ${card.id} ${card.name}: ${err.message}`)
    detail = { title: card.name, description: card.teaser, images: [], options: [] }
  }
  products.push({ ...card, ...detail })
  if ((i + 1) % 6 === 0) console.log(`  detail ${i + 1}/${cards.size}`)
  await sleep(400)
}

const out = {
  source: 'ka-international.com/shop/en/armchairs',
  scrapedAt: new Date().toISOString().slice(0, 10),
  currency: 'SAR',
  eurToSar: EUR_TO_SAR,
  imageBase: 'https://ka-international.com/shop/',
  products,
}
writeFileSync(new URL('../public/armchairs.json', import.meta.url), JSON.stringify(out))
console.log(`\nDONE — ${products.length} armchairs, ${products.filter((p) => p.images.length).length} with gallery`)
