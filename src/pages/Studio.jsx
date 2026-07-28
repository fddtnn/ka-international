import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import SEO from '../components/SEO.jsx'
import { Page, Icon } from '../components/ui.jsx'
import FabricFinder, { useCatalog, fabricImage, Paginator } from '../components/FabricFinder.jsx'

// Clone of the portal's "Decorador Virtual". Every product section shares the
// same six-step flow, so one component covers all of them.
//
// Rendering is a plain GET against the source's 3D engine:
//   getImage.aspx?ob=1&m=DV&ruta=…cgi_3d3.exe?compo/<scene>/<view>&80&E:100&jover/<fabric>.jpg&1
// `ob` is ignored by the server, so no session or server-side object is needed.
// Two-zone models repeat the per-zone segment and end with the zone count.
const DEFAULT_FABRIC = '009029203.jpg' // the plain white the portal shows before a fabric is applied
const RESULTS_PER_PAGE = 12

export default function Studio() {
  const { t } = useLang()
  const { data: catalog, error: catalogError } = useCatalog()
  const [portal, setPortal] = useState(null)
  const [sections, setSections] = useState(null)
  const [portalError, setPortalError] = useState(false)

  const [section, setSection] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [path, setPath] = useState([])
  const [model, setModel] = useState(null)
  const [view, setView] = useState(0)

  // The source's interaction: picking a swatch only *arms* it — the fabric is
  // applied when the shopper then clicks the item itself.
  const [selected, setSelected] = useState([]) // swatch strip under the render
  const [armed, setArmed] = useState(null) // the swatch waiting to be applied
  const [zone, setZone] = useState(0)
  const [applied, setApplied] = useState([null, null])

  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [resPage, setResPage] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}portal-models.json`).then((r) => r.json()),
      fetch(`${import.meta.env.BASE_URL}portal-sections.json`).then((r) => r.json()),
    ])
      .then(([m, s]) => { setPortal(m); setSections(s) })
      .catch(() => setPortalError(true))
  }, [])

  const byParent = useMemo(() => {
    if (!portal) return {}
    const map = {}
    const push = (k, v) => (map[k] = map[k] || []).push(v)
    for (const g of portal.groups) push(g.group, { ...g, kind: 'group' })
    for (const m of portal.models) push(m.group, { ...m, kind: 'model' })
    return map
  }, [portal])

  const byId = useMemo(() => {
    if (!portal) return {}
    const map = {}
    for (const g of portal.groups) map[g.id] = { ...g, kind: 'group' }
    for (const m of portal.models) map[m.id] = { ...m, kind: 'model' }
    return map
  }, [portal])

  const currentGroup = path.length ? path[path.length - 1].child : section?.rootGroup
  const children = byParent[currentGroup] || []
  const groupChildren = children.filter((c) => c.kind === 'group')
  const modelChildren = children.filter((c) => c.kind === 'model')

  function renderUrl(fabrics, viewIndex = view, model_ = model) {
    if (!portal || !model_) return null
    const zones = Math.max(1, model_.zones)
    const segments = []
    for (let i = 0; i < zones; i++) {
      segments.push(`E:100&${portal.fabricDir}${fabrics[i] ? fabrics[i].image : DEFAULT_FABRIC}`)
    }
    const file = model_.views[viewIndex] || model_.views[0]
    return `${portal.renderBase}${model_.scene}/${file}&80&${segments.join('&')}&${zones}`
  }

  function openModel(m) {
    setModel(m)
    setView(0)
    setZone(0)
    setApplied([null, null])
  }

  // A landing tile points at one or more menu nodes: a group opens its subtree,
  // a model opens straight into the configurator.
  function openSection(tile) {
    const nodes = (tile.nodes || []).map((id) => byId[id]).filter(Boolean)
    const group = nodes.find((n) => n.kind === 'group')
    const direct = nodes.find((n) => n.kind === 'model')
    setSection({ ...tile, rootGroup: group?.child })
    setPath([])
    setModel(null)
    if (!group && direct) openModel(direct)
  }

  function leaveSection() {
    setSection(null)
    setPath([])
    setModel(null)
  }

  function addToSelection(fab) {
    setSelected((s) => (s.some((x) => x.id === fab.id) ? s : [...s, fab]))
    setArmed(fab)
  }

  // Step 4 proper: the armed swatch lands on the item that was clicked.
  function decorate(targetZone = zone) {
    if (!armed) return
    setZone(targetZone)
    setApplied((a) => {
      const next = [...a]
      next[targetZone] = armed
      return next
    })
  }

  // The render is served without CORS headers, so its bytes can't be read here.
  // Printing a page that just holds the image gives the browser's own
  // "Save as PDF", which is what the source's PDF button produces anyway.
  function downloadPdf() {
    if (!preview) return
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(
      `<!doctype html><title>${model.title}</title>` +
        '<style>@page{size:A4 landscape;margin:14mm}body{margin:0;font:13px system-ui}' +
        'h1{font-size:15px;font-weight:600;margin:0 0 10px}img{width:100%;height:auto}</style>' +
        `<h1>${model.title}</h1><img src="${preview}" onload="window.focus();window.print()">`,
    )
    w.document.close()
  }

  // `desvestir()` on the source: strip the applied fabrics and show the model
  // back in its original plain finish.
  function removeFabric() {
    setApplied([null, null])
    setArmed(null)
  }

  const preview = renderUrl(applied)
  const lastFabric = applied[zone] || applied.find(Boolean)
  const pages = Math.ceil(results.length / RESULTS_PER_PAGE)
  const pageItems = results.slice(resPage * RESULTS_PER_PAGE, (resPage + 1) * RESULTS_PER_PAGE)

  if (portalError || catalogError) {
    return (
      <Page>
        <div className="pt-32 pb-24 text-center text-charcoal/60">{t.fabricFinder.loadError}</div>
      </Page>
    )
  }

  return (
    <Page>
      <SEO title={t.studio.title} description={t.studio.intro} />
      <div className="pt-28 md:pt-32 pb-20 mx-auto max-w-[1500px] px-5 md:px-8">
        <nav className="text-xs uppercase tracking-[0.18em] text-stone mb-4">
          <Link to="/" className="hover:text-olive">KA</Link>
          <span className="mx-2">/</span>
          <Link to="/collections/fabrics" className="hover:text-olive">{t.categories.fabrics}</Link>
          <span className="mx-2">/</span>
          <span className="text-olive-light">{t.studio.title}</span>
        </nav>
        <h1 className="font-display text-4xl md:text-5xl mb-2">{t.studio.title}</h1>
        <p className="text-stone text-sm mb-10">
          {portal ? t.studio.count.replace('{n}', portal.models.length) : t.fabricFinder.loading}
        </p>

        {/* ---------- landing: the portal's own tiles ---------- */}
        {!section && (
          <div className="space-y-10">
            {sections?.bands
              .filter((b) => !b.submenuOf || b.submenuOf === expanded)
              .map((band) => (
                <div key={band.submenuOf || band.title}>
                  {band.title && !band.submenuOf && (
                    <h2 className="text-xs uppercase tracking-[0.2em] text-stone mb-4">{band.title}</h2>
                  )}
                  <div className={`flex flex-wrap gap-5 ${band.submenuOf ? 'p-5 -mt-5 rounded-luxe bg-sand/60' : ''}`}>
                    {band.tiles.map((tile) => (
                      <Tile
                        key={tile.id}
                        tile={tile}
                        base={sections.tileBase}
                        open={expanded === tile.id}
                        onClick={() => {
                          if (tile.action === 'despliega') setExpanded(expanded === tile.id ? null : tile.id)
                          else if (tile.route === 'catalog') window.location.assign(`${import.meta.env.BASE_URL}collections/fabrics/catalog`)
                          else openSection(tile)
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {section && (
          <div className="grid xl:grid-cols-[280px_1fr_260px] lg:grid-cols-[280px_1fr] gap-6 items-start">
            {/* ---------- the six-step rail ---------- */}
            <aside className="bg-white rounded-luxe shadow-card p-6">
              <button onClick={leaveSection} className="text-sm text-olive hover:underline mb-5 cursor-pointer">
                ← {t.studio.allCategories}
              </button>

              <Step n="1" label={t.studio.stepScene} dim />
              <Step n="2" label={t.studio.stepModel} active={!model} />

              {model && (
                <>
                  {model.dims && (
                    <table className="mb-4 ms-9">
                      <tbody>
                        {model.dims.map((d) => (
                          <tr key={d.label}>
                            <td className="pb-1.5 pe-3">
                              <span className="inline-block w-14 text-center border hairline rounded bg-sand/60 py-1 text-[13px]">{d.value}</span>
                            </td>
                            <td className="pb-1.5 text-[13px] text-charcoal/70">{d.label}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <button onClick={() => setModel(null)} className="text-sm text-olive hover:underline mb-5 ms-9 block cursor-pointer">
                    ← {t.studio.changeModel}
                  </button>
                </>
              )}

              <Step n="3" label={t.studio.stepFabrics} active={!!model} dim={!model} />
              {model && <FabricFinder data={catalog} onResults={(r) => { setResults(r); setSearched(true); setResPage(0) }} />}

              <div className="mt-5">
                <Step n="4" label={t.studio.stepApply} dim={!model} />
                {model && <p className="text-[13px] leading-snug text-charcoal/60 ms-9 -mt-1 mb-5">{t.studio.applyHint}</p>}
              </div>

              <Step n="5" label={t.studio.stepPdf} dim={!preview} />
              <a
                href={preview || '#'}
                target="_blank"
                rel="noreferrer"
                className={`ms-9 -mt-1 mb-5 inline-flex items-center gap-2 text-sm ${preview ? 'text-olive hover:underline' : 'text-stone/50 pointer-events-none'}`}
              >
                <Icon.Download size={16} /> {t.studio.download}
              </a>

              <Step n="6" label={t.studio.stepQuote} dim />
            </aside>

            {/* ---------- model picker, or render + swatch strip ---------- */}
            <section className="bg-white rounded-luxe shadow-card p-6 min-w-0">
              {!model ? (
                <>
                  <h2 className="font-display text-lg mb-6">{t.studio.selectModelTitle}</h2>
                  {groupChildren.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {path.length > 0 && (
                        <button onClick={() => setPath(path.slice(0, -1))} className="px-4 py-2 rounded-full border hairline text-sm text-olive cursor-pointer">
                          ← {path.length > 1 ? path[path.length - 2].title : section.title}
                        </button>
                      )}
                      {groupChildren.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setPath([...path, g])}
                          className="px-4 py-2 rounded-full border hairline text-sm text-charcoal/75 hover:border-olive hover:text-olive transition-colors duration-200 cursor-pointer"
                        >
                          {g.title}
                        </button>
                      ))}
                    </div>
                  )}
                  {modelChildren.length === 0 && groupChildren.length === 0 ? (
                    <p className="py-16 text-center text-sm text-stone">{t.studio.noModels}</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {modelChildren.map((m) => (
                        <button key={m.id} onClick={() => openModel(m)} className="group text-center cursor-pointer">
                          {/* Cached plain render, so the grid paints at once. Falls
                              back to a live render if a thumbnail is missing. */}
                          <img
                            src={`${import.meta.env.BASE_URL}model-thumbs/${m.id}.jpg`}
                            onError={(e) => {
                              if (e.currentTarget.dataset.fellBack) return
                              e.currentTarget.dataset.fellBack = '1'
                              e.currentTarget.src = renderUrl([null, null], 0, m)
                            }}
                            alt={m.title}
                            loading="lazy"
                            className="w-full aspect-[4/3] object-contain bg-white transition-transform duration-300 group-hover:scale-[1.04]"
                          />
                          <p className="mt-2 text-[13px] leading-snug text-charcoal/70 group-hover:text-olive transition-colors duration-200">{m.title}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="relative">
                    <button
                      onClick={() => decorate()}
                      title={t.studio.applyHint}
                      className={`block w-full rounded-lg overflow-hidden bg-white ${armed ? 'cursor-copy' : 'cursor-default'}`}
                    >
                      <img key={preview} src={preview} alt={model.title} className="w-full aspect-square object-contain" />
                    </button>

                    {/* the source's three tools, stacked top-right of the render */}
                    <div className="absolute top-3 end-3 flex flex-col gap-2">
                      <ToolButton label={t.studio.download} onClick={downloadPdf}><Icon.Download size={20} /></ToolButton>
                      <ToolButton label={t.studio.zoom} onClick={() => setZoomOpen(true)}><Icon.Search size={20} /></ToolButton>
                      <ToolButton label={t.studio.removeFabric} onClick={removeFabric} disabled={!applied.some(Boolean)}>
                        <Icon.Rotate size={20} />
                      </ToolButton>
                    </div>
                  </div>

                  {model.views.length > 1 && (
                    <div className="flex gap-3 mt-3">
                      {model.views.map((v, i) => (
                        <button
                          key={v}
                          onClick={() => setView(i)}
                          className={`w-20 rounded overflow-hidden border-2 transition-colors duration-200 cursor-pointer ${view === i ? 'border-olive' : 'border-transparent hover:border-charcoal/20'}`}
                        >
                          <img src={renderUrl(applied, i)} alt="" loading="lazy" className="w-full aspect-square object-contain bg-white" />
                        </button>
                      ))}
                    </div>
                  )}

                  {model.zones > 1 && (
                    <div className="flex gap-2 mt-4">
                      {[model.zone1, model.zone2].slice(0, model.zones).map((label, i) => (
                        <button
                          key={i}
                          onClick={() => decorate(i)}
                          className={`px-3 py-2 rounded text-[12px] border hairline transition-colors duration-200 cursor-pointer ${zone === i ? 'bg-charcoal text-white border-charcoal' : 'text-charcoal/70 hover:border-olive'}`}
                        >
                          {label || `${t.studio.zone} ${i + 1}`}
                          {applied[i] && <span className="opacity-70"> · {applied[i].ref}</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ---------- selected fabrics strip ---------- */}
                  <div className="mt-8 pt-6 border-t hairline">
                    <h3 className="text-center text-sm text-charcoal/70 mb-4">{t.fabricFinder.selected}</h3>
                    {selected.length === 0 ? (
                      <p className="text-sm text-stone text-center pb-2">{t.fabricFinder.noSelection}</p>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-4">
                        {selected.map((fab) => (
                          <button
                            key={fab.id}
                            onClick={() => setArmed(fab)}
                            className={`w-32 p-2 rounded cursor-pointer transition-colors duration-200 ${armed?.id === fab.id ? 'bg-olive/15 ring-1 ring-olive' : 'hover:bg-sand'}`}
                          >
                            <img src={fabricImage(catalog, fab)} alt={fab.name} loading="lazy" className="w-full aspect-square object-cover rounded-sm bg-sand" />
                            <p className="mt-1.5 text-[10px] leading-tight text-stone">{fab.name}</p>
                            <p className="text-[10px] text-stone/70">{fab.ref}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ---------- search results ---------- */}
                  <div className="mt-8 pt-6 border-t hairline">
                    {!searched ? (
                      <p className="text-sm text-stone py-6 text-center">{t.fabricFinder.hint}</p>
                    ) : results.length === 0 ? (
                      <p className="text-sm text-stone py-6 text-center">{t.fabricFinder.empty}</p>
                    ) : (
                      <>
                        <p className="text-xs uppercase tracking-[0.16em] text-stone mb-4">
                          {t.fabricFinder.resultCount.replace('{n}', results.length)}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 gap-4">
                          {pageItems.map((fab) => (
                            <button key={fab.id} onClick={() => addToSelection(fab)} className="group text-center cursor-pointer">
                              <img
                                src={fabricImage(catalog, fab)}
                                alt={fab.name}
                                loading="lazy"
                                className={`w-full aspect-square object-cover rounded-sm bg-sand transition-transform duration-300 group-hover:scale-[1.04] ${armed?.id === fab.id ? 'ring-2 ring-olive' : ''}`}
                              />
                              <p className="mt-1.5 text-[10px] leading-tight text-stone">{fab.ref}</p>
                            </button>
                          ))}
                        </div>
                        <Paginator page={resPage} pages={pages} onGo={setResPage} />
                      </>
                    )}
                  </div>
                </>
              )}
            </section>

            {/* ---------- product detail ---------- */}
            {model && (
              <aside className="hidden xl:block bg-white rounded-luxe shadow-card p-6">
                <h2 className="text-center text-sm text-charcoal/70 pb-3 border-b hairline mb-5">{t.studio.productDetail}</h2>
                <p className="text-[13px] text-charcoal/80 mb-5">{model.title}</p>
                <p className="text-[13px] text-charcoal/60 mb-3">{t.studio.lastFabric}</p>
                {lastFabric ? (
                  <>
                    <img src={fabricImage(catalog, lastFabric)} alt={lastFabric.name} className="w-full aspect-square object-cover rounded-sm bg-sand" />
                    <p className="mt-2 text-[11px] leading-snug text-stone">{lastFabric.name}</p>
                    <p className="text-[11px] text-stone/70">{lastFabric.ref}</p>
                  </>
                ) : (
                  <p className="text-[12px] text-stone/70">—</p>
                )}
              </aside>
            )}
          </div>
        )}

        {/* ---------- zoom overlay ---------- */}
        {zoomOpen && model && (
          <div
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 z-[80] bg-charcoal/60 flex items-center justify-center p-4 md:p-10"
          >
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-luxe shadow-card w-full max-w-4xl max-h-full overflow-auto">
              <div className="flex items-start justify-between gap-4 p-5 border-b hairline">
                <h2 className="text-base text-charcoal/85">{model.title}</h2>
                <button onClick={() => setZoomOpen(false)} aria-label={t.common.close} className="text-stone hover:text-charcoal text-xl leading-none cursor-pointer">×</button>
              </div>
              <div className="relative p-5">
                <div className="absolute top-7 end-7">
                  <ToolButton label={t.studio.download} onClick={downloadPdf}><Icon.Download size={20} /></ToolButton>
                </div>
                <img src={preview} alt={model.title} className="w-full object-contain" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  )
}

function ToolButton({ children, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-md bg-white border hairline shadow-card text-charcoal/80 hover:text-olive hover:border-olive transition-colors duration-200 cursor-pointer disabled:opacity-35 disabled:cursor-default disabled:hover:text-charcoal/80 disabled:hover:border-charcoal/10"
    >
      {children}
    </button>
  )
}

function Tile({ tile, base, open, onClick }) {
  return (
    <button onClick={onClick} className="group w-[172px] cursor-pointer">
      <div className={`relative rounded-luxe overflow-hidden bg-sand transition-shadow duration-300 ${open ? 'ring-2 ring-olive' : 'group-hover:shadow-card'}`}>
        <img src={`${base}${tile.image}`} alt="" loading="lazy" className="w-full aspect-square object-cover" />
        <span className="absolute inset-x-0 bottom-0 bg-charcoal/55 text-white text-[13px] leading-tight px-3 py-2 text-center">
          {tile.title}
        </span>
      </div>
    </button>
  )
}

function Step({ n, label, active, dim }) {
  return (
    <h2 className={`flex items-center gap-3 font-display text-base mb-3 ${dim ? 'opacity-40' : ''}`}>
      <span className={`w-6 h-6 rounded-full border hairline flex items-center justify-center text-xs shrink-0 ${active ? 'bg-charcoal text-white border-charcoal' : ''}`}>{n}</span>
      <span className={active ? 'font-semibold' : ''}>{label}</span>
    </h2>
  )
}
