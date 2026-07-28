// Rebuilds public/portal-sections.json — the portal's own landing page: the
// tiles the user actually sees ("Upholstered furniture", "Cushions", …) rather
// than the raw internal menu tree.
//
// inicio.asp renders the tiles; posting a tile's id to decorador.asp reveals
// which menu nodes it opens (`newElements`) and which scene it uses (`escena`).
import { writeFileSync } from 'node:fs'

const U = process.env.KA_PORTAL_TOKEN || 'K66375468260728030700'
const HOST = 'https://www.deco3dserver.com/jover/shop'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const html = Buffer.from(await (await fetch(`${HOST}/inicio.asp?u=${U}`)).arrayBuffer()).toString('latin1')

// Tiles live in bands. A band introduced by `<div class='submenu' id='submenuN'>`
// holds the children of the `despliega(N)` tile and stays collapsed until that
// tile is clicked — that is how "Upholstered furniture" hides Sofas, Armchairs…
const TILE = /onClick="javascript:(selecciona|despliega)\((\d+)\)"\s*>\s*<img src="([^"]+)"\s*\/>\s*<div (?:id="titulo\d+" )?class="menu_title"><div>([^<]*)</g
const OPEN = /<div (?:class='submenu' id='submenu(\d+)' )?style='vertical-align:top;'>/g

const starts = [...html.matchAll(OPEN)].map((m) => ({ at: m.index, len: m[0].length, submenuOf: m[1] || null }))
const bands = []
for (let i = 0; i < starts.length; i++) {
  const from = starts[i].at + starts[i].len
  const chunk = html.slice(from, i + 1 < starts.length ? starts[i + 1].at : html.length)
  const tiles = [...chunk.matchAll(TILE)].map((m) => ({
    action: m[1], id: m[2], image: m[3].replace(/^\.\.\//, ''), title: m[4].trim(),
  }))
  if (!tiles.length) continue
  bands.push({
    title: ((chunk.match(/menu_padre_dv"[^>]*><div>([^<]*)</) || [])[1] || '').trim(),
    submenuOf: starts[i].submenuOf,
    tiles,
  })
}

const all = bands.flatMap((b) => b.tiles)
console.log(`bands ${bands.length} · tiles ${all.length}`)

// `despliega` tiles just reveal sibling tiles that are already in the markup,
// so only the `selecciona` ones need probing.
for (const tile of all) {
  if (tile.action !== 'selecciona') continue
  // 122 is the fabric catalog and 106 the wallpaper picker — separate pages.
  if (tile.id === '122') { tile.route = 'catalog'; continue }
  if (tile.id === '106') { tile.route = 'wallpaper' }
  try {
    const res = await fetch(`${HOST}/decorador.asp`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `u=${U}&new_element=${tile.id}`,
    })
    const page = Buffer.from(await res.arrayBuffer()).toString('latin1')
    const nodes = (page.match(/var newElements = new Array\(([^)]*)\)/) || [])[1] || ''
    tile.nodes = [...nodes.matchAll(/'(\d+)'/g)].map((m) => m[1])
    tile.scene = (page.match(/new Escena\("([^"]*)"\)/) || [])[1] || ''
  } catch (err) {
    console.error(`  FAILED ${tile.id} ${tile.title}: ${err.message}`)
    tile.nodes = []
  }
  console.log(`  ${tile.id.padStart(4)}  ${tile.title.padEnd(30)} nodes ${(tile.nodes || []).join(',') || '-'}  scene ${tile.scene || '-'}`)
  await sleep(200)
}

const out = {
  source: 'deco3dserver.com/jover/shop — KA International portal',
  scrapedAt: new Date().toISOString().slice(0, 10),
  tileBase: 'https://www.deco3dserver.com/jover/',
  bands,
}
writeFileSync(new URL('../public/portal-sections.json', import.meta.url), JSON.stringify(out))
console.log(`\nDONE — ${bands.length} bands, ${all.length} tiles`)
