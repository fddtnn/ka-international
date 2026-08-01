import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import SEO from '../components/SEO.jsx'
import { Page, Reveal } from '../components/ui.jsx'

// The 2026 printed catalogue, cut into individual products. Each piece keeps the
// name, reference and dimensions printed beneath it in the original.
const PER_PAGE = 24

export default function Catalogue() {
  const { t, lang } = useLang()
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [section, setSection] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}catalogue.json`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setFailed(true))
  }, [])

  const shown = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    return data.products.filter(
      (p) =>
        (section === 'all' || p.section === section) &&
        (!q || p.name.toLowerCase().includes(q) || (p.ref || '').toLowerCase().includes(q)),
    )
  }, [data, section, query])

  useEffect(() => setPage(0), [section, query])

  if (failed) return <Page className="pt-40 text-center"><p>{t.fabricFinder.loadError}</p></Page>

  const pages = Math.ceil(shown.length / PER_PAGE)
  const items = shown.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const src = (p) => `${import.meta.env.BASE_URL}${data.imageBase}${p.image}`
  const counts = data
    ? Object.keys(data.sections).reduce((a, k) => ({ ...a, [k]: data.products.filter((p) => p.section === k).length }), {})
    : {}

  return (
    <Page>
      <SEO title={t.catalogue.title} description={t.catalogue.intro} />
      <div className="pt-28 md:pt-32 pb-20 mx-auto max-w-7xl px-5 md:px-8">
        <nav className="text-xs uppercase tracking-[0.18em] text-stone mb-4">
          <Link to="/" className="hover:text-olive">KA</Link>
          <span className="mx-2">/</span>
          <span className="text-olive-light">{t.catalogue.title}</span>
        </nav>
        <h1 className="editorial text-4xl md:text-5xl mb-2">{t.catalogue.title}</h1>
        <p className="text-stone text-sm mb-9">
          {data ? t.catalogue.count.replace('{n}', data.products.length) : t.armchairs.loading}
        </p>

        {data && (
          <Reveal className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={() => setSection('all')}
              className={`px-5 py-2.5 rounded-full text-sm border transition-colors duration-200 cursor-pointer ${section === 'all' ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 text-charcoal/70 hover:border-olive hover:text-olive'}`}
            >
              {t.common.all} · {data.products.length}
            </button>
            {Object.entries(data.sections).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`px-5 py-2.5 rounded-full text-sm border transition-colors duration-200 cursor-pointer ${section === id ? 'bg-charcoal text-white border-charcoal' : 'border-charcoal/20 text-charcoal/70 hover:border-olive hover:text-olive'}`}
              >
                {label[lang]} · {counts[id]}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.catalogue.search}
              className="ms-auto border hairline rounded-full px-5 py-2.5 text-sm bg-white min-w-[200px]"
            />
          </Reveal>
        )}

        {!data ? (
          <div className="py-20 text-center text-sm text-stone">{t.armchairs.loading}</div>
        ) : shown.length === 0 ? (
          <div className="py-20 text-center text-sm text-stone">{t.fabricFinder.empty}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
              {items.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 8) * 0.04}>
                  <button onClick={() => setZoom(p)} className="group w-full text-start cursor-pointer">
                    <div className="rounded-luxe overflow-hidden bg-white border hairline aspect-square">
                      <img
                        src={src(p)}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    </div>
                    <h3 className="mt-3 text-sm tracking-wide text-charcoal/85 group-hover:text-olive transition-colors duration-200">{p.name}</h3>
                    <p className="text-xs text-stone mt-1">
                      {p.ref && <span>REF. {p.ref}</span>}
                      {p.ref && p.dim && <span className="mx-2">·</span>}
                      {p.dim && <span>{p.dim} cm</span>}
                    </p>
                  </button>
                </Reveal>
              ))}
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10 text-sm">
                <PageBtn disabled={page === 0} onClick={() => setPage(page - 1)}>«</PageBtn>
                {Array.from({ length: pages }, (_, n) => (
                  <PageBtn key={n} activeState={n === page} onClick={() => setPage(n)}>{n + 1}</PageBtn>
                ))}
                <PageBtn disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>»</PageBtn>
              </div>
            )}
          </>
        )}

        {zoom && (
          <div onClick={() => setZoom(null)} className="fixed inset-0 z-[80] bg-charcoal/60 flex items-center justify-center p-4 md:p-10">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-luxe shadow-card w-full max-w-3xl">
              <div className="flex items-start justify-between gap-4 p-5 border-b hairline">
                <div>
                  <h2 className="font-display text-xl">{zoom.name}</h2>
                  <p className="text-xs uppercase tracking-[0.16em] text-stone mt-1">
                    {zoom.ref && `REF. ${zoom.ref}`}{zoom.ref && zoom.dim && ' · '}{zoom.dim && `${zoom.dim} cm`}
                  </p>
                </div>
                <button onClick={() => setZoom(null)} aria-label={t.common.close} className="text-stone hover:text-charcoal text-2xl leading-none cursor-pointer">×</button>
              </div>
              <img src={src(zoom)} alt={zoom.name} className="w-full object-contain p-6" />
            </div>
          </div>
        )}
      </div>
    </Page>
  )
}

function PageBtn({ children, onClick, disabled, activeState }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-9 h-9 px-2.5 rounded border hairline transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-default ${activeState ? 'bg-charcoal text-white border-charcoal' : 'hover:border-olive hover:text-olive'}`}
    >
      {children}
    </button>
  )
}
