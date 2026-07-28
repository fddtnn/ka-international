// Rebuilds public/fabric-catalog.json from the KA International portal on
// deco3dserver. Run with:  node scripts/fetch-fabric-catalog.mjs
//
// Two passes are needed to match the source exactly:
//   1. every filter value, to learn which fabric carries which attribute
//   2. a reference sweep, which returns fabrics that carry no attributes at all
// The catalog is the union of both.
import { writeFileSync } from 'node:fs'

const U = process.env.KA_PORTAL_TOKEN || 'K66375468260728030700'
const HOST = 'https://www.deco3dserver.com/jover/shop'
const FILTER_URL = `${HOST}/resultadofiltros1.asp?metraje=si&u=${U}`

// Each colour filter is one row of the source palette sprite (images/paleta2.png),
// drawn as a strip of seven shades. The 4th shade is used as the row's identity.
const COLORS = [
  ['6', ['#677d95', '#5f858e', '#5b632a', '#a28317', '#9f5339', '#8c2538', '#d4b7bc']],
  ['3', ['#f7ead7', '#f9ecdb', '#fcf0e2', '#fdf5e8', '#fdfaf3', '#fefdf9', '#ffffff']],
  ['71', ['#90700d', '#9d7c11', '#aa8a1d', '#b99928', '#c9ab33', '#d8bb3b', '#e2c641']],
  ['67', ['#893b17', '#954417', '#a45417', '#b96215', '#c97118', '#d9801a', '#e68b18']],
  ['5', ['#4b090a', '#570f12', '#671814', '#76201f', '#882927', '#97312f', '#a03734']],
  ['66', ['#4e3262', '#5d426d', '#72577a', '#8b6e8a', '#a18699', '#b99aa9', '#c8aab2']],
  ['4', ['#0c335a', '#204066', '#305572', '#496684', '#617993', '#778c9f', '#8999a9']],
  ['70', ['#388388', '#498c92', '#639a9f', '#7ca9ae', '#93babf', '#aac9cc', '#bbd3d7']],
  ['1', ['#384114', '#454e1f', '#546227', '#6a7531', '#7c8b3a', '#8d9d45', '#9bac4c']],
  ['69', ['#947350', '#a1805d', '#af9270', '#c0a884', '#d0bc99', '#dfcfab', '#ecdcbb']],
  ['72', ['#382409', '#432b11', '#4a361b', '#564126', '#604c31', '#6b563b', '#725d42']],
  ['2', ['#5f5f5f', '#6d6d6d', '#808080', '#959595', '#a9a9a9', '#bcbcbc', '#cacaca']],
  ['68', ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000']],
].map(([id, shades]) => [id, shades[3], shades])
const TYPES = [
  ['T', 'upholstery and curtain'], ['V', 'sheer'], ['B', 'black-outs'],
  ['D', 'dim-outs'], ['S', 'screen'],
]
const QUALITIES = [
  ['bordado', 'embroidered'], ['estampado', 'printed'], ['jacquard', 'jacquard'],
  ['plano_textura', 'plain texture'], ['transparente', 'sheer'], ['acolchado', 'quilted'],
  ['resinado', 'coated'], ['terciopelo', 'velvet'], ['laminado', 'laminated'],
]
const WIDTHS = [
  ['WA', 'under 160 cm.'], ['WC', 'higher than 160 cm.'], ['WM', 'higher than 280 cm.'],
]
const STYLES = [
  ['8', 'plains & textures'], ['9', 'stripes / checks'], ['77', 'geometric'],
  ['62', 'ethnic'], ['79', 'oriental'], ['10', 'classic'], ['63', 'leaves and flowers'],
  ['80', 'sea / nautical'], ['11', 'child / youth'], ['78', 'kitchen / fruits'],
  ['12', 'other styles'],
]
const USES = [
  ['13', 'curtain'], ['73', 'upholstery for domestic use'], ['74', 'upholstery for intensive use'],
  ['60', 'outdoor fabric'], ['EX', 'fabric for outdoor use in the shade'], ['14', 'tendina'],
  ['15,16', 'blinds'], ['17', 'panel blind'], ['18', 'roller blinds'],
  ['33,34,35,36', 'bed'], ['37', 'cushions'], ['61', 'tablecloths'],
]
const PROPERTIES = [
  ['I0', 'Fire retardant Clase 1 EN13773'], ['I1', 'Fire retardant EN1021 1&2'],
  ['I8', 'Fire retardant M1 France'], ['I9', 'Fire retardant Clase 1 Italy UNI9177'],
  ['J0', 'Fire retardant IMO'], ['I2', 'Stain-resistant and water-repellent'],
  ['J2', 'Antibacterial Antivirus'], ['I3', 'UV resistant'], ['I4', 'Easy clean (SR)'],
  ['I5', 'Waterproof and breathable'], ['I6', 'Recycled'], ['I7', 'Stop Radiation'],
  ['J1', 'Sound absorption certificate'],
]

// Type, width and property values all travel in the source's `tipotex` param.
const GROUPS = [
  ['colors', 'color', COLORS],
  ['types', 'tipotex', TYPES],
  ['qualities', 'tipofab', QUALITIES],
  ['widths', 'tipotex', WIDTHS],
  ['styles', 'estilo', STYLES],
  ['uses', 'uso', USES],
  ['properties', 'tipotex', PROPERTIES],
]
const GROUP_NAMES = GROUPS.map(([name]) => name)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getTelas(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return JSON.parse(await (await fetch(url)).text()).Telas || []
    } catch (err) {
      if (attempt === 3) {
        console.error(`  FAILED ${url}: ${err.message}`)
        return []
      }
      await sleep(1500)
    }
  }
}

// ---- pass 1: attributes ----
const tagged = new Map()
for (const [group, param, values] of GROUPS) {
  for (const [value, label] of values) {
    const found = await getTelas(`${FILTER_URL}&${param}=${encodeURIComponent(value)}`)
    for (const row of found) {
      let f = tagged.get(row.id)
      if (!f) {
        f = Object.fromEntries(GROUP_NAMES.map((g) => [g, []]))
        f.row = row
        tagged.set(row.id, f)
      }
      if (!f[group].includes(label)) f[group].push(label)
    }
    console.log(`${group.padEnd(11)} ${label.padEnd(38)} ${String(found.length).padStart(5)}`)
    await sleep(250)
  }
}
console.log(`\nattribute pass   ${tagged.size}`)

// ---- pass 2: reference sweep ----
const rows = new Map()
for (const digit of '0123456789') {
  const found = await getTelas(`${HOST}/telas.asp?u=${U}&metraje=si&busca_tela=${digit}`)
  for (const r of found) rows.set(r.id, r)
  await sleep(250)
}
console.log(`reference sweep  ${rows.size}`)

for (const [id, f] of tagged) if (!rows.has(id)) rows.set(id, f.row)

const fabrics = [...rows.values()]
  .map((row) => {
    const a = tagged.get(row.id)
    const f = {
      id: row.id,
      ref: row.ref.trim(),
      name: row.nombre.trim(),
      collection: row.nom_dis.trim(),
      code: row.codigo.trim(),
      image: row.ruta,
      rapport: row.rapport,
      direction: row.direccion,
      basic: row.esbasico === 'si',
      certificates: row.certificados ? row.certificados.split(',').filter(Boolean) : [],
      meters: row.metros,
      price: row.precio,
      retail: row.precioConDescuento,
      // "Other colors" on the source groups by the first 7 digits of the ref.
      design: row.ref.trim().replace(/\./g, '').slice(0, 7),
    }
    for (const g of GROUP_NAMES) f[g] = a ? a[g] : []
    return f
  })
  .sort((a, b) => a.collection.localeCompare(b.collection) || a.ref.localeCompare(b.ref))

const out = {
  source: 'deco3dserver.com/jover/shop — KA International portal',
  scrapedAt: new Date().toISOString().slice(0, 10),
  imageBase: 'https://www.deco3dserver.com/deco3d/images/rapports/jover/miniaturas/',
  filters: {
    colors: COLORS.map(([id, hex, shades]) => ({ id, hex, shades })),
    types: TYPES.map(([, l]) => l),
    qualities: QUALITIES.map(([, l]) => l),
    widths: WIDTHS.map(([, l]) => l),
    styles: STYLES.map(([, l]) => l),
    uses: USES.map(([, l]) => l),
    properties: PROPERTIES.map(([, l]) => l),
  },
  fabrics,
}

writeFileSync(new URL('../public/fabric-catalog.json', import.meta.url), JSON.stringify(out))
console.log(`\nDONE — ${fabrics.length} fabrics, ${new Set(fabrics.map((f) => f.collection)).size} collections`)
