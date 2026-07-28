// Rebuilds public/portal-models.json — the model tree behind the virtual
// decorator. Run with:  node scripts/fetch-portal-models.mjs
//
// menushtml.asp returns the whole navigation tree in one request; each
// renderable node is then probed for its camera views and coverable zones.
import { writeFileSync } from 'node:fs'

const U = process.env.KA_PORTAL_TOKEN || 'K66375468260728030700'
const HOST = 'https://www.deco3dserver.com/jover/shop'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const xml = await (await fetch(`${HOST}/menushtml.asp?u=${U}`)).text()
const nodes = [...xml.matchAll(/<menu ([^>]+)\/>/g)].map((m) => {
  const o = {}
  for (const a of m[1].matchAll(/(\w+)="([^"]*)"/g)) o[a[1]] = a[2]
  return o
})

const visible = nodes.filter((n) => n.oculto !== 'Verdadero')
const groups = visible
  .filter((n) => n.objeto !== 'si')
  .map((n) => ({ id: n.id, group: n.grupo, child: n.llama, title: n.titulo, thumb: n.imagen || '' }))
const candidates = visible.filter((n) => n.objeto === 'si')
console.log(`menu nodes ${nodes.length} · groups ${groups.length} · models to probe ${candidates.length}`)

const models = []
let i = 0
for (const n of candidates) {
  i++
  let meta = null
  for (let attempt = 1; attempt <= 2 && !meta; attempt++) {
    try {
      const url = `${HOST}/nuevoElemento.asp?u=${U}&e=${n.id}&s=&a=${Date.now()}&r=&p=&nel=`
      meta = JSON.parse(await (await fetch(url)).text())
    } catch { await sleep(800) }
  }
  // Only models the engine can actually draw are useful to the configurator.
  if (meta?.representable === 'si' && meta.vistas?.length) {
    models.push({
      id: n.id,
      group: n.grupo,
      title: meta.nombre || n.titulo,
      thumb: n.imagen || '',
      scene: n.tipo,
      views: meta.vistas,
      zones: Number(meta.zonasRevestibles || 1),
      zone1: meta.nombre_zona1 || '',
      zone2: meta.nombre_zona2 || '',
    })
  }
  if (i % 40 === 0) console.log(`  ${i}/${candidates.length}`)
  await sleep(120)
}

const out = {
  source: 'deco3dserver.com/jover/shop — KA International portal',
  scrapedAt: new Date().toISOString().slice(0, 10),
  root: 'partes',
  thumbBase: 'https://www.deco3dserver.com/generator/imagenJD.aspx?tipo=1&filename=',
  // `ob` is ignored by the engine, so no server-side object needs creating.
  renderBase: 'https://www.deco3dserver.com/jover/shop/getImage.aspx?ob=1&m=DV&ruta=www.deco3dserver.com/deco3d/cgi-bin/cgi_3d3.exe?compo/',
  fabricDir: 'jover/',
  groups,
  models,
}

writeFileSync(new URL('../public/portal-models.json', import.meta.url), JSON.stringify(out))
console.log(`\nDONE — ${models.length} renderable models, ${new Set(models.map((m) => m.scene)).size} scenes`)
