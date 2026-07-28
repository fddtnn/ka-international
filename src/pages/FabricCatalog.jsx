import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import SEO from '../components/SEO.jsx'
import { Page, Icon } from '../components/ui.jsx'
import FabricFinder, { useCatalog, fabricImage, Paginator } from '../components/FabricFinder.jsx'

// Clone of the "Fabric Catalog" finder from the KA International portal on
// deco3dserver. The search panel and its filter semantics live in FabricFinder,
// which the virtual decorator reuses for its own fabric step.
const RESULTS_PER_PAGE = 24
const SELECTED_PER_PAGE = 4

export default function FabricCatalog() {
  const { t } = useLang()
  const { data, error } = useCatalog()

  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [tab, setTab] = useState('results') // results | colors | designs
  const [selected, setSelected] = useState([])
  const [active, setActive] = useState(null)
  const [resPage, setResPage] = useState(0)
  const [selPage, setSelPage] = useState(0)
  const sheetRef = useRef(null)

  function showResults(hits) {
    setResults(hits)
    setSearched(true)
    setTab('results')
    setResPage(0)
  }

  // "Other colors" = same design (first 7 digits of the reference).
  // "Other designs in the collection" = same collection name.
  const shown = useMemo(() => {
    if (!data) return []
    if (tab === 'colors') return active ? data.fabrics.filter((x) => x.design === active.design) : []
    if (tab === 'designs') return active ? data.fabrics.filter((x) => x.collection === active.collection) : []
    return results
  }, [tab, results, active, data])

  useEffect(() => setResPage(0), [tab])

  function pick(fab) {
    setActive(fab)
    setSelected((s) => (s.some((x) => x.id === fab.id) ? s : [...s, fab]))
  }

  function unpick(id) {
    setSelected((s) => s.filter((x) => x.id !== id))
  }

  const imgUrl = (fab) => `${data.imageBase}${fab.image}`

  const resPages = Math.ceil(shown.length / RESULTS_PER_PAGE)
  const selPages = Math.ceil(selected.length / SELECTED_PER_PAGE)
  const pageItems = shown.slice(resPage * RESULTS_PER_PAGE, (resPage + 1) * RESULTS_PER_PAGE)
  const selItems = selected.slice(selPage * SELECTED_PER_PAGE, (selPage + 1) * SELECTED_PER_PAGE)

  if (error) {
    return (
      <Page>
        <div className="pt-32 pb-24 text-center text-charcoal/60">{t.fabricFinder.loadError}</div>
      </Page>
    )
  }

  return (
    <Page>
      <SEO title={t.fabricFinder.title} description={t.fabricFinder.intro} />
      <div className="pt-28 md:pt-32 pb-20 mx-auto max-w-7xl px-5 md:px-8">
        <nav className="text-xs uppercase tracking-[0.18em] text-stone mb-4">
          <Link to="/" className="hover:text-olive">KA</Link>
          <span className="mx-2">/</span>
          <Link to="/collections/fabrics" className="hover:text-olive">{t.categories.fabrics}</Link>
          <span className="mx-2">/</span>
          <span className="text-olive-light">{t.fabricFinder.title}</span>
        </nav>
        <h1 className="font-display text-4xl md:text-5xl mb-2">{t.fabricFinder.title}</h1>
        <p className="text-stone text-sm mb-10">
          {data ? t.fabricFinder.count.replace('{n}', data.fabrics.length).replace('{c}', new Set(data.fabrics.map((x) => x.collection)).size) : t.fabricFinder.loading}
        </p>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
          {/* ---------- step 1: pick fabrics ---------- */}
          <aside className="bg-white rounded-luxe shadow-card p-6">
            <h2 className="flex items-center gap-3 font-display text-lg mb-5">
              <span className="w-6 h-6 rounded-full border hairline flex items-center justify-center text-xs">1</span>
              {t.fabricFinder.step1}
            </h2>

            <FabricFinder data={data} onResults={showResults} />

            <h2 className="flex items-center gap-3 font-display text-lg mt-7">
              <span className="w-6 h-6 rounded-full border hairline flex items-center justify-center text-xs">2</span>
              <button
                onClick={() => window.print()}
                disabled={!selected.length}
                className="text-start hover:text-olive disabled:opacity-40 disabled:hover:text-charcoal transition-colors duration-200 cursor-pointer disabled:cursor-default"
              >
                {t.fabricFinder.download}
              </button>
            </h2>
          </aside>

          {/* ---------- selection + results ---------- */}
          <section className="bg-white rounded-luxe shadow-card p-6" ref={sheetRef}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg">{t.fabricFinder.selected}</h2>
              <button
                onClick={() => window.print()}
                disabled={!selected.length}
                aria-label={t.fabricFinder.download}
                className="p-2 rounded-full hover:bg-sand disabled:opacity-30 transition-colors duration-200 cursor-pointer disabled:cursor-default"
              >
                <Icon.Download size={20} />
              </button>
            </div>

            {selected.length === 0 ? (
              <p className="text-sm text-stone pb-6">{t.fabricFinder.noSelection}</p>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selItems.map((fab) => (
                    <figure key={fab.id} className="relative group">
                      <button onClick={() => unpick(fab.id)} aria-label={t.common.remove} className="absolute top-1 end-1 z-10 w-6 h-6 rounded-full bg-white/90 text-charcoal opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-sm leading-none">×</button>
                      <img src={imgUrl(fab)} alt={fab.name} loading="lazy" className="w-full aspect-square object-cover rounded-sm bg-sand" />
                      <figcaption className="mt-2 text-center text-[11px] leading-snug text-stone">
                        {fab.name}<br />{fab.ref}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <Paginator page={selPage} pages={selPages} onGo={setSelPage} />
              </>
            )}

            <div className="flex gap-1 mt-8 border-b hairline">
              {[
                ['results', t.fabricFinder.tabResults],
                ['colors', t.fabricFinder.tabColors],
                ['designs', t.fabricFinder.tabDesigns],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  disabled={id !== 'results' && !active}
                  className={`flex-1 px-3 py-3 text-sm rounded-t-lg border hairline border-b-0 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-default ${tab === id ? 'bg-white -mb-px text-charcoal' : 'bg-sand/60 text-charcoal/60 hover:text-charcoal'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="pt-6">
              {!searched && tab === 'results' ? (
                <p className="text-sm text-stone py-10 text-center">{t.fabricFinder.hint}</p>
              ) : shown.length === 0 ? (
                <p className="text-sm text-stone py-10 text-center">{t.fabricFinder.empty}</p>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.16em] text-stone mb-4">
                    {t.fabricFinder.resultCount.replace('{n}', shown.length)}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                    {pageItems.map((fab) => (
                      <button key={fab.id} onClick={() => pick(fab)} className="group text-center cursor-pointer">
                        <img
                          src={imgUrl(fab)}
                          alt={fab.name}
                          loading="lazy"
                          className={`w-full aspect-square object-cover rounded-sm bg-sand transition-transform duration-300 group-hover:scale-[1.03] ${active?.id === fab.id ? 'ring-2 ring-olive' : ''}`}
                        />
                        <p className="mt-2 text-[11px] leading-snug text-stone">{fab.name}</p>
                        <p className="text-[11px] text-stone/70">{fab.ref}</p>
                      </button>
                    ))}
                  </div>
                  <Paginator page={resPage} pages={resPages} onGo={setResPage} />
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </Page>
  )
}
